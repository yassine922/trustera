const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// تأكد من أن هذه الملفات موجودة في المجلدات المشار إليها
const Order = require('../Order'); // يشير إلى backend/Order.js
const User = require('../auth/User'); // إضافة لاستخدامها في التحقق من البائعين
const Product = require('../products/Product'); // تصحيح المسار للوصول لمجلد المنتجات
const Notification = require('../Notification'); // المسار صحيح إذا كان الملف في backend/Notification.js

const { authMiddleware, adminMiddleware } = require('../auth'); // تم التحديث

// جلب جميع الطلبات (للمدير فقط)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Point 13: استخدام Aggregate لتفادي N+1 Problem
        const [orders, total] = await Promise.all([
            Order.aggregate([
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'buyerId',
                        foreignField: '_id',
                        as: 'buyer'
                    }
                },
                { $unwind: { path: '$buyer', preserveNullAndEmptyArrays: true } },
                { $project: { 'buyer.password': 0 } }
            ]),
            Order.countDocuments()
        ]);

        res.json({ 
            success: true, 
            data: orders,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب الطلبات', error: error.message });
    }
});

// جلب طلب واحد (للمشتري أو البائع المعني أو المدير)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyerId', 'name email')
            .populate('items.productId', 'name price');

        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

        // التحقق من صلاحية الوصول
        const isBuyer = order.buyerId._id.toString() === req.user.id;
        const isSellerOfItem = order.items.some(item => item.sellerId.toString() === req.user.id);
        const isAdmin = req.user.role === 'admin';

        if (!isBuyer && !isSellerOfItem && !isAdmin) {
            return res.status(403).json({ success: false, message: 'غير مصرح لك بمشاهدة هذا الطلب' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب الطلب', error: error.message });
    }
});

// ===== إنشاء طلب جديد وإرسال إشعارات فورية =====
router.post('/', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, totalAmount, shippingAddress } = req.body;
        if (!items || items.length === 0) {
            throw new Error('السلة فارغة');
        }
        
        // 1. التحقق والخصم في نفس العملية (Point 11: Race Condition Fix)
        for (const item of items) {
            const product = await Product.findOneAndUpdate(
                { _id: item.productId, stock: { $gte: Math.abs(item.qty || 1) } },
                { $inc: { stock: -Math.abs(item.qty || 1) } },
                { session, new: true }
            );
            
            if (!product) {
                throw new Error(`المنتج غير متوفر بالكمية المطلوبة`);
            }
        }

        // 2. إنشاء الطلب الفعلي في قاعدة البيانات
        const orderResult = await Order.create([{
            buyerId: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            status: 'pending'
        }], { session });

        const order = orderResult[0];
        const orderId = order._id;

        await session.commitTransaction();

        // 3. تحديد البائعين الموثوقين وإرسال الإشعارات (Point 12)
        const sellerIds = [...new Set(items.map(item => item.sellerId.toString()))];
        
        const validSellers = await User.find({
            _id: { $in: sellerIds },
            role: 'seller'
        }).select('_id');
        
        const validSellerIds = validSellers.map(s => s._id.toString());
        const io = req.app.get('io');

        for (const sId of validSellerIds) {
            const msg = `طلب جديد #${orderId.toString().slice(-6).toUpperCase()}`;
            
            await Notification.create({
                sellerId: sId,
                orderId: orderId,
                message: msg
            });

            if (io) {
                io.to(sId).emit('notification', {
                    message: msg,
                    orderId: orderId,
                    createdAt: new Date()
                });
            }
        }

        res.status(201).json({ success: true, orderId });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
});

// تحديث حالة طلب (للبائع المعني أو المدير)
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'حالة الطلب غير صالحة' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

        // التحقق من صلاحيات التحديث: يجب أن يكون البائع المعني بأحد المنتجات أو مديراً
        const isSellerOfItem = order.items.some(item => item.sellerId.toString() === req.user.id);
        const isAdmin = req.user.role === 'admin';

        if (!isSellerOfItem && !isAdmin) {
            return res.status(403).json({ success: false, message: 'غير مصرح لك بتحديث حالة هذا الطلب' });
        }

        order.status = status;
        order.updatedAt = new Date();
        await order.save();

        // إشعار المشتري بتحديث حالة طلبه (يمكن إضافته هنا)

        res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في تحديث حالة الطلب', error: error.message });
    }
});

// حذف طلب (للمدير فقط)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) throw new Error('الطلب غير موجود');

        // Point 27: استرجاع المخزون فقط إذا كان الطلب لم يكتمل
        if (order.status !== 'completed' && order.status !== 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, { 
                    $inc: { stock: Math.abs(item.qty) } 
                }, { session });
            }
        }

        await Order.findByIdAndDelete(req.params.id).session(session);
        await session.commitTransaction();
        res.json({ success: true, message: 'تم حذف الطلب بنجاح' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;