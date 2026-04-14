const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// تأكد من أن هذه الملفات موجودة في المجلدات المشار إليها
const Order = require('../Order'); // يشير إلى backend/Order.js
const Product = require('../products/Product'); // تصحيح المسار للوصول لمجلد المنتجات
const Notification = require('../Notification'); // تصحيح المسار: الملف في مجلد backend

const { authMiddleware, adminMiddleware } = require('../auth'); // تم التحديث

// جلب جميع الطلبات (للمدير فقط)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments();
        const orders = await Order.find()
            .populate('buyerId', 'name email')
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

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
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ success:false, message: 'السلة فارغة' });
        
        // التحقق من توفر المخزون لجميع المنتجات قبل البدء في الخصم
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < Math.abs(item.qty || 1)) {
                return res.status(400).json({ 
                    success: false, 
                    message: `المنتج "${product?.name || 'غير معروف'}" غير متوفر بالكمية المطلوبة` 
                });
            }
        }

        // 1. إنشاء الطلب الفعلي في قاعدة البيانات
        const order = await Order.create({
            buyerId: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            status: 'pending'
        });

        // 2. تحديث المخزون لكل منتج
        const stockUpdates = items.map(item => 
            Product.findByIdAndUpdate(item.productId, { 
                $inc: { stock: -Math.abs(item.qty || 1) } 
            }, { new: true }) // new:true لإرجاع المنتج بعد التحديث (للتأكد)
        );
        await Promise.all(stockUpdates);

        const orderId = order._id;

        // 3. تحديد البائعين وإرسال الإشعارات
        const sellerIds = [...new Set(items.map(item => item.sellerId.toString()))]; // التأكد من String
        const io = req.app.get('io');

        for (const sId of sellerIds) {
            const msg = `لديك طلب جديد رقم #${orderId.toString().slice(-6).toUpperCase()}`;
            
            // حفظ في قاعدة البيانات للرجوع إليها لاحقاً
            await Notification.create({
                sellerId: sId,
                orderId: orderId,
                message: msg
            });

            // إرسال الإشعار فوراً عبر Socket.io إذا كان البائع متصلاً
            if (io) {
                io.to(sId).emit('notification', {
                    message: msg,
                    orderId: orderId,
                    createdAt: new Date()
                });
            }
        }

        res.status(201).json({ success: true, message: 'تم إنشاء الطلب بنجاح', orderId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في معالجة الطلب', error: error.message });
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

module.exports = router;