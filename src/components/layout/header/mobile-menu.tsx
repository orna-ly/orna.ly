'use client';

import { useAtom } from 'jotai';
import {
  mobileMenuOpenAtom,
  currentUserAtom,
  isLoggedInAtom,
  isAdminAtom,
  currentLangAtom,
  logoutAtom,
} from '@/lib/atoms';
import { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { MobileNavigation } from './navigation-menu';

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [, logout] = useAtom(logoutAtom);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <div className="py-6 space-y-6">
          {/* User info for mobile */}
          {isLoggedIn && (
            <UserInfo user={currentUser} currentLang={currentLang} />
          )}

          {/* Navigation items */}
          <MobileNavigation onLinkClick={closeMobileMenu} />

          {/* Auth actions for mobile */}
          <div className="pt-4 border-t border-neutral-200">
            {isLoggedIn ? (
              <LoggedInActions
                isAdmin={isAdmin}
                currentLang={currentLang}
                onLogout={handleLogout}
                onLinkClick={closeMobileMenu}
              />
            ) : (
              <AuthActions
                currentLang={currentLang}
                onLinkClick={closeMobileMenu}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface UserInfoProps {
  user: UserType | null;
  currentLang: string;
}

function UserInfo({ user }: UserInfoProps) {
  if (!user) return null;

  return (
    <div className="pb-4 border-b border-neutral-200">
      <p className="font-medium text-neutral-900">{user.name || user.email}</p>
      <p className="text-sm text-neutral-500">{user.email}</p>
    </div>
  );
}

interface LoggedInActionsProps {
  isAdmin: boolean;
  currentLang: string;
  onLogout: () => void;
  onLinkClick: () => void;
}

function LoggedInActions({
  isAdmin,
  currentLang,
  onLogout,
  onLinkClick,
}: LoggedInActionsProps) {
  return (
    <div className="space-y-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center text-lg font-medium text-neutral-900 hover:text-amber-600 transition-colors"
          onClick={onLinkClick}
        >
          <Settings className="mr-2 h-5 w-5" />
          {currentLang === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
        </Link>
      )}
      <button
        onClick={onLogout}
        className="flex items-center text-lg font-medium text-red-600 hover:text-red-700 transition-colors w-full text-left"
      >
        <LogOut className="mr-2 h-5 w-5" />
        {currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
      </button>
    </div>
  );
}

interface AuthActionsProps {
  currentLang: string;
  onLinkClick: () => void;
}

function AuthActions({ currentLang, onLinkClick }: AuthActionsProps) {
  return (
    <div className="space-y-2">
      <Link
        href="/login"
        className="block text-lg font-medium text-neutral-900 hover:text-amber-600 transition-colors"
        onClick={onLinkClick}
      >
        {currentLang === 'ar' ? 'تسجيل الدخول' : 'Login'}
      </Link>
      <Link
        href="/register"
        className="block text-lg font-medium text-amber-600 hover:text-amber-700 transition-colors"
        onClick={onLinkClick}
      >
        {currentLang === 'ar' ? 'إنشاء حساب' : 'Register'}
      </Link>
    </div>
  );
}
