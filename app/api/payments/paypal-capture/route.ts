import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { client as paypalClient, checkoutNodeJssdk } from '@/lib/paypal'

export async function POST(request: NextRequest) {
  try {
    const { orderId, bookingId } = await request.json()

    if (!orderId || !bookingId) {
      return NextResponse.json(
        { error: 'Order ID and Booking ID are required' },
        { status: 400 }
      )
    }

    // Verify booking exists and is pending
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.paymentStatus === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'Payment already processed'
      })
    }

    // Capture the PayPal order
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId)
    captureRequest.requestBody({})

    const captureResponse = await paypalClient().execute(captureRequest)
    const capturedOrder = captureResponse.result

    if (capturedOrder.status === 'COMPLETED') {
      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'completed',
          amountPaid: parseFloat(capturedOrder.purchase_units[0].amount.value)
        }
      })

      // Update transaction status
      await prisma.transaction.updateMany({
        where: {
          bookingId: bookingId,
          providerPaymentId: orderId
        },
        data: {
          status: 'COMPLETED',
          payload: JSON.stringify(capturedOrder)
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Payment captured successfully',
        orderStatus: capturedOrder.status
      })
    } else {
      return NextResponse.json(
        { error: 'Payment not completed', status: capturedOrder.status },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to capture payment', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
