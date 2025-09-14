import { type Product, type Order, type Contact } from './atoms'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: {
      ar: 'خاتم الأمل الذهبي',
      en: 'Golden Hope Ring'
    },
    slug: 'golden-hope-ring',
    price: 1850,
    priceBeforeDiscount: 2100,
    images: [
      '/images/products/golden-hope-ring-1.jpg',
      '/images/products/golden-hope-ring-2.jpg'
    ],
    description: {
      ar: 'خاتم ذهبي عيار 18 قيراط مطعم بالألماس الطبيعي، يرمز للأمل والنور في حياتك',
      en: '18k gold ring adorned with natural diamonds, symbolizing hope and light in your life'
    },
    subtitle: {
      ar: 'تصميم أنيق ومميز',
      en: 'Elegant and distinctive design'
    },
    subdescription: {
      ar: 'يتميز هذا الخاتم بتصميمه الفريد الذي يجمع بين الأناقة الكلاسيكية والطابع العصري',
      en: 'This ring features a unique design that combines classic elegance with a modern touch'
    },
    featured: true,
    wrappingPrice: 100,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: {
      ar: 'عقد لؤلؤ التاهيتي',
      en: 'Tahitian Pearl Necklace'
    },
    slug: 'tahitian-pearl-necklace',
    price: 3200,
    images: [
      '/images/products/tahitian-pearl-necklace-1.jpg'
    ],
    description: {
      ar: 'عقد من لؤلؤ التاهيتي الطبيعي الفاخر مع إغلاق من الذهب الأبيض',
      en: 'Luxurious natural Tahitian pearl necklace with white gold clasp'
    },
    featured: true,
    wrappingPrice: 150,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: {
      ar: 'طقم الطاووس الأبيض',
      en: 'White Peacock Set'
    },
    slug: 'white-peacock-set',
    price: 4500,
    priceBeforeDiscount: 5000,
    images: [
      '/images/products/white-peacock-set-1.jpg',
      '/images/products/white-peacock-set-2.jpg',
      '/images/products/white-peacock-set-3.jpg'
    ],
    description: {
      ar: 'طقم كامل من الذهب الأبيض والماس يشمل عقد وأقراط وخاتم',
      en: 'Complete set of white gold and diamonds including necklace, earrings, and ring'
    },
    subtitle: {
      ar: 'رمز النقاء والخلود',
      en: 'Symbol of purity and eternity'
    },
    subdescription: {
      ar: 'مثالي لمناسبات الزفاف والاحتفالات الخاصة',
      en: 'Perfect for weddings and special celebrations'
    },
    featured: true,
    wrappingPrice: 200,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '4',
    name: {
      ar: 'أقراط الماس الكلاسيكية',
      en: 'Classic Diamond Earrings'
    },
    slug: 'classic-diamond-earrings',
    price: 2800,
    images: [
      '/images/products/diamond-earrings-1.jpg'
    ],
    description: {
      ar: 'أقراط كلاسيكية من الذهب الأبيض مطعمة بالألماس الطبيعي',
      en: 'Classic white gold earrings studded with natural diamonds'
    },
    featured: false,
    wrappingPrice: 120,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    name: {
      ar: 'سوار الوردة الذهبية',
      en: 'Golden Rose Bracelet'
    },
    slug: 'golden-rose-bracelet',
    price: 1650,
    images: [
      '/images/products/rose-bracelet-1.jpg'
    ],
    description: {
      ar: 'سوار ذهبي على شكل وردة بتصميم أنثوي راقي',
      en: 'Golden rose-shaped bracelet with elegant feminine design'
    },
    featured: false,
    wrappingPrice: 80,
    createdAt: new Date('2024-01-08')
  }
]

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORN-2024-001',
    customerName: 'سارة أحمد محمد',
    customerPhone: '+966501234567',
    customerEmail: 'sara@example.com',
    address: 'حي النرجس، شارع الملك فهد، الرياض',
    city: 'الرياض',
    state: 'الرياض',
    product: mockProducts[0],
    quantity: 1,
    totalAmount: 1950, // product price + shipping + wrapping
    wrapping: true,
    wrappingPrice: 100,
    paymentStatus: 'PAID',
    status: 'PROCESSING',
    notes: 'يرجى التغليف بعناية خاصة',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    orderNumber: 'ORN-2024-002',
    customerName: 'أحمد محمد علي',
    customerPhone: '+966557654321',
    customerEmail: 'ahmed@example.com',
    address: 'حي الملقا، طريق الملك عبدالعزيز، الرياض',
    city: 'الرياض',
    product: mockProducts[1],
    quantity: 1,
    totalAmount: 3200,
    wrapping: false,
    paymentStatus: 'PENDING',
    status: 'NEW',
    createdAt: new Date('2024-01-18')
  }
]

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'فاطمة خالد',
    email: 'fatima@example.com',
    phone: '+966501112233',
    subject: 'استفسار عن المنتجات',
    message: 'أريد معرفة المزيد عن مجموعة الخواتم الذهبية وأسعارها',
    status: 'NEW',
    createdAt: new Date('2024-01-19')
  },
  {
    id: '2',
    name: 'محمد عبدالله',
    email: 'mohammed@example.com',
    phone: '+966554433221',
    subject: 'طلب عرض سعر خاص',
    message: 'أرغب في الحصول على عرض سعر خاص لطقم كامل من المجوهرات',
    status: 'READ',
    createdAt: new Date('2024-01-17')
  }
]

// Utility functions
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id)
}

export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find(product => product.slug === slug)
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.featured)
}