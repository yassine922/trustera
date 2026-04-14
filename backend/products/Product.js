const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'اسم المنتج مطلوب'] },
    price: { 
        type: Number, 
        required: [true, 'السعر مطلوب'],
        min: [0, 'السعر لا يمكن أن يكون أقل من صفر']
    },
    description: { type: String, required: [true, 'وصف المنتج مطلوب'] },
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    sellerName: { type: String, default: '' },
    category: { type: String, default: 'other' },
    image: { type: String, default: '' },
    stock: { 
        type: Number, 
        default: 0,
        min: [0, 'المخزون لا يمكن أن يكون أقل من صفر']
    }
}, { timestamps: true });
productSchema.add({ averageRating: { type: Number, default: 0 }, reviewsCount: { type: Number, default: 0 } });

module.exports = mongoose.model('Product', productSchema);