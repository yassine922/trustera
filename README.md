# Trustera - منصة التجارة الإلكترونية

منصة تجارة إلكترونية حديثة تربط بين المشترين والبائعين بطريقة آمنة وموثوقة.

## المميزات الرئيسية

- **نظام المصادقة**: تسجيل دخول وتسجيل آمن للمشترين والبائعين
- **إدارة المنتجات**: إضافة وتعديل وحذف المنتجات
- **نظام الطلبات**: إنشاء وتتبع الطلبات
- **نظام النقاط**: جمع واستخدام نقاط المكافآت
- **خيارات الدفع**: دفع عبر البطاقة (CIB) أو عند الاستلام (COD)

## البنية

```
trustera/
├── frontend/          # الواجهة الأمامية (HTML, CSS, JavaScript)
├── backend/           # الخادم (Node.js, Express)
├── database/          # قاعدة البيانات (ملفات JSON مؤقتاً)
└── package.json       # المكتبات والتبعيات
```

## المتطلبات

- Node.js (v14 أو أحدث)
- npm أو yarn

## التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd trustera
```

2. تثبيت المكتبات:
```bash
npm install
```

3. إنشاء ملف `.env`:
```bash
cp .env.example .env
```

4. بدء الخادم:
```bash
npm start
```

أو للتطوير مع تحديث تلقائي:
```bash
npm run dev
```

## الاستخدام

### الواجهة الأمامية

افتح المتصفح وانتقل إلى:
```
http://localhost:3000/frontend/index.html
```

### الخادم

الخادم يعمل على:
```
http://localhost:5000
```

## API المسارات

### المصادقة
- `POST /api/auth/register` - التسجيل
- `POST /api/auth/login` - تسجيل الدخول

### المنتجات
- `GET /api/products` - جلب جميع المنتجات
- `GET /api/products/:id` - جلب منتج واحد
- `POST /api/products` - إضافة منتج
- `PUT /api/products/:id` - تحديث منتج
- `DELETE /api/products/:id` - حذف منتج

### الطلبات
- `GET /api/orders` - جلب جميع الطلبات
- `GET /api/orders/:id` - جلب طلب واحد
- `POST /api/orders` - إنشاء طلب
- `PUT /api/orders/:id` - تحديث الطلب

### النقاط
- `GET /api/points` - جلب النقاط
- `POST /api/points/add` - إضافة نقاط
- `POST /api/points/use` - استخدام نقاط

### الدفع
- `POST /api/payments/cib` - الدفع عبر CIB
- `POST /api/payments/cod` - الدفع عند الاستلام

## الخطوات التالية

1. **الانتقال إلى MongoDB**: استبدال ملفات JSON بـ MongoDB
2. **إضافة Mongoose**: لإدارة أفضل للبيانات
3. **تحسين الأمان**: إضافة Helmet و Rate Limiting
4. **إضافة الاختبارات**: Unit Tests و Integration Tests
5. **التوثيق**: توثيق API باستخدام Swagger

## الترخيص

MIT License

## الدعم

للمساعدة والدعم، يرجى فتح issue في المستودع.
