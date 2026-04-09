// ===== API المصادقة =====

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// مسار ملف المستخدمين
const usersFile = path.join(__dirname, '../../database/users.json');

// قراءة المستخدمين من الملف
function readUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// حفظ المستخدمين في الملف
function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// التسجيل
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // التحقق من البيانات
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const users = readUsers();

        // التحقق من وجود المستخدم
        if (users.find(u => u.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني موجود بالفعل'
            });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء مستخدم جديد
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date()
        };

        users.push(newUser);
        writeUsers(users);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: {
                id: newUser.id,
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

// تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // التحقق من البيانات
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني وكلمة المرور مطلوبة'
            });
        }

        const users = readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        // التحقق من كلمة المرور
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        // إنشاء التوكن
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user.id,
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
