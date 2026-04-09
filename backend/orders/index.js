// ===== API الطلبات =====

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// مسار ملف الطلبات
const ordersFile = path.join(__dirname, '../../database/orders.json');

// قراءة الطلبات من الملف
function readOrders() {
    try {
        const data = fs.readFileSync(ordersFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// حفظ الطلبات في الملف
function writeOrders(orders) {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// الحصول على جميع الطلبات
router.get('/', (req, res) => {
    try {
        const orders = readOrders();
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الطلبات',
            error: error.message
        });
    }
});

// الحصول على طلب واحد
router.get('/:id', (req, res) => {
    try {
        const orders = readOrders();
        const order = orders.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الطلب',
            error: error.message
        });
    }
});

// إنشاء طلب جديد
router.post('/', (req, res) => {
    try {
        const { items, totalAmount, buyerId } = req.body;

        // التحقق من البيانات
        if (!items || !totalAmount || !buyerId) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const orders = readOrders();

        const newOrder = {
            id: Date.now().toString(),
            buyerId,
            items,
            totalAmount,
            status: 'pending',
            paymentMethod: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        orders.push(newOrder);
        writeOrders(orders);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الطلب بنجاح',
            data: newOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في إنشاء الطلب',
            error: error.message
        });
    }
});

// تحديث حالة الطلب
router.put('/:id', (req, res) => {
    try {
        const { status, paymentMethod } = req.body;
        const orders = readOrders();
        const orderIndex = orders.findIndex(o => o.id === req.params.id);

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود'
            });
        }

        orders[orderIndex] = {
            ...orders[orderIndex],
            status: status || orders[orderIndex].status,
            paymentMethod: paymentMethod || orders[orderIndex].paymentMethod,
            updatedAt: new Date()
        };

        writeOrders(orders);

        res.json({
            success: true,
            message: 'تم تحديث الطلب بنجاح',
            data: orders[orderIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث الطلب',
            error: error.message
        });
    }
});

// حذف طلب
router.delete('/:id', (req, res) => {
    try {
        let orders = readOrders();
        const orderIndex = orders.findIndex(o => o.id === req.params.id);

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود'
            });
        }

        const deletedOrder = orders[orderIndex];
        orders = orders.filter(o => o.id !== req.params.id);
        writeOrders(orders);

        res.json({
            success: true,
            message: 'تم حذف الطلب بنجاح',
            data: deletedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف الطلب',
            error: error.message
        });
    }
});

module.exports = router;
