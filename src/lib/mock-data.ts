// Mock data for development
export const mockProducts = [
  {
    id: "1",
    name: {
      ar: "خاتم ذهبي فاخر",
      en: "Luxury Gold Ring",
    },
    slug: "luxury-gold-ring",
    price: 1200,
    priceBeforeDiscount: 1500,
    images: ["/images/ring1.jpg", "/images/ring1-2.jpg"],
    description: {
      ar: "خاتم ذهبي عيار 18 قيراط مع أحجار كريمة",
      en: "18k gold ring with precious stones",
    },
    featured: true,
  },
  {
    id: "2",
    name: {
      ar: "عقد لؤلؤ طبيعي",
      en: "Natural Pearl Necklace",
    },
    slug: "pearl-necklace",
    price: 2500,
    images: ["/images/necklace1.jpg"],
    description: {
      ar: "عقد لؤلؤ طبيعي بتصميم عصري",
      en: "Natural pearl necklace with modern design",
    },
    featured: true,
  },
  {
    id: "3",
    name: {
      ar: "أساور ذهب مُرصعة",
      en: "Diamond Gold Bracelet",
    },
    slug: "diamond-bracelet",
    price: 3200,
    images: ["/images/bracelet1.jpg"],
    description: {
      ar: "إسورة ذهب مرصعة بالألماس الطبيعي",
      en: "Gold bracelet studded with natural diamonds",
    },
    featured: false,
  },
  {
    id: "4",
    name: {
      ar: "أقراط لؤلؤ كلاسيكية",
      en: "Classic Pearl Earrings",
    },
    slug: "pearl-earrings",
    price: 850,
    images: ["/images/earrings1.jpg"],
    description: {
      ar: "أقراط لؤلؤ بتصميم كلاسيكي أنيق",
      en: "Classic pearl earrings with elegant design",
    },
    featured: true,
  },
];

export const mockOrders = [
  {
    id: "1",
    orderNumber: "ORN-001",
    customerName: "سارة أحمد",
    items: [{ productId: "1", quantity: 1, unitPrice: 1200 }],
    totalAmount: 1200,
    status: "PENDING",
  },
];

export const mockContacts = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    subject: "استفسار عن المنتجات",
    message: "أريد معرفة المزيد عن مجموعة الخواتم الذهبية",
    status: "NEW",
  },
];

// Helper function to get current language
export const getCurrentLang = () => "ar"; // For now, default to Arabic
