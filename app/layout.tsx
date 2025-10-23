import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),

  title: {
    default: 'Jamuna Gadgets - Electronics & Tech Accessories Store',
    template: '%s | Jamuna Gadgets'
  },

  description:
    'Shop the latest electronics, gadgets, and tech accessories at Jamuna Gadgets. Quality products with fast delivery across Bangladesh.',

  keywords: [
    'electronics Bangladesh',
    'tech gadgets',
    'mobile accessories',
    'Jamuna Gadgets',
    'buy electronics online',
    'tech store Dhaka'
  ],

  authors: [{ name: 'Ashik Rana', url: 'https://example.com' }],

  creator: 'Jamuna Gadgets',
  publisher: 'Jamuna Gadgets',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Jamuna Gadgets',
    title: 'Jamuna Gadgets - Electronics & Tech Accessories Store',
    description: 'Shop the latest electronics, gadgets, and tech accessories.',
    images: [
      {
        url: '/og_image.png', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'Jamuna Gadgets'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Jamuna Gadgets',
    description: 'Shop the latest electronics and tech accessories',
    images: ['/og_image.png']
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  verification: {
    google: 'your-google-verification-code' // Add after Google Search Console setup
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
