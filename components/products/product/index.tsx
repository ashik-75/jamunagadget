import { formatPriceBDT } from '@/lib/utils'
import { GET_PRODUCT_QUERYResult } from '@/sanity.types'
import { PortableText } from 'next-sanity'
import Link from 'next/link'
import AddButtonProduct from './add-button'
import BuyNowProduct from './buy-now'
import GalleryProduct from './gallery'

export default function ProductSlug({
  product
}: {
  product: GET_PRODUCT_QUERYResult
}) {
  if (!product) return null

  return (
    <div className="relative group flex flex-col gap-5 sm:flex-row group p-5">
      <GalleryProduct product={product} />
      <div className="sm:px-10">
        <h1 className="text-3xl">{product.name}</h1>
        <div className="flex flex-wrap gap-2 pt-3">
          {product.categories?.map((category) => (
            <Link
              href={`/categories/${category.slug?.current}`}
              key={category._id}
              className="text-sm text-lime-600 hover:underline"
            >
              {category.title}
            </Link>
          ))}
        </div>
        <p className="py-4 text-3xl font-bold">
          {formatPriceBDT(product.price)}
        </p>
        <div className="space-y-2 w-[300px]">
          <AddButtonProduct product={product} />
          <BuyNowProduct product={product} />
        </div>
        <div className="prose pt-10">
          {Array.isArray(product.description) && (
            <PortableText value={product.description} />
          )}
        </div>
      </div>
    </div>
  )
}
