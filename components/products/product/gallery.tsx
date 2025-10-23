'use client'

import { GET_PRODUCT_QUERYResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { blurDataURL } from '@/lib/constant'

export default function GalleryProduct({
  product
}: {
  product: GET_PRODUCT_QUERYResult
}) {
  if (!product) return null

  // ✅ Fallback placeholder
  const placeholderImage = '/image/placeholder_image.jpg'

  const [images] = useState<string[]>(
    product.images && product.images.length > 0
      ? product.images.map((image) => urlFor(image).url())
      : [placeholderImage]
  )

  const [current, setCurrent] = useState(0)
  const [visibleThreshold, setVisibleThreshold] = useState(6)
  const [showArrows, setShowArrows] = useState(false)

  // 🔹 Responsive visible threshold based on screen width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 480)
        setVisibleThreshold(3) // mobile
      else if (window.innerWidth < 768)
        setVisibleThreshold(4) // tablet
      else if (window.innerWidth < 1024)
        setVisibleThreshold(5) // small desktop
      else setVisibleThreshold(6) // large screen
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 🔹 Determine whether arrows should be visible
  useEffect(() => {
    setShowArrows(images.length > visibleThreshold)
  }, [images, visibleThreshold])

  const altSeo =
    product.name +
    ' ' +
    (product.description?.length
      ? product.description
          ?.map((desc) =>
            desc._type === 'block'
              ? desc.children?.map((child) => child.text).join(' ')
              : ''
          )
          .join(' ')
      : '')

  return (
    <div className="flex flex-col gap-5 sm:gap-1">
      {/* === Main Image === */}
      <div className="h-[350px] sm:w-[550px] sm:h-[550px] overflow-hidden flex justify-center max-w-full">
        <Image
          src={images[current]}
          width={550}
          height={550}
          className="h-full w-auto max-w-full max-h-full object-contain"
          alt={altSeo}
          priority // ✅ Main image loads immediately (above the fold)
          placeholder="blur"
          blurDataURL={blurDataURL}
          onError={(e) => {
            e.currentTarget.src = placeholderImage
          }}
        />
      </div>

      {/* === Thumbnail Carousel === */}
      <div className="relative w-full max-w-[550px] mx-auto px-5">
        <Carousel
          opts={{ align: 'start', slidesToScroll: 1 }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <button
                  onMouseEnter={() => setCurrent(index)}
                  data-current={current === index ? '' : undefined}
                  className="w-full transition-colors data-[current]:border-2 data-[current]:border-yellow-800 data-[current]:border-dotted aspect-square overflow-hidden p-1"
                >
                  <Image
                    width={100}
                    height={100}
                    src={image}
                    alt={altSeo ?? product.name ?? ''}
                    className="w-full h-full object-cover"
                    loading="lazy" // ✅ Thumbnails lazy load
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    onError={(e) => {
                      e.currentTarget.src = placeholderImage
                    }}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {showArrows && (
            <>
              <CarouselPrevious className="absolute -left-7 top-1/2 -translate-y-1/2 rounded-full w-6 h-6 flex items-center justify-center" />
              <CarouselNext className="absolute -right-7 top-1/2 -translate-y-1/2 rounded-full w-6 h-6 flex items-center justify-center" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  )
}
