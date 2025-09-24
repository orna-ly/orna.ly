'use client';

import { useAtom } from 'jotai';
import {
  currentLangAtom,
  cartItemsAtom,
  currentUserAtom,
  isLoggedInAtom,
  isAdminAtom,
  logoutAtom,
} from '@/lib/atoms';
import { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, Globe, User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

export function HeaderActions() {
  const [currentLang, setCurrentLang] = useAtom(currentLangAtom);
  const [cartItems] = useAtom(cartItemsAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [, logout] = useAtom(logoutAtom);

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const toggleLang = () => {
    setCurrentLang(currentLang === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Language Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLang}
        className="focus-ring hover:bg-amber-50"
        aria-label={
          currentLang === 'ar' ? 'Switch to English' : 'Switch to Arabic'
        }
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
        <Link
          href="/cart"
          aria-label={`Shopping cart with ${cartItemsCount} items`}
        >
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
        <UserDropdown
          user={currentUser}
          isAdmin={isAdmin}
          currentLang={currentLang}
          onLogout={handleLogout}
        />
      ) : (
        <AuthButtons currentLang={currentLang} />
      )}
    </div>
  );
}

interface UserDropdownProps {
  user: UserType | null;
  isAdmin: boolean;
  currentLang: string;
  onLogout: () => void;
}

function UserDropdown({
  user,
  isAdmin,
  currentLang,
  onLogout,
}: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="focus-ring hover:bg-amber-50"
          aria-label="User menu"
        >
          <User className="h-5 w-5 text-neutral-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-sm">
          <p className="font-medium">{user?.name || user?.email}</p>
          <p className="text-xs text-neutral-500">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              {currentLang === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          {currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AuthButtonsProps {
  currentLang: string;
}

function AuthButtons({ currentLang }: AuthButtonsProps) {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant="ghost"
        asChild
        className="text-neutral-700 hover:text-amber-600"
      >
        <Link href="/login">
          {currentLang === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </Link>
      </Button>
      <Button asChild className="btn-primary">
        <Link href="/register">
          {currentLang === 'ar' ? 'إنشاء حساب' : 'Register'}
        </Link>
      </Button>
    </div>
  );
}
