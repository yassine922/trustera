// ===== API الدفع =====

const express = require('express');
const router = express.Router();

// معالجة الدفع عبر CIB
router.post('/cib', (req, res) => {
    try {
        const { orderId, amount, cardNumber, cardHolder, expiryDate, cvv } = req.body;

        // التحقق من البيانات
        if (!orderId || !amount || !cardNumber || !cardHolder || !expiryDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: 'جميع بيانات البطاقة مطلوبة'
            });
        }

        // في التطبيق الفعلي، سيتم الاتصال بـ API البنك
        // هنا نحاكي عملية الدفع
        const isPaymentSuccessful = Math.random() > 0.1; // 90% نسبة نجاح

        if (isPaymentSuccessful) {
            res.json({
                success: true,
                message: 'تم الدفع بنجاح',
                data: {
                    orderId,
                    amount,
                    paymentMethod: 'CIB',
                    transactionId: Date.now().toString(),
                    status: 'completed',
                    timestamp: new Date()
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'فشل الدفع. يرجى التحقق من بيانات البطاقة'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في معالجة الدفع',
            error: error.message
        });
    }
});

// معالجة الدفع عند الاستلام (COD)
router.post('/cod', (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // التحقق من البيانات
        if (!orderId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'معرف الطلب والمبلغ مطلوبان'
            });
        }

        res.json({
            success: true,
            message: 'تم تأكيد الدفع عند الاستلام',
            data: {
                orderId,
                amount,
                paymentMethod: 'COD',
                status: 'pending',
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في معالجة الدفع',
            error: error.message
        });
    }
});

// التحقق من حالة الدفع
router.get('/status/:transactionId', (req, res) => {
    try {
        const { transactionId } = req.params;

        res.json({
            success: true,
            data: {
                transactionId,
                status: 'completed',
                amount: 0,
                paymentMethod: 'CIB',
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في التحقق من حالة الدفع',
            error: error.message
        });
    }
});

module.exports = router;
