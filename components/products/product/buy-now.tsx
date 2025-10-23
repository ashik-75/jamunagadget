'use client'

import { GET_PRODUCT_QUERYResult, Product } from '@/sanity.types'
import useCartStore from '@/stores/cart.store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  product: GET_PRODUCT_QUERYResult
}

export default function BuyNowProduct({ product }: Props) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [isLoading, setIsLoading] = useState(false)

  if (!product) return null

  const outOfStock = product.stock === 0

  const handleBuyNow = async () => {
    setIsLoading(true)
    addItem(product as unknown as Product)
    router.push('/checkout')
  }

  return (
    <button
      disabled={outOfStock || isLoading}
      onClick={handleBuyNow}
      className="py-2 font-black flex w-full shrink-0 justify-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none px-2 border bg-black text-white"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : outOfStock ? (
        'Out of stock'
      ) : (
        'Buy Now'
      )}
    </button>
  )
}
