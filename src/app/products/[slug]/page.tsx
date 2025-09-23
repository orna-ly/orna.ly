'use client'

import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  currentLangAtom, 
  addToCartAtom, 
  productsAtom,
  loadProductsAtom
} from '@/lib/atoms'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Heart, Share2, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/lib/atoms'
import { formatPrice } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [currentLang] = useAtom(currentLangAtom)
  const [, addToCart] = useAtom(addToCartAtom)
  const [products] = useAtom(productsAtom)
  const [, loadProducts] = useAtom(loadProductsAtom)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [loading, setLoading] = useState(true)

  // Initialize products and find current product
  useEffect(() => {
    const initializeProduct = async () => {
      setLoading(true)
      
      // Load products if not already loaded
      if (products.length === 0) {
        await loadProducts()
      }
      
      // Find the product by slug
      const foundProduct = products.find(p => p.slug === slug)
      setProduct(foundProduct || null)
      setLoading(false)
    }

    initializeProduct()
  }, [slug, products, loadProducts])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-200 rounded-xl animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-neutral-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-neutral-200 rounded animate-pulse" />
              <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4" />
              <div className="h-12 bg-neutral-200 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              {currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
            </h1>
            <p className="text-neutral-600 mb-6">
              {currentLang === 'ar' 
                ? 'عذراً، لم نتمكن من العثور على المنتج المطلوب'
                : 'Sorry, we couldn\'t find the product you\'re looking for'
              }
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentLang === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-neutral-600">
            <li><Link href="/" className="hover:text-amber-600">{currentLang === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-amber-600">{currentLang === 'ar' ? 'المنتجات' : 'Products'}</Link></li>
            <li>/</li>
            <li className="text-neutral-900">{product.name[currentLang]}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-white rounded-xl overflow-hidden bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${product.images[selectedImage] || '/placeholder.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Fallback gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100" />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700">
                  {currentLang === 'ar' ? 'مميز' : 'Featured'}
                </Badge>
              )}
              {product.priceBeforeDiscount && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  {Math.round(((product.priceBeforeDiscount - product.price) / product.priceBeforeDiscount) * 100)}%
                  {currentLang === 'ar' ? ' خصم' : ' OFF'}
                </Badge>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 bg-cover bg-center bg-no-repeat ${
                      selectedImage === index ? 'border-amber-600' : 'border-neutral-200'
                    }`}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Fallback gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {product.name[currentLang]}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-neutral-600">
                  {product.subtitle[currentLang]}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-amber-600">
                {formatPrice(product.price, 'LYD', currentLang)}
              </span>
              {product.priceBeforeDiscount && (
                <span className="text-xl text-neutral-400 line-through">
                  {formatPrice(product.priceBeforeDiscount, 'LYD', currentLang)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ar' ? 'الوصف' : 'Description'}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {product.description[currentLang]}
              </p>
              {product.subdescription && (
                <p className="text-neutral-600 mt-3 leading-relaxed">
                  {product.subdescription[currentLang]}
                </p>
              )}
            </div>

            <Separator />

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  {currentLang === 'ar' ? 'الكمية' : 'Quantity'}
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'تم الإضافة!' : 'Added!'}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">
                  {currentLang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{currentLang === 'ar' ? 'رمز المنتج:' : 'Product ID:'}</span>
                    <span className="font-medium">{product.id}</span>
                  </div>
                  {product.wrappingPrice && (
                    <div className="flex justify-between">
                      <span>{currentLang === 'ar' ? 'تغليف هدايا:' : 'Gift Wrapping:'}</span>
                      <span className="font-medium">
                        {formatPrice(product.wrappingPrice, 'LYD', currentLang)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{currentLang === 'ar' ? 'تاريخ الإضافة:' : 'Date Added:'}</span>
                    <span className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString(
                        currentLang === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
