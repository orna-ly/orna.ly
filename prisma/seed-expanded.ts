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
  console.log('🌱 Starting expanded database seed...');

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

  // Seed baseline store settings
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

  // Create many products for better testing
  const products = await Promise.all([
    // Original products
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

    // New products for expanded catalog
    prisma.product.create({
      data: {
        name: {
          ar: 'طقم التاج الملكي',
          en: 'Royal Crown Set',
        },
        slug: 'royal-crown-set',
        description: {
          ar: 'طقم ملكي فاخر مطعم بالكريستال والذهب الأبيض',
          en: 'Luxurious royal set adorned with crystals and white gold',
        },
        price: 5200,
        priceBeforeDiscount: 5800,
        discountPercentage: 10,
        wrappingPrice: 250,
        images: ['/orna/طقم التاج.jpg', '/orna/f1.jpg'],
        featured: true,
        stockQuantity: 2,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['طقم ملكي', 'كريستال فاخر'],
          en: ['Royal Set', 'Luxury Crystal'],
        },
        highlights: {
          ar: ['تصميم ملكي حصري', 'كريستالات عالية الجودة'],
          en: ['Exclusive royal design', 'High-quality crystals'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'طقم أحلام الكريستال',
          en: 'Crystal Dreams Set',
        },
        slug: 'crystal-dreams-set',
        description: {
          ar: 'طقم ساحر من الكريستال اللامع بتدرجات زرقاء رائعة',
          en: 'Enchanting crystal set with stunning blue gradients',
        },
        price: 3450,
        wrappingPrice: 170,
        images: ['/orna/طقم آحلام كريستال.JPG', '/orna/g1.jpg'],
        featured: false,
        stockQuantity: 8,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['كريستال أزرق', 'تصميم عصري'],
          en: ['Blue Crystal', 'Modern Design'],
        },
        highlights: {
          ar: ['كريستالات زرقاء فريدة', 'تدرجات لونية جميلة'],
          en: ['Unique blue crystals', 'Beautiful color gradients'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'طقم القمر المضيء',
          en: 'Luminous Moon Set',
        },
        slug: 'luminous-moon-set',
        description: {
          ar: 'طقم مستوحى من ضوء القمر بلآلئ بيضاء ناعمة',
          en: 'Moon-inspired set with soft white pearls',
        },
        price: 2890,
        priceBeforeDiscount: 3200,
        discountPercentage: 10,
        wrappingPrice: 140,
        images: ['/orna/طقم القمر المضيء.JPG', '/orna/g2.jpg'],
        featured: true,
        stockQuantity: 6,
        status: 'ACTIVE',
        category: 'NATURAL_PEARLS',
        tags: {
          ar: ['لؤلؤ أبيض', 'تصميم قمري'],
          en: ['White Pearl', 'Lunar Design'],
        },
        highlights: {
          ar: ['لآلئ بيضاء ناعمة', 'بريق قمري ساحر'],
          en: ['Soft white pearls', 'Enchanting lunar glow'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'طقم الشيشخان الأحمر',
          en: 'Red Coral Set',
        },
        slug: 'red-coral-set',
        description: {
          ar: 'طقم جريء بألوان حمراء دافئة مع لمسات ذهبية',
          en: 'Bold set with warm red colors and golden accents',
        },
        price: 3750,
        wrappingPrice: 180,
        images: ['/orna/طقم الشيشخان الآحمر.JPG', '/orna/111.jpg'],
        featured: false,
        stockQuantity: 4,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['أحمر جريء', 'لمسات ذهبية'],
          en: ['Bold Red', 'Golden Accents'],
        },
        highlights: {
          ar: ['ألوان دافئة جذابة', 'تصميم جريء ومميز'],
          en: ['Attractive warm colors', 'Bold distinctive design'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'طقم اللؤلؤ الوردي',
          en: 'Pink Pearl Set',
        },
        slug: 'pink-pearl-set',
        description: {
          ar: 'طقم رومانسي بلآلئ وردية ناعمة للمناسبات الخاصة',
          en: 'Romantic set with soft pink pearls for special occasions',
        },
        price: 3150,
        priceBeforeDiscount: 3500,
        discountPercentage: 10,
        wrappingPrice: 150,
        images: ['/orna/طقم اللؤلؤ الوردي.jpg', '/orna/222.jpg'],
        featured: true,
        stockQuantity: 7,
        status: 'ACTIVE',
        category: 'NATURAL_PEARLS',
        tags: {
          ar: ['لؤلؤ وردي', 'رومانسي'],
          en: ['Pink Pearl', 'Romantic'],
        },
        highlights: {
          ar: ['لآلئ وردية طبيعية', 'مثالي للمناسبات الرومانسية'],
          en: ['Natural pink pearls', 'Perfect for romantic occasions'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'طقم قطرات الندى',
          en: 'Dewdrop Set',
        },
        slug: 'dewdrop-set',
        description: {
          ar: 'طقم مستوحى من قطرات الندى الصباحية بكريستالات شفافة',
          en: 'Set inspired by morning dewdrops with clear crystals',
        },
        price: 2650,
        wrappingPrice: 130,
        images: ['/orna/طقم قطرات الندى.JPG', '/orna/333.jpg'],
        featured: false,
        stockQuantity: 9,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['كريستال شفاف', 'تصميم طبيعي'],
          en: ['Clear Crystal', 'Natural Design'],
        },
        highlights: {
          ar: ['كريستالات شفافة كقطرات الندى', 'تصميم مستوحى من الطبيعة'],
          en: ['Clear crystals like dewdrops', 'Nature-inspired design'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'عقد الفليجري الذهبي',
          en: 'Golden Filigree Necklace',
        },
        slug: 'golden-filigree-necklace',
        description: {
          ar: 'عقد ذهبي بتقنية الفليجري التراثية العريقة',
          en: 'Golden necklace with traditional filigree technique',
        },
        price: 1890,
        priceBeforeDiscount: 2100,
        discountPercentage: 10,
        wrappingPrice: 95,
        images: ['/orna/عقد الفليجري.jpg', '/orna/444.jpg'],
        featured: false,
        stockQuantity: 12,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['فليجري تراثي', 'حرفة يدوية'],
          en: ['Heritage Filigree', 'Handcraft'],
        },
        highlights: {
          ar: ['تقنية فليجري أصيلة', 'صناعة يدوية متقنة'],
          en: ['Authentic filigree technique', 'Exquisite handcraft'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'عقد الملكة إليزابيث',
          en: 'Queen Elizabeth Necklace',
        },
        slug: 'queen-elizabeth-necklace',
        description: {
          ar: 'عقد ملكي فاخر مستوحى من التيجان الأوروبية',
          en: 'Royal luxury necklace inspired by European crowns',
        },
        price: 4200,
        wrappingPrice: 200,
        images: ['/orna/عقد الملكة إليزابيث.JPG', '/orna/pear.jpg'],
        featured: true,
        stockQuantity: 3,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['تصميم ملكي', 'فخامة أوروبية'],
          en: ['Royal Design', 'European Luxury'],
        },
        highlights: {
          ar: ['مستوحى من التيجان الملكية', 'تصميم أوروبي كلاسيكي'],
          en: ['Inspired by royal crowns', 'Classic European design'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'قلادة الفليجري الفضية',
          en: 'Silver Filigree Pendant',
        },
        slug: 'silver-filigree-pendant',
        description: {
          ar: 'قلادة فضية بتقنية الفليجري مع تفاصيل دقيقة',
          en: 'Silver pendant with filigree technique and intricate details',
        },
        price: 1250,
        wrappingPrice: 65,
        images: ['/orna/قلادة الفليجري(3).jpg', '/orna/66.jpg'],
        featured: false,
        stockQuantity: 15,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['فضة خالصة', 'فليجري دقيق'],
          en: ['Pure Silver', 'Delicate Filigree'],
        },
        highlights: {
          ar: ['فضة عيار عالي', 'تفاصيل فليجري معقدة'],
          en: ['High-grade silver', 'Complex filigree details'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'قلادة ورقة القيقب',
          en: 'Maple Leaf Pendant',
        },
        slug: 'maple-leaf-pendant',
        description: {
          ar: 'قلادة مستوحاة من أوراق القيقب الذهبية',
          en: 'Pendant inspired by golden maple leaves',
        },
        price: 890,
        wrappingPrice: 45,
        images: ['/orna/قلادة ورقة القيقب.JPG'],
        featured: false,
        stockQuantity: 20,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['تصميم طبيعي', 'ورقة ذهبية'],
          en: ['Natural Design', 'Golden Leaf'],
        },
        highlights: {
          ar: ['مستوحى من الطبيعة', 'تفاصيل ورقة دقيقة'],
          en: ['Nature-inspired', 'Detailed leaf texture'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال التراث العربي',
          en: 'Arabic Heritage Chain',
        },
        slug: 'arabic-heritage-chain',
        description: {
          ar: 'سلسال ذهبي بنقوش عربية تراثية أصيلة',
          en: 'Golden chain with authentic Arabic heritage engravings',
        },
        price: 1650,
        priceBeforeDiscount: 1850,
        discountPercentage: 11,
        wrappingPrice: 80,
        images: ['/orna/سلسال التراث(1).JPG'],
        featured: true,
        stockQuantity: 8,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['تراث عربي', 'نقوش أصيلة'],
          en: ['Arabic Heritage', 'Authentic Engravings'],
        },
        highlights: {
          ar: ['نقوش عربية تراثية', 'صناعة محلية متقنة'],
          en: ['Arabic heritage engravings', 'Skilled local craftsmanship'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال العقيق البنفسجي',
          en: 'Purple Agate Chain',
        },
        slug: 'purple-agate-chain',
        description: {
          ar: 'سلسال مطعم بأحجار العقيق البنفسجي الطبيعي',
          en: 'Chain adorned with natural purple agate stones',
        },
        price: 2100,
        wrappingPrice: 105,
        images: ['/orna/سلسال العقيق البنفسجي.jpg'],
        featured: false,
        stockQuantity: 6,
        status: 'ACTIVE',
        category: 'NATURAL_PEARLS',
        tags: {
          ar: ['عقيق طبيعي', 'بنفسجي فاخر'],
          en: ['Natural Agate', 'Luxury Purple'],
        },
        highlights: {
          ar: ['أحجار عقيق طبيعية', 'لون بنفسجي مميز'],
          en: ['Natural agate stones', 'Distinctive purple color'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال الفراشة الذهبية',
          en: 'Golden Butterfly Chain',
        },
        slug: 'golden-butterfly-chain',
        description: {
          ar: 'سلسال رقيق بدلايات فراشات ذهبية صغيرة',
          en: 'Delicate chain with small golden butterfly pendants',
        },
        price: 1450,
        wrappingPrice: 70,
        images: ['/orna/سلسال الفراشة.JPG'],
        featured: false,
        stockQuantity: 14,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['فراشات ذهبية', 'تصميم رقيق'],
          en: ['Golden Butterflies', 'Delicate Design'],
        },
        highlights: {
          ar: ['دلايات فراشات صغيرة', 'سلسلة رفيعة أنيقة'],
          en: ['Small butterfly pendants', 'Elegant thin chain'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال إنفينيتي الأبدي',
          en: 'Eternal Infinity Chain',
        },
        slug: 'eternal-infinity-chain',
        description: {
          ar: 'سلسال برمز اللانهاية مطعم بالكريستال اللامع',
          en: 'Chain with infinity symbol adorned with shimmering crystals',
        },
        price: 1180,
        priceBeforeDiscount: 1320,
        discountPercentage: 11,
        wrappingPrice: 60,
        images: ['/orna/سلسال انفينيتي.JPG'],
        featured: false,
        stockQuantity: 18,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['رمز اللانهاية', 'كريستال لامع'],
          en: ['Infinity Symbol', 'Shimmering Crystal'],
        },
        highlights: {
          ar: ['رمز الحب الأبدي', 'كريستالات متلألئة'],
          en: ['Symbol of eternal love', 'Sparkling crystals'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال تينكر بيل السحري',
          en: 'Magical Tinker Bell Chain',
        },
        slug: 'magical-tinker-bell-chain',
        description: {
          ar: 'سلسال مستوحى من عالم الخيال بتفاصيل سحرية',
          en: 'Fantasy-inspired chain with magical details',
        },
        price: 1350,
        wrappingPrice: 70,
        images: ['/orna/سلسال تنكر بيل.JPG'],
        featured: false,
        stockQuantity: 10,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['خيال سحري', 'تصميم مرح'],
          en: ['Magical Fantasy', 'Playful Design'],
        },
        highlights: {
          ar: ['مستوحى من عالم الخيال', 'تفاصيل سحرية جذابة'],
          en: ['Fantasy world inspired', 'Attractive magical details'],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: {
          ar: 'سلسال هارموني المتناغم',
          en: 'Harmony Synchronized Chain',
        },
        slug: 'harmony-synchronized-chain',
        description: {
          ar: 'سلسال بتصميم متناغم يجمع بين عدة عناصر بتوازن مثالي',
          en: 'Chain with harmonious design combining multiple elements in perfect balance',
        },
        price: 1750,
        priceBeforeDiscount: 1950,
        discountPercentage: 10,
        wrappingPrice: 85,
        images: ['/orna/سلسال هارموني.JPG'],
        featured: true,
        stockQuantity: 7,
        status: 'ACTIVE',
        category: 'ARTIFICIAL_PEARLS',
        tags: {
          ar: ['تصميم متناغم', 'توازن مثالي'],
          en: ['Harmonious Design', 'Perfect Balance'],
        },
        highlights: {
          ar: ['عناصر متعددة متناغمة', 'توازن جمالي مثالي'],
          en: ['Multiple harmonious elements', 'Perfect aesthetic balance'],
        },
      },
    }),

    // Add more original products from the seed
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
            productId: products[17].id, // Tahitian Pearl Necklace
            quantity: 1,
            unitPrice: 3200,
            totalPrice: 3200,
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);
  console.log('🎉 Expanded database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
