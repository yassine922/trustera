const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('./User'); // التأكد من أن المسار نسبي للمجلد الحالي

// Point 8: Joi validation schema
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    role: Joi.string().valid('buyer', 'seller').default('buyer')
});

// ===== تسجيل مستخدم جديد =====
router.post('/register', async (req, res) => {
    try {
        // Validation logic
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role: role || 'buyer' });

        // Generate token on register
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d', issuer: 'trustera', audience: 'trustera-client' }
        );

        res.status(201).json({ success: true, message: 'تم التسجيل بنجاح', token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'خطأ في التسجيل', error: error.message });
    }
});

// ===== تسجيل الدخول =====
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d', issuer: 'trustera', audience: 'trustera-client' }
        );
        res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'خطأ في تسجيل الدخول', error: error.message });
    }
});

// ===== Middleware التحقق من التوكن =====
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader === 'Bearer null') {
        return res.status(401).json({ success: false, message: 'غير مصرح: لا يوجد توكن' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // تخزين معلومات المستخدم في كائن الطلب
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ success: false, message: 'غير مصرح: توكن غير صالح أو منتهي الصلاحية' });
    }
}

// ===== Middleware التحقق الاختياري من التوكن (للمسارات العامة) =====
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader !== 'Bearer null') {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // تجاهل الخطأ في حالة التوكن الاختياري أو المنتهي
        }
    }
    next();
}

// ===== Middleware التحقق من صلاحيات المدير (Admin) =====
function adminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'الوصول مرفوض: يجب أن تكون مديراً للوصول إلى هذه البيانات' });
    }
}

// ===== جلب جميع المستخدمين (للمدير فقط) =====
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // لا ترجع كلمة المرور
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'خطأ في جلب المستخدمين', error: error.message });
    }
});

// ===== جلب معلومات المستخدم الحالي (للمصادقة) =====
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });
        if (!user) {
            return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ success: false, message: 'خطأ في جلب معلومات المستخدم', error: error.message });
    }
});

module.exports = { router, authMiddleware, adminMiddleware, optionalAuth };
