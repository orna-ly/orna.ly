'use client'

import { useAtom } from 'jotai'
import { 
  currentLangAtom, 
  cartItemsAtom, 
  mobileMenuOpenAtom 
} from '@/lib/atoms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { ShoppingCart, Menu, Globe } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const [currentLang, setCurrentLang] = useAtom(currentLangAtom)
  const [cartItems] = useAtom(cartItemsAtom)
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom)

  const toggleLang = () => {
    setCurrentLang(currentLang === 'ar' ? 'en' : 'ar')
  }

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const navigation = [
    {
      name: { ar: 'الرئيسية', en: 'Home' },
      href: '/'
    },
    {
      name: { ar: 'المنتجات', en: 'Products' },
      href: '/products'
    },
    {
      name: { ar: 'من نحن', en: 'About' },
      href: '/about',
      children: [
        { name: { ar: 'حول مجوهرات أورنا', en: 'About Orna Jewelry' }, href: '/about' },
        { name: { ar: 'سياسة الإرجاع', en: 'Refund Policy' }, href: '/refund-policy' },
        { name: { ar: 'بوابات الدفع', en: 'Payment Gateways' }, href: '/payment-gateways' }
      ]
    },
    {
      name: { ar: 'الدعم', en: 'Support' },
      href: '/contact'
    }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-xl text-neutral-900">
              {currentLang === 'ar' ? 'مجوهرات أورنا' : 'Orna Jewelry'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.href}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger>
                        {item.name[currentLang as keyof typeof item.name]}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="p-4 space-y-2 min-w-[200px]">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                            >
                              {child.name[currentLang as keyof typeof child.name]}
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-neutral-700 hover:text-amber-600 transition-colors px-3 py-2"
                    >
                      {item.name[currentLang as keyof typeof item.name]}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleLang}>
              <Globe className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="py-6 space-y-4">
                  {navigation.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-lg font-medium text-neutral-900 hover:text-amber-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name[currentLang as keyof typeof item.name]}
                      </Link>
                      {item.children && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block text-neutral-600 hover:text-amber-600 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.name[currentLang as keyof typeof child.name]}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
