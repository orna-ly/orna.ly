'use client';

import { useAtom } from 'jotai';
import { currentLangAtom, settingsAtom } from '@/lib/atoms';
import Link from 'next/link';

export function Logo() {
  const [currentLang] = useAtom(currentLangAtom);
  const [settings] = useAtom(settingsAtom);

  const storeName =
    (typeof settings['store:name'] === 'string' && settings['store:name']) ||
    (currentLang === 'ar' ? 'مجوهرات أورنا' : 'Orna Jewelry');

  return (
    <Link
      href="/"
      className="flex items-center space-x-3 focus-ring rounded-lg"
    >
      <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-xl">O</span>
      </div>
      <span className="font-bold text-2xl gradient-text-gold">{storeName}</span>
    </Link>
  );
}
