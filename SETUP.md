# Orna Jewelry - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/orna_jewelry"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Orna Jewelry"
```

### 3. Database Setup

```bash
# Apply migrations and generate the Prisma client
bun run db:migrate

# Seed the database with sample data
bun run db:seed
```

### 4. Start Development Server

```bash
bun run dev
```

### 5. Run everything with Docker (optional)

```bash
cp docker/.env.docker.example docker/.env.docker
docker compose up --build
```

This boots the Next.js app on port `3000` and a PostgreSQL instance on `5432`. Edit `docker/.env.docker` (or provide an `--env-file`) before deploying the stack anywhere outside of local development.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── products/      # Product CRUD operations
│   │   ├── orders/        # Order management
│   │   └── contacts/      # Contact form submissions
│   ├── admin/             # Admin panel pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout process
│   ├── contact/           # Contact page
│   └── products/          # Product pages
├── components/            # React components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # Shadcn/UI components
└── lib/                   # Utilities and configurations
    ├── atoms.ts           # Jotai state management
    ├── api.ts             # API utility functions
    ├── prisma.ts          # Prisma client
    └── utils.ts           # Helper functions
```

## 🛠️ Features Implemented

### ✅ State Management (Jotai)

- Global state for products, orders, contacts
- Cart management with localStorage persistence
- Language switching (Arabic/English)
- Loading states and error handling

### ✅ Database (Prisma + PostgreSQL)

- Product management with multilingual support
- Order processing with items and customer info
- Contact form submissions
- User management (ready for authentication)

### ✅ API Routes

- RESTful API for all entities
- Proper error handling and validation
- Type-safe with TypeScript

### ✅ Forms & Validation

- Contact form with real-time validation
- Order form with cart integration
- Error handling and success states
- Multilingual form labels

### ✅ UI Components

- Modern design with Shadcn/UI
- Responsive layout
- Arabic RTL support
- Loading states and animations

## 🎯 Next Steps

### Phase 1: Database Connection

1. Set up PostgreSQL database
2. Configure DATABASE_URL in .env.local
3. Run database migrations and seed

### Phase 2: Authentication

1. Implement NextAuth.js
2. Add user registration/login
3. Protect admin routes

### Phase 3: Payment Integration

1. Add payment gateway (Stripe/PayPal)
2. Implement order payment flow
3. Add payment status tracking

### Phase 4: Advanced Features

1. Email notifications
2. Image upload for products
3. Order tracking system
4. Advanced search and filtering

## 🔧 Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:migrate       # Apply committed migrations
bun run db:push          # Experimental: push schema during prototyping
bun run db:seed          # Seed database with sample data

# Code Quality
bun run lint             # Run ESLint
```

## 📱 Pages Overview

### Public Pages

- **Homepage** (`/`) - Featured products carousel
- **Products** (`/products`) - Product catalog with filtering
- **Product Detail** (`/products/[slug]`) - Individual product page
- **Contact** (`/contact`) - Contact form and company info
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Order creation process

### Admin Pages

- **Dashboard** (`/admin`) - Admin overview
- **Products** (`/admin/products`) - Product management
- **Orders** (`/admin/orders`) - Order management
- **Contacts** (`/admin/contacts`) - Contact submissions

## 🌐 Internationalization

The app supports Arabic and English with:

- RTL layout for Arabic
- Language-specific content
- URL routing (`/ar/` and `/en/`)
- Persistent language preference

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** for consistent component design
- **Custom color scheme** with amber/rose accents
- **Responsive design** for all screen sizes

## 🔒 Security

- Input validation on both client and server
- SQL injection protection via Prisma
- XSS protection with proper sanitization
- CSRF protection (ready for implementation)

## 📊 Database Schema

### Products

- Multilingual name/description (JSON)
- Price with discount support
- Image gallery
- Featured status
- Wrapping options

### Orders

- Customer information
- Shipping address (JSON)
- Order items with quantities
- Payment and status tracking
- Notes and special instructions

### Contacts

- Form submissions
- Status tracking (NEW/REPLIED/RESOLVED)
- Timestamps for follow-up

## 🚀 Deployment

The app is ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

Make sure to:

1. Set up production database
2. Configure environment variables
3. Run database migrations
4. Set up domain and SSL

## 📞 Support

For questions or issues:

1. Check the documentation
2. Review the code comments
3. Test with the provided sample data
4. Ensure all dependencies are installed

---

**Happy coding! 🎉**
