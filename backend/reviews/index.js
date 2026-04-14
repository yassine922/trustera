const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../Review'); // بناءً على server.js الملف في الجذر
const { authMiddleware } = require('../auth'); // تم التحديث (لإعادة استخدام Middleware)
const Product = require('../products/Product'); // بناءً على server.js الملف في مجلد المنتجات

// إضافة تقييم جديد للمنتج
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'يرجى إرسال التقييم والتعليق ومعرف المنتج' });
        }
        if (rating < 1 || rating > 5) { // إضافة تحقق على نطاق التقييم
            return res.status(400).json({ success: false, message: 'التقييم يجب أن يكون بين 1 و 5' });
        }

        // منع التقييم المتكرر من نفس المستخدم لنفس المنتج
        const existingReview = await Review.findOne({ productId, buyerId: req.user.id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'لقد قمت بتقييم هذا المنتج مسبقاً' });
        }

        const review = await Review.create({
            productId,
            buyerId: req.user.id,
            rating,
            comment
        });

        // تحديث إحصائيات التقييم في موديل المنتج
        const allReviews = await Review.find({ productId });
        const count = allReviews.length;
        const avg = allReviews.reduce((sum, item) => sum + item.rating, 0) / count;

        await Product.findByIdAndUpdate(productId, {
            averageRating: avg.toFixed(1),
            reviewsCount: count
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في إضافة التقييم', error: error.message });
    }
});

// جلب جميع تقييمات منتج معين مع بيانات المشتري
router.get('/product/:productId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
            return res.status(400).json({ success: false, message: 'معرف منتج غير صحيح' });
        }
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('buyerId', 'name') // جلب اسم المشتري فقط من موديل المستخدم
            .sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب التقييمات', error: error.message });
    }
});

module.exports = router;