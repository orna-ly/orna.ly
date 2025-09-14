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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLang] = useAtom(currentLangAtom)
  const pathname = usePathname()

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
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        {/* Admin Header */}
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            {currentLang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
          </h2>
          <p className="text-sm text-neutral-600">
            {currentLang === 'ar' ? 'مجوهرات أورنا' : 'Orna Jewelry'}
          </p>
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
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active 
                    ? 'bg-amber-100 text-amber-900' 
                    : 'text-neutral-700 hover:bg-neutral-100'
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
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {pathname === '/admin' && (currentLang === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
                {pathname === '/admin/products' && (currentLang === 'ar' ? 'إدارة المنتجات' : 'Product Management')}
                {pathname === '/admin/orders' && (currentLang === 'ar' ? 'إدارة الطلبات' : 'Order Management')}
                {pathname === '/admin/contacts' && (currentLang === 'ar' ? 'إدارة الرسائل' : 'Message Management')}
                {pathname === '/admin/customers' && (currentLang === 'ar' ? 'إدارة العملاء' : 'Customer Management')}
                {pathname === '/admin/settings' && (currentLang === 'ar' ? 'الإعدادات' : 'Settings')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {currentLang === 'ar' ? 'مدير' : 'Admin'}
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
