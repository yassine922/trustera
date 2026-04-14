const express = require('express');
const router = express.Router();
const Review = mongoose.models.Review || require('./Review'); 
const { authMiddleware } = require('../auth/index');
const Product = require('./products/Product'); 

// إضافة تقييم جديد للمنتج
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'يرجى إرسال التقييم والتعليق ومعرف المنتج' });
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
        res.status(500).json({ success: false, message: 'خطأ في إضافة التقييم' });
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
        res.status(500).json({ success: false, message: 'خطأ في جلب التقييمات' });
    }
});

module.exports = router;