'use client';

import { Logo } from './header/logo';
import { DesktopNavigation } from './header/navigation-menu';
import { HeaderActions } from './header/header-actions';
import { MobileMenu } from './header/mobile-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <HeaderActions />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
