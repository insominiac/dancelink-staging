import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { client as paypalClient, checkoutNodeJssdk } from '@/lib/paypal'

const createPaymentSessionSchema = z.object({
  paymentProvider: z.enum(['STRIPE', 'WISE', 'PAYPAL']).default('PAYPAL'),
  bookingType: z.enum(['class', 'event']),
  itemId: z.string().min(1, 'Item ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  // Optional pricing customization
  customAmount: z.number().optional(),
  discountAmount: z.number().default(0),
  taxAmount: z.number().default(0),
  // Success/cancel URLs
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = createPaymentSessionSchema.parse(body)
    
    const { 
      paymentProvider,
      bookingType, 
      itemId, 
      userId, 
      customAmount, 
      discountAmount, 
      taxAmount, 
      successUrl, 
      cancelUrl,
    } = validatedData

    // Validate URLs are provided
    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Success URL and Cancel URL are required' },
        { status: 400 }
      )
    }

    // Get item details and price
    let item: any
    let basePrice: number
    let itemName: string
    let itemImage: string | null = null

    if (bookingType === 'class') {
      item = await prisma.class.findUnique({
        where: { id: itemId },
        include: {
          venue: true,
          classInstructors: {
            include: {
              instructor: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      })
      
      if (!item || !item.isActive) {
        return NextResponse.json(
          { error: 'Class not found or inactive' },
          { status: 404 }
        )
      }
      
      basePrice = Number(item.price)
      itemName = item.title
      itemImage = item.imageUrl
    } else {
      item = await prisma.event.findUnique({
        where: { id: itemId },
        include: {
          venue: true,
          organizer: true
        }
      })
      
      if (!item || item.status !== 'PUBLISHED') {
        return NextResponse.json(
          { error: 'Event not found or not published' },
          { status: 404 }
        )
      }
      
      basePrice = Number(item.price)
      itemName = item.title
      itemImage = item.imageUrl
    }

    // Calculate final amounts
    const finalBasePrice = customAmount || basePrice
    const finalDiscountAmount = discountAmount || 0
    const finalTaxAmount = taxAmount || 0
    const totalAmount = finalBasePrice - finalDiscountAmount + finalTaxAmount

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Total amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create booking record first
    const booking = await prisma.booking.create({
      data: {
        userId,
        classId: bookingType === 'class' ? itemId : null,
        eventId: bookingType === 'event' ? itemId : null,
        status: 'PENDING',
        totalAmount: finalBasePrice,
        amountPaid: 0,
        discountAmount: finalDiscountAmount,
        taxAmount: finalTaxAmount,
        paymentStatus: 'pending',
        paymentMethod: paymentProvider,
        confirmationCode: `${bookingType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    })

    // Process payment based on provider
    if (paymentProvider === 'PAYPAL') {
      // Check if PayPal credentials are configured
      const paypalClientId = process.env.PAYPAL_CLIENT_ID
      const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET
      
      if (!paypalClientId || !paypalClientSecret) {
        console.error('PayPal credentials not configured')
        
        // Delete the booking since we can't process payment
        await prisma.booking.delete({ where: { id: booking.id } })
        
        return NextResponse.json(
          { 
            error: 'PayPal is not configured', 
            details: 'PayPal credentials are missing. Please contact support or use another payment method.' 
          },
          { status: 503 }
        )
      }
      
      try {
        console.log('[PayPal] Creating order for booking:', booking.id)
        console.log('[PayPal] Amount:', totalAmount, 'Discount:', finalDiscountAmount, 'Tax:', finalTaxAmount)
        
        // Create PayPal order
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest()
        request.prefer('return=representation')
        
        // Build amount breakdown (only include non-zero values)
        const amountBreakdown: any = {
          item_total: {
            currency_code: 'USD',
            value: finalBasePrice.toFixed(2)
          }
        }
        
        if (finalDiscountAmount > 0) {
          amountBreakdown.discount = {
            currency_code: 'USD',
            value: finalDiscountAmount.toFixed(2)
          }
        }
        
        if (finalTaxAmount > 0) {
          amountBreakdown.tax_total = {
            currency_code: 'USD',
            value: finalTaxAmount.toFixed(2)
          }
        }
        
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2),
                breakdown: amountBreakdown
              },
              description: `${bookingType === 'class' ? 'Dance Class' : 'Dance Event'}: ${itemName}`,
              custom_id: booking.id,
              items: [
                {
                  name: itemName.substring(0, 127), // PayPal has 127 char limit
                  unit_amount: {
                    currency_code: 'USD',
                    value: finalBasePrice.toFixed(2)
                  },
                  quantity: '1',
                  category: 'DIGITAL_GOODS'
                }
              ]
            }
          ],
          application_context: {
            brand_name: 'DanceLink',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW',
            return_url: successUrl.replace('{CHECKOUT_SESSION_ID}', booking.id),
            cancel_url: cancelUrl
          }
        })

        // Execute PayPal request
        const paypalResponse = await paypalClient().execute(request)
        const paypalOrder = paypalResponse.result
        
        // Find the approval URL
        const approvalUrl = paypalOrder.links?.find((link: any) => link.rel === 'approve')?.href
        
        if (!approvalUrl) {
          throw new Error('PayPal approval URL not found')
        }

        // Create transaction record
        await prisma.transaction.create({
          data: {
            bookingId: booking.id,
            userId: user.id,
            provider: 'PAYPAL',
            providerPaymentId: paypalOrder.id,
            type: 'PAYMENT',
            status: 'CREATED',
            amount: totalAmount,
            currency: 'USD',
            payload: JSON.stringify({
              orderId: paypalOrder.id,
              amount: totalAmount,
              currency: 'USD',
              itemName,
              bookingType,
              status: paypalOrder.status
            })
          }
        })

        return NextResponse.json({
          success: true,
          paymentProvider: 'PAYPAL',
          orderId: paypalOrder.id,
          sessionUrl: approvalUrl,
          approvalUrl: approvalUrl,
          booking: {
            id: booking.id,
            confirmationCode: booking.confirmationCode,
            totalAmount: finalBasePrice,
            discountAmount: finalDiscountAmount,
            taxAmount: finalTaxAmount,
            finalAmount: totalAmount
          }
        })
      } catch (paypalError: any) {
        console.error('[PayPal] Order creation error:', paypalError)
        console.error('[PayPal] Error details:', JSON.stringify(paypalError, null, 2))
        
        // Delete the booking if PayPal order creation fails
        await prisma.booking.delete({ where: { id: booking.id } })
        
        const errorMessage = paypalError?.message || 'PayPal API error'
        const errorDetails = paypalError?.details || paypalError?.response?.details || []
        
        return NextResponse.json(
          { 
            error: 'Failed to create PayPal order', 
            details: errorMessage,
            paypalErrors: errorDetails
          },
          { status: 500 }
        )
      }

    } else if (paymentProvider === 'STRIPE' || paymentProvider === 'WISE') {
      // These providers are temporarily disabled
      return NextResponse.json(
        { error: `${paymentProvider} payment provider is temporarily unavailable. Please use PayPal.` },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Unsupported payment provider' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Create payment session error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create payment session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
