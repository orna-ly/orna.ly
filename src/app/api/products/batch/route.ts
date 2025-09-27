import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products must be an array' },
        { status: 400 }
      );
    }

    // Validate and create products
    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const productData = products[i];

        // Validate required fields
        if (
          !productData.name?.ar ||
          !productData.name?.en ||
          !productData.slug
        ) {
          errors.push(
            `Product ${i + 1}: Missing required fields (name.ar, name.en, slug)`
          );
          continue;
        }

        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
          where: { slug: productData.slug },
        });

        if (existingProduct) {
          errors.push(
            `Product ${i + 1}: Slug "${productData.slug}" already exists`
          );
          continue;
        }

        // Create the product
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description || { ar: '', en: '' },
            subtitle: productData.subtitle || { ar: '', en: '' },
            price: productData.price || 0,
            priceBeforeDiscount: productData.priceBeforeDiscount,
            wrappingPrice: productData.wrappingPrice,
            images: productData.images || [],
            stockQuantity: productData.stockQuantity || 0,
            status: productData.status || 'ACTIVE',
            featured: productData.featured || false,
          },
        });

        createdProducts.push(product);
      } catch (error) {
        console.error(`Error creating product ${i + 1}:`, error);
        errors.push(
          `Product ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      created: createdProducts.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully created ${createdProducts.length} products${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
    });
  } catch (error) {
    console.error('Batch import error:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
