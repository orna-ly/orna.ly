'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { currentLangAtom } from '@/lib/atoms';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentLang] = useAtom(currentLangAtom);

  const email = searchParams.get('email') || '';
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ar: 'تحقق من بريدك الإلكتروني',
        en: 'Verify Your Email',
      },
      subtitle: {
        ar: 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني',
        en: 'Enter the verification code sent to your email',
      },
      codeLabel: {
        ar: 'رمز التحقق',
        en: 'Verification Code',
      },
      codePlaceholder: {
        ar: 'أدخل رمز التحقق المكون من 6 أرقام',
        en: 'Enter 6-digit verification code',
      },
      verifyButton: {
        ar: 'تحقق من البريد الإلكتروني',
        en: 'Verify Email',
      },
      verifying: {
        ar: 'جاري التحقق...',
        en: 'Verifying...',
      },
      resendButton: {
        ar: 'إعادة إرسال الرمز',
        en: 'Resend Code',
      },
      resending: {
        ar: 'جاري الإرسال...',
        en: 'Sending...',
      },
      successTitle: {
        ar: 'تم التحقق بنجاح!',
        en: 'Email Verified Successfully!',
      },
      successMessage: {
        ar: 'تم تأكيد بريدك الإلكتروني. يمكنك الآن تسجيل الدخول.',
        en: 'Your email has been verified. You can now sign in.',
      },
      loginButton: {
        ar: 'تسجيل الدخول',
        en: 'Sign In',
      },
      sentTo: {
        ar: 'تم الإرسال إلى:',
        en: 'Sent to:',
      },
    };
    return texts[key]?.[currentLang] || texts[key]?.en || '';
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError(
        currentLang === 'ar'
          ? 'رمز التحقق مطلوب'
          : 'Verification code is required'
      );
      return;
    }

    setIsVerifying(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: verificationCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setVerified(true);
      setMessage(data.message);
    } catch (error) {
      console.error('Verification error:', error);
      setError(
        error instanceof Error
          ? error.message
          : currentLang === 'ar'
            ? 'فشل في التحقق'
            : 'Verification failed'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError(
        currentLang === 'ar'
          ? 'عنوان البريد الإلكتروني مطلوب'
          : 'Email address is required'
      );
      return;
    }

    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setMessage(data.message);
    } catch (error) {
      console.error('Resend error:', error);
      setError(
        error instanceof Error
          ? error.message
          : currentLang === 'ar'
            ? 'فشل في إعادة الإرسال'
            : 'Failed to resend code'
      );
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-800 mb-4">
              {getText('successTitle')}
            </h1>

            <p className="text-neutral-600 mb-8">{getText('successMessage')}</p>

            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {getText('loginButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-amber-600" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              {getText('title')}
            </h1>

            <p className="text-neutral-600 mb-4">{getText('subtitle')}</p>

            {email && (
              <div className="bg-neutral-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-neutral-600">{getText('sentTo')}</p>
                <p className="font-medium text-neutral-800">{email}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <Label htmlFor="verificationCode">{getText('codeLabel')}</Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={getText('codePlaceholder')}
                className="text-center text-lg tracking-wider"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isVerifying || !verificationCode.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  {getText('verifying')}
                </>
              ) : (
                getText('verifyButton')
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={isResending}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    {getText('resending')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {getText('resendButton')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
