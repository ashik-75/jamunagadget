import { blurDataURL } from '@/lib/constant'
import { formatPriceBDT } from '@/lib/utils'
import { GET_PRODUCTS_QUERYResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({
  product
}: {
  product: GET_PRODUCTS_QUERYResult[0]
}) {
  const exhaustive = product.stock === 0

  // ✅ Safe image handling (TS won't complain)
  const hasImage = !!(product.images && product.images.length > 0)
  const imageUrl = hasImage
    ? urlFor(product.images![0]).width(300).height(300).url()
    : '/image/placeholder_image.jpg' // fallback image in /public

  return (
    <div
      data-exhaustive={exhaustive ? 'true' : undefined}
      className="relative border rounded flex data-[exhaustive]:opacity-60 data-[exhaustive]:grayscale flex-col group overflow-hidden"
    >
      <Link
        href={`/products/${product.slug?.current}`}
        className="absolute inset-0 z-[1]"
      />
      <div className="overflow-hidden relative aspect-[6/5] p-2">
        {exhaustive && (
          <div className="absolute inset-0 z-10 bg-stone-500/80 grid place-content-center font-bold text-white text-xl sm:text-2xl">
            <p>Out Of Stock</p>
          </div>
        )}

        <Image
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 rounded"
          src={imageUrl}
          alt={product.name || 'Product image'}
          loading="lazy" // ✅ Lazy load images
          placeholder="blur" // ✅ Optional: show blur while loading
          blurDataURL={blurDataURL}
        />
      </div>

      <div className="overflow-ellipsis p-3 flex-grow gap-0 flex flex-col">
        <h2 className="text-ellipsis flex-grow line-clamp-1 text-sm font-medium">
          {product.name}
        </h2>

        {product.categories?.[0] && (
          <Link
            href={`/categories/${product.categories?.[0].slug?.current}`}
            className="text-xs z-[1] relative text-lime-500 hover:underline"
          >
            {product.categories?.[0].title}
          </Link>
        )}

        <p className="font-bold">{formatPriceBDT(product.price)}</p>
      </div>
    </div>
  )
}
