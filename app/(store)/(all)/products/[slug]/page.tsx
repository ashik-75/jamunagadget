import ProductSlug from '@/components/products/product'
import RelatedProducts from '@/components/products/related'
import { GET_PRODUCT_QUERYResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import { getProduct } from '@/sanity/lib/products/getProduct'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-static'
export const revalidate = 60

// ✅ Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = (await getProduct(slug)) as GET_PRODUCT_QUERYResult

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.'
    }
  }

  // Extract description text from block content
  const description =
    product.description && product.description.length > 0
      ? product.description
          .map((desc) =>
            desc._type === 'block'
              ? desc.children?.map((child) => child.text).join(' ')
              : ''
          )
          .join(' ')
          .slice(0, 160) // Limit to 160 characters for meta description
      : `Buy ${product.name} online. High quality products at the best prices.`

  // Get product images
  const images =
    product.images && product.images.length > 0
      ? product.images.map((image) => ({
          url: urlFor(image).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: product.name || 'Product image'
        }))
      : [
          {
            url: '/image/placeholder_image.jpg',
            width: 1200,
            height: 630,
            alt: 'Product placeholder'
          }
        ]

  // Category for breadcrumbs
  const category = product.categories?.[0]?.title || 'Products'

  return {
    title: `${product.name}`,
    description,
    keywords: [
      product.name || '',
      category,
      ...(product.categories?.map((cat) => cat.title || '') || []),
      'online shopping',
      'buy online'
    ].filter(Boolean),
    openGraph: {
      title: product.name || 'Product',
      description,
      images,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
      siteName: 'Your Store Name'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name || 'Product',
      description,
      images: images.map((img) => img.url)
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`
    },
    robots: {
      index: product.stock && product.stock > 0 ? true : false, // Don't index out of stock
      follow: true
    }
  }
}

export default async function ProductSlugPage({
  params
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params

  const product = (await getProduct(slug)) as GET_PRODUCT_QUERYResult

  if (!product) {
    return notFound()
  }

  // ✅ JSON-LD structured data for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description && product.description.length > 0
        ? product.description
            .map((desc) =>
              desc._type === 'block'
                ? desc.children?.map((child) => child.text).join(' ')
                : ''
            )
            .join(' ')
        : '',
    image:
      product.images && product.images.length > 0
        ? product.images.map((img) => urlFor(img).url())
        : ['/image/placeholder_image.jpg'],
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: 'BDT',
      availability:
        product.stock && product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`
    },
    brand: {
      '@type': 'Brand',
      name: 'Your Brand Name'
    },
    category: product.categories?.[0]?.title || 'General'
  }

  return (
    <>
      {/* ✅ Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <ProductSlug product={product} />
        <Suspense
          fallback={<div className="py-10">Loading related products...</div>}
        >
          <RelatedProducts product={product} />
        </Suspense>
      </div>
    </>
  )
}
