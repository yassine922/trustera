const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerId: { type: String, required: true },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentMethod: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// جلب جميع الطلبات
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب الطلبات', error: error.message });
    }
});

// جلب طلب واحد
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب الطلب', error: error.message });
    }
});

// إنشاء طلب
router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, buyerId } = req.body;
        if (!items || !totalAmount || !buyerId) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }
        const order = await Order.create({ buyerId, items, totalAmount });
        res.status(201).json({ success: true, message: 'تم إنشاء الطلب بنجاح', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في إنشاء الطلب', error: error.message });
    }
});

// تحديث طلب
router.put('/:id', async (req, res) => {
    try {
        const { status, paymentMethod } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, paymentMethod, updatedAt: new Date() },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
        res.json({ success: true, message: 'تم تحديث الطلب بنجاح', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في تحديث الطلب', error: error.message });
    }
});

// حذف طلب
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
        res.json({ success: true, message: 'تم حذف الطلب بنجاح', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في حذف الطلب', error: error.message });
    }
});

module.exports = router;