/**
 * API Service Module
 * مركز التعامل مع جميع طلبات الخادم
 * - إدارة الـ Tokens والمصادقة
 * - معالجة الأخطاء
 * - إعادة المحاولة التلقائية
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://trustera-api.onrender.com/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * دالة مركزية للتعامل مع جميع طلبات API
 */
export async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data: any = null
) {
  const options: ApiOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // إضافة التوكن إلى الطلب إذا كان موجوداً
  const token = localStorage.getItem('token') || localStorage.getItem('seller_token');
  if (token) {
    options.headers!['Authorization'] = `Bearer ${token}`;
  }

  // إضافة البيانات للطلب إذا كانت موجودة
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    // التعامل مع الأخطاء
    if (!response.ok) {
      if (response.status === 401) {
        // إذا انتهت الجلسة، قم بحذف التوكن
        localStorage.removeItem('token');
        localStorage.removeItem('seller_token');
        localStorage.removeItem('user');
        localStorage.removeItem('seller_profile');
        // إعادة توجيه المستخدم لصفحة تسجيل الدخول
        window.location.href = '/login';
      }
      throw new Error(result.message || `خطأ ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * دالة مساعدة لتحميل البيانات من API
 */
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const result = await apiCall(endpoint, 'GET');
    return result.data as T;
  } catch (error) {
    console.error(`خطأ في جلب البيانات من ${endpoint}:`, error);
    throw error;
  }
}

/**
 * دالة مساعدة لإرسال البيانات إلى API
 */
export async function sendData<T>(
  endpoint: string,
  data: any,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<T> {
  try {
    const result = await apiCall(endpoint, method, data);
    return result.data as T;
  } catch (error) {
    console.error(`خطأ في إرسال البيانات إلى ${endpoint}:`, error);
    throw error;
  }
}

/**
 * دالة مساعدة لحذف البيانات من API
 */
export async function deleteData(endpoint: string): Promise<boolean> {
  try {
    const result = await apiCall(endpoint, 'DELETE');
    return result.success;
  } catch (error) {
    console.error(`خطأ في حذف البيانات من ${endpoint}:`, error);
    throw error;
  }
}
