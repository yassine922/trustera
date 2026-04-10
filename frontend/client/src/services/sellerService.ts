const API_URL = import.meta.env.VITE_API_URL || '';

export interface SellerFormData {
  storeName: string;
  fullName: string;
  phone: string;
  email: string;
  category: string;
  password: string;
}

export async function registerSeller(data: SellerFormData): Promise<{ success: boolean; message?: string }> {
  if (!API_URL) {
    // محاكاة للتطوير
    await new Promise(r => setTimeout(r, 1000));
    if (!data.email.includes('@')) return { success: false, message: 'البريد الإلكتروني غير صحيح' };
    return { success: true };
  }
  try {
    const res = await fetch(`${API_URL}/api/sellers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'خطأ في الاتصال بالخادم' };
  }
}
