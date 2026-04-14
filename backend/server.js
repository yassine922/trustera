require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const authRoutes = require('./auth').router;
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const notificationRoutes = require('./notifications'); 
const reviewRoutes = require('./reviews/index'); // التأكد من المسار الكامل للراوت

// تأكد أنك تستورد نماذج Mongoose لكي يتم تسجيلها قبل أي استعلامات
require('./auth/User'); // تصحيح المسار لتسجيل الموديل
require('./products/Product');
require('./Review');
require('./Order'); // يشير إلى backend/Order.js
require('./Notification'); 


const app = express();
const server = http.createServer(app);

if (!process.env.MONGODB_URI) {
    console.error('❌ خطأ: MONGODB_URI غير معرف في متغيرات البيئة!');
}

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }
});

// إعداد Socket.io وإتاحته للـ Routes
app.set('io', io);

io.on('connection', (socket) => {
    console.log('مستخدم متصل:', socket.id);
    
    // يمكن هنا إضافة منطق المصادقة للـ Socket.io (مثال: التحقق من التوكن)
    // if (!socket.handshake.auth || !socket.handshake.auth.token) {
    //     console.log('Socket: توكن غير موجود');
    //     socket.disconnect(true);
    //     return;
    // }
    // try {
    //     const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
    //     socket.user = decoded; // تخزين معلومات المستخدم في كائن الـ socket
    //     console.log(`Socket: المستخدم ${socket.user.id} مصادق`);
    // } catch (err) {
    //     console.log('Socket: توكن غير صالح');
    //     socket.disconnect(true);
    //     return;
    // }


    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`المستخدم ${userId} انضم لغرفته الخاصة`);
    });

    socket.on('disconnect', () => {
        console.log('انقطع الاتصال');
    });
});

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // أضف رابط Vercel في متغيرات البيئة لاحقاً
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: '5mb' })); // لدعم صور Base64

// ربط المسارات
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);

// ===== معالج الأخطاء العام (Global Error Handler) =====
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: 'حدث خطأ غير متوقع في الخادم!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined // عرض تفاصيل الخطأ في وضع التطوير فقط
    });
});

// إعداد المنافذ
const PORT = process.env.PORT || 5000;

// ابدأ الاستماع للمنفذ فوراً لنجاح فحص Render
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

// الاتصال بقاعدة البيانات بشكل منفصل
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB متصل بنجاح');
    })
    .catch(err => {
        console.error('❌ فشل الاتصال بـ MongoDB:', err);
    });
