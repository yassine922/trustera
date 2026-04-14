const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  image: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stock: { type: Number, default: 0, min: 0 },
  averageRating: { type: Number, default: 0, index: true },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'hidden'], default: 'active', index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Point 14 & 28: إضافة فهارس نصية للبحث المتقدم وفهارس مركبة للأداء
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ sellerId: 1, status: 1 });

// تحويل toJSON لضمان تنسيق الأرقام
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.averageRating) ret.averageRating = Number(ret.averageRating.toFixed(1));
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema);