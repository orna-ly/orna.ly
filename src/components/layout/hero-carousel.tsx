"use client";

import { useAtom } from "jotai";
import { currentLangAtom } from "@/lib/atoms";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import Autoplay from "embla-carousel-autoplay";

export function HeroCarousel() {
  const [currentLang] = useAtom(currentLangAtom);

  const featuredSlides = [
    {
      title: { ar: "الطاووس الأبيض", en: "The White Peacock" },
      description: {
        ar: "يرمز إلى النقاء والخلود! المجموعة مثالية لمناسبات الزفاف.",
        en: "Symbolizes purity and eternity! The set is perfect for wedding occasions.",
      },
      link: "/products/white-peacock-set",
      gradient: "from-rose-600 to-pink-600",
    },
    {
      title: { ar: "الخاتم الذهبي", en: "The Golden Ring" },
      description: {
        ar: "تبدو رائعة مع أي ملابس. تم تصميمه مع وضع الرومانسية في الاعتبار!",
        en: "Looks gorgeous with any outfit. Designed with the romantic in mind!",
      },
      link: "/products/golden-hope-ring",
      gradient: "from-amber-600 to-orange-600",
    },
    {
      title: { ar: "لؤلؤة التاهيتي", en: "Tahitian Pearl" },
      description: {
        ar: "فريد. أنيق. جميل مصنوع يدويًا من لؤلؤة المياه العذبة.",
        en: "Unique. Stylish. Beautifully handcrafted from freshwater pearls.",
      },
      link: "/products/tahitian-pearl-necklace",
      gradient: "from-slate-600 to-gray-700",
    },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="h-full w-full"
      >
        <CarouselContent className="h-full">
          {featuredSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full">
              <div className="relative h-full w-full">
                {/* Beautiful gradient backgrounds */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-90`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

                {/* Decorative patterns */}
                <div className="absolute inset-0">
                  <div className="absolute top-20 right-20 w-64 h-64 border border-white/20 rounded-full opacity-30" />
                  <div className="absolute bottom-32 left-16 w-48 h-48 border-2 border-white/10 rotate-45 opacity-40" />
                  <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full opacity-60" />
                  <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/10 rotate-45 opacity-50" />
                </div>

                {/* Jewelry-themed decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="text-white text-9xl">💍</div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-end">
                  <div className="container-width pb-20 w-full">
                    <div className="max-w-2xl">
                      <div className="jewelry-card bg-white/95 backdrop-blur-md border-0 text-neutral-900 p-8 shadow-2xl">
                        <h3 className="text-4xl font-bold mb-4 gradient-text-gold">
                          <Link
                            href={slide.link}
                            className="hover:opacity-80 transition-opacity focus-ring rounded-lg"
                          >
                            {
                              slide.title[
                                currentLang as keyof typeof slide.title
                              ]
                            }
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
                            {currentLang === "ar"
                              ? "عرض المنتج"
                              : "View Product"}
                          </Link>
                        </Button>
                      </div>
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
