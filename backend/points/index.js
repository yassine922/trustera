// ===== API النقاط =====

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// مسار ملف معاملات النقاط
const pointsFile = path.join(__dirname, '../../database/points_transactions.json');

// قراءة معاملات النقاط من الملف
function readPoints() {
    try {
        const data = fs.readFileSync(pointsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// حفظ معاملات النقاط في الملف
function writePoints(points) {
    fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

// حساب إجمالي النقاط للمستخدم
function getUserPoints(userId) {
    const transactions = readPoints();
    return transactions
        .filter(t => t.userId === userId)
        .reduce((total, t) => total + t.amount, 0);
}

// الحصول على النقاط
router.get('/', (req, res) => {
    try {
        const userId = req.query.userId;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'معرف المستخدم مطلوب'
            });
        }

        const points = getUserPoints(userId);
        const transactions = readPoints().filter(t => t.userId === userId);

        res.json({
            success: true,
            data: {
                totalPoints: points,
                transactions: transactions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب النقاط',
            error: error.message
        });
    }
});

// إضافة نقاط
router.post('/add', (req, res) => {
    try {
        const { userId, amount, reason } = req.body;

        // التحقق من البيانات
        if (!userId || !amount || !reason) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const transactions = readPoints();

        const newTransaction = {
            id: Date.now().toString(),
            userId,
            amount: parseInt(amount),
            reason,
            type: 'add',
            createdAt: new Date()
        };

        transactions.push(newTransaction);
        writePoints(transactions);

        const totalPoints = getUserPoints(userId);

        res.status(201).json({
            success: true,
            message: 'تم إضافة النقاط بنجاح',
            data: {
                transaction: newTransaction,
                totalPoints: totalPoints
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في إضافة النقاط',
            error: error.message
        });
    }
});

// استخدام النقاط
router.post('/use', (req, res) => {
    try {
        const { userId, amount, reason } = req.body;

        // التحقق من البيانات
        if (!userId || !amount || !reason) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const currentPoints = getUserPoints(userId);

        if (currentPoints < amount) {
            return res.status(400).json({
                success: false,
                message: 'النقاط المتاحة غير كافية'
            });
        }

        const transactions = readPoints();

        const newTransaction = {
            id: Date.now().toString(),
            userId,
            amount: -parseInt(amount),
            reason,
            type: 'use',
            createdAt: new Date()
        };

        transactions.push(newTransaction);
        writePoints(transactions);

        const totalPoints = getUserPoints(userId);

        res.status(201).json({
            success: true,
            message: 'تم استخدام النقاط بنجاح',
            data: {
                transaction: newTransaction,
                totalPoints: totalPoints
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في استخدام النقاط',
            error: error.message
        });
    }
});

module.exports = router;
