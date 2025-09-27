'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { createPlaceholderImage } from '@/lib/image-utils';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomScale?: number;
  rounded?: string;
}

export function ProductImageZoom({
  src,
  alt,
  className,
  zoomScale = 2,
  rounded = 'rounded-xl',
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('50% 50%');
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleTouch = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouch, { once: true });
    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  const updatePosition = (event: React.PointerEvent | React.TouchEvent) => {
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden group',
        'bg-neutral-100',
        rounded,
        className
      )}
      onPointerEnter={() => !isTouch && setIsZoomed(true)}
      onPointerLeave={() => setIsZoomed(false)}
      onPointerMove={(event) => {
        if (!isTouch) {
          updatePosition(event);
        }
      }}
      onTouchStart={(event) => {
        setIsZoomed(true);
        updatePosition(event);
      }}
      onTouchMove={(event) => {
        updatePosition(event);
      }}
      onTouchEnd={() => setIsZoomed(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        placeholder="blur"
        blurDataURL={createPlaceholderImage(600, 600, 'Orna')}
        className={cn(
          'object-cover transition-transform duration-700',
          isZoomed ? 'scale-105' : 'scale-100'
        )}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-200',
          isZoomed ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition,
          backgroundSize: `${zoomScale * 100}%`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 border border-white/40 mix-blend-overlay" />
    </div>
  );
}
