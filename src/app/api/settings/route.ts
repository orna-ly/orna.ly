import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  // body: { key: string, value: any }[]
  const ops = Array.isArray(body) ? body : [];
  for (const op of ops) {
    await prisma.setting.upsert({
      where: { key: op.key },
      update: { value: op.value },
      create: { key: op.key, value: op.value },
    });
  }
  return NextResponse.json({ success: true });
}
