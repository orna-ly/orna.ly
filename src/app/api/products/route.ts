import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { ProductStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    const where: {
      status: ProductStatus;
      featured?: boolean;
      OR?: Array<{
        name?: { path: string[]; string_contains: string };
        description?: { path: string[]; string_contains: string };
      }>;
    } = {
      status: ProductStatus.ACTIVE,
    };

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        {
          name: {
            path: ["ar"],
            string_contains: search,
          },
        },
        {
          name: {
            path: ["en"],
            string_contains: search,
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // AuthZ: admin only
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        subtitle: body.subtitle,
        price: body.price,
        priceBeforeDiscount: body.priceBeforeDiscount,
        wrappingPrice: body.wrappingPrice,
        images: body.images,
        stockQuantity: body.stockQuantity ?? 0,
        featured: body.featured || false,
        status: body.status || "ACTIVE",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
