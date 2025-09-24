import toast from 'react-hot-toast';

// Toast notification helpers with internationalization support
export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  // Internationalized messages
  i18n: {
    success: {
      ar: {
        saved: 'تم الحفظ بنجاح',
        deleted: 'تم الحذف بنجاح',
        updated: 'تم التحديث بنجاح',
        created: 'تم الإنشاء بنجاح',
        sent: 'تم الإرسال بنجاح',
        copied: 'تم النسخ',
      },
      en: {
        saved: 'Saved successfully',
        deleted: 'Deleted successfully',
        updated: 'Updated successfully',
        created: 'Created successfully',
        sent: 'Sent successfully',
        copied: 'Copied to clipboard',
      },
    },
    error: {
      ar: {
        generic: 'حدث خطأ غير متوقع',
        network: 'خطأ في الاتصال',
        validation: 'يرجى التحقق من البيانات المدخلة',
        unauthorized: 'غير مصرح لك بهذا الإجراء',
        notFound: 'العنصر غير موجود',
        server: 'خطأ في الخادم',
      },
      en: {
        generic: 'An unexpected error occurred',
        network: 'Network error occurred',
        validation: 'Please check your input data',
        unauthorized: 'You are not authorized for this action',
        notFound: 'Item not found',
        server: 'Server error occurred',
      },
    },
    loading: {
      ar: {
        saving: 'جاري الحفظ...',
        loading: 'جاري التحميل...',
        deleting: 'جاري الحذف...',
        updating: 'جاري التحديث...',
        creating: 'جاري الإنشاء...',
        sending: 'جاري الإرسال...',
      },
      en: {
        saving: 'Saving...',
        loading: 'Loading...',
        deleting: 'Deleting...',
        updating: 'Updating...',
        creating: 'Creating...',
        sending: 'Sending...',
      },
    },
  },
};

// Helper function to get localized message
export function getToastMessage(
  type: keyof typeof showToast.i18n,
  key: string,
  lang: 'ar' | 'en' = 'ar'
): string {
  const messages = showToast.i18n[type][lang] as Record<string, string>;
  return messages[key] || messages.generic || 'Unknown message';
}

// Convenience functions for common operations
export const toastSuccess = (key: string, lang: 'ar' | 'en' = 'ar') => {
  showToast.success(getToastMessage('success', key, lang));
};

export const toastError = (key: string, lang: 'ar' | 'en' = 'ar') => {
  showToast.error(getToastMessage('error', key, lang));
};

export const toastLoading = (key: string, lang: 'ar' | 'en' = 'ar') => {
  return showToast.loading(getToastMessage('loading', key, lang));
};

// API operation helpers
export const apiToast = {
  promise: <T>(
    promise: Promise<T>,
    operation: string,
    lang: 'ar' | 'en' = 'ar'
  ) => {
    return showToast.promise(promise, {
      loading: getToastMessage('loading', operation, lang),
      success: getToastMessage('success', operation, lang),
      error: getToastMessage('error', 'generic', lang),
    });
  },
};
