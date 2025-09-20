# 🚀 Complete Migration Guide: Laravel Orna.ly → Next.js + Prisma + Jotai

## 📋 **What You Need to Know**

### **Current Laravel Application Analysis**
Your existing Laravel application has:
- **Products**: Name (multilingual JSON), slug, price, wrapping_price, descriptions
- **Orders**: Customer info, product relationship, payment status, wrapping options
- **Contacts**: Contact form submissions
- **Users**: Admin user management with roles/permissions
- **Multilingual**: Arabic/English support with JSON fields

### **New Tech Stack**
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: Jotai (atomic state management)
- **UI Components**: Shadcn/UI (modern, accessible components)
- **Runtime**: Bun (fast JavaScript runtime)
- **Internationalization**: next-intl (Arabic/English)
- **Forms**: React Hook Form + Zod validation

---

## 🛠️ **Complete Setup Instructions**

### **Step 1: Environment Setup**

```bash
# 1. Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# 2. Install PostgreSQL with Docker
docker run --name orna-postgres \
  -e POSTGRES_DB=orna_jewelry \
  -e POSTGRES_USER=orna_user \
  -e POSTGRES_PASSWORD=orna_password \
  -p 5432:5432 \
  -d postgres:15

# 3. Verify PostgreSQL is running
docker ps
```

### **Step 2: Project Structure**

```
orna-jewelry-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalization routes
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/      # Product pages
│   │   │   ├── admin/         # Admin panel
│   │   │   └── api/           # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── admin/            # Admin-specific components
│   │   └── website/          # Website components
│   ├── lib/                  # Utilities and configurations
│   │   ├── atoms.ts          # Jotai state atoms
│   │   ├── db.ts             # Prisma client
│   │   ├── utils.ts          # Utility functions
│   │   └── validations.ts    # Zod schemas
│   └── types/                # TypeScript type definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── scripts/                  # Migration and utility scripts
└── docker-compose.yml        # Docker configuration
```

### **Step 3: Database Schema (Prisma)**

The Prisma schema will mirror your Laravel models:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders Order[]
  
  @@map("users")
}

model Product {
  id          String        @id @default(cuid())
  name        Json          // { en: "Gold Ring", ar: "خاتم ذهبي" }
  slug        String        @unique
  description Json?         
  subtitle    Json?         
  subdescription Json?      
  price       Decimal       @db.Decimal(10,2)
  priceBeforeDiscount Decimal? @db.Decimal(10,2)
  wrappingPrice Decimal?    @db.Decimal(10,2)
  image       String?       
  status      ProductStatus @default(ACTIVE)
  featured    Boolean       @default(false)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  orders Order[]
  
  @@map("products")
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique @default(cuid())
  customerName    String
  customerPhone   String
  customerEmail   String?
  address         String
  city            String?
  state           String?
  totalAmount     Decimal       @db.Decimal(10,2)
  wrappingCost    Decimal?      @db.Decimal(10,2)
  needsWrapping   Boolean       @default(false)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentUrl      String?
  mailSent        Boolean       @default(false)
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  customer   User?       @relation(fields: [customerId], references: [id])
  customerId String?
  product    Product     @relation(fields: [productId], references: [id])
  productId  String
  
  @@map("orders")
}

model Contact {
  id        String        @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String
  status    ContactStatus @default(NEW)
  userId    String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  user User? @relation(fields: [userId], references: [id])
  
  @@map("contacts")
}

// Enums
enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum ContactStatus {
  NEW
  READ
  REPLIED
  RESOLVED
}
```

### **Step 4: Environment Configuration**

```bash
# .env.local
# Database
DATABASE_URL="postgresql://orna_user:orna_password@localhost:5432/orna_jewelry"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="مجوهرات أورنا"

# Old Laravel Database (for migration)
OLD_DB_HOST="localhost"
OLD_DB_PORT="3306"
OLD_DB_NAME="your_old_database_name"
OLD_DB_USER="your_old_db_username"  
OLD_DB_PASS="your_old_db_password"

# Upload Settings
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="10485760"

# Payment Gateway (copy from your Laravel .env)
PAYMENT_GATEWAY_API_KEY="your-payment-key"
PAYMENT_GATEWAY_SECRET="your-payment-secret"
```

### **Step 5: Jotai State Management**

```typescript
// src/lib/atoms.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Types
export interface Product {
  id: string
  name: Record<string, string>
  slug: string
  price: number
  priceBeforeDiscount?: number
  image?: string
  description: Record<string, string>
  subtitle?: Record<string, string>
  subdescription?: Record<string, string>
  featured: boolean
  wrappingPrice?: number
  createdAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  address: string
  city?: string
  state?: string
  product: Product
  totalAmount: number
  wrapping: boolean
  wrappingPrice?: number
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  paymentUrl?: string
  mailSent: boolean
  notes?: string
  createdAt: Date
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'RESOLVED'
  userId?: string
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

// Global State Atoms
export const currentLangAtom = atomWithStorage<string>('currentLang', 'ar')

export const productsAtom = atom<Product[]>([])
export const featuredProductsAtom = atom<Product[]>(
  (get) => get(productsAtom).filter(p => p.featured)
)

export const cartItemsAtom = atomWithStorage<CartItem[]>('cartItems', [])
export const cartTotalAtom = atom(
  (get) => get(cartItemsAtom).reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  )
)

export const ordersAtom = atom<Order[]>([])
export const contactsAtom = atom<Contact[]>([])

// UI State Atoms
export const mobileMenuOpenAtom = atom(false)
export const loadingAtom = atom(false)
export const searchQueryAtom = atom('')
export const filterCategoryAtom = atom<string>('all')

// Cart Actions
export const addToCartAtom = atom(
  null,
  (get, set, product: Product) => {
    const currentItems = get(cartItemsAtom)
    const existingItem = currentItems.find(item => item.product.id === product.id)
    
    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      set(cartItemsAtom, updatedItems)
    } else {
      set(cartItemsAtom, [...currentItems, { product, quantity: 1 }])
    }
  }
)

export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const currentItems = get(cartItemsAtom)
    const updatedItems = currentItems.filter(item => item.product.id !== productId)
    set(cartItemsAtom, updatedItems)
  }
)
```

### **Step 6: Data Migration Script**

```typescript
// scripts/migrate-data.ts
import mysql from 'mysql2/promise'
import { prisma } from '../src/lib/db'

// Old Laravel database connection
const oldDb = await mysql.createConnection({
  host: process.env.OLD_DB_HOST,
  port: parseInt(process.env.OLD_DB_PORT || '3306'),
  user: process.env.OLD_DB_USER,
  password: process.env.OLD_DB_PASS,
  database: process.env.OLD_DB_NAME
})

async function migrateProducts() {
  console.log('🔄 Migrating products...')
  
  const [products] = await oldDb.execute('SELECT * FROM product ORDER BY id')
  
  for (const product of products as any[]) {
    try {
      // Parse JSON fields (name, description, etc.)
      let name = product.name
      if (typeof name === 'string' && name.startsWith('{')) {
        name = JSON.parse(name)
      } else {
        // Convert single value to multilingual
        name = {
          ar: product.name || 'اسم المنتج',
          en: product.name || 'Product Name'
        }
      }
      
      await prisma.product.create({
        data: {
          name: name,
          slug: product.slug || `product-${product.id}`,
          price: parseFloat(product.price || '0'),
          wrappingPrice: product.wrapping_price ? parseFloat(product.wrapping_price) : null,
          image: product.image,
          status: 'ACTIVE',
          createdAt: new Date(product.created_at),
          updatedAt: new Date(product.updated_at)
        }
      })
      
      console.log(`✅ Migrated product: ${name.en || name.ar}`)
    } catch (error) {
      console.error(`❌ Error migrating product ${product.id}:`, error)
    }
  }
}

async function migrateOrders() {
  console.log('🔄 Migrating orders...')
  
  const [orders] = await oldDb.execute('SELECT * FROM `order` ORDER BY id')
  
  for (const order of orders as any[]) {
    try {
      await prisma.order.create({
        data: {
          orderNumber: `ORN-${order.id}`,
          customerName: order.name || 'Unknown Customer',
          customerPhone: order.phone || '',
          address: order.address || '',
          city: 'Unknown',
          state: 'Unknown',
          totalAmount: parseFloat(order.price || '0'),
          wrappingCost: order.wrapping_price ? parseFloat(order.wrapping_price) : null,
          needsWrapping: Boolean(order.wrapping),
          paymentStatus: order.payment_status === 'paid' ? 'PAID' : 'PENDING',
          paymentUrl: order.payment_url,
          mailSent: Boolean(order.mail_sent),
          createdAt: new Date(order.created_at),
          updatedAt: new Date(order.updated_at)
        }
      })
      
      console.log(`✅ Migrated order: ${order.id}`)
    } catch (error) {
      console.error(`❌ Error migrating order ${order.id}:`, error)
    }
  }
}

async function migrateContacts() {
  console.log('🔄 Migrating contacts...')
  
  const [contacts] = await oldDb.execute('SELECT * FROM contacts ORDER BY id')
  
  for (const contact of contacts as any[]) {
    try {
      await prisma.contact.create({
        data: {
          name: contact.name || 'Unknown',
          email: contact.email || 'unknown@example.com',
          phone: contact.phone,
          subject: contact.subject || 'General Inquiry',
          message: contact.message || '',
          status: 'NEW',
          userId: contact.user_id ? contact.user_id.toString() : null,
          createdAt: new Date(contact.created_at),
          updatedAt: new Date(contact.updated_at)
        }
      })
      
      console.log(`✅ Migrated contact: ${contact.name}`)
    } catch (error) {
      console.error(`❌ Error migrating contact ${contact.id}:`, error)
    }
  }
}

async function main() {
  console.log('🚀 Starting data migration...')
  
  await migrateProducts()
  await migrateOrders()
  await migrateContacts()
  
  console.log('✅ Migration completed!')
  
  await oldDb.end()
  await prisma.$disconnect()
}

main().catch(console.error)
```

---

## 🎯 **Key Features to Implement**

### **1. Homepage with Hero Carousel**
- Full-screen image carousel
- Featured products section
- Arabic/English toggle
- Responsive design

### **2. Product Management**
- Product listing with search/filter
- Product detail pages
- Image galleries
- Add to cart functionality

### **3. Shopping Cart**
- Persistent cart (localStorage)
- Quantity management
- Price calculations
- Checkout flow

### **4. Order System**
- Order placement
- Order tracking
- Payment integration
- Email notifications

### **5. Admin Panel**
- Dashboard with statistics
- Product CRUD operations
- Order management
- Contact form submissions
- User management

### **6. Internationalization**
- Arabic (RTL) and English (LTR)
- URL-based language switching
- Multilingual content management

---

## 🚀 **Development Commands**

```bash
# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Database operations
bun run db:generate    # Generate Prisma client
bun run db:push        # Push schema to database
bun run db:migrate     # Run migrations
bun run db:studio      # Open Prisma Studio

# Data migration
bun run migrate-data   # Migrate from Laravel

# Linting
bun run lint
```

---

## 📱 **Responsive Design Strategy**

### **Mobile-First Approach**
- Tailwind CSS breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Touch-friendly interface
- Optimized images
- Fast loading

### **Arabic RTL Support**
- CSS `direction: rtl` for Arabic
- Proper text alignment
- Icon and layout mirroring
- Font optimization

---

## 🔐 **Security Considerations**

### **API Security**
- Input validation with Zod
- SQL injection prevention (Prisma)
- CORS configuration
- Rate limiting

### **Authentication**
- NextAuth.js integration
- JWT tokens
- Role-based access control
- Session management

---

## 📊 **Performance Optimization**

### **Next.js Features**
- Server-side rendering (SSR)
- Static site generation (SSG)
- Image optimization
- Code splitting

### **Database Optimization**
- Prisma connection pooling
- Query optimization
- Indexing strategy
- Caching layer

---

## 🎨 **UI/UX Best Practices**

### **Design System**
- Consistent color palette
- Typography hierarchy
- Spacing system
- Component library

### **Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

---

## 🔄 **Migration Strategy**

### **Phase 1: Setup & Core (Week 1)**
- ✅ Project initialization
- ✅ Database schema
- ✅ Basic components
- ✅ State management

### **Phase 2: Features (Week 2)**
- 🔄 Product pages
- 🔄 Shopping cart
- 🔄 Order system
- 🔄 Admin panel

### **Phase 3: Polish (Week 3)**
- ⏳ Data migration
- ⏳ Testing
- ⏳ Performance optimization
- ⏳ Deployment

---

## 🆘 **Common Issues & Solutions**

### **Database Connection**
```bash
# Check PostgreSQL status
docker ps

# Reset database
docker restart orna-postgres
```

### **Prisma Issues**
```bash
# Reset Prisma client
bun run db:generate

# Reset database
bun run db:push --force-reset
```

### **Build Issues**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
bun install
```

---

## 📚 **Resources & Documentation**

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Jotai**: https://jotai.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com/docs

---

This guide provides everything you need to successfully migrate your Laravel application to a modern Next.js stack. The new architecture will be more maintainable, performant, and scalable! 🚀
