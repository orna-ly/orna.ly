"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { loadCurrentUserAtom, currentLangAtom } from "@/lib/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, loadCurrentUser] = useAtom(loadCurrentUserAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const message = searchParams.get("message");

  const text = {
    title: { ar: "تسجيل الدخول", en: "Welcome Back" },
    subtitle: {
      ar: "سجل دخولك للوصول إلى حسابك",
      en: "Sign in to access your account",
    },
    email: { ar: "البريد الإلكتروني", en: "Email Address" },
    password: { ar: "كلمة المرور", en: "Password" },
    signIn: { ar: "تسجيل الدخول", en: "Sign In" },
    signingIn: { ar: "جار تسجيل الدخول...", en: "Signing in..." },
    noAccount: { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
    register: { ar: "إنشاء حساب", en: "Create Account" },
    backToHome: { ar: "العودة للرئيسية", en: "Back to Home" },
    brandName: { ar: "مجوهرات أورنا", en: "Orna Jewelry" },
    tagline: { ar: "جمال يدوم للأبد", en: "Beauty that lasts forever" },
    registeredSuccess: {
      ar: "تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.",
      en: "Account created successfully! You can now sign in.",
    },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // Load user data after successful login
      await loadCurrentUser();

      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex bg-gradient-to-br from-amber-50 via-white to-rose-50"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      {/* Left Side - Brand Showcase */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/orna/1.jpeg"
            alt="Orna Jewelry"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-amber-800/60 to-rose-900/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full opacity-30" />
          <div className="absolute bottom-32 right-16 w-48 h-48 border-2 border-white/10 rotate-45 opacity-40" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full opacity-60" />
        </div>

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">O</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {text.brandName[currentLang as keyof typeof text.brandName]}
                </h1>
                <p className="text-amber-200 text-lg">
                  {text.tagline[currentLang as keyof typeof text.tagline]}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <p className="text-lg">
                  {currentLang === "ar"
                    ? "تصاميم فريدة ومميزة"
                    : "Unique and distinctive designs"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <p className="text-lg">
                  {currentLang === "ar"
                    ? "جودة عالية ومواد فاخرة"
                    : "High quality and luxury materials"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <p className="text-lg">
                  {currentLang === "ar"
                    ? "خدمة عملاء متميزة"
                    : "Outstanding customer service"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text-gold">
                {text.brandName[currentLang as keyof typeof text.brandName]}
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {text.title[currentLang as keyof typeof text.title]}
            </h2>
            <p className="text-neutral-600">
              {text.subtitle[currentLang as keyof typeof text.subtitle]}
            </p>
          </div>

          {/* Login Form */}
          <Card className="jewelry-card shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {message === "registered" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600">
                      {
                        text.registeredSuccess[
                          currentLang as keyof typeof text.registeredSuccess
                        ]
                      }
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    {text.email[currentLang as keyof typeof text.email]}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-neutral-200 focus:border-amber-400 focus:ring-amber-400"
                      placeholder={
                        currentLang === "ar"
                          ? "أدخل بريدك الإلكتروني"
                          : "Enter your email"
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    {text.password[currentLang as keyof typeof text.password]}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-neutral-200 focus:border-amber-400 focus:ring-amber-400"
                      placeholder={
                        currentLang === "ar"
                          ? "أدخل كلمة المرور"
                          : "Enter your password"
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 btn-primary text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {
                        text.signingIn[
                          currentLang as keyof typeof text.signingIn
                        ]
                      }
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {text.signIn[currentLang as keyof typeof text.signIn]}
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-neutral-600">
              {text.noAccount[currentLang as keyof typeof text.noAccount]}{" "}
              <Link
                href="/register"
                className="text-amber-600 hover:text-amber-700 font-medium hover:underline transition-colors"
              >
                {text.register[currentLang as keyof typeof text.register]}
              </Link>
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              {text.backToHome[currentLang as keyof typeof text.backToHome]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
