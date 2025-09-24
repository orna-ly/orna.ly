import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { Prisma } from '@prisma/client';

export async function GET() {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json(settings);
}

interface SettingUpdateRequest {
  key: string;
  // TODO: Improve typing - value should be typed based on the setting key (string | number | boolean | object)
  value: Prisma.InputJsonValue;
}

export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const ops: SettingUpdateRequest[] = Array.isArray(body) ? body : [];
  for (const op of ops) {
    await prisma.setting.upsert({
      where: { key: op.key },
      update: { value: op.value },
      create: { key: op.key, value: op.value },
    });
  }
  return NextResponse.json({ success: true });
}
