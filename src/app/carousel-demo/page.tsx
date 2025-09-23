"use client";

import EmblaCarousel from "@/components/ui/embla-carousel";
import "@/components/ui/embla-carousel.css";

export default function CarouselDemo() {
  // Create an array of slide indices
  const slides = Array.from({ length: 8 }, (_, index) => index);

  const carouselOptions = {
    align: "start" as const,
    loop: true,
    skipSnaps: false,
    dragFree: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white py-16">
      <div className="container-width">
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4 gradient-text-gold">
            Embla Carousel Demo
          </h1>
          <p className="body-text text-lg max-w-2xl mx-auto">
            A beautiful carousel with navigation arrows and dot indicators,
            styled with our jewelry theme colors.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <EmblaCarousel slides={slides} options={carouselOptions} />
        </div>

        <div className="mt-16 text-center">
          <h2 className="heading-2 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="jewelry-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Navigation Arrows</h3>
              <p className="body-text">
                Smooth navigation with custom styled arrow buttons
              </p>
            </div>

            <div className="jewelry-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                  <circle cx="5" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Dot Indicators</h3>
              <p className="body-text">
                Interactive dot navigation showing current slide position
              </p>
            </div>

            <div className="jewelry-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
              <p className="body-text">
                Fully responsive and optimized for all device sizes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
