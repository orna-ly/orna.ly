'use client'

import { useAtom } from 'jotai'
import { currentLangAtom } from '@/lib/atoms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Mail, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLang] = useAtom(currentLangAtom)
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(true)

  useEffect(() => {
    // Best-effort check by calling a lightweight endpoint or decoding cookie server-side via middleware.
    // Here we assume middleware protects routes; keep a local flag true.
    setIsAuthed(true)
  }, [])

  const navigation = [
    {
      name: { ar: 'لوحة التحكم', en: 'Dashboard' },
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: { ar: 'المنتجات', en: 'Products' },
      href: '/admin/products',
      icon: Package
    },
    {
      name: { ar: 'الطلبات', en: 'Orders' },
      href: '/admin/orders',
      icon: ShoppingBag,
      badge: 3 // New orders count
    },
    {
      name: { ar: 'الرسائل', en: 'Messages' },
      href: '/admin/contacts',
      icon: Mail,
      badge: 2 // Unread messages count
    },
    {
      name: { ar: 'العملاء', en: 'Customers' },
      href: '/admin/customers',
      icon: Users
    },
    {
      name: { ar: 'الإعدادات', en: 'Settings' },
      href: '/admin/settings',
      icon: Settings
    }
  ]

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 shadow-lg flex flex-col">
        {/* Admin Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold">O</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {currentLang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
              </h2>
              <p className="text-sm text-neutral-600">
                {currentLang === 'ar' ? 'مجوهرات أورنا' : 'Orna Jewelry'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.href, item.exact)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active 
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 shadow-md border border-amber-200' 
                    : 'text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-100 hover:to-neutral-50 hover:shadow-sm'
                  }
                `}
              >
                <IconComponent className="h-5 w-5" />
                <span className="flex-1">
                  {item.name[currentLang as keyof typeof item.name]}
                </span>
                {item.badge && (
                  <Badge variant="destructive" className="h-5 px-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">
              {currentLang === 'ar' ? 'زيارة الموقع' : 'Visit Site'}
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            {currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">
                  {currentLang === 'ar' ? 'متصل' : 'Online'}
                </span>
              </div>
              <h1 className="text-3xl font-bold gradient-text-gold">
                {pathname === '/admin' && (currentLang === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
                {pathname === '/admin/products' && (currentLang === 'ar' ? 'إدارة المنتجات' : 'Product Management')}
                {pathname === '/admin/orders' && (currentLang === 'ar' ? 'إدارة الطلبات' : 'Order Management')}
                {pathname === '/admin/contacts' && (currentLang === 'ar' ? 'إدارة الرسائل' : 'Message Management')}
                {pathname === '/admin/customers' && (currentLang === 'ar' ? 'إدارة العملاء' : 'Customer Management')}
                {pathname === '/admin/settings' && (currentLang === 'ar' ? 'الإعدادات' : 'Settings')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200 px-3 py-1">
                {currentLang === 'ar' ? 'مدير النظام' : 'System Admin'}
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
