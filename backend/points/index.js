const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const pointSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    type: { type: String, enum: ['add', 'use'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Point = mongoose.model('Point', pointSchema);

// جلب النقاط
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, message: 'معرف المستخدم مطلوب' });

        const transactions = await Point.find({ userId });
        const totalPoints = transactions.reduce((total, t) => total + t.amount, 0);

        res.json({ success: true, data: { totalPoints, transactions } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب النقاط', error: error.message });
    }
});

// إضافة نقاط
router.post('/add', async (req, res) => {
    try {
        const { userId, amount, reason } = req.body;
        if (!userId || !amount || !reason) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }
        const transaction = await Point.create({ userId, amount: parseInt(amount), reason, type: 'add' });
        const transactions = await Point.find({ userId });
        const totalPoints = transactions.reduce((total, t) => total + t.amount, 0);

        res.status(201).json({ success: true, message: 'تم إضافة النقاط بنجاح', data: { transaction, totalPoints } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في إضافة النقاط', error: error.message });
    }
});

// استخدام نقاط
router.post('/use', async (req, res) => {
    try {
        const { userId, amount, reason } = req.body;
        if (!userId || !amount || !reason) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }

        const transactions = await Point.find({ userId });
        const currentPoints = transactions.reduce((total, t) => total + t.amount, 0);

        if (currentPoints < amount) {
            return res.status(400).json({ success: false, message: 'النقاط المتاحة غير كافية' });
        }

        const transaction = await Point.create({ userId, amount: -parseInt(amount), reason, type: 'use' });
        const updatedTransactions = await Point.find({ userId });
        const totalPoints = updatedTransactions.reduce((total, t) => total + t.amount, 0);

        res.status(201).json({ success: true, message: 'تم استخدام النقاط بنجاح', data: { transaction, totalPoints } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في استخدام النقاط', error: error.message });
    }
});

module.exports = router;