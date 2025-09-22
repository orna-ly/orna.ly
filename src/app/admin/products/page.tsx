'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { productsAtom, currentLangAtom, loadProductsAtom } from '@/lib/atoms'
import { ProductsDataTable } from '@/components/admin/products-data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Package, Star, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AdminProductsPage() {
  const [products] = useAtom(productsAtom)
  const [currentLang] = useAtom(currentLangAtom)
  const [, loadProducts] = useAtom(loadProductsAtom)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    nameAr: '',
    nameEn: '',
    slug: '',
    price: '',
    priceBeforeDiscount: '',
    wrappingPrice: '',
    stockQuantity: '',
    images: '', // comma separated
    featured: false,
    subtitleAr: '',
    subtitleEn: '',
    descriptionAr: '',
    descriptionEn: ''
  })

  // Load products from backend
  useEffect(() => {
    if (products.length === 0) {
      void loadProducts()
    }
    // open create dialog if ?create=1
    try {
      // @ts-ignore
      const sp = new URLSearchParams(window.location.search)
      if (sp.get('create') === '1') setOpen(true)
    } catch {}
  }, [products.length, loadProducts])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const body = {
        name: { ar: form.nameAr, en: form.nameEn },
        slug: form.slug,
        price: parseFloat(form.price || '0'),
        priceBeforeDiscount: form.priceBeforeDiscount ? parseFloat(form.priceBeforeDiscount) : undefined,
        wrappingPrice: form.wrappingPrice ? parseFloat(form.wrappingPrice) : undefined,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        featured: form.featured,
        subtitle: { ar: form.subtitleAr, en: form.subtitleEn },
        description: { ar: form.descriptionAr, en: form.descriptionEn },
        status: 'ACTIVE'
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('Failed to create product')
      setOpen(false)
      setForm({
        nameAr: '', nameEn: '', slug: '', price: '', priceBeforeDiscount: '', wrappingPrice: '', stockQuantity: '', images: '', featured: false,
        subtitleAr: '', subtitleEn: '', descriptionAr: '', descriptionEn: ''
      })
      // refresh list
      await loadProducts()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

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
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              {currentLang === 'ar' ? 'منتج جديد' : 'New Product'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{currentLang === 'ar' ? 'إضافة منتج' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder={currentLang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'} value={form.nameAr} onChange={e=>setForm(f=>({...f,nameAr:e.target.value}))} />
                <Input placeholder="Name (EN)" value={form.nameEn} onChange={e=>setForm(f=>({...f,nameEn:e.target.value}))} />
                <Input placeholder="slug" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} />
                <Input placeholder={currentLang === 'ar' ? 'السعر' : 'Price'} type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
                <Input placeholder={currentLang === 'ar' ? 'السعر قبل الخصم' : 'Price Before Discount'} type="number" value={form.priceBeforeDiscount} onChange={e=>setForm(f=>({...f,priceBeforeDiscount:e.target.value}))} />
                <Input placeholder={currentLang === 'ar' ? 'سعر التغليف' : 'Wrapping Price'} type="number" value={form.wrappingPrice} onChange={e=>setForm(f=>({...f,wrappingPrice:e.target.value}))} />
                <Input placeholder={currentLang === 'ar' ? 'الكمية بالمخزون' : 'Stock Quantity'} type="number" value={form.stockQuantity} onChange={e=>setForm(f=>({...f,stockQuantity:e.target.value}))} />
                <Input placeholder={currentLang === 'ar' ? 'روابط الصور (مفصولة بفواصل)' : 'Image URLs (comma-separated)'} value={form.images} onChange={e=>setForm(f=>({...f,images:e.target.value}))} className="col-span-2" />
                <Input placeholder={currentLang === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (AR)'} value={form.subtitleAr} onChange={e=>setForm(f=>({...f,subtitleAr:e.target.value}))} />
                <Input placeholder="Subtitle (EN)" value={form.subtitleEn} onChange={e=>setForm(f=>({...f,subtitleEn:e.target.value}))} />
              </div>
              <Textarea placeholder={currentLang === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'} value={form.descriptionAr} onChange={e=>setForm(f=>({...f,descriptionAr:e.target.value}))} />
              <Textarea placeholder="Description (EN)" value={form.descriptionEn} onChange={e=>setForm(f=>({...f,descriptionEn:e.target.value}))} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={()=>setOpen(false)}>{currentLang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
                <Button type="submit" disabled={creating} className="bg-amber-600 hover:bg-amber-700">
                  {creating ? (currentLang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (currentLang === 'ar' ? 'حفظ' : 'Save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                {formatPrice(averagePrice, 'LYD', currentLang)}
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
