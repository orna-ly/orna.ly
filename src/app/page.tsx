import Link from "next/link";
import { getCurrentLang, mockProducts } from "@/lib/mock-data";

export default function Home() {
  const currentLang = getCurrentLang();
  const featuredProducts = mockProducts.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-r from-yellow-100 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: "Noto Sans Arabic" }}
          >
            مجوهرات أورنا
          </h1>
          <p
            className="text-xl text-gray-600 mb-8"
            style={{ fontFamily: "Noto Sans Arabic" }}
          >
            اكتشف مجموعتنا الحصرية من المجوهرات الفاخرة
          </p>
          <Link
            href="/products"
            className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition"
          >
            تسوق الآن
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "Noto Sans Arabic" }}
          >
            المنتجات المميزة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-64 bg-gray-200 relative">
                  {/* Placeholder for product image */}
                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                    <span className="text-4xl">💍</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "Noto Sans Arabic" }}
                  >
                    {product.name[currentLang as "ar" | "en"]}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description?.[currentLang as "ar" | "en"]}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-yellow-600">
                        {product.price} ر.س
                      </span>
                      {product.priceBeforeDiscount && (
                        <span className="text-sm text-gray-400 line-through mr-2">
                          {product.priceBeforeDiscount} ر.س
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition text-sm"
                    >
                      عرض
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
