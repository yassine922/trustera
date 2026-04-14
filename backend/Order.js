const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: { type: Number, default: 1 },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);