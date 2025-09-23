"use client";

import { useAtom } from "jotai";
import { cartItemsAtom, currentLangAtom } from "@/lib/atoms";
import { OrderForm } from "@/components/forms/order-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [cartItems] = useAtom(cartItemsAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const router = useRouter();

  const handleOrderCreated = (orderId: string) => {
    // Redirect to order confirmation page
    router.push(`/orders/${orderId}`);
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              {currentLang === "ar" ? "السلة فارغة" : "Cart is Empty"}
            </h1>
            <p className="text-neutral-600 mb-6">
              {currentLang === "ar"
                ? "أضف بعض المنتجات إلى سلتك أولاً"
                : "Add some products to your cart first"}
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentLang === "ar" ? "العودة للمنتجات" : "Back to Products"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
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
            {currentLang === "ar" ? "العودة للسلة" : "Back to Cart"}
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentLang === "ar" ? "إتمام الطلب" : "Checkout"}
          </h1>
          <p className="text-neutral-600 mt-2">
            {currentLang === "ar"
              ? "أكمل معلوماتك لإتمام عملية الشراء"
              : "Complete your information to finish your purchase"}
          </p>
        </div>

        {/* Order Form */}
        <OrderForm onOrderCreated={handleOrderCreated} />
      </div>
    </div>
  );
}
