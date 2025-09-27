import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@orna.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  // Store hash in image field temporarily? Schema has no password; add Setting token.
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
      image: undefined,
    },
  });
  await prisma.setting.upsert({
    where: { key: `cred:${user.id}` },
    update: { value: { passwordHash } },
    create: { key: `cred:${user.id}`, value: { passwordHash } },
  });
  return user;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.product.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // Ensure admin
  const admin = await ensureAdmin();
  console.log(`✅ Seeded admin: ${admin.email}`);

  // Seed baseline store settings used across the storefront
  await Promise.all([
    prisma.setting.upsert({
      where: { key: 'store:name' },
      update: { value: 'Orna Fine Jewelry' },
      create: { key: 'store:name', value: 'Orna Fine Jewelry' },
    }),
    prisma.setting.upsert({
      where: { key: 'store:currency' },
      update: { value: 'LYD' },
      create: { key: 'store:currency', value: 'LYD' },
    }),
    prisma.setting.upsert({
      where: { key: 'store:deliveryRegion' },
      update: { value: 'Tripoli & Surrounding Cities' },
      create: {
        key: 'store:deliveryRegion',
        value: 'Tripoli & Surrounding Cities',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'store:contactPhone' },
      update: { value: '+218 91 123 4567' },
      create: { key: 'store:contactPhone', value: '+218 91 123 4567' },
    }),
    prisma.setting.upsert({
      where: { key: 'store:contactEmail' },
      update: { value: 'care@orna.ly' },
      create: { key: 'store:contactEmail', value: 'care@orna.ly' },
    }),
    prisma.setting.upsert({
      where: { key: 'store:social' },
      update: {
        value: {
          instagram: 'https://instagram.com/orna.jewelry',
          facebook: 'https://facebook.com/orna.jewelry',
          whatsapp: 'https://wa.me/218911234567',
        },
      },
      create: {
        key: 'store:social',
        value: {
          instagram: 'https://instagram.com/orna.jewelry',
          facebook: 'https://facebook.com/orna.jewelry',
          whatsapp: 'https://wa.me/218911234567',
        },
      },
    }),
  ]);

  console.log('✅ Seeded core store settings');

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: {
          ar: 'خاتم الأمل الذهبي',
          en: 'Golden Hope Ring',
        },
        slug: 'golden-hope-ring',
        description: {
          ar: 'خاتم ذهبي عيار 18 قيراط مطعم بالألماس الطبيعي، يرمز للأمل والنور في حياتك',
          en: '18k gold ring adorned with natural diamonds, symbolizing hope and light in your life',
        },
        subtitle: {
          ar: 'تصميم أنيق ومميز',
          en: 'Elegant and distinctive design',
        },
        price: 1850,
        priceBeforeDiscount: 2100,
        discountPercentage: 12,
        wrappingPrice: 100,
        images: ['/orna/خاتم الآمل(1).JPG', '/orna/1.jpeg'],
        featured: true,
        stockQuantity: 8,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['مجوهرات راقية', 'لؤلؤ صناعي'],
          en: ['Fine Jewelry', 'Artificial Pearl'],
        },
        highlights: {
          ar: ['مصنوع يدويًا', 'طلاء ذهبي مقاوم للخدوش'],
          en: ['Hand-crafted detail', 'Scratch resistant gold plating'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'عقد لؤلؤ التاهيتي',
          en: 'Tahitian Pearl Necklace',
        },
        slug: 'tahitian-pearl-necklace',
        description: {
          ar: 'عقد من لؤلؤ التاهيتي الطبيعي الفاخر مع إغلاق من الذهب الأبيض',
          en: 'Luxurious natural Tahitian pearl necklace with white gold clasp',
        },
        price: 3200,
        wrappingPrice: 150,
        images: ['/orna/سلسال اللؤلؤ التاهيتي مع الباروك.JPG', '/orna/2.jpeg'],
        featured: true,
        stockQuantity: 5,
        status: 'ACTIVE',
        category: 'NATURAL_PEARLS',
        tags: {
          ar: ['لؤلؤ طبيعي', 'عقد فاخر'],
          en: ['Natural Pearl', 'Luxury Necklace'],
        },
        highlights: {
          ar: ['إغلاق من الذهب الأبيض', 'لآلئ تاهيتي أصلية'],
          en: ['White gold clasp', 'Genuine Tahitian pearls'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'طقم الطاووس الأبيض',
          en: 'White Peacock Set',
        },
        slug: 'white-peacock-set',
        description: {
          ar: 'طقم كامل من الذهب الأبيض والماس يشمل عقد وأقراط وخاتم',
          en: 'Complete set of white gold and diamonds including necklace, earrings, and ring',
        },
        subtitle: {
          ar: 'رمز النقاء والخلود',
          en: 'Symbol of purity and eternity',
        },
        price: 4500,
        priceBeforeDiscount: 5000,
        discountPercentage: 10,
        wrappingPrice: 200,
        images: [
          '/orna/طقم الطاووس الآبيض.JPG',
          '/orna/3.jpeg',
          '/orna/4.jpeg',
        ],
        featured: true,
        stockQuantity: 3,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['طقم متكامل', 'لؤلؤ صناعي'],
          en: ['Complete Set', 'Artificial Pearl'],
        },
        highlights: {
          ar: ['يشمل عقد وأقراط وخاتم', 'تصميم مرصع بالألماس'],
          en: ['Includes necklace, earrings & ring', 'Diamond-accented design'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'أقراط الماس الكلاسيكية',
          en: 'Classic Diamond Earrings',
        },
        slug: 'classic-diamond-earrings',
        description: {
          ar: 'أقراط كلاسيكية من الذهب الأبيض مطعمة بالألماس الطبيعي',
          en: 'Classic white gold earrings studded with natural diamonds',
        },
        price: 2800,
        wrappingPrice: 120,
        images: ['/orna/5.jpeg', '/orna/6.jpeg'],
        featured: false,
        stockQuantity: 10,
        status: 'ACTIVE',
        category: 'NATURAL_PEARLS',
        tags: {
          ar: ['ألماس طبيعي', 'تصميم كلاسيكي'],
          en: ['Natural Diamond', 'Classic Style'],
        },
        highlights: {
          ar: ['تصميم مريح للأذن', 'ثبات آمن للأقراط'],
          en: ['Comfort-fit backings', 'Secure clasp'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'سوار الوردة الذهبية',
          en: 'Golden Rose Bracelet',
        },
        slug: 'golden-rose-bracelet',
        description: {
          ar: 'سوار ذهبي على شكل وردة بتصميم أنثوي راقي',
          en: 'Golden rose-shaped bracelet with elegant feminine design',
        },
        price: 1650,
        wrappingPrice: 80,
        images: ['/orna/7.jpeg', '/orna/8.jpeg'],
        featured: false,
        stockQuantity: 12,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['إطلالة يومية', 'لؤلؤ صناعي'],
          en: ['Everyday Elegance', 'Artificial Pearl'],
        },
        highlights: {
          ar: ['سوار قابل للتعديل', 'لمسة نهائية لامعة'],
          en: ['Adjustable bracelet', 'High-gloss finish'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال آفردويت المتدلي',
          en: 'Aphrodite Cascade Necklace',
        },
        slug: 'aphrodite-cascade-necklace',
        description: {
          ar: 'سلسال فاخر مرصع بالكريستال اللامع يعكس بريقاً أنثوياً ساحراً',
          en: 'A luxurious necklace adorned with shimmering crystals that radiate feminine allure.',
        },
        subtitle: {
          ar: 'بريق لا ينسى',
          en: 'Unforgettable brilliance',
        },
        price: 2350,
        priceBeforeDiscount: 2590,
        discountPercentage: 9,
        wrappingPrice: 120,
        images: ['/orna/سلسال آفروديت.JPG', '/orna/333.jpg'],
        featured: true,
        stockQuantity: 6,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['تصميم معاصر', 'لؤلؤ صناعي'],
          en: ['Contemporary Design', 'Artificial Pearl'],
        },
        highlights: {
          ar: ['طلاء مقاوم للتشقق', 'كريستالات لامعة'],
          en: ['Crack-resistant plating', 'Shimmering crystals'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'قلادة المفتاح الملكي',
          en: 'Heritage Key Pendant',
        },
        slug: 'heritage-key-pendant',
        description: {
          ar: 'قلادة ذهبية تعكس إرثاً عريقاً بتفاصيل محفورة يدوياً',
          en: 'A gold pendant celebrating timeless heritage with meticulously hand-engraved details.',
        },
        price: 980,
        wrappingPrice: 65,
        images: ['/orna/سلسال المفتاح.JPG', '/orna/444.jpg'],
        featured: false,
        stockQuantity: 15,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['هدية مثالية', 'لمسة تراثية'],
          en: ['Gift Ready', 'Heritage Inspired'],
        },
        highlights: {
          ar: ['تفاصيل محفورة يدويًا', 'سلسلة قابلة للتعديل'],
          en: ['Hand-engraved details', 'Adjustable chain'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'طقم الحديقة الليلية',
          en: 'Midnight Garden Set',
        },
        slug: 'midnight-garden-set',
        description: {
          ar: 'طقم متكامل من الذهب الوردي والأحجار الداكنة مستوحى من جمال الحدائق الليلية',
          en: 'A complete rose-gold set with deep gemstones inspired by the mystery of midnight gardens.',
        },
        subtitle: {
          ar: 'سحر الألوان الدافئة',
          en: 'Warm, enchanting hues',
        },
        price: 3820,
        priceBeforeDiscount: 4200,
        discountPercentage: 9,
        wrappingPrice: 180,
        images: ['/orna/طقم الحديقة السرية.jpg', '/orna/66.jpg'],
        featured: false,
        stockQuantity: 4,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['طقم فاخر', 'ألوان داكنة'],
          en: ['Luxury Set', 'Deep Gemstones'],
        },
        highlights: {
          ar: ['مستوحى من الحدائق الليلية', 'تشكيلة متعددة القطع'],
          en: ['Midnight garden inspiration', 'Multi-piece ensemble'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'طقم بلوسوم الفاخر',
          en: 'Blossom Ribbon Set',
        },
        slug: 'blossom-ribbon-set',
        description: {
          ar: 'طقم أنيق يجمع بين الأقراط والقلادة بتصميم مستوحى من شرائط الزهور',
          en: 'An elegant set pairing earrings and necklace with ribbon-inspired floral motifs.',
        },
        price: 2950,
        wrappingPrice: 140,
        images: ['/orna/طقم بلوسوم.JPG', '/orna/طقم الفيونكة.jpg'],
        featured: true,
        stockQuantity: 7,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['تصميم زهري', 'لؤلؤ صناعي'],
          en: ['Floral Design', 'Artificial Pearl'],
        },
        highlights: {
          ar: ['توازن مثالي بين القلادة والأقراط', 'تشطيب لامع طويل الأمد'],
          en: ['Balanced necklace & earrings', 'Long-lasting shine'],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'طقم اللؤلؤ الباروك',
          en: 'Baroque Pearl Suite',
        },
        slug: 'baroque-pearl-suite',
        description: {
          ar: 'مجموعة فاخرة من اللآلئ الطبيعية بتصميم كلاسيكي يعكس الفخامة العصرية',
          en: 'A lavish ensemble of natural baroque pearls crafted for modern sophistication.',
        },
        price: 4100,
        wrappingPrice: 160,
        images: [
          '/orna/طقم لؤلؤ الباروك.JPG',
          '/orna/طقم لؤلؤ الباروك التاهيتي.jpg',
        ],
        featured: true,
        stockQuantity: 5,
        status: 'ACTIVE',
        category: 'NATURAL_PEARLS',
        tags: {
          ar: ['لؤلؤ طبيعي', 'طقم فاخر'],
          en: ['Natural Pearl', 'Luxury Suite'],
        },
        highlights: {
          ar: ['لآلئ باروك أصلية', 'إغلاق آمن'],
          en: ['Authentic baroque pearls', 'Secure clasp system'],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'فاطمة خالد',
        email: 'fatima@example.com',
        phone: '+21891112233',
        subject: 'استفسار عن المنتجات',
        message: 'أريد معرفة المزيد عن مجموعة الخواتم الذهبية وأسعارها',
        status: 'NEW',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'محمد عبدالله',
        email: 'mohammed@example.com',
        phone: '+21894433221',
        subject: 'طلب عرض سعر خاص',
        message: 'أرغب في الحصول على عرض سعر خاص لطقم كامل من المجوهرات',
        status: 'REPLIED',
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Aisha Al-Mansouri',
        email: 'aisha@example.com',
        phone: '+218923334455',
        subject: 'متابعة حالة الطلب',
        message:
          'أود التأكد من موعد تسليم طلبي الأخير وشكر الفريق على الخدمة الممتازة',
        status: 'RESOLVED',
      },
    }),
  ]);

  console.log(`✅ Created ${contacts.length} contacts`);

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-1001',
        customerName: 'سارة أحمد محمد',
        customerPhone: '+218911234567',
        customerEmail: 'sara@example.com',
        shippingAddress: {
          address: 'حي النرجس، شارع الملك فهد، الرياض',
          city: 'الرياض',
          state: 'الرياض',
        },
        totalAmount: 1950,
        wrappingCost: 100,
        needsWrapping: true,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        notes: 'يرجى التغليف بعناية خاصة',
        items: {
          create: {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 1850,
            totalPrice: 1850,
          },
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-1002',
        customerName: 'أحمد محمد علي',
        customerPhone: '+218947654321',
        customerEmail: 'ahmed@example.com',
        shippingAddress: {
          address: 'حي الملقا، طريق الملك عبدالعزيز، الرياض',
          city: 'الرياض',
        },
        totalAmount: 3200,
        needsWrapping: false,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: {
            productId: products[1].id,
            quantity: 1,
            unitPrice: 3200,
            totalPrice: 3200,
          },
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-1003',
        customerName: 'ليلى عبدالسلام',
        customerPhone: '+218912223344',
        customerEmail: 'leila@example.com',
        shippingAddress: {
          address: 'طريق الشط، برج الهناء، طرابلس',
          city: 'طرابلس',
          state: 'طرابلس',
        },
        totalAmount: 4530,
        wrappingCost: 220,
        needsWrapping: true,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'card',
        notes: 'الرجاء تضمين بطاقة تهنئة باللغة العربية',
        items: {
          create: [
            {
              productId: products[5].id,
              quantity: 1,
              unitPrice: 2350,
              totalPrice: 2350,
            },
            {
              productId: products[6].id,
              quantity: 2,
              unitPrice: 980,
              totalPrice: 1960,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
