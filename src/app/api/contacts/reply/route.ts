import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email reply
    await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://orna.ly/logo.png" alt="Orna Jewelry" style="height: 60px;" />
            <h1 style="color: #d97706; margin: 10px 0;">Orna Jewelry</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #374151; margin-top: 0;">Reply from Orna Jewelry</h2>
            <div style="line-height: 1.6; color: #4b5563;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Thank you for contacting Orna Jewelry<br>
              Visit us at <a href="https://orna.ly" style="color: #d97706;">orna.ly</a>
            </p>
          </div>
        </div>
      `,
      text: message,
    });

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
