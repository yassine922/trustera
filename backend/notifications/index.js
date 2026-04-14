const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // تم التحديث
const { authMiddleware } = require('../auth'); // تم التحديث

// جلب إشعارات البائع الحالي
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ sellerId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب الإشعارات', error: error.message });
    }
});

// تحديد الإشعار كمقروء
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, sellerId: req.user.id },
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'الإشعار غير موجود أو لا تملك صلاحية تعديله' });
        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في تحديث الإشعار', error: error.message });
    }
});

module.exports = router;