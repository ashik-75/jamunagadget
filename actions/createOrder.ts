'use server'

import { sendOrderNotificationToOwner } from '@/lib/email'
import { backendClient } from '@/sanity/lib/backendClient'

interface ShippingAddress {
  name: string
  phone: string
  district: string
  upazila: string
  street: string
}

interface OrderData {
  orderNumber: string
  customerName: string
  customerPhone?: string
  shippingAddress: ShippingAddress
  products: Array<{
    _key: string
    product: {
      _type: 'reference'
      _ref: string
    }
    quantity: number
  }>
  totalPrice: number
  currency: string
  status: string
  orderDate: string
  paymentMethod: string
}

// Explicitly type the return value
export async function createOrder(
  orderData: OrderData
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Create the order in Sanity
    const order = await backendClient.create({
      _type: 'order',
      ...orderData
    })

    // Fetch product details for email
    const productIds = orderData.products.map((p) => p.product._ref)
    const products = await backendClient.fetch<
      Array<{ _id: string; name: string; price: number }>
    >(
      `*[_type == "product" && _id in $ids]{
        _id,
        name,
        price
      }`,
      { ids: productIds }
    )

    // Map products with quantities for email
    const productsForEmail = orderData.products.map((orderProduct) => {
      const product = products.find((p) => p._id === orderProduct.product._ref)
      return {
        productName: product?.name || 'Unknown Product',
        quantity: orderProduct.quantity,
        price: product?.price || 0
      }
    })

    // Send email notification to shop owner
    try {
      await sendOrderNotificationToOwner({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        products: productsForEmail,
        totalPrice: orderData.totalPrice,
        currency: orderData.currency,
        paymentMethod: orderData.paymentMethod,
        orderDate: orderData.orderDate
      })
      console.log('Order notification email sent successfully')
    } catch (emailError) {
      // Log email error but don't fail the order creation
      console.error('Failed to send order notification email:', emailError)
    }

    return { success: true, orderId: order._id }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}
