"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import { currentLangAtom, loadContactsAtom } from "@/lib/atoms";
import { createContact } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Check, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [currentLang] = useAtom(currentLangAtom);
  const [, loadContacts] = useAtom(loadContactsAtom);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name =
        currentLang === "ar" ? "الاسم مطلوب" : "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        currentLang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        currentLang === "ar"
          ? "بريد إلكتروني غير صحيح"
          : "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject =
        currentLang === "ar" ? "الموضوع مطلوب" : "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message =
        currentLang === "ar" ? "الرسالة مطلوبة" : "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.error) {
        setSubmitError(result.error);
      } else {
        // Reload contacts to get the latest data
        await loadContacts();

        setSubmitted(true);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Reset submitted state after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {
      setSubmitError(
        currentLang === "ar"
          ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
          : "An error occurred while sending the message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            {currentLang === "ar" ? "تم إرسال رسالتك!" : "Message Sent!"}
          </h3>
          <p className="text-green-700">
            {currentLang === "ar"
              ? "شكراً لتواصلكم معنا. سنرد عليكم في أقرب وقت ممكن."
              : "Thank you for contacting us. We'll get back to you as soon as possible."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {submitError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {currentLang === "ar" ? "الاسم" : "Name"} *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder={
            currentLang === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"
          }
          className={errors.name ? "border-red-300" : ""}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {currentLang === "ar" ? "البريد الإلكتروني" : "Email"} *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={
            currentLang === "ar" ? "example@domain.com" : "example@domain.com"
          }
          className={errors.email ? "border-red-300" : ""}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {currentLang === "ar" ? "رقم الهاتف" : "Phone Number"}
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder={
            currentLang === "ar" ? "+218 91 123 4567" : "+218 91 123 4567"
          }
        />
      </div>

      {/* Subject Field */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {currentLang === "ar" ? "الموضوع" : "Subject"} *
        </label>
        <Input
          type="text"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder={
            currentLang === "ar" ? "موضوع رسالتك" : "Subject of your message"
          }
          className={errors.subject ? "border-red-300" : ""}
        />
        {errors.subject && (
          <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {currentLang === "ar" ? "الرسالة" : "Message"} *
        </label>
        <Textarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder={
            currentLang === "ar"
              ? "اكتب رسالتك هنا..."
              : "Write your message here..."
          }
          className={`min-h-[120px] ${errors.message ? "border-red-300" : ""}`}
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {currentLang === "ar" ? "جاري الإرسال..." : "Sending..."}
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            {currentLang === "ar" ? "إرسال الرسالة" : "Send Message"}
          </>
        )}
      </Button>

      <p className="text-xs text-neutral-500 text-center">
        {currentLang === "ar"
          ? "بإرسال هذه الرسالة، فإنك توافق على سياسة الخصوصية الخاصة بنا."
          : "By sending this message, you agree to our privacy policy."}
      </p>
    </form>
  );
}
