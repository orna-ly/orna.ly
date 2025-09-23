"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { currentLangAtom } from "@/lib/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [currentLang] = useAtom(currentLangAtom);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const text = {
    title: { ar: "إنشاء حساب جديد", en: "Create Your Account" },
    subtitle: {
      ar: "انضم إلى عائلة مجوهرات أورنا",
      en: "Join the Orna Jewelry family",
    },
    name: { ar: "الاسم الكامل", en: "Full Name" },
    email: { ar: "البريد الإلكتروني", en: "Email Address" },
    password: { ar: "كلمة المرور", en: "Password" },
    confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm Password" },
    createAccount: { ar: "إنشاء الحساب", en: "Create Account" },
    creating: { ar: "جار إنشاء الحساب...", en: "Creating account..." },
    haveAccount: { ar: "لديك حساب بالفعل؟", en: "Already have an account?" },
    signIn: { ar: "تسجيل الدخول", en: "Sign In" },
    backToHome: { ar: "العودة للرئيسية", en: "Back to Home" },
    brandName: { ar: "مجوهرات أورنا", en: "Orna Jewelry" },
    tagline: { ar: "جمال يدوم للأبد", en: "Beauty that lasts forever" },
    passwordMismatch: {
      ar: "كلمتا المرور غير متطابقتين",
      en: "Passwords do not match",
    },
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setError(
        text.passwordMismatch[
          currentLang as keyof typeof text.passwordMismatch
        ],
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      router.replace("/login?message=registered");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex bg-gradient-to-br from-rose-50 via-white to-amber-50"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      {/* Left Side - Brand Showcase */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/orna/2.jpeg"
            alt="Orna Jewelry"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 via-rose-800/60 to-amber-900/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-20 w-48 h-48 border border-white/20 rounded-full opacity-30" />
          <div className="absolute bottom-20 left-16 w-64 h-64 border-2 border-white/10 rotate-12 opacity-40" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full opacity-60" />
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
                <p className="text-rose-200 text-lg">
                  {text.tagline[currentLang as keyof typeof text.tagline]}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-rose-100">
              <div className="flex items-center gap-4">
                <Check className="w-6 h-6 text-rose-300" />
                <p className="text-lg">
                  {currentLang === "ar"
                    ? "حساب مجاني بالكامل"
                    : "Completely free account"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Check className="w-6 h-6 text-rose-300" />
                <p className="text-lg">
                  {currentLang === "ar"
                    ? "عروض حصرية للأعضاء"
                    : "Exclusive member offers"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Check className="w-6 h-6 text-rose-300" />
                <p className="text-lg">
                  {currentLang === "ar"
                    ? "تتبع الطلبات والمفضلة"
                    : "Order tracking and wishlist"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
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

          {/* Register Form */}
          <Card className="jewelry-card shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <CardContent className="p-8">
              <form onSubmit={handleRegister} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    {text.name[currentLang as keyof typeof text.name]}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 border-neutral-200 focus:border-amber-400 focus:ring-amber-400"
                      placeholder={
                        currentLang === "ar"
                          ? "أدخل اسمك الكامل"
                          : "Enter your full name"
                      }
                      required
                    />
                  </div>
                </div>

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
                      minLength={6}
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    {
                      text.confirmPassword[
                        currentLang as keyof typeof text.confirmPassword
                      ]
                    }
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-neutral-200 focus:border-amber-400 focus:ring-amber-400"
                      placeholder={
                        currentLang === "ar"
                          ? "أعد إدخال كلمة المرور"
                          : "Confirm your password"
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? (
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
                      {text.creating[currentLang as keyof typeof text.creating]}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {
                        text.createAccount[
                          currentLang as keyof typeof text.createAccount
                        ]
                      }
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
              {text.haveAccount[currentLang as keyof typeof text.haveAccount]}{" "}
              <Link
                href="/login"
                className="text-amber-600 hover:text-amber-700 font-medium hover:underline transition-colors"
              >
                {text.signIn[currentLang as keyof typeof text.signIn]}
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
