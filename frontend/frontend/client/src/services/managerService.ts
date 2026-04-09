/**
 * Manager Service Module
 * يتعامل مع العمليات الإدارية والمراقبة
 * - إحصائيات المنصة
 * - تتبع الطلبات
 * - إدارة المستخدمين
 * - الإشعارات والدعم
 */

import { apiCall } from './apiService';

export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  pendingOrders: number;
}

export interface OrderTracking {
  orderNumber: string;
  status: 'received' | 'processing' | 'shipped' | 'delivered';
  currentLocation?: string;
  estimatedDelivery?: string;
  timeline: {
    received: string;
    processing?: string;
    shipped?: string;
    delivered?: string;
  };
}

export interface PlatformNotification {
  id: string;
  type: 'order' | 'seller' | 'buyer' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/**
 * جلب إحصائيات المنصة العامة
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const result = await apiCall('/admin/stats', 'GET');
    return result.data as PlatformStats;
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return {
      totalUsers: 0,
      totalSellers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeOrders: 0,
      pendingOrders: 0,
    };
  }
}

/**
 * تتبع حالة الطلب (للمدير)
 */
export async function trackOrderAdmin(orderNumber: string): Promise<OrderTracking | null> {
  try {
    const result = await apiCall(`/admin/orders/track/${orderNumber}`, 'GET');
    return result.data as OrderTracking;
  } catch (error) {
    console.error('خطأ في تتبع الطلب:', error);
    return null;
  }
}

/**
 * جلب الإشعارات الإدارية
 */
export async function getAdminNotifications(): Promise<PlatformNotification[]> {
  try {
    const result = await apiCall('/admin/notifications', 'GET');
    return result.data as PlatformNotification[];
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    return [];
  }
}

/**
 * تحديث حالة الإشعار
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const result = await apiCall(`/admin/notifications/${notificationId}/read`, 'PUT');
    return result.success;
  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error);
    return false;
  }
}

/**
 * جلب قائمة الطلبات المعلقة
 */
export async function getPendingOrders() {
  try {
    const result = await apiCall('/admin/orders/pending', 'GET');
    return result.data;
  } catch (error) {
    console.error('خطأ في جلب الطلبات المعلقة:', error);
    return [];
  }
}

/**
 * جلب قائمة الطلبات النشطة
 */
export async function getActiveOrders() {
  try {
    const result = await apiCall('/admin/orders/active', 'GET');
    return result.data;
  } catch (error) {
    console.error('خطأ في جلب الطلبات النشطة:', error);
    return [];
  }
}

/**
 * تحديث حالة الطلب (للمدير)
 */
export async function updateOrderStatus(
  orderNumber: string,
  status: 'processing' | 'shipped' | 'delivered'
): Promise<boolean> {
  try {
    const result = await apiCall(`/admin/orders/${orderNumber}/status`, 'PUT', { status });
    return result.success;
  } catch (error) {
    console.error('خطأ في تحديث حالة الطلب:', error);
    return false;
  }
}

/**
 * إرسال رسالة دعم فني
 */
export async function sendSupportMessage(message: {
  subject: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
}): Promise<boolean> {
  try {
    const result = await apiCall('/support/messages', 'POST', message);
    return result.success;
  } catch (error) {
    console.error('خطأ في إرسال رسالة الدعم:', error);
    return false;
  }
}

/**
 * جلب رسائل الدعم الفني
 */
export async function getSupportMessages() {
  try {
    const result = await apiCall('/support/messages', 'GET');
    return result.data;
  } catch (error) {
    console.error('خطأ في جلب رسائل الدعم:', error);
    return [];
  }
}

/**
 * إغلاق تذكرة دعم فني
 */
export async function closeSupportTicket(ticketId: string): Promise<boolean> {
  try {
    const result = await apiCall(`/support/tickets/${ticketId}/close`, 'PUT');
    return result.success;
  } catch (error) {
    console.error('خطأ في إغلاق التذكرة:', error);
    return false;
  }
}
