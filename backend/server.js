// ===== الخادم الرئيسي =====

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ===== الاتصال بـ MongoDB =====
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB متصل'))
    .catch(err => console.error('❌ خطأ في الاتصال:', err));

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== خدمة الملفات الثابتة =====
app.use(express.static('frontend'));

// ===== المسارات =====
app.use('/api/auth', require('./auth/index'));
app.use('/api/products', require('./products/index'));
app.use('/api/orders', require('./orders/index'));
app.use('/api/points', require('./points/index'));
app.use('/api/payments', require('./payments/index'));

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
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});