'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, addToCartAtom, type Product } from '@/lib/atoms'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import Link from 'next/link'

interface ProductCarouselProps {
  products: Product[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentLang] = useAtom(currentLangAtom)
  const [, addToCart] = useAtom(addToCartAtom)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse">
          <div className="text-6xl mb-4">💍</div>
          <p className="text-neutral-600 text-lg">
            {currentLang === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="jewelry-card jewelry-card-hover group h-full">
                <CardHeader className="p-0 relative">
                  {/* Product Image Placeholder with Beautiful Background */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-8xl opacity-40 transform group-hover:scale-110 transition-transform duration-500">
                          💍
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 space-y-2">
                      {product.featured && (
                        <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                          {currentLang === 'ar' ? 'مميز' : 'Featured'}
                        </Badge>
                      )}
                      {product.priceBeforeDiscount && (
                        <Badge variant="destructive">
                          {Math.round(((product.priceBeforeDiscount - product.price) / product.priceBeforeDiscount) * 100)}% 
                          {currentLang === 'ar' ? ' خصم' : ' OFF'}
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                      <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white shadow-lg">
                        <Heart className="h-4 w-4 text-rose-600" />
                      </Button>
                      <Button size="icon" variant="secondary" asChild className="bg-white/90 hover:bg-white shadow-lg">
                        <Link href={`/products/${product.slug}`}>
                          <Eye className="h-4 w-4 text-neutral-600" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Product Name */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-neutral-900 line-clamp-1 text-lg">
                      {product.name[currentLang]}
                    </h3>
                    {product.subtitle && (
                      <p className="text-sm text-neutral-600 line-clamp-1">
                        {product.subtitle[currentLang]}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 line-clamp-2 flex-1">
                    {product.description[currentLang]}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="price-text text-xl font-bold">
                      {product.price.toLocaleString()} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                    {product.priceBeforeDiscount && (
                      <span className="text-sm text-neutral-400 line-through">
                        {product.priceBeforeDiscount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 btn-primary focus-ring"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'إضافة' : 'Add'}
                    </Button>
                    <Button size="sm" variant="outline" asChild className="focus-ring">
                      <Link href={`/products/${product.slug}`}>
                        {currentLang === 'ar' ? 'عرض' : 'View'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Mobile indicators */}
      <div className="flex justify-center mt-6 md:hidden">
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
            <div key={index} className="w-2 h-2 bg-amber-300 rounded-full opacity-50" />
          ))}
        </div>
      </div>
    </div>
  )
}
