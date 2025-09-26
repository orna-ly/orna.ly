'use client';

import { useAtom } from 'jotai';
import { currentLangAtom } from '@/lib/atoms';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Package, Shield } from 'lucide-react';

export default function ReturnPolicyPage() {
  const [currentLang] = useAtom(currentLangAtom);

  const sections = [
    {
      icon: Clock,
      title: {
        ar: 'إطار زمني مرن',
        en: 'Flexible Timeline',
      },
      description: {
        ar: 'يمكنك تقديم طلب إرجاع خلال 14 يومًا من تاريخ استلامك للطلب مع الحفاظ على القطعة بحالتها الأصلية.',
        en: 'You may request a return within 14 days of receiving your order as long as the piece remains in its original condition.',
      },
    },
    {
      icon: Package,
      title: {
        ar: 'شروط الإرجاع',
        en: 'Return Eligibility',
      },
      description: {
        ar: 'يجب أن تكون القطعة غير مستخدمة، مع جميع الملحقات والتغليف الأصلي، وتشمل بطاقة الضمان وأي شهادات اعتماد.',
        en: 'Items must be unused and include all accessories, original packaging, warranty card, and any authenticity certificates.',
      },
    },
    {
      icon: Shield,
      title: {
        ar: 'سلامة المنتج',
        en: 'Product Integrity',
      },
      description: {
        ar: 'لضمان جودة مجوهراتنا، نخضع كل قطعة يتم إرجاعها لفحص من فريق الجودة قبل قبول عملية الاستبدال أو الاسترجاع.',
        en: 'To preserve our quality standards, every returned item is inspected by our quality team before approving an exchange or refund.',
      },
    },
    {
      icon: CheckCircle,
      title: {
        ar: 'عملية سهلة',
        en: 'Simple Process',
      },
      description: {
        ar: 'ابدأ بإرسال طلب عبر نموذج التواصل أو البريد الإلكتروني، وسيتواصل فريق خدمة العملاء معك لتأكيد تفاصيل الإرجاع وخيارات الشحن.',
        en: 'Start by sending a request through our contact form or email. Our support team will confirm the return details and shipping options with you.',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-rose-50/30">
      <section className="section-padding bg-gradient-to-r from-amber-600 to-rose-600 text-white">
        <div className="container-width text-center">
          <Badge className="mb-4 bg-white/20 text-white border border-white/40">
            {currentLang === 'ar' ? 'خدمة مضمونة' : 'Guaranteed Service'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentLang === 'ar' ? 'سياسة الإرجاع' : 'Return Policy'}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            {currentLang === 'ar'
              ? 'نلتزم بتجربة تسوق آمنة تضمن لك راحة البال عند اقتناء مجوهرات أورنا.'
              : 'We are committed to a safe shopping experience that gives you complete peace of mind when choosing Orna Jewelry.'}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm">
              <CardContent className="p-8 space-y-6 text-lg leading-relaxed">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-neutral-900">
                    {currentLang === 'ar'
                      ? 'كيفية تقديم طلب الإرجاع'
                      : 'How to Request a Return'}
                  </h2>
                  <p className="text-neutral-700">
                    {currentLang === 'ar'
                      ? 'إذا رغبت في إرجاع أحد المنتجات، يرجى التواصل معنا عبر البريد الإلكتروني support@orna.ly أو من خلال صفحة التواصل وتزويدنا برقم الطلب وسبب الإرجاع.'
                      : 'If you would like to return an item, please contact us at support@orna.ly or through the contact page, providing your order number and the reason for the return.'}
                  </p>
                </div>
                <ul className="space-y-3 text-neutral-700">
                  <li>
                    {currentLang === 'ar'
                      ? 'سيوجهك فريقنا إلى شركة الشحن المعتمدة لدينا، أو يمكنك زيارة أحد معارضنا المعتمدة لإتمام الإرجاع.'
                      : 'Our team will guide you to our preferred courier partner or invite you to visit one of our authorised boutiques to complete the return.'}
                  </li>
                  <li>
                    {currentLang === 'ar'
                      ? 'يتم إصدار استرداد المبلغ بعد استلام القطعة والتأكد من حالتها خلال 5-7 أيام عمل.'
                      : 'Refunds are processed within 5-7 business days after receiving and approving the item.'}
                  </li>
                  <li>
                    {currentLang === 'ar'
                      ? 'يمكنك اختيار استبدال القطعة أو الحصول على رصيد تسوق لاستخدامه في المستقبل.'
                      : 'You may choose between exchanging the piece or receiving store credit for future purchases.'}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-8 space-y-4 text-neutral-700 text-lg leading-relaxed">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  {currentLang === 'ar'
                    ? 'حالات غير قابلة للإرجاع'
                    : 'When Returns Are Not Available'}
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    {currentLang === 'ar'
                      ? 'القطع المصممة خصيصًا حسب الطلب أو المنقوشة برسالة شخصية.'
                      : 'Custom-made or engraved pieces created especially for you.'}
                  </li>
                  <li>
                    {currentLang === 'ar'
                      ? 'المنتجات التي تظهر عليها علامات استخدام أو تعديل.'
                      : 'Items that show signs of wear or alteration.'}
                  </li>
                  <li>
                    {currentLang === 'ar'
                      ? 'المنتجات التي تم شراؤها خلال العروض الخاصة مع توضيح عدم إمكانية الإرجاع.'
                      : 'Pieces purchased during promotional events marked as final sale.'}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title.en} className="shadow-sm">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-amber-100 text-amber-700 p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {section.title[currentLang as 'ar' | 'en']}
                      </h3>
                      <p className="text-neutral-700 text-base leading-relaxed">
                        {section.description[currentLang as 'ar' | 'en']}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
