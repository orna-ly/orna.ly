'use client';

import { useAtom } from 'jotai';
import { currentLangAtom, addToCartAtom, type Product } from '@/lib/atoms';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createPlaceholderImage } from '@/lib/image-utils';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentLang] = useAtom(currentLangAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const getCurrentImageIndex = (productId: string) => {
    return currentImageIndex[productId] || 0;
  };

  const setCurrentImage = (productId: string, index: number) => {
    setCurrentImageIndex((prev) => ({ ...prev, [productId]: index }));
  };

  const nextImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0 + 1) % totalImages,
    }));
  };

  const prevImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]:
        prev[productId] === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">💍</div>
        <p className="text-neutral-600 text-lg mb-4">
          {currentLang === 'ar'
            ? 'لا توجد منتجات متاحة حاليًا'
            : 'No products available at the moment'}
        </p>
        <p className="text-neutral-500 text-sm">
          {currentLang === 'ar'
            ? 'يرجى المحاولة مرة أخرى لاحقًا'
            : 'Please try again later'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="jewelry-card jewelry-card-hover group h-full">
                <CardHeader className="p-0 relative">
                  {/* Product Image Carousel */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    {product.images && product.images.length > 0 ? (
                      <>
                        <Image
                          src={product.images[getCurrentImageIndex(product.id)]}
                          alt={product.name[currentLang]}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          placeholder="blur"
                          blurDataURL={createPlaceholderImage(300, 300, 'Orna')}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Image Navigation Arrows */}
                        {product.images.length > 1 && (
                          <>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                prevImage(product.id, product.images.length)
                              }
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                nextImage(product.id, product.images.length)
                              }
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* Image Dots Indicator */}
                        {product.images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                            {product.images.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === getCurrentImageIndex(product.id)
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                                onClick={() =>
                                  setCurrentImage(product.id, index)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Fallback for products without images */
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-8xl opacity-40 transform group-hover:scale-110 transition-transform duration-500">
                            💍
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 space-y-2 z-10">
                      {product.featured && (
                        <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                          {currentLang === 'ar' ? 'مميز' : 'Featured'}
                        </Badge>
                      )}
                      {product.priceBeforeDiscount && (
                        <Badge variant="destructive">
                          {Math.round(
                            ((product.priceBeforeDiscount - product.price) /
                              product.priceBeforeDiscount) *
                              100
                          )}
                          %{currentLang === 'ar' ? ' خصم' : ' OFF'}
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2 z-10">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white shadow-lg"
                      >
                        <Heart className="h-4 w-4 text-rose-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        asChild
                        className="bg-white/90 hover:bg-white shadow-lg"
                      >
                        <Link href={`/products/${product.slug}`}>
                          <Eye className="h-4 w-4 text-neutral-600" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Product Name */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-neutral-900 line-clamp-1 text-lg">
                      {product.name[currentLang]}
                    </h3>
                    {product.subtitle && (
                      <p className="text-sm text-neutral-600 line-clamp-1">
                        {product.subtitle[currentLang]}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 line-clamp-2 flex-1">
                    {product.description[currentLang]}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="price-text text-xl font-bold">
                      {formatPrice(product.price, 'LYD', currentLang)}
                    </span>
                    {product.priceBeforeDiscount && (
                      <span className="text-sm text-neutral-400 line-through">
                        {formatPrice(
                          product.priceBeforeDiscount,
                          'LYD',
                          currentLang
                        )}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 btn-primary focus-ring"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'إضافة' : 'Add'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="focus-ring"
                    >
                      <Link href={`/products/${product.slug}`}>
                        {currentLang === 'ar' ? 'عرض' : 'View'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Mobile indicators */}
      <div className="flex justify-center mt-6 md:hidden">
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(products.length / 2) }).map(
            (_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-amber-300 rounded-full opacity-50"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
