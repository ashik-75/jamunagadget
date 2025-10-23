'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { placeholderImage } from '@/lib/constant'
import { formatPriceBDT } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import useCartStore from '@/stores/cart.store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BsPlus } from 'react-icons/bs'
import { GiShoppingCart } from 'react-icons/gi'
import { HiMinus } from 'react-icons/hi2'

export default function CartSheet() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const [open, setOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // Simulate a small delay to ensure UX feels smooth
    await new Promise((resolve) => setTimeout(resolve, 500))
    setOpen(false)
    router.push('/checkout')
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    // Reset checkout state when opening the sheet
    if (newOpen) {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          title="Cart"
          className="relative  hover:text-neutral-100 transition"
        >
          <GiShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 grid place-content-center bg-blue-700 text-white text-xs rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex justify-between items-center">
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-neutral-500 mt-10">
              Your cart is empty.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {items.map((item) => (
                <li
                  key={item.product._id}
                  className="flex gap-4 py-3 items-center"
                >
                  <div className="w-[70px] h-[70px] overflow-hidden rounded">
                    <picture>
                      <img
                        className="w-24 h-24 object-cover rounded-md"
                        src={
                          item.product.images && item.product.images.length > 0
                            ? urlFor(item.product.images[0]).url()
                            : placeholderImage
                        }
                        alt={item.product.name || 'Product image'}
                      />
                    </picture>
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug?.current}`}
                      className="text-sm font-medium hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-neutral-500">
                      {formatPriceBDT(item.product.price ?? 0)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="border rounded bg-black text-white p-1"
                        disabled={isCheckingOut}
                      >
                        <HiMinus size={14} />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => addItem(item.product)}
                        className="border rounded bg-black text-white p-1"
                        disabled={isCheckingOut}
                      >
                        <BsPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-right w-20">
                    {formatPriceBDT((item.product.price ?? 0) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 mt-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">Subtotal</span>
              <span>{formatPriceBDT(getTotalPrice())}</span>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-black text-white py-2 rounded-sm text-sm hover:bg-neutral-800 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
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
                </>
              ) : (
                'Checkout'
              )}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
