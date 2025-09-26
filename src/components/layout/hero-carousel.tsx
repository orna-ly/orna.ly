'use client';

import { useAtom } from 'jotai';
import {
  currentLangAtom,
  featuredProductsAtom,
  type Product,
} from '@/lib/atoms';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { createPlaceholderImage } from '@/lib/image-utils';

import Autoplay from 'embla-carousel-autoplay';

export function HeroCarousel() {
  const [currentLang] = useAtom(currentLangAtom);
  const [featuredProducts] = useAtom(featuredProductsAtom);
  const [, setImagesLoaded] = useState<boolean[]>([]);

  // Map backend featured products into slides
  const featuredSlides = (featuredProducts?.slice(0, 5) || []).map(
    (p: Product) => ({
      title: p.name,
      description: p.description,
      link: `/products/${p.slug}`,
      image: p.images?.[0] || '/orna/1.jpeg',
      gradient: 'from-amber-600 to-rose-600',
    })
  );

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const loadPromises = featuredSlides.map((slide) => {
        return new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = slide.image;
        });
      });

      const results = await Promise.all(loadPromises);
      setImagesLoaded(results);
    };

    preloadImages();
  }, [featuredSlides]);

  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-neutral-100">
      <Carousel
        key={currentLang}
        dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        opts={{
          align: 'start',
          loop: true,
          direction: currentLang === 'ar' ? 'rtl' : 'ltr',
        }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="h-full w-full"
      >
        <CarouselContent className="h-full">
          {(featuredSlides.length > 0
            ? featuredSlides
            : [
                {
                  title: {
                    ar: 'اكتشف أناقة مجوهرات أورنا',
                    en: 'Discover the Elegance of Orna',
                  },
                  description: {
                    ar: 'قطع مصممة بعناية من الذهب والأحجار الكريمة للاحتفال بكل لحظة ثمينة في حياتك',
                    en: 'Thoughtfully crafted gold and gemstone pieces to celebrate every precious moment.',
                  },
                  link: '/products',
                  image: '/orna/3.jpeg',
                  gradient: 'from-amber-600 to-rose-600',
                },
              ]
          ).map((slide, index) => (
            <CarouselItem key={index} className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <NextImage
                  src={slide.image}
                  alt={
                    typeof slide.title === 'string'
                      ? slide.title
                      : slide.title[currentLang]
                  }
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={createPlaceholderImage(1200, 800, 'Orna')}
                  className="object-cover"
                />
                {/* Pearl gradient tint */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-40 mix-blend-multiply`}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Decorative patterns */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 border border-white/20 rounded-full opacity-30" />
                <div className="absolute bottom-32 left-16 w-48 h-48 border-2 border-white/10 rotate-45 opacity-40" />
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full opacity-60" />
                <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/10 rotate-45 opacity-50" />
              </div>

              {/* Jewelry-themed decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <div className="text-white text-9xl">💍</div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-end">
                <div className="container-width pb-20 w-full">
                  <div className="max-w-2xl">
                    <div className="jewelry-card bg-white/95 backdrop-blur-md border-0 text-neutral-900 p-8 shadow-2xl">
                      <h3 className="text-4xl font-bold mb-4 gradient-text-gold">
                        <Link
                          href={slide.link}
                          className="hover:opacity-80 transition-opacity focus-ring rounded-lg"
                        >
                          {slide.title[currentLang as keyof typeof slide.title]}
                        </Link>
                      </h3>
                      <p className="body-text text-xl mb-6 leading-relaxed">
                        {
                          slide.description[
                            currentLang as keyof typeof slide.description
                          ]
                        }
                      </p>
                      <Button
                        asChild
                        className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
                      >
                        <Link
                          href={slide.link}
                          className="focus-ring rounded-lg"
                        >
                          {currentLang === 'ar' ? 'عرض المنتج' : 'View Product'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
