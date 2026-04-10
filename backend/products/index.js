const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    sellerId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// جلب جميع المنتجات
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب المنتجات', error: error.message });
    }
});

// جلب منتج واحد
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب المنتج', error: error.message });
    }
});

// إضافة منتج
router.post('/', async (req, res) => {
    try {
        const { name, price, description, sellerId } = req.body;
        if (!name || !price || !description || !sellerId) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }
        const product = await Product.create({ name, price, description, sellerId });
        res.status(201).json({ success: true, message: 'تم إضافة المنتج بنجاح', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في إضافة المنتج', error: error.message });
    }
});

// تحديث منتج
router.put('/:id', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description, updatedAt: new Date() },
            { new: true }
        );
        if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
        res.json({ success: true, message: 'تم تحديث المنتج بنجاح', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في تحديث المنتج', error: error.message });
    }
});

// حذف منتج
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
        res.json({ success: true, message: 'تم حذف المنتج بنجاح', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في حذف المنتج', error: error.message });
    }
});

module.exports = router;