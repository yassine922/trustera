// ===== الخادم الرئيسي =====

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
// ===== خدمة الملفات الثابتة =====
app.use(express.static('frontend'));
// ===== المسارات =====

// مسارات المصادقة
const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

// مسارات المنتجات
const productRoutes = require('./products');
app.use('/api/products', productRoutes);

// مسارات الطلبات
const orderRoutes = require('./orders');
app.use('/api/orders', orderRoutes);

// مسارات النقاط
const pointsRoutes = require('./points');
app.use('/api/points', pointsRoutes);

// مسارات الدفع
const paymentRoutes = require('./payments');
app.use('/api/payments', paymentRoutes);

// ===== معالج الأخطاء =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ===== بدء الخادم =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
