'use client'

import { AskingQuestion } from '@/icons/asking-question'
import { placeholderImage } from '@/lib/constant'
import { formatPriceBDT } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import useCartStore from '@/stores/cart.store'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsArrowRight } from 'react-icons/bs'

// Define the shipping address interface
interface ShippingAddress {
  name: string
  phone: string
  district: string
  upazila: string
  street: string
}

export default function CheckoutOrder() {
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)

  const [isLoading, setIsLoading] = React.useState(false)
  const [isRedirecting, setIsRedirecting] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [contactNumber, setContactNumber] = React.useState('')
  const [shippingAddress, setShippingAddress] = React.useState<ShippingAddress>(
    {
      name: '',
      phone: '',
      district: '',
      upazila: '',
      street: ''
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // In your CheckoutOrder component
  const handleCheckout = async () => {
    // Validate shipping address
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.district ||
      !shippingAddress.upazila ||
      !shippingAddress.street
    ) {
      alert('Please fill in all shipping address fields')
      return
    }

    setIsLoading(true)

    try {
      // Type the orderData explicitly
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString()
      const orderData = {
        orderNumber: orderNumber,
        customerName: shippingAddress.name ?? 'Unknown',
        customerPhone: contactNumber ?? 'Unknown',
        clerkUserId: 'unknown',
        shippingAddress: shippingAddress,
        products: items.map((item) => ({
          _key: crypto.randomUUID(),
          product: {
            _type: 'reference' as const,
            _ref: item.product._id
          },
          quantity: item.quantity
        })),
        totalPrice: getTotalPrice(),
        currency: 'BDT',
        status: 'pending',
        orderDate: new Date().toISOString(),
        paymentMethod: paymentMethod || 'cod'
      }

      // Dynamic import of the server action
      const { createOrder } = await import('@/actions/createOrder')

      // Create the order using server action
      const result = await createOrder(orderData)

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order')
      }

      // Set redirecting state BEFORE clearing cart
      setIsRedirecting(true)

      // Clear the cart after successful order
      clearCart()

      // Redirect to order confirmation page
      window.location.href = `/success?order_number=${orderNumber}`
    } catch (error) {
      console.error(error)
      alert('There was an error processing your order. Please try again.')
      setIsLoading(false)
    }
  }

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-lime-950 mb-4"
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
        <p className="text-lg font-medium">Processing to success page...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-10">
        <AskingQuestion
          width={200}
          height={200}
          className="text-blue-500 mx-auto"
        />
        <p className="text-center max-w-[40ch] mx-auto p-10 text-sm">
          There are no products in your cart. Add some from our{' '}
          <Link href="/" className="text-blue-500 hover:underline">
            catalog.
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="w-full flex gap-10 flex-col lg:flex-row">
      {/* Here is the payment or billing address */}
      <aside className="max-lg:border-t order-2 sm:order-1 flex-1 border-dotted border-stone-200 max-lg:pt-5">
        <div className="mt-3">
          <h3 className="font-medium mb-3">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 bg-white outline-none rounded text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-medium mb-3">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={shippingAddress.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 bg-white outline-none rounded text-sm"
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className="block text-xs mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 bg-white outline-none rounded text-sm"
                placeholder="Phone Number"
              />
            </div>

            <div>
              <label className="block text-xs mb-1">District</label>
              <input
                type="text"
                name="district"
                value={shippingAddress.district}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 bg-white outline-none rounded text-sm"
                placeholder="District"
              />
            </div>

            <div>
              <label className="block text-xs mb-1">Upazila</label>
              <input
                type="text"
                name="upazila"
                value={shippingAddress.upazila}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 bg-white outline-none rounded text-sm"
                placeholder="Upazila"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 bg-white outline-none rounded text-sm"
                placeholder="Street Address"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Payment Method</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="appearance-none w-2 h-2 rounded-full border border-gray-400 checked:bg-black checked:ring-2 checked:ring-offset-2 checked:ring-black checked:border-transparent transition-colors cursor-pointer bg-white"
              />

              <span className="text-sm">Cash on Delivery</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="appearance-none w-2 h-2 rounded-full border border-gray-400 checked:bg-black checked:ring-2 checked:ring-offset-2 checked:ring-black checked:border-transparent transition-colors cursor-pointer bg-white"
              />
              <span className="text-sm">Online Payment</span>
            </label>
          </div>
          {paymentMethod === 'online' && (
            <div className="text-sm">
              <p>Pay with your bkash wallet</p>
              <p>014044 XXXXXX - Merchant Account (Make Payment)</p>

              <p>Put your order ID as reference number</p>
            </div>
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full disabled:justify-center disabled:opacity-50 disabled:grayscale flex justify-center gap-2 items-center p-3 px-4 transition-all rounded-sm bg-lime-950 text-lime-50 mt-5"
        >
          {isLoading ? (
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
              Placing order ...
            </>
          ) : (
            <>
              Place Order
              <BsArrowRight size={20} />
            </>
          )}
        </button>
      </aside>

      {/* here is the products details */}
      <div className="flex-1 order-1 sm:order-2">
        <ul className="flex flex-col w-full flex-grow divide-y divide-stone-700">
          {items.map((item) => {
            const totalPrice = item.quantity * (item.product.price ?? 0)
            return (
              <li
                key={item.product._id}
                className="py-3 gap-5 w-full flex items-center"
              >
                <div className="w-[80px] rounded-xl min-w-[80px] aspect-square overflow-hidden">
                  <picture>
                    <img
                      className="w-full h-full object-cover"
                      src={
                        item.product.images && item.product.images.length > 0
                          ? urlFor(item.product.images[0]).url()
                          : placeholderImage
                      }
                      alt={item.product.name}
                    />
                  </picture>
                </div>
                <div className="w-full">
                  <Link
                    className="hover:underline"
                    href={'/products/' + item.product.slug?.current}
                  >
                    <h3>{item.product.name}</h3>
                  </Link>
                  {Array.isArray(item.product.description) && (
                    <p className="text-xs text-stone-400 pt-2 line-clamp-2">
                      {item.product.description
                        ?.map((desc) =>
                          desc._type === 'block'
                            ? desc.children
                                ?.map((child) => child.text)
                                .join(' ')
                            : ' '
                        )
                        .join(' ')}
                    </p>
                  )}
                  <div className="flex pt-2 items-center gap-3">
                    <p className="text-sm flex-grow">
                      {formatPriceBDT(item.product.price ?? 0)} X{' '}
                      {item.quantity}
                    </p>
                    <div className="flex gap-2 items-center">
                      {formatPriceBDT(totalPrice)}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex py-1 text-sm">
          <span className="flex flex-grow text-stone-400">Subtotal</span>
          <p>{formatPriceBDT(getTotalPrice())}</p>
        </div>
        <div className="flex py-1 text-sm">
          <span className="flex flex-grow text-stone-400">Shipping</span>
          <span>FREE</span>
        </div>
        <div className="flex py-1 text-sm border-t border-stone-300 pt-3 mt-3">
          <span className="flex flex-grow text-black">Total</span>
          <p>{formatPriceBDT(getTotalPrice())}</p>
        </div>
      </div>
    </div>
  )
}
