'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { currentLangAtom, loadContactsAtom } from '@/lib/atoms';
import { createContact } from '@/lib/api';
import {
  createContactSchema,
  type CreateContactInput,
} from '@/lib/validations';
import { toastSuccess, toastError, apiToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Send, Check } from 'lucide-react';

export function ContactForm() {
  const [currentLang] = useAtom(currentLangAtom);
  const [, loadContacts] = useAtom(loadContactsAtom);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
  });

  const onSubmit = async (data: CreateContactInput) => {
    try {
      // Convert undefined phone to null for API compatibility
      const contactData = {
        ...data,
        phone: data.phone || null,
      };
      const submitPromise = createContact(contactData);

      await apiToast.promise(
        submitPromise,
        'sending',
        currentLang as 'ar' | 'en'
      );

      const result = await submitPromise;

      if (result.error) {
        toastError('generic', currentLang as 'ar' | 'en');
        return;
      }

      // Reload contacts to get the latest data
      await loadContacts();

      // Show success state
      setSubmitted(true);
      reset();

      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);

      toastSuccess('sent', currentLang as 'ar' | 'en');
    } catch (error) {
      console.error('Contact form submission error:', error);
      toastError('network', currentLang as 'ar' | 'en');
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
            {currentLang === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}
          </h3>
          <p className="text-green-700">
            {currentLang === 'ar'
              ? 'شكراً لتواصلكم معنا. سنرد عليكم في أقرب وقت ممكن.'
              : "Thank you for contacting us. We'll get back to you as soon as possible."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <FormField
        label={currentLang === 'ar' ? 'الاسم' : 'Name'}
        required
        error={errors.name?.message}
        htmlFor="name"
      >
        <Input
          id="name"
          type="text"
          placeholder={
            currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'
          }
          className={errors.name ? 'border-red-300' : ''}
          {...register('name')}
        />
      </FormField>

      {/* Email Field */}
      <FormField
        label={currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
        required
        error={errors.email?.message}
        htmlFor="email"
      >
        <Input
          id="email"
          type="email"
          placeholder="example@domain.com"
          className={errors.email ? 'border-red-300' : ''}
          {...register('email')}
        />
      </FormField>

      {/* Phone Field */}
      <FormField
        label={currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
        error={errors.phone?.message}
        htmlFor="phone"
      >
        <Input
          id="phone"
          type="tel"
          placeholder="+218 91 123 4567"
          {...register('phone')}
        />
      </FormField>

      {/* Subject Field */}
      <FormField
        label={currentLang === 'ar' ? 'الموضوع' : 'Subject'}
        required
        error={errors.subject?.message}
        htmlFor="subject"
      >
        <Input
          id="subject"
          type="text"
          placeholder={
            currentLang === 'ar' ? 'موضوع رسالتك' : 'Subject of your message'
          }
          className={errors.subject ? 'border-red-300' : ''}
          {...register('subject')}
        />
      </FormField>

      {/* Message Field */}
      <FormField
        label={currentLang === 'ar' ? 'الرسالة' : 'Message'}
        required
        error={errors.message?.message}
        htmlFor="message"
      >
        <Textarea
          id="message"
          placeholder={
            currentLang === 'ar'
              ? 'اكتب رسالتك هنا...'
              : 'Write your message here...'
          }
          className={`min-h-[120px] ${errors.message ? 'border-red-300' : ''}`}
          {...register('message')}
        />
      </FormField>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            {currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
          </>
        )}
      </Button>

      <p className="text-xs text-neutral-500 text-center">
        {currentLang === 'ar'
          ? 'بإرسال هذه الرسالة، فإنك توافق على سياسة الخصوصية الخاصة بنا.'
          : 'By sending this message, you agree to our privacy policy.'}
      </p>
    </form>
  );
}
