import { BasketIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string'
      // validation: (Rule) => Rule.required().email()
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Contact Name',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'district',
          title: 'District',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'upazila',
          title: 'Upazila',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: (Rule) => Rule.required()
        })
      ]
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product Bought',
              type: 'reference',
              to: [{ type: 'product' }]
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity Purchased',
              type: 'number',
              validation: (Rule) => Rule.required().min(1)
            })
          ],
          preview: {
            select: {
              product: 'product.name',
              quantity: 'quantity',
              images: 'product.images',
              price: 'product.price',
              currency: 'product.currency'
            },
            prepare(selection) {
              return {
                title: `${selection.product} x ${selection.quantity}`,
                subtitle: `${selection.price * selection.quantity}`,
                media: selection.images[0]
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'ammountDiscount',
      title: 'Ammount Discount',
      type: 'number',
      validation: (Rule) => Rule.min(0)
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          {
            title: 'Pending',
            value: 'pending'
          },
          {
            title: 'Paid',
            value: 'paid'
          },
          {
            title: 'Shipped',
            value: 'shipped'
          },
          {
            title: 'Delivered',
            value: 'delivered'
          },
          {
            title: 'Cancelled',
            value: 'cancelled'
          }
        ]
      }
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      name: 'customerName',
      amount: 'totalPrice',
      currency: 'currency',
      orderId: 'orderNumber',
      phone: 'customerPhone'
    },
    prepare(selection) {
      const orderIdSinippet = `${selection.orderId.slice(0, 5)}...${selection.orderId.slice(-5)}}`
      return {
        title: `${selection.name} (${orderIdSinippet})`,
        subtitle: `${selection.amount} ${selection.currency} - ${selection.phone}`,
        media: BasketIcon
      }
    }
  }
})
