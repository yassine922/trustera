const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./Product'); // تصحيح المسار: الملف في نفس المجلد
const { authMiddleware, adminMiddleware, optionalAuth } = require('../auth'); // تم التحديث
const User = require('../auth/User'); // تصحيح المسار: الملف موجود في مجلد auth وليس models

// 1. جلب منتجات البائع الحالي فقط (تأمين كامل)
router.get('/my-products', authMiddleware, async (req, res) => {
    try {
        // نعتمد على معرف المستخدم المستخرج من التوكن وليس المرسل من المتصفح
        const products = await Product.find({ sellerId: req.user.id });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب منتجاتك', error: error.message });
    }
});

// 6. البحث المتقدم (Advanced Search)
router.get('/search', optionalAuth, async (req, res) => {
    try {
        const { q, minPrice, maxPrice, minRating, category, status } = req.query;
        const isAdmin = req.user && req.user.role === 'admin'; // ملاحظة: هذا يتطلب وجود middleware قبل المسار لفك التوكن
        
        let query = {};
        // إذا لم يكن مديراً، يرى المنتجات النشطة فقط دائماً
        // إذا كان مديراً، يمكنه الفلترة حسب الحالة المرسلة أو رؤية الكل
        query.status = isAdmin ? (status || { $exists: true }) : 'active';


        // البحث بالاسم (Regex للإيجاد الجزئي غير الحساس لحالة الأحرف)
        if (q) {
            query.name = { $regex: q, $options: 'i' };
        }

        // البحث بمدى السعر
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // البحث بالحد الأدنى للتقييم
        if (minRating) {
            query.averageRating = { $gte: Number(minRating) };
        }

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في عملية البحث', error: error.message });
    }
});

// 2. جلب جميع المنتجات (للزوار) - فقط المنتجات النشطة
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ status: 'active' });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب المنتجات', error: error.message });
    }
});

// جلب منتج واحد (نشط فقط للزوار)
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'معرف منتج غير صحيح' });
        }
        let query = { _id: req.params.id };
        if (req.user && req.user.role === 'admin') {
            // المدير يمكنه رؤية المنتجات بكل الحالات
        } else {
            query.status = 'active'; // المستخدمون الآخرون يرون المنتجات النشطة فقط
        }
        const product = await Product.findOne(query).populate('sellerId', 'name email');
        if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود أو غير نشط' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب المنتج', error: error.message });
    }
});


// 3. تحديث منتج (تأمين الملكية)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });

        // التحقق: هل المستخدم هو صاحب المنتج أم مدير؟
        if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'غير مصرح لك بتعديل هذا المنتج' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        res.json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في التحديث', error: error.message });
    }
});

// 4. حذف منتج (تأمين الملكية)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });

        // التحقق من الملكية
        if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف هذا المنتج' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في الحذف', error: error.message });
    }
});

// 5. إضافة منتج جديد
router.post('/', authMiddleware, async (req, res) => {
    try {
        // التأكد أن المستخدم بائع أو مدير
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'غير مصرح: يجب أن تكون بائعاً أو مديراً لإضافة منتجات' });
        }

        const { name, price, description, category, image, stock } = req.body;

        if (!name || !price || !description) {
            return res.status(400).json({ success: false, message: 'الاسم والسعر والوصف مطلوبة' });
        }

        const seller = await User.findById(req.user.id);
        if (!seller) {
            return res.status(404).json({ success: false, message: 'البائع غير موجود' });
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            category,
            image,
            stock,
            sellerId: req.user.id, // نضمن دائماً ربط المنتج بصاحب التوكن
            sellerName: seller.name, // جلب اسم البائع من قاعدة البيانات
            status: req.user.role === 'admin' ? 'active' : 'pending' // المدير ينشر فوراً، البائع العادي يبقى معلق
        });
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في الإضافة', error: error.message });
    }
});

module.exports = router;