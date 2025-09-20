'use client'

import { useAtom } from 'jotai'
import { 
  cartItemsAtom, 
  cartTotalAtom, 
  currentLangAtom,
  removeFromCartAtom,
  updateCartQuantityAtom
} from '@/lib/atoms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Minus, Plus, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const [cartItems] = useAtom(cartItemsAtom)
  const [cartTotal] = useAtom(cartTotalAtom)
  const [currentLang] = useAtom(currentLangAtom)
  const [, removeFromCart] = useAtom(removeFromCartAtom)
  const [, updateCartQuantity] = useAtom(updateCartQuantityAtom)

  const shippingCost = 50
  const finalTotal = cartTotal + shippingCost

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm">
            <ShoppingCart className="h-24 w-24 text-neutral-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              {currentLang === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </h1>
            <p className="text-neutral-600 mb-8 text-lg">
              {currentLang === 'ar' 
                ? 'ابدأ التسوق واكتشف مجموعتنا الرائعة من المجوهرات'
                : 'Start shopping and discover our amazing jewelry collection'
              }
            </p>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/products">
                {currentLang === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                <ArrowRight className="h-4 w-4 ml-2" />
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentLang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>
          <p className="text-neutral-600 mt-2">
            {currentLang === 'ar' ? 'راجع عناصرك قبل المتابعة للدفع' : 'Review your items before checkout'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/placeholder.jpg'}
                        alt={item.product.name[currentLang]}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">
                            {item.product.name[currentLang]}
                          </h3>
                          {item.product.subtitle && (
                            <p className="text-sm text-neutral-600">
                              {item.product.subtitle[currentLang]}
                            </p>
                          )}
                          <p className="text-lg font-bold text-amber-600 mt-2">
                            {formatPrice(item.product.price, 'LYD', currentLang)}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm font-medium text-neutral-700">
                          {currentLang === 'ar' ? 'الكمية:' : 'Quantity:'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartQuantity({ 
                              productId: item.product.id, 
                              quantity: Math.max(1, item.quantity - 1) 
                            })}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateCartQuantity({ 
                              productId: item.product.id, 
                              quantity: item.quantity + 1 
                            })}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3">
                        <span className="text-sm text-neutral-600">
                          {currentLang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'} 
                        </span>
                        <span className="text-lg font-bold text-neutral-900 ml-2">
                          {formatPrice(item.product.price * item.quantity, 'LYD', currentLang)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>
                  {currentLang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{currentLang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>{formatPrice(cartTotal, 'LYD', currentLang)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{currentLang === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                    <span>{formatPrice(shippingCost, 'LYD', currentLang)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{currentLang === 'ar' ? 'المجموع:' : 'Total:'}</span>
                      <span className="text-amber-600">
                        {formatPrice(finalTotal, 'LYD', currentLang)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                  <Link href="/checkout">
                    {currentLang === 'ar' ? 'متابعة للدفع' : 'Proceed to Checkout'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/products">
                    {currentLang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
