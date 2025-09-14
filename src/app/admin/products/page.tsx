'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { productsAtom, currentLangAtom } from '@/lib/atoms'
import { mockProducts } from '@/lib/mock-data'
import { ProductsDataTable } from '@/components/admin/products-data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Package, Star, TrendingUp, AlertTriangle } from 'lucide-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useAtom(productsAtom)
  const [currentLang] = useAtom(currentLangAtom)

  // Initialize products
  useEffect(() => {
    if (products.length === 0) {
      setProducts(mockProducts)
    }
  }, [products.length, setProducts])

  const featuredCount = products.filter(p => p.featured).length
  const averagePrice = products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
    : 0
  const discountedCount = products.filter(p => p.priceBeforeDiscount).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentLang === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
          </h1>
          <p className="text-neutral-600 mt-2">
            {currentLang === 'ar' 
              ? 'إدارة مجموعة المنتجات والمجوهرات'
              : 'Manage your jewelry collection and products'
            }
          </p>
        </div>
        
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          {currentLang === 'ar' ? 'منتج جديد' : 'New Product'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">{products.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">{featuredCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === 'ar' ? 'متوسط السعر' : 'Average Price'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {averagePrice} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === 'ar' ? 'منتجات بخصم' : 'Discounted Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{discountedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentLang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
            <Button variant="outline" size="sm">
              {currentLang === 'ar' ? 'تصدير' : 'Export'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsDataTable products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
