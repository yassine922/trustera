const API_URL = import.meta.env.VITE_API_URL || '';

export interface SellerProfile {
  id: string;
  storeName: string;
  name: string;
  fullName: string;
  phone: string;
  email: string;
  category: string;
  rating: number;
  reviews: number;
  sales: number;
  responseRate: number;
  reviewCount?: number;
  totalSales?: number;
  joinDate?: string;
  avatar?: string;
  verified?: boolean;
}

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
