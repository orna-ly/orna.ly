// Image optimization utilities
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export function getOptimizedImageUrl(
  src: string, 
  options: ImageOptimizationOptions = {}
): string {
  const { width = 800, height = 600, quality = 75, format = 'jpeg' } = options;
  
  // For now, return the original src since we're not using Next.js Image optimization
  // In production, you could integrate with a CDN or image optimization service
  return src;
}

export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<boolean[]> {
  return Promise.all(srcs.map(preloadImage));
}

// Generate responsive image sizes
export function getResponsiveImageSizes(breakpoints: number[] = [640, 768, 1024, 1280, 1920]): string {
  return breakpoints.map(width => `${width}w`).join(', ');
}

// Create a placeholder image data URL
export function createPlaceholderImage(width: number = 400, height: number = 400, text: string = 'Image'): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
