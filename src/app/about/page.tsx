'use client';

import { useAtom } from 'jotai';
import { currentLangAtom } from '@/lib/atoms';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  const [currentLang] = useAtom(currentLangAtom);

  const features = [
    {
      icon: Star,
      title: { ar: 'جودة استثنائية', en: 'Exceptional Quality' },
      description: {
        ar: 'نستخدم أفضل المواد الخام والأحجار الكريمة الطبيعية في صناعة مجوهراتنا',
        en: 'We use the finest raw materials and natural gemstones in crafting our jewelry',
      },
    },
    {
      icon: Award,
      title: { ar: 'تصميمات حصرية', en: 'Exclusive Designs' },
      description: {
        ar: 'كل قطعة مجوهرات مصممة بعناية فائقة لتعكس الأناقة والجمال',
        en: 'Each piece of jewelry is carefully designed to reflect elegance and beauty',
      },
    },
    {
      icon: Shield,
      title: { ar: 'ضمان مدى الحياة', en: 'Lifetime Guarantee' },
      description: {
        ar: 'نقدم ضمان شامل على جميع منتجاتنا مع خدمة صيانة مجانية',
        en: 'We provide comprehensive warranty on all our products with free maintenance service',
      },
    },
    {
      icon: Heart,
      title: { ar: 'صناعة يدوية', en: 'Handcrafted' },
      description: {
        ar: 'كل قطعة مصنوعة بحب واهتمام من قبل حرفيين ماهرين',
        en: 'Every piece is made with love and care by skilled artisans',
      },
    },
  ];

  const stats = [
    {
      number: '10+',
      label: { ar: 'سنوات من الخبرة', en: 'Years of Experience' },
    },
    { number: '5000+', label: { ar: 'عميل راضي', en: 'Satisfied Customers' } },
    { number: '500+', label: { ar: 'تصميم حصري', en: 'Exclusive Designs' } },
    { number: '50+', label: { ar: 'حرفي ماهر', en: 'Skilled Craftsmen' } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-rose-50/30">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-amber-600 to-rose-600 text-white">
        <div className="container-width text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {currentLang === 'ar' ? 'عن مجوهرات أورنا' : 'About Orna Jewelry'}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {currentLang === 'ar'
                ? 'رحلة من الإبداع والتميز في عالم المجوهرات الفاخرة منذ أكثر من عقد من الزمان'
                : 'A journey of creativity and excellence in the world of luxury jewelry for over a decade'}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-800 text-sm px-3 py-1">
                {currentLang === 'ar' ? 'قصتنا' : 'Our Story'}
              </Badge>
              <h2 className="heading-2 mb-6">
                {currentLang === 'ar'
                  ? 'رحلة الإبداع والتميز'
                  : 'Journey of Creativity and Excellence'}
              </h2>
              <div className="body-text space-y-4 text-lg leading-relaxed">
                <p>
                  {currentLang === 'ar'
                    ? 'بدأت رحلتنا من حلم بسيط: إنشاء مجوهرات تحكي قصة كل امرأة وتبرز جمالها الطبيعي. منذ تأسيس مجوهرات أورنا، التزمنا بأعلى معايير الجودة والحرفية.'
                    : "Our journey began with a simple dream: to create jewelry that tells every woman's story and highlights her natural beauty. Since founding Orna Jewelry, we have committed to the highest standards of quality and craftsmanship."}
                </p>
                <p>
                  {currentLang === 'ar'
                    ? 'نحن نؤمن بأن كل قطعة مجوهرات يجب أن تكون استثمار في الجمال والذكريات، لذلك نختار بعناية كل حجر كريم وكل تفصيل.'
                    : 'We believe that every piece of jewelry should be an investment in beauty and memories, which is why we carefully select every gemstone and every detail.'}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="jewelry-card p-8 bg-gradient-to-br from-amber-50 to-rose-50">
                <div className="text-center">
                  <div className="text-8xl mb-4">💎</div>
                  <h3 className="text-2xl font-bold text-amber-700 mb-2">
                    {currentLang === 'ar'
                      ? 'التميز في كل التفاصيل'
                      : 'Excellence in Every Detail'}
                  </h3>
                  <p className="text-amber-600">
                    {currentLang === 'ar'
                      ? 'من التصميم إلى التسليم'
                      : 'From Design to Delivery'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-neutral-900 text-white">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-white mb-4">
              {currentLang === 'ar'
                ? 'إنجازاتنا بالأرقام'
                : 'Our Achievements in Numbers'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-300">
                  {stat.label[currentLang as keyof typeof stat.label]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              {currentLang === 'ar' ? 'ما يميزنا' : 'What Makes Us Special'}
            </h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              {currentLang === 'ar'
                ? 'نحن نتميز بالتزامنا بالجودة والابتكار والخدمة الاستثنائية'
                : 'We stand out through our commitment to quality, innovation, and exceptional service'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="jewelry-card jewelry-card-hover p-6"
                >
                  <CardContent className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                        {
                          feature.title[
                            currentLang as keyof typeof feature.title
                          ]
                        }
                      </h3>
                      <p className="body-text">
                        {
                          feature.description[
                            currentLang as keyof typeof feature.description
                          ]
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gradient-to-r from-amber-100 to-rose-100">
        <div className="container-width">
          <div className="text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-2 mb-8">
                {currentLang === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </h2>
              <div className="jewelry-card p-8 bg-white/80 backdrop-blur-sm">
                <p className="text-xl leading-relaxed text-neutral-700">
                  {currentLang === 'ar'
                    ? 'أن نكون الرائدين في صناعة المجوهرات الفاخرة من خلال تقديم قطع استثنائية تجمع بين التصميم المبتكر والحرفية التقليدية، مع الحفاظ على أعلى معايير الجودة والاستدامة.'
                    : 'To be leaders in the luxury jewelry industry by providing exceptional pieces that combine innovative design with traditional craftsmanship, while maintaining the highest standards of quality and sustainability.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
