'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, addToCartAtom, type Product } from '@/lib/atoms'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [currentLang] = useAtom(currentLangAtom)
  const [, addToCart] = useAtom(addToCartAtom)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    // You can add a toast notification here
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💍</div>
        <p className="text-neutral-600 text-lg">
          {currentLang === 'ar' ? 'لا توجد منتجات للعرض' : 'No products to display'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="p-0 relative">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-amber-50 to-rose-50">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name[currentLang]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  💍
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 space-y-2">
                {product.featured && (
                  <Badge className="bg-amber-600 hover:bg-amber-700">
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
                <Button size="icon" variant="secondary" asChild>
                  <Link href={`/products/${product.slug}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-3">
            {/* Product Name */}
            <div>
              <h3 className="font-semibold text-neutral-900 line-clamp-1">
                {product.name[currentLang]}
              </h3>
              {product.subtitle && (
                <p className="text-sm text-neutral-600 line-clamp-1">
                  {product.subtitle[currentLang]}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 line-clamp-2">
              {product.description[currentLang]}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-amber-600">
                {product.price} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
              {product.priceBeforeDiscount && (
                <span className="text-sm text-neutral-400 line-through">
                  {product.priceBeforeDiscount} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1 bg-amber-600 hover:bg-amber-700"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {currentLang === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/products/${product.slug}`}>
                  {currentLang === 'ar' ? 'عرض' : 'View'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
