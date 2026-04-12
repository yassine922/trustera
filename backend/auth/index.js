const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// ===== موديل المستخدم =====
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ===== التسجيل =====
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        // التحقق من وجود المستخدم
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني موجود بالفعل'
            });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء مستخدم جديد
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في التسجيل',
            error: error.message
        });
    }
});

// ===== تسجيل الدخول =====
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني وكلمة المرور مطلوبة'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في تسجيل الدخول',
            error: error.message
        });
    }
});

module.exports = router;
// ===== Middleware التحقق من التوكن =====
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'غير مصرح' });
    }
    try {
        const decoded = require('jsonwebtoken').verify(
            auth.split(' ')[1],
            process.env.JWT_SECRET || 'your-secret-key'
        );
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'توكن غير صالح' });
    }
}

// ===== جلب جميع المستخدمين (للمدير فقط) =====
router.get('/users', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'غير مصرح' });
        }
        const users = await User.find({}, { password: 0 });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب المستخدمين', error: error.message });
    }
});

// ===== جلب بيانات المستخدم الحالي =====
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });
        if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ', error: error.message });
    }
});
