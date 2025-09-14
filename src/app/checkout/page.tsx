'use client'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { 
  cartItemsAtom, 
  cartTotalAtom, 
  currentLangAtom,
  ordersAtom
} from '@/lib/atoms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Order } from '@/lib/atoms'

export default function CheckoutPage() {
  const [cartItems] = useAtom(cartItemsAtom)
  const [cartTotal] = useAtom(cartTotalAtom)
  const [currentLang] = useAtom(currentLangAtom)
  const [orders, setOrders] = useAtom(ordersAtom)
  
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const shippingCost = 50
  const giftWrapCost = giftWrap ? 100 : 0
  const finalTotal = cartTotal + shippingCost + giftWrapCost

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              {currentLang === 'ar' ? 'السلة فارغة' : 'Cart is Empty'}
            </h1>
            <p className="text-neutral-600 mb-6">
              {currentLang === 'ar' 
                ? 'أضف بعض المنتجات إلى سلتك أولاً'
                : 'Add some products to your cart first'
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = currentLang === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = currentLang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = currentLang === 'ar' ? 'بريد إلكتروني غير صحيح' : 'Invalid email format'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = currentLang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = currentLang === 'ar' ? 'العنوان مطلوب' : 'Address is required'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = currentLang === 'ar' ? 'المدينة مطلوبة' : 'City is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create orders for each cart item (simplified - in reality you'd create one order with multiple items)
    const newOrders: Order[] = cartItems.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      orderNumber: `ORN-${new Date().getFullYear()}-${String(orders.length + index + 1).padStart(3, '0')}`,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      address: formData.address,
      city: formData.city,
      product: item.product,
      quantity: item.quantity,
      totalAmount: (item.product.price * item.quantity) + (shippingCost / cartItems.length) + (giftWrapCost / cartItems.length),
      wrapping: giftWrap,
      wrappingPrice: giftWrapCost / cartItems.length,
      paymentStatus: 'PENDING',
      status: 'NEW',
      notes: formData.notes || undefined,
      createdAt: new Date()
    }))
    
    setOrders([...orders, ...newOrders])
    
    // Clear cart and redirect to success page
    // In a real app, you'd clear the cart here
    router.push(`/orders/${newOrders[0].orderNumber}`)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentLang === 'ar' ? 'العودة للسلة' : 'Back to Cart'}
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentLang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
          </h1>
          <p className="text-neutral-600 mt-2">
            {currentLang === 'ar' ? 'أكمل معلوماتك لإتمام عملية الشراء' : 'Complete your information to finish your purchase'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentLang === 'ar' ? 'معلومات العميل' : 'Customer Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      className={errors.name ? 'border-red-300' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@domain.com"
                        className={errors.email ? 'border-red-300' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+966 50 123 4567"
                        className={errors.phone ? 'border-red-300' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {currentLang === 'ar' ? 'معلومات التوصيل' : 'Shipping Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {currentLang === 'ar' ? 'العنوان' : 'Address'} *
                    </label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={currentLang === 'ar' ? 'أدخل عنوانك بالتفصيل' : 'Enter your detailed address'}
                      className={errors.address ? 'border-red-300' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {currentLang === 'ar' ? 'المدينة' : 'City'} *
                    </label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder={currentLang === 'ar' ? 'الرياض' : 'Riyadh'}
                      className={errors.city ? 'border-red-300' : ''}
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {currentLang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder={currentLang === 'ar' ? 'أي ملاحظات خاصة لطلبك' : 'Any special notes for your order'}
                    />
                  </div>

                  {/* Gift Wrapping Option */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gift-wrap"
                      checked={giftWrap}
                      onCheckedChange={(checked) => setGiftWrap(checked as boolean)}
                    />
                    <label htmlFor="gift-wrap" className="text-sm font-medium">
                      {currentLang === 'ar' ? 'تغليف هدايا' : 'Gift wrapping'} 
                      <span className="text-amber-600 ml-1">
                        (+100 {currentLang === 'ar' ? 'ر.س' : 'SAR'})
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {currentLang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      {currentLang === 'ar' 
                        ? 'الدفع عند الاستلام متاح. سيتم تأكيد طلبك قريباً.'
                        : 'Cash on delivery available. Your order will be confirmed soon.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
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
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || '/placeholder.jpg'}
                          alt={item.product.name[currentLang]}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.product.name[currentLang]}
                        </h4>
                        <p className="text-xs text-neutral-600">
                          {currentLang === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-amber-600">
                          {item.product.price * item.quantity} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{currentLang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>{cartTotal} {currentLang === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{currentLang === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                    <span>{shippingCost} {currentLang === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  {giftWrap && (
                    <div className="flex justify-between text-sm">
                      <span>{currentLang === 'ar' ? 'تغليف الهدايا:' : 'Gift wrapping:'}</span>
                      <span>{giftWrapCost} {currentLang === 'ar' ? 'ر.س' : 'SAR'}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{currentLang === 'ar' ? 'المجموع:' : 'Total:'}</span>
                    <span className="text-amber-600">
                      {finalTotal} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {currentLang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'تأكيد الطلب' : 'Place Order'}
                    </>
                  )}
                </Button>

                {/* Security Note */}
                <p className="text-xs text-neutral-500 text-center">
                  <Shield className="h-3 w-3 inline mr-1" />
                  {currentLang === 'ar' 
                    ? 'معلوماتك آمنة ومحمية'
                    : 'Your information is safe and secure'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
