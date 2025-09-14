'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, addToCartAtom, type Product } from '@/lib/atoms'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye } from 'lucide-react'
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
        <Card key={product.id} className="jewelry-card jewelry-card-hover group">
          <CardHeader className="p-0 relative">
            {/* Product Image Placeholder with Beautiful Background */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-8xl opacity-30 transform group-hover:scale-110 transition-transform duration-500">
                  💍
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
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
              <span className="price-text text-lg">
                {product.price.toLocaleString()} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
              {product.priceBeforeDiscount && (
                <span className="text-sm text-neutral-400 line-through">
                  {product.priceBeforeDiscount.toLocaleString()} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
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
                {currentLang === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
              </Button>
              <Button size="sm" variant="outline" asChild className="focus-ring">
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
