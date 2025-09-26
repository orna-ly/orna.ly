'use client';

import { useAtom } from 'jotai';
import Link from 'next/link';
import { currentLangAtom } from '@/lib/atoms';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, CreditCard, Smartphone, Globe } from 'lucide-react';

export default function PaymentGatewaysPage() {
  const [currentLang] = useAtom(currentLangAtom);
  const locale = currentLang === 'ar' ? 'ar' : 'en';

  const highlights = [
    {
      icon: CreditCard,
      title: {
        ar: 'خيارات دفع متعددة',
        en: 'Multiple Payment Options',
      },
      description: {
        ar: 'بوابة Plutu تدعم البطاقات المحلية والدولية بالإضافة إلى المحافظ الإلكترونية الليبية لتوفير تجربة دفع شاملة.',
        en: 'Plutu supports local and international cards alongside Libyan e-wallets to offer a complete checkout experience.',
      },
    },
    {
      icon: ShieldCheck,
      title: {
        ar: 'معايير أمان عالمية',
        en: 'Global Security Standards',
      },
      description: {
        ar: 'يتم تشفير جميع المعاملات باستخدام بروتوكولات PCI DSS مع مصادقة ثنائية لحماية بيانات العملاء.',
        en: 'All transactions are encrypted with PCI DSS compliant protocols and two-factor authentication to keep customer data secure.',
      },
    },
    {
      icon: Smartphone,
      title: {
        ar: 'دفع سلس عبر الجوال',
        en: 'Mobile-Friendly Checkout',
      },
      description: {
        ar: 'واجهات الدفع المتجاوبة تضمن تجربة سريعة وسهلة على الهواتف الذكية مع تأكيد فوري للمعاملات.',
        en: 'Responsive payment screens ensure fast, simple mobile flows with instant confirmation for each transaction.',
      },
    },
    {
      icon: Globe,
      title: {
        ar: 'عمليات دولية',
        en: 'Cross-Border Ready',
      },
      description: {
        ar: 'ندعم تحويل العملات ورسوم الصرف الشفافة لتمكين عملائنا في الخارج من الشراء دون تعقيدات.',
        en: 'We support currency conversion and transparent fees so international customers can order without friction.',
      },
    },
  ];

  const steps = [
    {
      title: {
        ar: 'تهيئة حساب Plutu',
        en: 'Set Up Your Plutu Account',
      },
      body: {
        ar: 'ننشئ حساب التاجر ونتأكد من تفعيل جميع طرق الدفع المطلوبة، بما في ذلك البطاقات والمحافظ المحلية.',
        en: 'We provision the merchant account and activate the necessary payment methods including cards and local wallets.',
      },
    },
    {
      title: {
        ar: 'دمج API الآمن',
        en: 'Secure API Integration',
      },
      body: {
        ar: 'واجهة برمجة تطبيقات Plutu توفر نقاط نهاية بسيطة لإنشاء المدفوعات وتتبع الحالات مع دعم SDK للواجهات الأمامية.',
        en: "Plutu's API exposes straightforward endpoints to create payments and track statuses, backed by frontend-ready SDKs.",
      },
    },
    {
      title: {
        ar: 'مراقبة في الوقت الفعلي',
        en: 'Real-Time Monitoring',
      },
      body: {
        ar: 'لوحة التحكم توفر تقارير فورية وإشعارات للمدفوعات الناجحة أو المعلقة لضمان متابعة فريق خدمة العملاء.',
        en: 'The dashboard delivers instant reporting and alerts for successful or pending payments so support teams can react quickly.',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-rose-50/30">
      <section className="section-padding bg-gradient-to-r from-amber-600 to-rose-600 text-white">
        <div className="container-width text-center space-y-4">
          <Badge className="bg-white/20 text-white border border-white/40">
            {currentLang === 'ar' ? 'حلول دفع موثوقة' : 'Trusted Payments'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            {currentLang === 'ar' ? 'بوابات الدفع' : 'Payment Gateways'}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            {currentLang === 'ar'
              ? 'نعتمد على منصة Plutu الليبية لتقديم عمليات دفع آمنة وسلسة ومتوافقة مع السوق المحلي والعالمي.'
              : "We rely on Libya's Plutu platform to deliver secure, frictionless payments tailored to both local and international customers."}
          </p>
          <Link
            href="https://plutu.ly/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white text-amber-600 font-semibold shadow hover:bg-amber-50 transition"
          >
            {currentLang === 'ar'
              ? 'تعرّف على Plutu'
              : 'Learn more about Plutu'}
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm">
              <CardContent className="p-8 space-y-4 text-lg leading-relaxed text-neutral-700">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  {currentLang === 'ar'
                    ? 'لماذا اخترنا Plutu؟'
                    : 'Why we chose Plutu'}
                </h2>
                <p>
                  {currentLang === 'ar'
                    ? 'توفر Plutu بنية تحتية متكاملة للمدفوعات في ليبيا، وتتيح لنا قبول المدفوعات الإلكترونية بسهولة مع الامتثال لجميع المتطلبات المصرفية المحلية.'
                    : 'Plutu provides Libya-focused payment infrastructure, allowing us to accept digital payments effortlessly while staying compliant with local banking requirements.'}
                </p>
                <p>
                  {currentLang === 'ar'
                    ? 'يدعم النظام التسويات اليومية، وإدارة النزاعات، وإمكانية التوسع إلى قنوات دفع جديدة فور إطلاقها في السوق.'
                    : 'The system supports daily settlements, dispute management, and rapid expansion into new payment channels as they launch in the market.'}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  {currentLang === 'ar' ? 'رحلة الدفع' : 'Payment Journey'}
                </h2>
                <ol className="space-y-4 text-neutral-700 text-lg leading-relaxed">
                  {steps.map((step) => (
                    <li
                      key={step.title[locale]}
                      className="border-l-4 border-amber-500 pl-4"
                    >
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {step.title[locale]}
                      </h3>
                      <p>{step.body[locale]}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card key={highlight.title.en} className="shadow-sm">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-amber-100 text-amber-700 p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {highlight.title[locale]}
                      </h3>
                      <p className="text-neutral-700 text-base leading-relaxed">
                        {highlight.description[locale]}
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
