import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    // Read password hash from settings (cred:<userId>)
    const cred = await prisma.setting.findUnique({ where: { key: `cred:${user.id}` } })
    const passwordHash = cred?.value?.passwordHash as string | undefined
    if (!passwordHash) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
    }
    const ok = await bcrypt.compare(password, passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )
    const res = NextResponse.json({ success: true })
    res.cookies.set('orna_admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    return res
  } catch (error) {
    console.error('Login error', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}


