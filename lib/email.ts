import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerPhone?: string
  shippingAddress: {
    name: string
    phone: string
    district: string
    upazila: string
    street: string
  }
  products: Array<{
    productName: string
    quantity: number
    price: number
  }>
  totalPrice: number
  currency: string
  paymentMethod: string
  orderDate: string
}

export async function sendOrderNotificationToOwner(
  orderData: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const shopOwnerEmail = process.env.SHOP_OWNER_EMAIL || 'owner@example.com'

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'orders@yourdomain.com',
      to: shopOwnerEmail,
      subject: `New Order Received - ${orderData.orderNumber}`,
      html: generateOrderEmailHTML(orderData)
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending order notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

function generateOrderEmailHTML(orderData: OrderEmailData): string {
  const productRows = orderData.products
    .map(
      (product) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${product.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${product.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${orderData.currency} ${product.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">🎉 New Order Received!</h1>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">A new order has been placed on your store</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Order Details</h2>
          
          <table style="width: 100%; margin-bottom: 15px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Order Number:</td>
              <td style="padding: 8px 0; font-weight: bold;">${orderData.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Order Date:</td>
              <td style="padding: 8px 0;">${new Date(
                orderData.orderDate
              ).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Payment Method:</td>
              <td style="padding: 8px 0;">${orderData.paymentMethod}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Customer Information</h2>
          
          <table style="width: 100%; margin-bottom: 15px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Name:</td>
              <td style="padding: 8px 0; font-weight: bold;">${orderData.customerName}</td>
            </tr>

            ${
              orderData.customerPhone
                ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
              <td style="padding: 8px 0;">${orderData.customerPhone}</td>
            </tr>
            `
                : ''
            }
          </table>

          <h3 style="color: #1f2937; margin: 20px 0 10px 0; font-size: 16px;">Shipping Address:</h3>
          <p style="margin: 5px 0; padding: 12px; background-color: #f9fafb; border-radius: 4px;">
            <strong>${orderData.shippingAddress.name}</strong><br>
            Phone: ${orderData.shippingAddress.phone}<br>
            ${orderData.shippingAddress.street}<br>
            ${orderData.shippingAddress.upazila}, ${orderData.shippingAddress.district}
          </p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Order Items</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-weight: 600;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-weight: 600;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-weight: 600;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9fafb;">
                <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px; color: #3b82f6;">${orderData.currency} ${orderData.totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>Action Required:</strong> Please process this order and update the order status accordingly.
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">This is an automated notification from your e-commerce store.</p>
          <p style="margin: 5px 0;">Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `
}
