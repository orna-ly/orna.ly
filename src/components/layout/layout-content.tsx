'use client';

import { useAtom } from 'jotai';
import { currentLangAtom } from '@/lib/atoms';
import { Header } from '@/components/layout/header';
import { useEffect, useState } from 'react';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const [currentLang] = useAtom(currentLangAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      // Update body classes for better RTL/LTR styling
      document.body.className = document.body.className.replace(
        /\b(rtl|ltr)\b/g,
        ''
      );
      document.body.classList.add(currentLang === 'ar' ? 'rtl' : 'ltr');
    }
  }, [currentLang, mounted]);

  return (
    <>
      <Header />
      <main
        className={`transition-all duration-300 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}
      >
        {children}
      </main>
    </>
  );
}
