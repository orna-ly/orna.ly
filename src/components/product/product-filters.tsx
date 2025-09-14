'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, filterCategoryAtom } from '@/lib/atoms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function ProductFilters() {
  const [currentLang] = useAtom(currentLangAtom)
  const [filterCategory, setFilterCategory] = useAtom(filterCategoryAtom)

  const categories = [
    {
      id: 'all',
      name: { ar: 'جميع المنتجات', en: 'All Products' },
      count: 0
    },
    {
      id: 'featured',
      name: { ar: 'المنتجات المميزة', en: 'Featured Products' },
      count: 0
    },
    {
      id: 'rings',
      name: { ar: 'الخواتم', en: 'Rings' },
      count: 0
    },
    {
      id: 'necklaces',
      name: { ar: 'العقود', en: 'Necklaces' },
      count: 0
    },
    {
      id: 'earrings',
      name: { ar: 'الأقراط', en: 'Earrings' },
      count: 0
    },
    {
      id: 'bracelets',
      name: { ar: 'الأساور', en: 'Bracelets' },
      count: 0
    }
  ]

  const priceRanges = [
    {
      id: 'under-1000',
      name: { ar: 'أقل من 1000 ر.س', en: 'Under 1000 SAR' },
      min: 0,
      max: 1000
    },
    {
      id: '1000-2000',
      name: { ar: '1000 - 2000 ر.س', en: '1000 - 2000 SAR' },
      min: 1000,
      max: 2000
    },
    {
      id: '2000-3000',
      name: { ar: '2000 - 3000 ر.س', en: '2000 - 3000 SAR' },
      min: 2000,
      max: 3000
    },
    {
      id: 'above-3000',
      name: { ar: 'أكثر من 3000 ر.س', en: 'Above 3000 SAR' },
      min: 3000,
      max: Infinity
    }
  ]

  const materials = [
    { id: 'gold', name: { ar: 'ذهب', en: 'Gold' } },
    { id: 'silver', name: { ar: 'فضة', en: 'Silver' } },
    { id: 'diamond', name: { ar: 'ألماس', en: 'Diamond' } },
    { id: 'pearl', name: { ar: 'لؤلؤ', en: 'Pearl' } }
  ]

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentLang === 'ar' ? 'الفئات' : 'Categories'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filterCategory === category.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setFilterCategory(category.id)}
            >
              <span className="flex-1 text-left">
                {category.name[currentLang as keyof typeof category.name]}
              </span>
              {category.count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentLang === 'ar' ? 'نطاق السعر' : 'Price Range'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priceRanges.map((range) => (
            <Button
              key={range.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                // Add price filtering logic here
                console.log('Price filter:', range)
              }}
            >
              {range.name[currentLang as keyof typeof range.name]}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Materials Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentLang === 'ar' ? 'المواد' : 'Materials'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {materials.map((material) => (
            <Button
              key={material.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                // Add material filtering logic here
                console.log('Material filter:', material)
              }}
            >
              {material.name[currentLang as keyof typeof material.name]}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setFilterCategory('all')
          // Clear other filters when implemented
        }}
      >
        {currentLang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
      </Button>
    </div>
  )
}
