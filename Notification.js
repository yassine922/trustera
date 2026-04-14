const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sellerId: { type: String, required: true }, // البائع المستهدف
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }, // هل قرأ البائع الإشعار؟
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);