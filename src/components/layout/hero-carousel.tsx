'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, type Product } from '@/lib/atoms'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

interface HeroCarouselProps {
  products: Product[]
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const [currentLang] = useAtom(currentLangAtom)

  const featuredSlides = [
    {
      image: '/images/hero/white-peacock.jpg',
      title: { ar: 'الطاووس الأبيض', en: 'The White Peacock' },
      description: { 
        ar: 'يرمز إلى النقاء والخلود! المجموعة مثالية لمناسبات الزفاف.',
        en: 'Symbolizes purity and eternity! The set is perfect for wedding occasions.'
      },
      link: '/products/white-peacock-set'
    },
    {
      image: '/images/hero/golden-ring.jpg',
      title: { ar: 'الخاتم الذهبي', en: 'The Golden Ring' },
      description: { 
        ar: 'تبدو رائعة مع أي ملابس. تم تصميمه مع وضع الرومانسية في الاعتبار!',
        en: 'Looks gorgeous with any outfit. Designed with the romantic in mind!'
      },
      link: '/products/golden-hope-ring'
    },
    {
      image: '/images/hero/tahitian-pearl.jpg',
      title: { ar: 'لؤلؤة التاهيتي', en: 'Tahitian Pearl' },
      description: { 
        ar: 'فريد. أنيق. جميل مصنوع يدويًا من لؤلؤة المياه العذبة.',
        en: 'Unique. Stylish. Beautifully handcrafted from freshwater pearls.'
      },
      link: '/products/tahitian-pearl-necklace'
    }
  ]

  // If no products are available, use featured slides data
  const slidesToShow = products.length > 0 
    ? products.slice(0, 3).map(product => ({
        image: product.images[0] || '/images/hero/placeholder.jpg',
        title: product.name,
        description: product.description,
        link: `/products/${product.slug}`
      }))
    : featuredSlides

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Carousel 
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="h-full w-full"
      >
        <CarouselContent className="h-full">
          {slidesToShow.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full">
              <div className="relative h-full w-full">
                {/* Background gradient as fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-amber-50" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-end">
                  <div className="max-w-7xl mx-auto px-4 pb-20 w-full">
                    <Card className="bg-rose-600/90 backdrop-blur-sm border-0 text-white max-w-lg p-8">
                      <h3 className="text-3xl font-bold mb-4">
                        <Link 
                          href={slide.link}
                          className="hover:text-rose-100 transition-colors"
                        >
                          {slide.title[currentLang as keyof typeof slide.title]}
                        </Link>
                      </h3>
                      <p className="text-rose-100 mb-6 text-lg">
                        {slide.description[currentLang as keyof typeof slide.description]}
                      </p>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-rose-600"
                      >
                        <Link href={slide.link}>
                          {currentLang === 'ar' ? 'عرض المنتج' : 'View Product'}
                        </Link>
                      </Button>
                    </Card>
                  </div>
                </div>

                {/* Large decorative elements */}
                <div className="absolute top-1/4 right-10 opacity-10">
                  <div className="w-32 h-32 border-8 border-white rounded-full" />
                </div>
                <div className="absolute bottom-1/3 left-20 opacity-10">
                  <div className="w-24 h-24 border-4 border-white rotate-45" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
