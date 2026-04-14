const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'الاسم مطلوب'] 
    },
    email: { 
        type: String, 
        required: [true, 'البريد الإلكتروني مطلوب'], 
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'يرجى إدخال بريد إلكتروني صالح']
    },
    password: { 
        type: String, 
        required: [true, 'كلمة المرور مطلوبة'] 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'],
        default: 'user' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);