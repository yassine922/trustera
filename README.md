# 🛍️ Trustera - Premium E-Commerce Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node Version](https://img.shields.io/badge/Node-%3E%3D18.0.0-brightgreen.svg)
![Platform](https://img.shields.io/badge/Platform-Desktop%20%26%20Mobile-orange.svg)

**Trustera** هي منصة تجارة إلكترونية متكاملة تم بناؤها باستخدام تقنيات MERN الحديثة. تهدف المنصة إلى توفير تجربة تسوق آمنة وسلسة في السوق الجزائري، مع دعم كامل للبائعين والمشترين ونظام إداري قوي.

---

## ✨ المميزات الرئيسية (Core Features)

### 👤 للمستخدمين (Buyers & Sellers)
- **نظام مصادقة متطور**: حماية بكلمات مرور مشفرة (Bcrypt) وتوكن (JWT).
- **لوحة تحكم البائع**: واجهة مخصصة لإدارة المخزون، تتبع المبيعات، واستلام الإشعارات الفورية.
- **إشعارات حية**: تنبيهات فورية باستخدام **Socket.io** عند استلام طلبات جديدة.
- **نظام تقييمات**: مصداقية عالية عبر نظام مراجعات يمنع التقييم المتكرر.

### ⚙️ تقنياً (Technical Highlights)
- **بحث متقدم**: فلترة المنتجات حسب السعر، التقييم، القسم، والحالة.
- **تصميم متجاوب**: واجهة مستخدم عصرية باستخدام **Tailwind CSS** و **Radix UI**.
- **تأمين البيانات**: Middleware للتحقق من الصلاحيات (Admin, Seller, Buyer).
- **إدارة الحالة**: استخدام React Context API لإدارة السلة والمفضلة بكفاءة.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

| Frontend | Backend | Database | Infrastructure |
| :--- | :--- | :--- | :--- |
| React 18 / Vite | Node.js | MongoDB Atlas | Render / Vercel |
| Tailwind CSS | Express.js | Mongoose ODM | GitHub Actions |
| Wouter (Routing) | Socket.io | - | Dotenv (Security) |

---

## 📂 هيكل المشروع (Project Structure)

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
