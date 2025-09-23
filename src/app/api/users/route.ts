import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  // Only admin can create users
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) return NextResponse.json({ error: 'Email in use' }, { status: 409 })
  const passwordHash = await bcrypt.hash(body.password, 10)
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      role: body.role || 'USER',
      image: body.image
    }
  })
  await prisma.setting.upsert({
    where: { key: `cred:${user.id}` },
    update: { value: { passwordHash } },
    create: { key: `cred:${user.id}`, value: { passwordHash } }
  })
  return NextResponse.json(user, { status: 201 })
}


