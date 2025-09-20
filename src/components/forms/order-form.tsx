'use client'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { currentLangAtom, cartItemsAtom, createOrder } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ShoppingCart, Check, AlertCircle } from 'lucide-react'
import type { CartItem } from '@/lib/atoms'

interface OrderFormProps {
  onOrderCreated?: (orderId: string) => void
}

export function OrderForm({ onOrderCreated }: OrderFormProps) {
  const [currentLang] = useAtom(currentLangAtom)
  const [cartItems] = useAtom(cartItemsAtom)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: '',
    state: '',
    notes: ''
  })
  
  const [needsWrapping, setNeedsWrapping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = currentLang === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = currentLang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = currentLang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = currentLang === 'ar' ? 'بريد إلكتروني غير صحيح' : 'Invalid email format'
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

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    )
    const wrappingCost = needsWrapping 
      ? cartItems.reduce((total, item) => 
          total + ((item.product.wrappingPrice || 0) * item.quantity), 0
        )
      : 0
    const shippingCost = 50 // Fixed shipping cost
    
    return {
      subtotal,
      wrappingCost,
      shippingCost,
      total: subtotal + wrappingCost + shippingCost
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (cartItems.length === 0) {
      setSubmitError(
        currentLang === 'ar' 
          ? 'سلة التسوق فارغة'
          : 'Shopping cart is empty'
      )
      return
    }
    
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const totals = calculateTotal()
      
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state
        },
        totalAmount: totals.total,
        wrappingCost: needsWrapping ? totals.wrappingCost : 0,
        needsWrapping,
        notes: formData.notes,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity
        }))
      }
      
      const result = await createOrder(orderData)
      
      if (result.error) {
        setSubmitError(result.error)
      } else if (result.data) {
        setSubmitted(true)
        onOrderCreated?.(result.data.id)
        
        // Reset form
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          address: '',
          city: '',
          state: '',
          notes: ''
        })
        setNeedsWrapping(false)
        
        // Reset submitted state after 5 seconds
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      setSubmitError(
        currentLang === 'ar' 
          ? 'حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while creating the order. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const totals = calculateTotal()

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            {currentLang === 'ar' ? 'تم إنشاء الطلب بنجاح!' : 'Order Created Successfully!'}
          </h3>
          <p className="text-green-700">
            {currentLang === 'ar' 
              ? 'شكراً لطلبك. سنتواصل معك قريباً لتأكيد التفاصيل.'
              : 'Thank you for your order. We\'ll contact you soon to confirm the details.'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            {currentLang === 'ar' ? 'سلة التسوق فارغة' : 'Shopping Cart is Empty'}
          </h3>
          <p className="text-amber-700">
            {currentLang === 'ar' 
              ? 'يرجى إضافة منتجات إلى السلة قبل المتابعة.'
              : 'Please add products to your cart before proceeding.'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLang === 'ar' ? 'معلومات الطلب' : 'Order Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {submitError && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <Input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder={currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                className={errors.customerName ? 'border-red-300' : ''}
              />
              {errors.customerName && (
                <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <Input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
                placeholder={currentLang === 'ar' ? '+966 50 123 4567' : '+966 50 123 4567'}
                className={errors.customerPhone ? 'border-red-300' : ''}
              />
              {errors.customerPhone && (
                <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
              </label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                placeholder="example@domain.com"
                className={errors.customerEmail ? 'border-red-300' : ''}
              />
              {errors.customerEmail && (
                <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'العنوان' : 'Address'} *
              </label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder={currentLang === 'ar' ? 'أدخل عنوانك الكامل' : 'Enter your full address'}
                className={`min-h-[80px] ${errors.address ? 'border-red-300' : ''}`}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'المدينة' : 'City'} *
              </label>
              <Input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder={currentLang === 'ar' ? 'الرياض' : 'Riyadh'}
                className={errors.city ? 'border-red-300' : ''}
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'المنطقة' : 'State/Region'}
              </label>
              <Input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder={currentLang === 'ar' ? 'منطقة الرياض' : 'Riyadh Region'}
              />
            </div>

            {/* Wrapping Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wrapping"
                checked={needsWrapping}
                onCheckedChange={(checked) => setNeedsWrapping(checked as boolean)}
              />
              <label htmlFor="wrapping" className="text-sm font-medium text-neutral-700">
                {currentLang === 'ar' ? 'تغليف هدايا' : 'Gift Wrapping'}
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {currentLang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder={currentLang === 'ar' ? 'أي ملاحظات أو تعليمات خاصة...' : 'Any special notes or instructions...'}
                className="min-h-[80px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {currentLang === 'ar' ? 'جاري إنشاء الطلب...' : 'Creating Order...'}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {currentLang === 'ar' ? 'إنشاء الطلب' : 'Create Order'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-sm">
                    {item.product.name[currentLang]}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {currentLang === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {item.product.price * item.quantity} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>{currentLang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span>{totals.subtotal} {currentLang === 'ar' ? 'ر.س' : 'SAR'}</span>
            </div>
            
            {needsWrapping && totals.wrappingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>{currentLang === 'ar' ? 'التغليف:' : 'Wrapping:'}</span>
                <span>{totals.wrappingCost} {currentLang === 'ar' ? 'ر.س' : 'SAR'}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>{currentLang === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
              <span>{totals.shippingCost} {currentLang === 'ar' ? 'ر.س' : 'SAR'}</span>
            </div>
            
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>{currentLang === 'ar' ? 'المجموع الكلي:' : 'Total:'}</span>
              <span className="text-amber-600">
                {totals.total} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
