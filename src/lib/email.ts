// Email utility functions
// In a production environment, you would use a service like SendGrid, AWS SES, or Nodemailer with SMTP

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: EmailOptions): Promise<void> {
  // For development/demo purposes, we'll log the email instead of actually sending it
  // In production, replace this with actual email service integration

  console.log('📧 Email would be sent:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);
  console.log('Text:', text);

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For production, uncomment and configure one of these services:

  /* 
  // Example with Nodemailer (requires npm install nodemailer @types/nodemailer)
  import nodemailer from 'nodemailer';
  
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@orna.ly',
    to,
    subject,
    html,
    text,
  });
  */

  /* 
  // Example with SendGrid (requires npm install @sendgrid/mail)
  import sgMail from '@sendgrid/mail';
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  
  await sgMail.send({
    to,
    from: process.env.FROM_EMAIL || 'noreply@orna.ly',
    subject,
    html,
    text,
  });
  */

  /* 
  // Example with AWS SES (requires npm install @aws-sdk/client-ses)
  import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
  
  const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new SendEmailCommand({
    Source: process.env.FROM_EMAIL || 'noreply@orna.ly',
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: html,
          Charset: 'UTF-8',
        },
        Text: {
          Data: text,
          Charset: 'UTF-8',
        },
      },
    },
  });

  await sesClient.send(command);
  */
}

export async function sendVerificationEmail(
  to: string,
  verificationCode: string
): Promise<void> {
  const subject = 'Verify your email - Orna Jewelry';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://orna.ly/logo.png" alt="Orna Jewelry" style="height: 60px;" />
        <h1 style="color: #d97706; margin: 10px 0;">Orna Jewelry</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #374151; margin-top: 0;">Verify Your Email Address</h2>
        <p style="line-height: 1.6; color: #4b5563;">
          Thank you for creating an account with Orna Jewelry. To complete your registration, 
          please verify your email address by entering the verification code below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #d97706; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
            ${verificationCode}
          </div>
        </div>
        
        <p style="line-height: 1.6; color: #4b5563; font-size: 14px;">
          This verification code will expire in 24 hours. If you didn't create an account with us, 
          please ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Thank you for choosing Orna Jewelry<br>
          Visit us at <a href="https://orna.ly" style="color: #d97706;">orna.ly</a>
        </p>
      </div>
    </div>
  `;

  const text = `
    Verify Your Email Address - Orna Jewelry
    
    Thank you for creating an account with Orna Jewelry. 
    Your verification code is: ${verificationCode}
    
    This code will expire in 24 hours.
    
    Visit us at https://orna.ly
  `;

  await sendEmail({ to, subject, html, text });
}
