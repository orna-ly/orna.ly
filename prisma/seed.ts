import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: {
          ar: 'خاتم الأمل الذهبي',
          en: 'Golden Hope Ring'
        },
        slug: 'golden-hope-ring',
        description: {
          ar: 'خاتم ذهبي عيار 18 قيراط مطعم بالألماس الطبيعي، يرمز للأمل والنور في حياتك',
          en: '18k gold ring adorned with natural diamonds, symbolizing hope and light in your life'
        },
        subtitle: {
          ar: 'تصميم أنيق ومميز',
          en: 'Elegant and distinctive design'
        },
        price: 1850,
        priceBeforeDiscount: 2100,
        wrappingPrice: 100,
        images: [
          '/images/products/golden-hope-ring-1.jpg',
          '/images/products/golden-hope-ring-2.jpg'
        ],
        featured: true,
        status: 'ACTIVE'
      }
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'عقد لؤلؤ التاهيتي',
          en: 'Tahitian Pearl Necklace'
        },
        slug: 'tahitian-pearl-necklace',
        description: {
          ar: 'عقد من لؤلؤ التاهيتي الطبيعي الفاخر مع إغلاق من الذهب الأبيض',
          en: 'Luxurious natural Tahitian pearl necklace with white gold clasp'
        },
        price: 3200,
        wrappingPrice: 150,
        images: [
          '/images/products/tahitian-pearl-necklace-1.jpg'
        ],
        featured: true,
        status: 'ACTIVE'
      }
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'طقم الطاووس الأبيض',
          en: 'White Peacock Set'
        },
        slug: 'white-peacock-set',
        description: {
          ar: 'طقم كامل من الذهب الأبيض والماس يشمل عقد وأقراط وخاتم',
          en: 'Complete set of white gold and diamonds including necklace, earrings, and ring'
        },
        subtitle: {
          ar: 'رمز النقاء والخلود',
          en: 'Symbol of purity and eternity'
        },
        price: 4500,
        priceBeforeDiscount: 5000,
        wrappingPrice: 200,
        images: [
          '/images/products/white-peacock-set-1.jpg',
          '/images/products/white-peacock-set-2.jpg',
          '/images/products/white-peacock-set-3.jpg'
        ],
        featured: true,
        status: 'ACTIVE'
      }
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'أقراط الماس الكلاسيكية',
          en: 'Classic Diamond Earrings'
        },
        slug: 'classic-diamond-earrings',
        description: {
          ar: 'أقراط كلاسيكية من الذهب الأبيض مطعمة بالألماس الطبيعي',
          en: 'Classic white gold earrings studded with natural diamonds'
        },
        price: 2800,
        wrappingPrice: 120,
        images: [
          '/images/products/diamond-earrings-1.jpg'
        ],
        featured: false,
        status: 'ACTIVE'
      }
    }),
    prisma.product.create({
      data: {
        name: {
          ar: 'سوار الوردة الذهبية',
          en: 'Golden Rose Bracelet'
        },
        slug: 'golden-rose-bracelet',
        description: {
          ar: 'سوار ذهبي على شكل وردة بتصميم أنثوي راقي',
          en: 'Golden rose-shaped bracelet with elegant feminine design'
        },
        price: 1650,
        wrappingPrice: 80,
        images: [
          '/images/products/rose-bracelet-1.jpg'
        ],
        featured: false,
        status: 'ACTIVE'
      }
    })
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'فاطمة خالد',
        email: 'fatima@example.com',
        phone: '+966501112233',
        subject: 'استفسار عن المنتجات',
        message: 'أريد معرفة المزيد عن مجموعة الخواتم الذهبية وأسعارها',
        status: 'NEW'
      }
    }),
    prisma.contact.create({
      data: {
        name: 'محمد عبدالله',
        email: 'mohammed@example.com',
        phone: '+966554433221',
        subject: 'طلب عرض سعر خاص',
        message: 'أرغب في الحصول على عرض سعر خاص لطقم كامل من المجوهرات',
        status: 'REPLIED'
      }
    })
  ])

  console.log(`✅ Created ${contacts.length} contacts`)

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerName: 'سارة أحمد محمد',
        customerPhone: '+966501234567',
        customerEmail: 'sara@example.com',
        shippingAddress: {
          address: 'حي النرجس، شارع الملك فهد، الرياض',
          city: 'الرياض',
          state: 'الرياض'
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
            totalPrice: 1850
          }
        }
      }
    }),
    prisma.order.create({
      data: {
        customerName: 'أحمد محمد علي',
        customerPhone: '+966557654321',
        customerEmail: 'ahmed@example.com',
        shippingAddress: {
          address: 'حي الملقا، طريق الملك عبدالعزيز، الرياض',
          city: 'الرياض'
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
            totalPrice: 3200
          }
        }
      }
    })
  ])

  console.log(`✅ Created ${orders.length} orders`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
