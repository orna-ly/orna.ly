import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: 'USER'
      }
    })

    await prisma.setting.upsert({
      where: { key: `cred:${user.id}` },
      update: { value: { passwordHash } },
      create: { key: `cred:${user.id}`, value: { passwordHash } }
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 })
  } catch (error) {
    console.error('Register error', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}


