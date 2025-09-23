import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: 'USER',
        emailVerified: false,
        verificationCode,
        verificationExpiry,
      },
    });

    await prisma.setting.upsert({
      where: { key: `cred:${user.id}` },
      update: { value: { passwordHash } },
      create: { key: `cred:${user.id}`, value: { passwordHash } },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        message:
          'Registration successful. Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
