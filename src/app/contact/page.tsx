'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, contactsAtom } from '@/lib/atoms'
import { ContactForm } from '@/components/forms/contact-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [currentLang] = useAtom(currentLangAtom)

  const contactInfo = [
    {
      icon: MapPin,
      title: { ar: 'العنوان', en: 'Address' },
      content: { 
        ar: 'الرياض، المملكة العربية السعودية', 
        en: 'Riyadh, Saudi Arabia' 
      }
    },
    {
      icon: Phone,
      title: { ar: 'الهاتف', en: 'Phone' },
      content: '+966 50 123 4567'
    },
    {
      icon: Mail,
      title: { ar: 'البريد الإلكتروني', en: 'Email' },
      content: 'info@orna.ly'
    },
    {
      icon: Clock,
      title: { ar: 'ساعات العمل', en: 'Working Hours' },
      content: { 
        ar: 'الأحد - الخميس: 9ص - 9م', 
        en: 'Sunday - Thursday: 9 AM - 9 PM' 
      }
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {currentLang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </h1>
          <p className="text-xl text-neutral-600">
            {currentLang === 'ar' 
              ? 'نحن هنا للإجابة على جميع استفساراتك'
              : 'We\'re here to answer all your questions'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          {typeof info.title === 'object' 
                            ? info.title[currentLang as keyof typeof info.title]
                            : info.title
                          }
                        </h3>
                        <p className="text-neutral-600">
                          {typeof info.content === 'object' 
                            ? info.content[currentLang as keyof typeof info.content]
                            : info.content
                          }
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLang === 'ar' ? 'تابعنا على' : 'Follow Us'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'Twitter', 'WhatsApp'].map((social) => (
                    <div 
                      key={social}
                      className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-medium">{social[0]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLang === 'ar' ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-sm">
                    {currentLang === 'ar' ? 'ضمان الجودة العالية' : 'High Quality Assurance'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-sm">
                    {currentLang === 'ar' ? 'توصيل سريع وآمن' : 'Fast & Secure Delivery'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-sm">
                    {currentLang === 'ar' ? 'خدمة عملاء متميزة' : 'Excellent Customer Service'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-sm">
                    {currentLang === 'ar' ? 'سياسة إرجاع مرنة' : 'Flexible Return Policy'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
