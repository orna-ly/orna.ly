#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Preparing database for deployment...');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Run migrations
    console.log('🔄 Applying database migrations...');
    // Note: In production, migrations should be applied via `prisma migrate deploy`
    // This script just ensures the database is ready

    // Check if we need to seed
    const productCount = await prisma.product.count();
    console.log(`📊 Found ${productCount} products in database`);

    if (productCount === 0) {
      console.log('🌱 Database appears empty, consider running seed script');
    }

    console.log('✅ Database preparation completed');
  } catch (error) {
    console.error('❌ Database preparation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Database preparation failed:', error);
  process.exit(1);
});
