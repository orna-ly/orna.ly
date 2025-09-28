'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { currentLangAtom, cartItemsAtom } from '@/lib/atoms';
import { createOrder as createOrderApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export type SupportedLanguage = 'ar' | 'en';

export interface CardDetailsState {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface ExpiryInfo {
  month: string;
  year: string;
  isValid: boolean;
}

export interface CardValidationResult {
  sanitizedNumber: string;
  expiryInfo: ExpiryInfo;
  cvvDigits: string;
  errors: Record<string, string>;
  isValid: boolean;
}

export interface PaymentResponsePayload {
  data?: { transactionId?: string };
  error?: string;
  message?: string;
}

export function sanitizeCardNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 19);
}

export function formatCardNumber(value: string): string {
  const digits = sanitizeCardNumber(value);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function luhnCheck(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 12) {
    return false;
  }
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits.charAt(i), 10);
    if (Number.isNaN(digit)) {
      return false;
    }
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function getExpiryInfo(value: string): ExpiryInfo {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  const month = digits.slice(0, 2);
  const year = digits.slice(2, 4);
  if (month.length !== 2 || year.length !== 2) {
    return { month: '', year: '', isValid: false };
  }
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  const fullYear = 2000 + yearNumber;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const isValidMonth = monthNumber >= 1 && monthNumber <= 12;
  const isExpired =
    fullYear < currentYear ||
    (fullYear === currentYear && monthNumber < currentMonth);

  return {
    month,
    year: fullYear.toString(),
    isValid: isValidMonth && !isExpired,
  };
}

export function validateCardDetails(
  details: CardDetailsState,
  lang: SupportedLanguage
): CardValidationResult {
  const sanitizedNumber = sanitizeCardNumber(details.cardNumber);
  const expiryInfo = getExpiryInfo(details.expiry);
  const cvvDigits = details.cvv.replace(/\D/g, '').slice(0, 4);
  const errors: Record<string, string> = {};

  if (!details.cardholderName.trim()) {
    errors.cardholderName =
      lang === 'ar' ? 'اسم حامل البطاقة مطلوب' : 'Cardholder name is required';
  }

  if (!sanitizedNumber) {
    errors.cardNumber =
      lang === 'ar' ? 'رقم البطاقة مطلوب' : 'Card number is required';
  } else if (!luhnCheck(sanitizedNumber)) {
    errors.cardNumber =
      lang === 'ar' ? 'رقم البطاقة غير صالح' : 'Invalid card number';
  }

  if (!expiryInfo.isValid) {
    errors.expiry =
      lang === 'ar' ? 'تاريخ الانتهاء غير صالح' : 'Invalid expiration date';
  }

  if (cvvDigits.length < 3) {
    errors.cvv =
      lang === 'ar' ? 'رمز الأمان غير صالح' : 'Invalid security code';
  }

  return {
    sanitizedNumber,
    expiryInfo,
    cvvDigits,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function interpretPaymentResponse(
  ok: boolean,
  payload: PaymentResponsePayload,
  lang: SupportedLanguage
): { success: boolean; transactionId?: string; errorMessage?: string } {
  if (!ok || !payload?.data?.transactionId) {
    const fallback =
      lang === 'ar'
        ? 'تعذر معالجة الدفع. يرجى التحقق من بيانات البطاقة.'
        : 'Unable to process your card. Please verify the card details.';

    return {
      success: false,
      errorMessage: payload?.error || payload?.message || fallback,
    };
  }

  return {
    success: true,
    transactionId: payload.data.transactionId,
  };
}

function toSupportedLanguage(value: string): SupportedLanguage {
  return value === 'ar' ? 'ar' : 'en';
}

interface OrderFormProps {
  onOrderCreated?: (orderId: string) => void;
  createOrderFn?: typeof createOrderApi;
}

export function OrderForm({ onOrderCreated, createOrderFn }: OrderFormProps) {
  const [currentLang] = useAtom(currentLangAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const submitOrder = createOrderFn ?? createOrderApi;

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: '',
    state: '',
    notes: '',
  });

  const [needsWrapping, setNeedsWrapping] = useState(false);
  const [customShipping, setCustomShipping] = useState<string>('');
  const [customPackaging, setCustomPackaging] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'apple_pay' | 'stc_pay' | 'cod'
  >('card');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCardChange = (field: keyof typeof cardDetails, value: string) => {
    let formattedValue = value;
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
    if (cardErrors[field]) {
      setCardErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    if (paymentMethod !== 'card') {
      setCardErrors({});
    }
  }, [paymentMethod]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName =
        currentLang === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone =
        currentLang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail =
        currentLang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail =
        currentLang === 'ar'
          ? 'بريد إلكتروني غير صحيح'
          : 'Invalid email format';
    }

    if (!formData.address.trim()) {
      newErrors.address =
        currentLang === 'ar' ? 'العنوان مطلوب' : 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city =
        currentLang === 'ar' ? 'المدينة مطلوبة' : 'City is required';
    }

    let isValid = Object.keys(newErrors).length === 0;

    if (paymentMethod === 'card') {
      const cardValidation = validateCardDetails(
        cardDetails,
        toSupportedLanguage(currentLang)
      );
      setCardErrors(cardValidation.errors);
      if (!cardValidation.isValid) {
        isValid = false;
      }
    } else {
      setCardErrors({});
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const wrappingCostDefault = needsWrapping
      ? cartItems.reduce(
          (total, item) =>
            total + (item.product.wrappingPrice || 0) * item.quantity,
          0
        )
      : 0;
    const shippingCost =
      customShipping !== '' ? parseFloat(customShipping) || 0 : 50;
    const wrappingCost =
      customPackaging !== ''
        ? parseFloat(customPackaging) || 0
        : wrappingCostDefault;

    return {
      subtotal,
      wrappingCost,
      shippingCost,
      total: subtotal + wrappingCost + shippingCost,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError(
        currentLang === 'ar' ? 'سلة التسوق فارغة' : 'Shopping cart is empty'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const totals = calculateTotal();

      let paymentReference: string | undefined;
      let paymentStatus: 'PENDING' | 'PAID' = 'PENDING';

      if (paymentMethod === 'card') {
        const lang = toSupportedLanguage(currentLang);
        const cardValidation = validateCardDetails(cardDetails, lang);

        if (!cardValidation.isValid) {
          setCardErrors(cardValidation.errors);
          return;
        }

        const chargeResponse = await fetch('/api/payments/charge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardNumber: cardValidation.sanitizedNumber,
            cardholderName: cardDetails.cardholderName.trim(),
            expiryMonth: cardValidation.expiryInfo.month,
            expiryYear: cardValidation.expiryInfo.year,
            cvv: cardValidation.cvvDigits,
            amount: totals.total,
            currency: 'LYD',
          }),
        });

        const chargeResult =
          (await chargeResponse.json()) as PaymentResponsePayload;
        const outcome = interpretPaymentResponse(
          chargeResponse.ok,
          chargeResult,
          lang
        );

        if (!outcome.success || !outcome.transactionId) {
          setSubmitError(outcome.errorMessage ?? '');
          return;
        }

        paymentReference = outcome.transactionId;
        paymentStatus = 'PAID';
      }

      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail.trim(),
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || undefined,
        },
        totalAmount: totals.total,
        wrappingCost: needsWrapping ? totals.wrappingCost : 0,
        needsWrapping,
        paymentMethod,
        paymentStatus,
        paymentReference,
        notes: formData.notes.trim() || undefined,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
      };

      const result = await submitOrder(orderData);

      if (result.error) {
        setSubmitError(result.error);
      } else if (result.data) {
        setSubmitted(true);
        onOrderCreated?.(result.data.id);

        // Reset form
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          address: '',
          city: '',
          state: '',
          notes: '',
        });
        setNeedsWrapping(false);
        setPaymentMethod('card');
        setCardDetails({
          cardholderName: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
        });
        setCardErrors({});

        // Clear cart items after successful order submission to keep checkout state in sync
        setCartItems([]);

        // Reset submitted state after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch {
      setSubmitError(
        currentLang === 'ar'
          ? 'حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while creating the order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const totals = calculateTotal();

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            {currentLang === 'ar'
              ? 'تم إنشاء الطلب بنجاح!'
              : 'Order Created Successfully!'}
          </h3>
          <p className="text-green-700">
            {currentLang === 'ar'
              ? 'شكراً لطلبك. سنتواصل معك قريباً لتأكيد التفاصيل.'
              : "Thank you for your order. We'll contact you soon to confirm the details."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            {currentLang === 'ar'
              ? 'سلة التسوق فارغة'
              : 'Shopping Cart is Empty'}
          </h3>
          <p className="text-amber-700">
            {currentLang === 'ar'
              ? 'يرجى إضافة منتجات إلى السلة قبل المتابعة.'
              : 'Please add products to your cart before proceeding.'}
          </p>
        </CardContent>
      </Card>
    );
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
                placeholder={
                  currentLang === 'ar'
                    ? 'أدخل اسمك الكامل'
                    : 'Enter your full name'
                }
                className={errors.customerName ? 'border-red-300' : ''}
              />
              {errors.customerName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Shipping & Packaging Overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {currentLang === 'ar'
                    ? 'سعر الشحن (اختياري)'
                    : 'Shipping Cost (optional)'}
                </label>
                <Input
                  type="number"
                  min="0"
                  value={customShipping}
                  onChange={(e) => setCustomShipping(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'مثال: 50' : 'e.g. 50'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {currentLang === 'ar'
                    ? 'سعر التغليف (اختياري)'
                    : 'Packaging Cost (optional)'}
                </label>
                <Input
                  type="number"
                  min="0"
                  value={customPackaging}
                  onChange={(e) => setCustomPackaging(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'مثال: 25' : 'e.g. 25'}
                />
              </div>
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
                placeholder={
                  currentLang === 'ar' ? '+218 91 123 4567' : '+218 91 123 4567'
                }
                className={errors.customerPhone ? 'border-red-300' : ''}
              />
              {errors.customerPhone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerPhone}
                </p>
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
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerEmail}
                </p>
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
                placeholder={
                  currentLang === 'ar'
                    ? 'أدخل عنوانك الكامل'
                    : 'Enter your full address'
                }
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
                placeholder={
                  currentLang === 'ar' ? 'منطقة الرياض' : 'Riyadh Region'
                }
              />
            </div>

            {/* Wrapping Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wrapping"
                checked={needsWrapping}
                onCheckedChange={(checked) =>
                  setNeedsWrapping(checked as boolean)
                }
              />
              <label
                htmlFor="wrapping"
                className="text-sm font-medium text-neutral-700"
              >
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
                placeholder={
                  currentLang === 'ar'
                    ? 'أي ملاحظات أو تعليمات خاصة...'
                    : 'Any special notes or instructions...'
                }
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
                  {currentLang === 'ar'
                    ? 'جاري إنشاء الطلب...'
                    : 'Creating Order...'}
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
          {/* Payment Methods */}
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">
              {currentLang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  key: 'card',
                  labelAr: 'بطاقة بنكية',
                  labelEn: 'Card',
                  icon: '/orna/visa.svg',
                },
                {
                  key: 'apple_pay',
                  labelAr: 'ابل باي',
                  labelEn: 'Apple Pay',
                  icon: '/orna/apple-pay.svg',
                },
                {
                  key: 'stc_pay',
                  labelAr: 'STC Pay',
                  labelEn: 'STC Pay',
                  icon: '/orna/unionpay.svg',
                },
                {
                  key: 'cod',
                  labelAr: 'الدفع عند الاستلام',
                  labelEn: 'Cash on Delivery',
                  icon: '/orna/mast  ercard.svg',
                },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      m.key as 'card' | 'apple_pay' | 'stc_pay' | 'cod'
                    )
                  }
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    paymentMethod === m.key
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="relative w-8 h-6">
                    <Image
                      src={m.icon}
                      alt={m.labelEn}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm">
                    {currentLang === 'ar' ? m.labelAr : m.labelEn}
                  </span>
                </button>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-700">
                  {currentLang === 'ar'
                    ? 'تفاصيل البطاقة البنكية'
                    : 'Card details'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      {currentLang === 'ar'
                        ? 'اسم حامل البطاقة'
                        : 'Cardholder name'}
                    </label>
                    <Input
                      value={cardDetails.cardholderName}
                      onChange={(e) =>
                        handleCardChange('cardholderName', e.target.value)
                      }
                      placeholder={
                        currentLang === 'ar'
                          ? 'كما يظهر على البطاقة'
                          : 'As shown on card'
                      }
                      autoComplete="cc-name"
                    />
                    {cardErrors.cardholderName && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.cardholderName}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      {currentLang === 'ar' ? 'رقم البطاقة' : 'Card number'}
                    </label>
                    <Input
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        handleCardChange('cardNumber', e.target.value)
                      }
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                      inputMode="numeric"
                    />
                    {cardErrors.cardNumber && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      {currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry date'}
                    </label>
                    <Input
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        handleCardChange('expiry', e.target.value)
                      }
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                    />
                    {cardErrors.expiry && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.expiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      {currentLang === 'ar'
                        ? 'رمز الأمان (CVV)'
                        : 'Security code (CVV)'}
                    </label>
                    <Input
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardChange('cvv', e.target.value)}
                      placeholder="123"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                    />
                    {cardErrors.cvv && (
                      <p className="text-xs text-red-600 mt-1">
                        {cardErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Cart Items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <p className="font-medium text-sm">
                    {item.product.name[currentLang]}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {currentLang === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(
                    item.product.price * item.quantity,
                    'LYD',
                    currentLang
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>
                {currentLang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}
              </span>
              <span>{formatPrice(totals.subtotal, 'LYD', currentLang)}</span>
            </div>

            {needsWrapping && totals.wrappingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>{currentLang === 'ar' ? 'التغليف:' : 'Wrapping:'}</span>
                <span>
                  {formatPrice(totals.wrappingCost, 'LYD', currentLang)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>{currentLang === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
              <span>
                {formatPrice(totals.shippingCost, 'LYD', currentLang)}
              </span>
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>{currentLang === 'ar' ? 'المجموع الكلي:' : 'Total:'}</span>
              <span className="text-amber-600">
                {formatPrice(totals.total, 'LYD', currentLang)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
