/**
 * Seller Service Module
 * يتعامل مع جميع العمليات المتعلقة بالبائعين
 * - تسجيل بائع جديد
 * - جلب بيانات البائع
 * - تحديث معلومات المتجر
 */

import { apiCall } from './apiService';

export interface SellerData {
  id?: string;
  storeName: string;
  fullName: string;
  phone: string;
  email: string;
  category: string;
  password?: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  sales: string;
  responseRate: number;
  verified: boolean;
}

/**
 * تسجيل بائع جديد على المنصة
 */
export async function registerSeller(sellerData: SellerData) {
  try {
    const result = await apiCall('/sellers/register', 'POST', sellerData);
    if (result.success) {
      localStorage.setItem('seller_token', result.token);
      localStorage.setItem('seller_profile', JSON.stringify(result.seller));
    }
    return result;
  } catch (error) {
    console.error('خطأ في تسجيل البائع:', error);
    throw error;
  }
}

/**
 * جلب بيانات البائع من الخادم
 */
export async function getSellerProfile(sellerId: string) {
  try {
    const result = await apiCall(`/sellers/${sellerId}`, 'GET');
    return result.data as SellerProfile;
  } catch (error) {
    console.error('خطأ في جلب بيانات البائع:', error);
    throw error;
  }
}

/**
 * تحديث معلومات متجر البائع
 */
export async function updateSellerStore(storeData: Partial<SellerData>) {
  try {
    const result = await apiCall('/sellers/store', 'PUT', storeData);
    if (result.success) {
      localStorage.setItem('seller_profile', JSON.stringify(result.seller));
    }
    return result;
  } catch (error) {
    console.error('خطأ في تحديث متجر البائع:', error);
    throw error;
  }
}

/**
 * جلب قائمة أفضل البائعين
 */
export async function getTopSellers(limit: number = 6) {
  try {
    const result = await apiCall(`/sellers/top?limit=${limit}`, 'GET');
    return result.data as SellerProfile[];
  } catch (error) {
    console.error('خطأ في جلب أفضل البائعين:', error);
    return [];
  }
}

/**
 * التحقق من توثيق البائع
 */
export async function verifySeller(sellerId: string) {
  try {
    const result = await apiCall(`/sellers/${sellerId}/verify`, 'POST');
    return result.success;
  } catch (error) {
    console.error('خطأ في توثيق البائع:', error);
    return false;
  }
}

/**
 * الحصول على إحصائيات البائع
 */
export async function getSellerStats(sellerId: string) {
  try {
    const result = await apiCall(`/sellers/${sellerId}/stats`, 'GET');
    return result.data;
  } catch (error) {
    console.error('خطأ في جلب إحصائيات البائع:', error);
    return null;
  }
}
