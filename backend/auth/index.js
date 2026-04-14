const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const { authMiddleware, adminMiddleware } = require('../auth'); // تم التحديث
const User = require('../models/User'); // تم التحديث لجلب اسم البائع

















        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'يرجى إدخال بريد إلكتروني صحيح'
            });
        }

        res.status(500).json({ success: false, message: 'خطأ في جلب منتجاتك', error: error.message });
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            });
        }

        const { q, minPrice, maxPrice, minRating, category, status } = req.query;
        // التحقق من وجود المستخدم

        let query = { }; // لا نحدد الحالة هنا لكي يتمكن المدير من البحث في كل الحالات
        if (req.user && req.user.role !== 'admin') { // للمستخدم العادي، نبحث عن المنتجات النشطة فقط
            query.status = 'active';
        } else if (status) { // للمدير، يمكنه تحديد الحالة
            query.status = status;
        }
        if (existingUser) {


            return res.status(409).json({
                success: false,

                message: 'البريد الإلكتروني مستخدم بالفعل'
            });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // تحديد الرتبة: السماح بـ buyer أو seller فقط، والافتراضي هو buyer
        const userRole = (role === 'seller' || role === 'buyer') ? role : 'buyer';

        // إنشاء مستخدم جديد
        const newUser = await User.create({
            name,
        if (category) {
            query.category = category;
        }

            email,
            password: hashedPassword,
            role: userRole

        res.status(500).json({ success: false, message: 'خطأ في عملية البحث', error: error.message });

        res.status(201).json({
            success: true,

// 2. جلب جميع المنتجات (للزوار) - فقط المنتجات النشطة
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role

        res.status(500).json({ success: false, message: 'خطأ في جلب المنتجات', error: error.message });
        });
    } catch (error) {

// جلب منتج واحد (نشط فقط للزوار)
router.get('/:id', async (req, res) => {
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



router.put('/:id/status', authMiddleware, async (req, res) => {








        const { status } = req.body;
        if (!status || !['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'حالة الطلب غير صالحة' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

        // التحقق من صلاحيات التحديث: يجب أن يكون البائع المعني بأحد المنتجات أو مديراً
        const isSellerOfItem = order.items.some(item => item.sellerId.toString() === req.user.id);
        const isAdmin = req.user.role === 'admin';

            return res.status(403).json({ success: false, message: 'غير مصرح لك بتحديث حالة هذا الطلب' });
        }

        order.status = status;
        order.updatedAt = new Date();
        await order.save();

        // إشعار المشتري بتحديث حالة طلبه (يمكن إضافته هنا)

        res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح', data: order });


        res.status(500).json({ success: false, message: 'خطأ في تحديث حالة الطلب', error: error.message });
// ===== تسجيل الدخول =====
router.post('/login', async (req, res) => {
    try {
// حذف طلب (للمدير فقط)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

        // استرجاع المخزون للمنتجات المحذوفة (اختياري، بناءً على سياسة العمل)
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: Math.abs(item.qty) } });
        }

        res.json({ success: true, message: 'تم حذف الطلب بنجاح', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في حذف الطلب', error: error.message });
    }
});

        const { email, password } = req.body;
        if (!isSellerOfItem && !isAdmin) {

        if (!email || !password) {

            { new: true, runValidators: true }
                success: false,
                message: 'البريد الإلكتروني وكلمة المرور مطلوبة'
            });

        res.status(500).json({ success: false, message: 'خطأ في التحديث', error: error.message });

        // التحقق من وجود المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,

                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {


        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({

        res.status(500).json({ success: false, message: 'خطأ في الحذف', error: error.message });

                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        const token = jwt.sign(
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

            { id: user._id, email: user.email, role: user.role },


            name,
            price,
            description,
            category,
            image,
            stock,
            sellerId: req.user.id, // نضمن دائماً ربط المنتج بصاحب التوكن
            sellerName: seller.name, // جلب اسم البائع من قاعدة البيانات
            status: req.user.role === 'admin' ? 'active' : 'pending' // المدير ينشر فوراً، البائع العادي يبقى معلق
            { expiresIn: '7d' }
        );


        res.status(500).json({ success: false, message: 'خطأ في الإضافة', error: error.message });
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





        res.status(500).json({ success: false, message: 'خطأ في تسجيل الدخول', error: error.message });
    }
});

// ===== Middleware التحقق من التوكن =====
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {

        return res.status(401).json({ success: false, message: 'غير مصرح: لا يوجد توكن' });
    }
    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(


            token,
            process.env.JWT_SECRET // تم إزالة المفتاح الافتراضي
        );
        req.user = decoded;
        next();


    } catch (error) {
        return res.status(401).json({ success: false, message: 'غير مصرح: توكن غير صالح أو منتهي الصلاحية' });
    }
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
        const users = await User.find({}, { password: 0 });
        res.json({ success: true, data: users });
    } catch (error) {
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
        res.status(500).json({ success: false, message: 'خطأ', error: error.message });
    }
});

module.exports = {
    router,
    authMiddleware,
    adminMiddleware
};


// ===== جلب معلومات المستخدم الحالي (للمصادقة) =====
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });

        if (!user) {
            return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ', error: error.message });
    }
});

module.exports = {
    router,
    authMiddleware,
    adminMiddleware
};
