'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PayPalReturnHandler({ bookingId }: { bookingId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams?.get('token') // PayPal order ID
    
    if (token && !isProcessing) {
      capturePayment(token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const capturePayment = async (orderId: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments/paypal-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          bookingId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment capture failed')
      }

      // Reload the page to show updated payment status
      router.refresh()
    } catch (err) {
      console.error('Payment capture error:', err)
      setError(err instanceof Error ? err.message : 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Processing your payment...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
