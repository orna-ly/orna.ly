"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  featuredProductsAtom,
  currentLangAtom,
  productsAtom,
} from "@/lib/atoms";
import { mockProducts } from "@/lib/mock-data";
import { HeroCarousel } from "@/components/layout/hero-carousel";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [featuredProducts] = useAtom(featuredProductsAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [, setProducts] = useAtom(productsAtom);

  // Initialize products from mock data
  useEffect(() => {
    setProducts(mockProducts);
  }, [setProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section with Carousel */}
      <HeroCarousel />

      {/* Featured Products Section */}
      <section className="section-padding bg-gradient-to-b from-amber-50/30 via-white to-rose-50/30">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4 gradient-text-gold">
              {currentLang === "ar" ? "المنتجات المميزة" : "Featured Products"}
            </h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              {currentLang === "ar"
                ? "اكتشف مجموعتنا الحصرية من المجوهرات الفاخرة المصممة بعناية فائقة"
                : "Discover our exclusive collection of luxury jewelry crafted with exceptional care"}
            </p>
          </div>
 
          <ProductGrid products={featuredProducts.slice(0, 8)} />
 
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/products">
                {currentLang === "ar"
                  ? "عرض جميع المنتجات"
                  : "View All Products"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
