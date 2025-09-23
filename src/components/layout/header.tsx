"use client";

import { useAtom } from "jotai";
import {
  currentLangAtom,
  cartItemsAtom,
  mobileMenuOpenAtom,
  settingsAtom,
  currentUserAtom,
  isLoggedInAtom,
  isAdminAtom,
  loadCurrentUserAtom,
  logoutAtom,
} from "@/lib/atoms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  ShoppingCart,
  Menu,
  Globe,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [currentLang, setCurrentLang] = useAtom(currentLangAtom);
  const [cartItems] = useAtom(cartItemsAtom);
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom);
  const [settings] = useAtom(settingsAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [, loadCurrentUser] = useAtom(loadCurrentUserAtom);
  const [, logout] = useAtom(logoutAtom);

  const toggleLang = () => {
    setCurrentLang(currentLang === "ar" ? "en" : "ar");
  };

  const handleLogout = async () => {
    await logout();
  };

  // Load current user on component mount
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const navigation = [
    {
      name: { ar: "الرئيسية", en: "Home" },
      href: "/",
    },
    {
      name: { ar: "المنتجات", en: "Products" },
      href: "/products",
    },
    {
      name: { ar: "من نحن", en: "About" },
      href: "/about",
      children: [
        {
          name: { ar: "حول مجوهرات أورنا", en: "About Orna Jewelry" },
          href: "/about",
        },
        {
          name: { ar: "سياسة الإرجاع", en: "Refund Policy" },
          href: "/refund-policy",
        },
        {
          name: { ar: "بوابات الدفع", en: "Payment Gateways" },
          href: "/payment-gateways",
        },
      ],
    },
    {
      name: { ar: "الدعم", en: "Support" },
      href: "/contact",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 focus-ring rounded-lg"
          >
            <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-2xl gradient-text-gold">
              {(typeof settings["store:name"] === "string" &&
                settings["store:name"]) ||
                (currentLang === "ar" ? "مجوهرات أورنا" : "Orna Jewelry")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
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
                              {
                                child.name[
                                  currentLang as keyof typeof child.name
                                ]
                              }
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
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLang}
              className="focus-ring hover:bg-amber-50"
            >
              <Globe className="h-5 w-5 text-neutral-600" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative focus-ring hover:bg-amber-50"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 text-neutral-600" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-amber-600 hover:bg-amber-700 animate-pulse">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Authentication */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="focus-ring hover:bg-amber-50"
                  >
                    <User className="h-5 w-5 text-neutral-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-medium">
                      {currentUser?.name || currentUser?.email}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {currentUser?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        {currentLang === "ar"
                          ? "لوحة الإدارة"
                          : "Admin Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {currentLang === "ar" ? "تسجيل الخروج" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  asChild
                  className="text-neutral-700 hover:text-amber-600"
                >
                  <Link href="/login">
                    {currentLang === "ar" ? "تسجيل الدخول" : "Login"}
                  </Link>
                </Button>
                <Button asChild className="btn-primary">
                  <Link href="/register">
                    {currentLang === "ar" ? "إنشاء حساب" : "Register"}
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="py-6 space-y-4">
                  {/* User info for mobile */}
                  {isLoggedIn && (
                    <div className="pb-4 border-b border-neutral-200">
                      <p className="font-medium text-neutral-900">
                        {currentUser?.name || currentUser?.email}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {currentUser?.email}
                      </p>
                    </div>
                  )}

                  {/* Navigation items */}
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
                              {
                                child.name[
                                  currentLang as keyof typeof child.name
                                ]
                              }
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Auth actions for mobile */}
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    {isLoggedIn ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center text-lg font-medium text-neutral-900 hover:text-amber-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Settings className="mr-2 h-5 w-5" />
                            {currentLang === "ar"
                              ? "لوحة الإدارة"
                              : "Admin Dashboard"}
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center text-lg font-medium text-red-600 hover:text-red-700 transition-colors w-full text-left"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          {currentLang === "ar" ? "تسجيل الخروج" : "Logout"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block text-lg font-medium text-neutral-900 hover:text-amber-600 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {currentLang === "ar" ? "تسجيل الدخول" : "Login"}
                        </Link>
                        <Link
                          href="/register"
                          className="block text-lg font-medium text-amber-600 hover:text-amber-700 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {currentLang === "ar" ? "إنشاء حساب" : "Register"}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
