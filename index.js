const express = require('express');
const router = express.Router();
const Notification = require('../Notification');
const { authMiddleware } = require('../auth');

// Point 29: إضافة Pagination للإشعارات
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ sellerId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('orderId', 'status totalAmount'),
      Notification.countDocuments({ sellerId: req.user.id })
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;