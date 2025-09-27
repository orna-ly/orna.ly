'use client';

import { useAtom } from 'jotai';
import { currentLangAtom, addToCartAtom, type Product } from '@/lib/atoms';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createPlaceholderImage } from '@/lib/image-utils';
import { formatPrice } from '@/lib/utils';
import { showToast } from '@/lib/toast';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [currentLang] = useAtom(currentLangAtom);
  const [, addToCart] = useAtom(addToCartAtom);

  const handleAddToCart = (product: Product) => {
    const stock = product.stockQuantity ?? 0;
    if (stock <= 0 || product.status === 'OUT_OF_STOCK') {
      showToast.error(
        currentLang === 'ar'
          ? 'المنتج غير متوفر في الوقت الحالي'
          : 'Product is sold out right now'
      );
      return;
    }

    addToCart(product);
    showToast.success(
      currentLang === 'ar' ? 'تمت إضافة المنتج إلى السلة' : 'Added to cart'
    );
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💍</div>
        <p className="text-neutral-600 text-lg">
          {currentLang === 'ar'
            ? 'لا توجد منتجات للعرض'
            : 'No products to display'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const isSoldOut =
          (product.stockQuantity ?? 0) <= 0 ||
          product.status === 'OUT_OF_STOCK';

        return (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 rounded-xl"
          >
            <Card className="jewelry-card jewelry-card-hover group h-full">
              <CardHeader className="p-0 relative">
                {/* Product Image with optimization */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={(product.images?.[0] as string) || '/orna/pear.jpg'}
                    alt={product.name[currentLang]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={false}
                    placeholder="blur"
                    blurDataURL={createPlaceholderImage(300, 300, 'Orna')}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2">
                    {product.featured && (
                      <Badge className="bg-amber-600 hover:bg-amber-700">
                        {currentLang === 'ar' ? 'مميز' : 'Featured'}
                      </Badge>
                    )}
                    {(product.discountPercentage ||
                      product.priceBeforeDiscount) && (
                      <Badge variant="destructive">
                        {Math.round(
                          product.discountPercentage ??
                            (((product.priceBeforeDiscount ?? product.price) -
                              product.price) /
                              (product.priceBeforeDiscount ?? product.price)) *
                              100
                        )}
                        %{currentLang === 'ar' ? ' خصم' : ' OFF'}
                      </Badge>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-neutral-800"
                    >
                      {product.category === 'NATURAL_PEARLS'
                        ? currentLang === 'ar'
                          ? 'لؤلؤ طبيعي'
                          : 'Natural'
                        : currentLang === 'ar'
                          ? 'لؤلؤ صناعي'
                          : 'Artificial'}
                    </Badge>
                  </div>

                  {((product.stockQuantity ?? 0) <= 0 ||
                    product.status === 'OUT_OF_STOCK') && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {currentLang === 'ar' ? 'تم البيع' : 'Sold Out'}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {/* Product Name */}
                <div>
                  <h3 className="font-semibold text-neutral-900 line-clamp-1">
                    {product.name[currentLang]}
                  </h3>
                  {product.subtitle && (
                    <p className="text-sm text-neutral-600 line-clamp-1">
                      {product.subtitle[currentLang]}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {product.description[currentLang]}
                </p>

                {/* Tags */}
                {product.tags?.[currentLang] && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags[currentLang]?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-amber-200 text-amber-700 bg-amber-50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="price-text text-lg">
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
                    type="button"
                    disabled={isSoldOut}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {isSoldOut ? (
                      currentLang === 'ar' ? (
                        'تم البيع'
                      ) : (
                        'Sold Out'
                      )
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {currentLang === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
