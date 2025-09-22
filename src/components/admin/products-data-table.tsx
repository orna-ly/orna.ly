'use client'

import { useAtom } from 'jotai'
import { currentLangAtom, type Product, loadProductsAtom } from '@/lib/atoms'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Eye, Trash2, Copy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface ProductsDataTableProps {
  products: Product[]
}

export function ProductsDataTable({ products }: ProductsDataTableProps) {
  const [currentLang] = useAtom(currentLangAtom)
  const [, loadProducts] = useAtom(loadProductsAtom)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    price: '',
    priceBeforeDiscount: '',
    wrappingPrice: '',
    stockQuantity: '',
    featured: false,
    status: 'ACTIVE',
    images: ''
  })

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      price: String(p.price ?? ''),
      priceBeforeDiscount: p.priceBeforeDiscount != null ? String(p.priceBeforeDiscount) : '',
      wrappingPrice: p.wrappingPrice != null ? String(p.wrappingPrice) : '',
      stockQuantity: (p as any).stockQuantity != null ? String((p as any).stockQuantity) : '0',
      featured: p.featured,
      status: p.status,
      images: (p.images || []).join(', ')
    })
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const body: any = {
        price: parseFloat(form.price || '0'),
        priceBeforeDiscount: form.priceBeforeDiscount ? parseFloat(form.priceBeforeDiscount) : undefined,
        wrappingPrice: form.wrappingPrice ? parseFloat(form.wrappingPrice) : undefined,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
        featured: form.featured,
        status: form.status,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean)
      }
      const res = await fetch(`/api/products/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to save')
      setEditing(null)
      await loadProducts()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    // You could add a toast notification here
  }

  const handleDelete = async (productId: string) => {
    if (!confirm(currentLang === 'ar' ? 'تأكيد حذف المنتج؟' : 'Delete this product?')) return
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Failed to delete')
      await loadProducts()
    } catch (err) {
      console.error(err)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {currentLang === 'ar' ? 'لا توجد منتجات' : 'No products found'}
        </h3>
        <p className="text-neutral-600">
          {currentLang === 'ar' 
            ? 'ابدأ بإضافة منتجات جديدة إلى متجرك'
            : 'Start by adding new products to your store'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">
              {currentLang === 'ar' ? 'صورة' : 'Image'}
            </TableHead>
            <TableHead>
              {currentLang === 'ar' ? 'الاسم' : 'Name'}
            </TableHead>
            <TableHead>
              {currentLang === 'ar' ? 'السعر' : 'Price'}
            </TableHead>
            <TableHead>
              {currentLang === 'ar' ? 'الحالة' : 'Status'}
            </TableHead>
            <TableHead>
              {currentLang === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
            </TableHead>
            <TableHead className="w-20">
              {currentLang === 'ar' ? 'الإجراءات' : 'Actions'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-neutral-50">
              <TableCell>
                <div className="relative w-12 h-12">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name[currentLang]}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 rounded-md flex items-center justify-center">
                      <span className="text-xl">💍</span>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="font-medium">
                    {product.name[currentLang]}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {product.slug}
                  </div>
                  {product.subtitle && (
                    <div className="text-sm text-neutral-600 mt-1">
                      {product.subtitle[currentLang]}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="font-medium">
                    {new Intl.NumberFormat(currentLang === 'ar' ? 'ar-LY' : 'en-LY').format(product.price)} {currentLang === 'ar' ? 'د.ل' : 'LYD'}
                  </div>
                  {product.priceBeforeDiscount && (
                    <div className="text-sm text-neutral-500 line-through">
                      {new Intl.NumberFormat(currentLang === 'ar' ? 'ar-LY' : 'en-LY').format(product.priceBeforeDiscount)} {currentLang === 'ar' ? 'د.ل' : 'LYD'}
                    </div>
                  )}
                  {product.priceBeforeDiscount && (
                    <div className="text-xs text-green-600 font-medium">
                      {Math.round(((product.priceBeforeDiscount - product.price) / product.priceBeforeDiscount) * 100)}% OFF
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <Badge variant={product.featured ? 'default' : 'secondary'}>
                    {product.featured 
                      ? (currentLang === 'ar' ? 'مميز' : 'Featured')
                      : (currentLang === 'ar' ? 'عادي' : 'Regular')
                    }
                  </Badge>
                  {product.priceBeforeDiscount && (
                    <Badge variant="outline" className="text-xs">
                      {currentLang === 'ar' ? 'خصم' : 'Sale'}
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  {new Date(product.createdAt).toLocaleDateString(
                    currentLang === 'ar' ? 'ar-SA' : 'en-US'
                  )}
                </div>
                <div className="text-xs text-neutral-500">
                  {new Date(product.createdAt).toLocaleTimeString(
                    currentLang === 'ar' ? 'ar-SA' : 'en-US',
                    { hour: '2-digit', minute: '2-digit' }
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        {currentLang === 'ar' ? 'عرض' : 'View'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEdit(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'تعديل' : 'Edit'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyId(product.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'نسخ المعرف' : 'Copy ID'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {currentLang === 'ar' ? 'حذف' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Edit Dialog
export function EditProductDialog({ editing, setEditing, form, setForm, onSave, saving }: any) {
  if (!editing) return null
  return (
    <Dialog open={!!editing} onOpenChange={(o)=>!o && setEditing(null)}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{'Edit Product'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder={'Price'} type="number" value={form.price} onChange={e=>setForm((f:any)=>({...f,price:e.target.value}))} />
          <Input placeholder={'Price Before Discount'} type="number" value={form.priceBeforeDiscount} onChange={e=>setForm((f:any)=>({...f,priceBeforeDiscount:e.target.value}))} />
          <Input placeholder={'Wrapping Price'} type="number" value={form.wrappingPrice} onChange={e=>setForm((f:any)=>({...f,wrappingPrice:e.target.value}))} />
          <Input placeholder={'Stock Quantity'} type="number" value={form.stockQuantity} onChange={e=>setForm((f:any)=>({...f,stockQuantity:e.target.value}))} />
          <div className="flex items-center gap-2">
            <Checkbox id="featured" checked={form.featured} onCheckedChange={(v:any)=>setForm((f:any)=>({...f,featured:!!v}))} />
            <label htmlFor="featured">Featured</label>
          </div>
          <Select value={form.status} onValueChange={(v)=>setForm((f:any)=>({...f,status:v}))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
            </SelectContent>
          </Select>
          <Input className="col-span-2" placeholder={'Image URLs (comma-separated)'} value={form.images} onChange={e=>setForm((f:any)=>({...f,images:e.target.value}))} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700">{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
