'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  currentLangAtom,
  addToCartAtom,
  productsAtom,
  loadProductsAtom,
} from '@/lib/atoms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/atoms';
import { formatPrice } from '@/lib/utils';
import { createPlaceholderImage } from '@/lib/image-utils';
import { showToast, toastError, toastSuccess } from '@/lib/toast';
import { ProductImageZoom } from '@/components/product/product-image-zoom';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [currentLang] = useAtom(currentLangAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [products] = useAtom(productsAtom);
  const [, loadProducts] = useAtom(loadProductsAtom);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );

  const locale = currentLang === 'ar' ? 'ar' : 'en';

  // Initialize products and find current product
  useEffect(() => {
    const initializeProduct = async () => {
      setLoading(true);

      // Load products if not already loaded
      if (products.length === 0) {
        await loadProducts();
      }

      // Find the product by slug
      const foundProduct = products.find((p) => p.slug === slug);
      setProduct(foundProduct || null);
      setLoading(false);
    };

    initializeProduct();
  }, [slug, products, loadProducts]);

  const handleAddToCart = () => {
    if (!product) return;

    const availableStock = product.stockQuantity ?? 0;
    const isSoldOut = availableStock <= 0 || product.status === 'OUT_OF_STOCK';

    if (isSoldOut) {
      showToast.error(
        currentLang === 'ar'
          ? 'عذراً، هذا المنتج غير متوفر حالياً'
          : 'Sorry, this product is sold out right now'
      );
      return;
    }

    if (availableStock > 0 && quantity > availableStock) {
      setQuantity(availableStock);
      showToast.error(
        currentLang === 'ar'
          ? 'تم تعديل الكمية لتتناسب مع المتوفر'
          : 'Quantity adjusted to available stock'
      );
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAddedToCart(true);
    showToast.success(
      currentLang === 'ar' ? 'تمت إضافة المنتج إلى السلة' : 'Added to cart'
    );
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    toastSuccess(isFavorite ? 'deleted' : 'saved', locale);
  };

  const handleShare = async () => {
    if (!product) return;

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';
    const productUrl = origin
      ? `${origin}/products/${product.slug}`
      : `/products/${product.slug}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: product.name[currentLang],
          url: productUrl,
        });
      } else if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(productUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = productUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setShareStatus('copied');
      toastSuccess('copied', locale);
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy product link', error);
      setShareStatus('error');
      toastError('generic', locale);
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-200 rounded-xl animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 bg-neutral-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-neutral-200 rounded animate-pulse" />
              <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4" />
              <div className="h-12 bg-neutral-200 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              {currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
            </h1>
            <p className="text-neutral-600 mb-6">
              {currentLang === 'ar'
                ? 'عذراً، لم نتمكن من العثور على المنتج المطلوب'
                : "Sorry, we couldn't find the product you're looking for"}
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentLang === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const availableStock = product.stockQuantity ?? 0;
  const isSoldOut = availableStock <= 0 || product.status === 'OUT_OF_STOCK';
  const lowStock = !isSoldOut && availableStock <= 3;
  const discountValue = product.discountPercentage
    ? Math.round(product.discountPercentage)
    : product.priceBeforeDiscount
      ? Math.round(
          ((product.priceBeforeDiscount - product.price) /
            product.priceBeforeDiscount) *
            100
        )
      : null;
  const categoryLabel =
    product.category === 'NATURAL_PEARLS'
      ? currentLang === 'ar'
        ? 'لؤلؤ طبيعي'
        : 'Natural Pearls'
      : currentLang === 'ar'
        ? 'لؤلؤ صناعي'
        : 'Artificial Pearls';
  const productTags = product.tags?.[currentLang] ?? [];
  const highlights = product.highlights?.[currentLang] ?? [];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-neutral-600">
            <li>
              <Link href="/" className="hover:text-amber-600">
                {currentLang === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-amber-600">
                {currentLang === 'ar' ? 'المنتجات' : 'Products'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-900">{product.name[currentLang]}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square">
              <ProductImageZoom
                src={
                  product.images[selectedImage] ||
                  product.images[0] ||
                  '/orna/1.jpeg'
                }
                alt={product.name[currentLang]}
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/20 via-rose-50/30 to-amber-100/20" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <Badge className="bg-amber-600 hover:bg-amber-700">
                    {currentLang === 'ar' ? 'مميز' : 'Featured'}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-neutral-800"
                >
                  {categoryLabel}
                </Badge>
              </div>
              {discountValue !== null && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  {discountValue}%{currentLang === 'ar' ? ' خصم' : ' OFF'}
                </Badge>
              )}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    {currentLang === 'ar' ? 'تم البيع بالكامل' : 'Sold Out'}
                  </span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image || index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-amber-600'
                        : 'border-transparent'
                    }`}
                    aria-label={
                      currentLang === 'ar'
                        ? 'عرض صورة المنتج'
                        : 'Show product image'
                    }
                  >
                    <Image
                      src={image || '/orna/1.jpeg'}
                      alt={product.name[currentLang]}
                      fill
                      sizes="80px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={createPlaceholderImage(160, 160, 'Orna')}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/20 via-rose-50/30 to-amber-100/20" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {product.name[currentLang]}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-neutral-600">
                  {product.subtitle[currentLang]}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  {categoryLabel}
                </Badge>
                {productTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-neutral-200 text-neutral-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-amber-600">
                {formatPrice(product.price, 'LYD', currentLang)}
              </span>
              {product.priceBeforeDiscount && (
                <span className="text-xl text-neutral-400 line-through">
                  {formatPrice(product.priceBeforeDiscount, 'LYD', currentLang)}
                </span>
              )}
              {discountValue !== null && (
                <Badge
                  variant="destructive"
                  className="bg-red-50 text-red-600 border-red-200"
                >
                  {currentLang === 'ar'
                    ? `${discountValue}% خصم`
                    : `${discountValue}% off`}
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ar' ? 'الوصف' : 'Description'}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {product.description[currentLang]}
              </p>
              {product.subdescription && (
                <p className="text-neutral-600 mt-3 leading-relaxed">
                  {product.subdescription[currentLang]}
                </p>
              )}
              {highlights.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-neutral-800">
                    {currentLang === 'ar' ? 'أبرز المزايا' : 'Key Highlights'}
                  </h4>
                  <ul className="space-y-1">
                    {highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-neutral-700"
                      >
                        <Check className="h-4 w-4 text-amber-600 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Separator />

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                {isSoldOut ? (
                  <span className="font-medium text-red-600">
                    {currentLang === 'ar'
                      ? 'هذا المنتج غير متوفر حالياً'
                      : 'This product is currently sold out'}
                  </span>
                ) : (
                  <>
                    <span className="text-neutral-600">
                      {currentLang === 'ar'
                        ? `المتوفر: ${availableStock} قطعة`
                        : `Available: ${availableStock} pieces`}
                    </span>
                    {lowStock && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700"
                      >
                        {currentLang === 'ar'
                          ? 'متبقي كمية محدودة'
                          : 'Limited stock'}
                      </Badge>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  {currentLang === 'ar' ? 'الكمية' : 'Quantity'}
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    disabled={quantity <= 1 || isSoldOut}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    disabled={
                      isSoldOut ||
                      (availableStock > 0 && quantity >= availableStock)
                    }
                    onClick={() =>
                      setQuantity((prev) =>
                        availableStock > 0
                          ? Math.min(availableStock, prev + 1)
                          : prev + 1
                      )
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'تم الإضافة!' : 'Added!'}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isSoldOut
                        ? currentLang === 'ar'
                          ? 'غير متوفر'
                          : 'Unavailable'
                        : currentLang === 'ar'
                          ? 'إضافة للسلة'
                          : 'Add to Cart'}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant={isFavorite ? 'default' : 'outline'}
                  onClick={handleToggleFavorite}
                  type="button"
                  aria-pressed={isFavorite}
                  aria-label={
                    currentLang === 'ar'
                      ? 'إضافة إلى المفضلة'
                      : 'Add to favourites'
                  }
                  className={
                    isFavorite
                      ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                      : undefined
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleShare}
                  type="button"
                  aria-label={
                    currentLang === 'ar'
                      ? 'نسخ رابط المنتج'
                      : 'Copy product link'
                  }
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">
                    {shareStatus === 'copied'
                      ? currentLang === 'ar'
                        ? 'تم نسخ الرابط'
                        : 'Link copied'
                      : shareStatus === 'error'
                        ? currentLang === 'ar'
                          ? 'فشل نسخ الرابط'
                          : 'Failed to copy'
                        : currentLang === 'ar'
                          ? 'مشاركة'
                          : 'Share'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">
                  {currentLang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {currentLang === 'ar' ? 'رمز المنتج:' : 'Product ID:'}
                    </span>
                    <span className="font-medium">{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{currentLang === 'ar' ? 'الفئة:' : 'Category:'}</span>
                    <span className="font-medium">{categoryLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {currentLang === 'ar' ? 'حالة المخزون:' : 'Stock Status:'}
                    </span>
                    <span
                      className={`font-medium ${
                        isSoldOut
                          ? 'text-red-600'
                          : lowStock
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                      }`}
                    >
                      {isSoldOut
                        ? currentLang === 'ar'
                          ? 'غير متوفر'
                          : 'Sold out'
                        : lowStock
                          ? currentLang === 'ar'
                            ? 'كمية محدودة'
                            : 'Limited stock'
                          : currentLang === 'ar'
                            ? 'متوفر'
                            : 'In stock'}
                    </span>
                  </div>
                  {!isSoldOut && (
                    <div className="flex justify-between">
                      <span>
                        {currentLang === 'ar'
                          ? 'الكمية المتاحة:'
                          : 'Available:'}
                      </span>
                      <span className="font-medium">{availableStock}</span>
                    </div>
                  )}
                  {product.wrappingPrice && (
                    <div className="flex justify-between">
                      <span>
                        {currentLang === 'ar'
                          ? 'تغليف هدايا:'
                          : 'Gift Wrapping:'}
                      </span>
                      <span className="font-medium">
                        {formatPrice(product.wrappingPrice, 'LYD', currentLang)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>
                      {currentLang === 'ar' ? 'تاريخ الإضافة:' : 'Date Added:'}
                    </span>
                    <span className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString(
                        currentLang === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </span>
                  </div>
                  {discountValue !== null && (
                    <div className="flex justify-between">
                      <span>
                        {currentLang === 'ar' ? 'نسبة الخصم:' : 'Discount:'}
                      </span>
                      <span className="font-medium">{discountValue}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
