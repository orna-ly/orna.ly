'use client';

import { useAtom } from 'jotai';
import { useMemo } from 'react';
import {
  productsAtom,
  currentLangAtom,
  searchQueryAtom,
  filterCategoryAtom,
  productsLoadingAtom,
  productsErrorAtom,
} from '@/lib/atoms';
import { ProductGrid } from '@/components/product/product-grid';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { ProductFilters } from '@/components/product/product-filters';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [products] = useAtom(productsAtom);
  const [isLoading] = useAtom(productsLoadingAtom);
  const [productsError] = useAtom(productsErrorAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filterCategory] = useAtom(filterCategoryAtom);
  // Products are loaded globally by DataProvider, no need to load here

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name[currentLang]
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.description[currentLang]
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      // Add category filtering logic based on your product categories
      filtered = filtered.filter((product) => {
        // For now, we'll use featured status as a simple filter
        if (filterCategory === 'featured') {
          return product.featured;
        }
        if (filterCategory === 'rings') {
          return (
            product.name[currentLang]?.toLowerCase().includes('خاتم') ||
            product.name[currentLang]?.toLowerCase().includes('ring')
          );
        }
        if (filterCategory === 'necklaces') {
          return (
            product.name[currentLang]?.toLowerCase().includes('عقد') ||
            product.name[currentLang]?.toLowerCase().includes('necklace')
          );
        }
        return true;
      });
    }

    return filtered;
  }, [products, searchQuery, filterCategory, currentLang]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {currentLang === 'ar' ? 'جميع المنتجات' : 'All Products'}
          </h1>
          <p className="text-neutral-600 text-lg">
            {currentLang === 'ar'
              ? 'تصفح مجموعتنا الكاملة من المجوهرات الفاخرة'
              : 'Browse our complete collection of luxury jewelry'}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            placeholder={
              currentLang === 'ar'
                ? 'البحث عن المنتجات...'
                : 'Search products...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-neutral-600">
                {currentLang === 'ar'
                  ? `${filteredProducts.length} منتج متاح`
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="jewelry-card p-4">
                    <Skeleton className="w-full aspect-square rounded-lg mb-4" />
                    <SkeletonText className="w-3/4 mb-2" />
                    <SkeletonText className="w-1/2 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!isLoading && productsError && (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-neutral-700 text-lg mb-2">
                  {currentLang === 'ar'
                    ? 'حدث خطأ أثناء تحميل المنتجات'
                    : 'An error occurred while loading products'}
                </p>
                <p className="text-neutral-500">{productsError}</p>
              </div>
            )}

            {/* Loaded state */}
            {!isLoading && !productsError && (
              <ProductGrid products={filteredProducts} />
            )}

            {!isLoading && !productsError && filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-neutral-600 text-lg mb-2">
                  {currentLang === 'ar'
                    ? 'لم يتم العثور على منتجات'
                    : 'No products found'}
                </p>
                <p className="text-neutral-500">
                  {currentLang === 'ar'
                    ? 'جرب البحث بكلمات مختلفة أو امسح الفلاتر'
                    : 'Try searching with different terms or clear filters'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
