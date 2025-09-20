import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from 'jotai'
import { LayoutContent } from '@/components/layout/layout-content'
import { DataProvider } from '@/components/providers/data-provider'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orna Jewelry - مجوهرات أورنا",
  description: "Discover our exclusive collection of luxury jewelry - اكتشف مجموعتنا الحصرية من المجوهرات الفاخرة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Provider>
          <DataProvider>
            <LayoutContent>{children}</LayoutContent>
          </DataProvider>
        </Provider>
      </body>
    </html>
  );
}