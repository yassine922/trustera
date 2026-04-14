require('dotenv').config();
const jwt = require('jsonwebtoken');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

// ===== التحقق من متغيرات البيئة (Point 4) =====
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ Missing required env variable: ${key}`);
        process.exit(1);
    }
});
if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    process.exit(1);
}

// ===== إعداد Winston Logger (Point 3) =====
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log' })
    ]
});

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

// ===== إعدادات CORS المقيدة (Point 1) =====
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

const io = new Server(server, {
    cors: corsOptions
});

// إعداد Socket.io وإتاحته للـ Routes
app.set('io', io);

// ===== مصادقة Socket.io (Point 2) =====
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected via socket`);
    
    socket.on('join', (userId) => {
        if (socket.user.id !== userId && socket.user.role !== 'admin') {
            return socket.disconnect();
        }
        socket.join(userId);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.user.id} disconnected`);
    });
});

// Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Point 30: تقليل limit لحماية الـ RAM
app.use(mongoSanitize());
app.use(xss());

// ===== Rate Limiting (Point 6) =====
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts, please try again later'
});
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/auth/', authLimiter);
app.use('/api/', apiLimiter);

// ربط المسارات
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);

// ===== Health Check (Point 24) =====
app.get('/health', async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    try {
        await mongoose.connection.db.admin().ping();
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).json(healthcheck);
    }
});

// ===== معالج الأخطاء العام (Global Error Handler) =====
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'حدث خطأ غير متوقع في الخادم!' : err.message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// إعداد المنافذ
const PORT = process.env.PORT || 5000;

// ابدأ الاستماع للمنفذ فوراً لنجاح فحص Render
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

// ===== اتصال MongoDB مع Options (Point 5) =====
mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ MongoDB متصل بنجاح');
})
.catch(err => {
    console.error('❌ فشل الاتصال بـ MongoDB:', err);
    process.exit(1);
});
