'use client';

import { useAtom } from 'jotai';
import { currentLangAtom, productsAtom } from '@/lib/atoms';
import { HeroCarousel } from '@/components/layout/hero-carousel';
import { ProductCarousel } from '@/components/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Truck, Award } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [products] = useAtom(productsAtom);
  const [currentLang] = useAtom(currentLangAtom);

  const features = [
    {
      icon: Star,
      title: { ar: 'جودة استثنائية', en: 'Premium Quality' },
      description: {
        ar: 'مجوهرات فاخرة بأعلى معايير الجودة',
        en: 'Luxury jewelry with highest quality standards',
      },
    },
    {
      icon: Shield,
      title: { ar: 'ضمان شامل', en: 'Full Warranty' },
      description: {
        ar: 'ضمان مدى الحياة على جميع منتجاتنا',
        en: 'Lifetime warranty on all our products',
      },
    },
    {
      icon: Truck,
      title: { ar: 'توصيل سريع', en: 'Fast Delivery' },
      description: {
        ar: 'توصيل سريع داخل ليبيا',
        en: 'Fast delivery across Libya',
      },
    },
    {
      icon: Award,
      title: { ar: 'تصاميم حصرية', en: 'Exclusive Designs' },
      description: {
        ar: 'تصاميم فريدة لا تجدها في مكان آخر',
        en: "Unique designs you won't find elsewhere",
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <HeroCarousel />

      {/* Featured Products Carousel */}
      <section className="section-padding bg-gradient-to-b from-amber-50/30 via-white to-rose-50/30">
        <div className="container-width">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-100 text-amber-800 text-sm px-4 py-2">
              {currentLang === 'ar'
                ? 'مجموعتنا المميزة'
                : 'Featured Collection'}
            </Badge>
            <h2 className="heading-2 mb-6 gradient-text-gold">
              {currentLang === 'ar' ? 'أحدث إبداعاتنا' : 'Our Latest Creations'}
            </h2>
            <p className="body-text text-lg max-w-3xl mx-auto leading-relaxed">
              {currentLang === 'ar'
                ? 'استكشف مجموعتنا الحصرية من المجوهرات الفاخرة المصممة بحرفية عالية لتناسب جميع المناسبات الخاصة'
                : 'Explore our exclusive collection of luxury jewelry crafted with exceptional artistry for all your special occasions'}
            </p>
          </div>

          {products.length > 0 ? (
            <ProductCarousel products={products} />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💍</div>
              <p className="text-neutral-600 text-lg mb-4">
                {currentLang === 'ar'
                  ? 'لا توجد منتجات متاحة حاليًا'
                  : 'No products available at the moment'}
              </p>
              <p className="text-neutral-500 text-sm mb-6">
                {currentLang === 'ar'
                  ? 'نعمل على إضافة منتجات جديدة قريبًا'
                  : "We're working on adding new products soon"}
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/products">
                {currentLang === 'ar'
                  ? 'تصفح المجموعة الكاملة'
                  : 'Browse Full Collection'}
                <span className="inline-block transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ml-2 rtl:ml-0 rtl:mr-2">
                  {currentLang === 'ar' ? '←' : '→'}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-width">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-6">
              {currentLang === 'ar'
                ? 'لماذا تختار مجوهرات أورنا؟'
                : 'Why Choose Orna Jewelry?'}
            </h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              {currentLang === 'ar'
                ? 'نحن نقدم أفضل تجربة تسوق للمجوهرات مع ضمان الجودة والخدمة المتميزة'
                : 'We provide the best jewelry shopping experience with quality guarantee and exceptional service'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="jewelry-card text-center p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {feature.title[currentLang as keyof typeof feature.title]}
                    </h3>
                    <p className="body-text">
                      {
                        feature.description[
                          currentLang as keyof typeof feature.description
                        ]
                      }
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-gradient-to-r from-amber-600 to-rose-600 text-white">
        <div className="container-width text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {currentLang === 'ar'
                ? 'ابدأ رحلتك مع الجمال'
                : 'Begin Your Journey with Beauty'}
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              {currentLang === 'ar'
                ? 'اكتشف مجموعة لا تُضاهى من المجوهرات الفاخرة واجعل كل لحظة خاصة لا تُنسى'
                : 'Discover an unparalleled collection of luxury jewelry and make every moment uniquely memorable'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-amber-600 hover:bg-neutral-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/products">
                  {currentLang === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Link href="/contact">
                  {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
