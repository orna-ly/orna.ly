'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { featuredProductsAtom, currentLangAtom, productsAtom } from '@/lib/atoms'
import { mockProducts } from '@/lib/mock-data'
import { HeroCarousel } from '@/components/layout/hero-carousel'
import { ProductGrid } from '@/components/product/product-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  const [featuredProducts] = useAtom(featuredProductsAtom)
  const [currentLang] = useAtom(currentLangAtom)
  const [, setProducts] = useAtom(productsAtom)

  // Initialize products from mock data
  useEffect(() => {
    setProducts(mockProducts)
  }, [setProducts])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <HeroCarousel products={featuredProducts} />

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              {currentLang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
            </h2>
            <p className="text-neutral-600 text-lg">
              {currentLang === 'ar' 
                ? 'اكتشف مجموعتنا الحصرية من المجوهرات الفاخرة'
                : 'Discover our exclusive collection of luxury jewelry'
              }
            </p>
          </div>
          
          <ProductGrid products={featuredProducts.slice(0, 8)} />
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/products">
                {currentLang === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}