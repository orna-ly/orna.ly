'use client';

import { useAtom } from 'jotai';
import { currentLangAtom } from '@/lib/atoms';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

interface NavigationItem {
  name: { ar: string; en: string };
  href: string;
  children?: Array<{
    name: { ar: string; en: string };
    href: string;
  }>;
}

const navigationItems: NavigationItem[] = [
  {
    name: { ar: 'الرئيسية', en: 'Home' },
    href: '/',
  },
  {
    name: { ar: 'المنتجات', en: 'Products' },
    href: '/products',
  },
  {
    name: { ar: 'من نحن', en: 'About' },
    href: '/about',
    children: [
      {
        name: { ar: 'حول مجوهرات أورنا', en: 'About Orna Jewelry' },
        href: '/about',
      },
      {
        name: { ar: 'سياسة الإرجاع', en: 'Return Policy' },
        href: '/return-policy',
      },
      {
        name: { ar: 'بوابات الدفع', en: 'Payment Gateways' },
        href: '/payment-gateways',
      },
    ],
  },
  {
    name: { ar: 'الدعم', en: 'Support' },
    href: '/contact',
  },
];

export function DesktopNavigation() {
  const [currentLang] = useAtom(currentLangAtom);

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-6">
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.children ? (
              <>
                <NavigationMenuTrigger className="bg-transparent px-3 py-2 h-auto text-base font-normal text-neutral-700 hover:text-amber-600 focus:text-amber-600 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-amber-600">
                  {item.name[currentLang as keyof typeof item.name]}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 space-y-2 min-w-[240px] bg-white border border-neutral-200 rounded-lg shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-3 text-sm text-neutral-700 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors font-medium"
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
  );
}

interface MobileNavigationProps {
  onLinkClick: () => void;
}

export function MobileNavigation({ onLinkClick }: MobileNavigationProps) {
  const [currentLang] = useAtom(currentLangAtom);

  return (
    <div className="space-y-4">
      {navigationItems.map((item) => (
        <div key={item.href}>
          <Link
            href={item.href}
            className="block text-lg font-medium text-neutral-900 hover:text-amber-600 transition-colors"
            onClick={onLinkClick}
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
                  onClick={onLinkClick}
                >
                  {child.name[currentLang as keyof typeof child.name]}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
