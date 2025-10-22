// app/(store)/success/success-content.tsx
'use client'

import { Check, Copy } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ClearCart from './@clear-cart'

export default function SuccessPageContent() {
  const searchParams = useSearchParams()
  const order_number = searchParams.get('order_number')
  const [copied, setCopied] = useState(false)

  const copyOrderNumber = () => {
    if (order_number) {
      navigator.clipboard.writeText(order_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="text-center py-20 px-4 w-full max-w-xl mx-auto">
      <div className="border rounded-md bg-lime-100 p-4">
        <ClearCart order_number={order_number} />
        <h1 className="font-larken text-base">Thank you for your purchase!</h1>
        <p className="pt-5 text-xs">Your order has been confirmed.</p>
        <div className="text-left border-y text-sm py-5 border-dotted border-stone-600 mt-4">
          <div className="flex justify-between items-center">
            <p>Order number:</p>
            <div className="flex items-center gap-2">
              <p>{order_number}</p>
              <button
                onClick={copyOrderNumber}
                className="hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Copy order number"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-700" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-5 gap-2">
          <Link
            href="/"
            className="border p-3 py-2 block hover:bg-white/10 rounded-sm border-stone-700 px-5"
          >
            Continue shopping
          </Link>

          <Link
            href="/track-order"
            className="border p-3 py-2 block hover:bg-white/10 rounded-sm border-stone-700 px-5"
          >
            Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
