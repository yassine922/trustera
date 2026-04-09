# هيكل مشروع Trustera Split

## نظرة عامة
مشروع تقسيم منصة ترسترا إلى أقسام منظمة (بائع، مدير، مشتري، API) مع فصل الخدمات والمكونات.

## بنية المسارات

```
client/src/
├── services/
│   ├── apiService.ts          # خدمة API المركزية
│   ├── sellerService.ts       # خدمات البائع
│   ├── buyerService.ts        # خدمات المشتري
│   └── managerService.ts      # خدمات المدير
│
├── components/
│   ├── seller/
│   │   ├── SellerRegistrationForm.tsx  # نموذج تسجيل البائع
│   │   └── SellerCard.tsx              # بطاقة عرض البائع
│   │
│   ├── buyer/
│   │   └── ShoppingCart.tsx            # مكون سلة المشتريات
│   │
│   ├── manager/
│   │   └── StatsDashboard.tsx          # لوحة الإحصائيات
│   │
│   └── ui/                             # مكونات shadcn/ui الأساسية
│
├── pages/
│   ├── Home.tsx                        # الصفحة الرئيسية
│   ├── SellerRegister.tsx              # صفحة تسجيل البائع
│   ├── BuyerCheckout.tsx               # صفحة الدفع
│   └── ManagerDashboard.tsx            # صفحة لوحة المدير
│
├── contexts/
│   └── ThemeContext.tsx                # سياق المظهر
│
├── lib/
│   └── utils.ts                        # دوال مساعدة عامة
│
├── App.tsx                             # التطبيق الرئيسي والتوجيه
├── main.tsx                            # نقطة الدخول
└── index.css                           # الأنماط العامة
```

## الخدمات (Services)

### 1. API Service (`apiService.ts`)
**الوظيفة:** مركز التعامل مع جميع طلبات الخادم
- `apiCall()` - دالة مركزية لكل الطلبات
- `fetchData()` - جلب البيانات
- `sendData()` - إرسال البيانات
- `deleteData()` - حذف البيانات

**الاستخدام:**
```typescript
import { apiCall, fetchData, sendData } from '@/services/apiService';

// جلب البيانات
const data = await fetchData('/products');

// إرسال البيانات
await sendData('/orders', orderData, 'POST');
```

### 2. Seller Service (`sellerService.ts`)
**الوظيفة:** إدارة جميع عمليات البائعين
- `registerSeller()` - تسجيل بائع جديد
- `getSellerProfile()` - جلب بيانات البائع
- `updateSellerStore()` - تحديث متجر البائع
- `getTopSellers()` - جلب أفضل البائعين
- `verifySeller()` - توثيق البائع
- `getSellerStats()` - إحصائيات البائع

**الاستخدام:**
```typescript
import { registerSeller, getTopSellers } from '@/services/sellerService';

// تسجيل بائع
const result = await registerSeller({
  storeName: 'متجري',
  fullName: 'أحمد',
  phone: '06XXXXXXXX',
  email: 'seller@example.com',
  category: 'electronics',
  password: 'password123'
});

// جلب أفضل البائعين
const topSellers = await getTopSellers(6);
```

### 3. Buyer Service (`buyerService.ts`)
**الوظيفة:** إدارة جميع عمليات المشتري
- `createOrder()` - إنشاء طلب شراء
- `getBuyerOrders()` - جلب طلبات المشتري
- `trackOrder()` - تتبع الطلب
- `addToWishlist()` - إضافة للمفضلة
- `getWishlist()` - جلب المفضلة
- `addProductReview()` - إضافة تقييم

**الاستخدام:**
```typescript
import { createOrder, getBuyerOrders, trackOrder } from '@/services/buyerService';

// إنشاء طلب
const order = await createOrder({
  items: cartItems,
  deliveryAddress: 'العنوان',
  paymentMethod: 'cash'
});

// تتبع الطلب
const tracking = await trackOrder('TRS-2025-001');
```

### 4. Manager Service (`managerService.ts`)
**الوظيفة:** إدارة العمليات الإدارية والمراقبة
- `getPlatformStats()` - إحصائيات المنصة
- `trackOrderAdmin()` - تتبع الطلب (للمدير)
- `getAdminNotifications()` - الإشعارات الإدارية
- `updateOrderStatus()` - تحديث حالة الطلب
- `sendSupportMessage()` - إرسال رسالة دعم

**الاستخدام:**
```typescript
import { getPlatformStats, getAdminNotifications } from '@/services/managerService';

// جلب الإحصائيات
const stats = await getPlatformStats();

// جلب الإشعارات
const notifications = await getAdminNotifications();
```

## المكونات (Components)

### مكونات البائع
- **SellerRegistrationForm** - نموذج تسجيل البائع
- **SellerCard** - بطاقة عرض بيانات البائع

### مكونات المشتري
- **ShoppingCart** - سلة المشتريات مع التحكم بالكميات

### مكونات المدير
- **StatsDashboard** - لوحة الإحصائيات الرئيسية

## نقاط النهاية (API Endpoints)

### المصادقة
- `POST /auth/login` - تسجيل الدخول
- `POST /auth/register` - إنشاء حساب جديد

### البائعين
- `POST /sellers/register` - تسجيل بائع جديد
- `GET /sellers/:id` - جلب بيانات البائع
- `PUT /sellers/store` - تحديث متجر البائع
- `GET /sellers/top?limit=6` - أفضل البائعين
- `POST /sellers/:id/verify` - توثيق البائع
- `GET /sellers/:id/stats` - إحصائيات البائع

### المشترين والطلبات
- `POST /orders` - إنشاء طلب جديد
- `GET /orders/my-orders` - طلبات المشتري
- `GET /orders/:id` - تفاصيل الطلب
- `GET /orders/track/:orderNumber` - تتبع الطلب
- `POST /wishlist` - إضافة للمفضلة
- `GET /wishlist` - جلب المفضلة
- `DELETE /wishlist/:productId` - حذف من المفضلة

### الإدارة
- `GET /admin/stats` - إحصائيات المنصة
- `GET /admin/orders/pending` - الطلبات المعلقة
- `GET /admin/orders/active` - الطلبات النشطة
- `PUT /admin/orders/:orderNumber/status` - تحديث حالة الطلب
- `GET /admin/notifications` - الإشعارات الإدارية

## تعليمات الاستخدام

### 1. إضافة مكون جديد
```typescript
// في components/seller/NewComponent.tsx
import { Button } from '@/components/ui/button';

export default function NewComponent() {
  return <div>المكون الجديد</div>;
}
```

### 2. استخدام خدمة في مكون
```typescript
import { useEffect, useState } from 'react';
import { getTopSellers } from '@/services/sellerService';

export default function TopSellersComponent() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    getTopSellers(6).then(setSellers);
  }, []);

  return (
    <div>
      {sellers.map(seller => (
        <div key={seller.id}>{seller.name}</div>
      ))}
    </div>
  );
}
```

### 3. معالجة الأخطاء
```typescript
try {
  const result = await registerSeller(formData);
  if (result.success) {
    // نجاح
  } else {
    // فشل
    console.error(result.message);
  }
} catch (error) {
  // خطأ في الاتصال
  console.error(error);
}
```

## متغيرات البيئة

أضف المتغيرات التالية في ملف `.env`:

```env
REACT_APP_API_URL=https://trustera-api.onrender.com/api
```

## الملاحظات المهمة

1. **التوكن:** يتم حفظ التوكن تلقائياً في `localStorage` بعد تسجيل الدخول
2. **الأخطاء:** جميع الأخطاء يتم معالجتها في `apiService` وتعيد رسائل خطأ واضحة
3. **التخزين المحلي:** يتم استخدام `localStorage` لحفظ البيانات المهمة
4. **إعادة المحاولة:** في حالة فشل الاتصال، يمكن إضافة آلية إعادة محاولة

## الخطوات التالية

1. إنشاء صفحات لكل قسم (Seller, Buyer, Manager)
2. دمج مكونات UI من shadcn/ui
3. إضافة معالجة الأخطاء والتحقق من الصحة
4. اختبار جميع الخدمات والمكونات
5. نشر التطبيق
