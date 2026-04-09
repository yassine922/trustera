/**
 * Buyer Service Module
 * يتعامل مع جميع العمليات المتعلقة بالمشترين
 * - إدارة السلة
 * - إنشاء الطلبات
 * - إدارة المفضلة
 * - تتبع الطلبات
 */

import { apiCall } from './apiService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  deliveryAddress: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  addedAt: string;
}

/**
 * إنشاء طلب شراء جديد
 */
export async function createOrder(orderData: {
  items: CartItem[];
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
}) {
  try {
    const result = await apiCall('/orders', 'POST', orderData);
    if (result.success) {
      // حفظ رقم الطلب في localStorage
      localStorage.setItem('last_order_number', result.data.orderNumber);
    }
    return result;
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    throw error;
  }
}

/**
 * جلب الطلبات السابقة للمشتري
 */
export async function getBuyerOrders() {
  try {
    const result = await apiCall('/orders/my-orders', 'GET');
    return result.data as Order[];
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return [];
  }
}

/**
 * جلب تفاصيل طلب معين
 */
export async function getOrderDetails(orderId: string) {
  try {
    const result = await apiCall(`/orders/${orderId}`, 'GET');
    return result.data as Order;
  } catch (error) {
    console.error('خطأ في جلب تفاصيل الطلب:', error);
    return null;
  }
}

/**
 * تتبع حالة الطلب
 */
export async function trackOrder(orderNumber: string) {
  try {
    const result = await apiCall(`/orders/track/${orderNumber}`, 'GET');
    return result.data;
  } catch (error) {
    console.error('خطأ في تتبع الطلب:', error);
    return null;
  }
}

/**
 * إضافة منتج للمفضلة
 */
export async function addToWishlist(productId: string) {
  try {
    const result = await apiCall('/wishlist', 'POST', { productId });
    return result.success;
  } catch (error) {
    console.error('خطأ في إضافة المنتج للمفضلة:', error);
    return false;
  }
}

/**
 * حذف منتج من المفضلة
 */
export async function removeFromWishlist(productId: string) {
  try {
    const result = await apiCall(`/wishlist/${productId}`, 'DELETE');
    return result.success;
  } catch (error) {
    console.error('خطأ في حذف المنتج من المفضلة:', error);
    return false;
  }
}

/**
 * جلب قائمة المفضلة
 */
export async function getWishlist() {
  try {
    const result = await apiCall('/wishlist', 'GET');
    return result.data as WishlistItem[];
  } catch (error) {
    console.error('خطأ في جلب المفضلة:', error);
    return [];
  }
}

/**
 * إضافة تقييم للمنتج
 */
export async function addProductReview(productId: string, reviewData: {
  rating: number;
  text: string;
}) {
  try {
    const result = await apiCall(`/products/${productId}/reviews`, 'POST', reviewData);
    return result.success;
  } catch (error) {
    console.error('خطأ في إضافة التقييم:', error);
    return false;
  }
}

/**
 * تحديث عنوان التوصيل
 */
export async function updateDeliveryAddress(addressData: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}) {
  try {
    const result = await apiCall('/buyer/addresses', 'PUT', addressData);
    return result.success;
  } catch (error) {
    console.error('خطأ في تحديث العنوان:', error);
    return false;
  }
}

/**
 * الحصول على عناوين التوصيل المحفوظة
 */
export async function getDeliveryAddresses() {
  try {
    const result = await apiCall('/buyer/addresses', 'GET');
    return result.data;
  } catch (error) {
    console.error('خطأ في جلب العناوين:', error);
    return [];
  }
}
