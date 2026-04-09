// ===== API المنتجات =====

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// مسار ملف المنتجات
const productsFile = path.join(__dirname, '../../database/products.json');

// قراءة المنتجات من الملف
function readProducts() {
    try {
        const data = fs.readFileSync(productsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// حفظ المنتجات في الملف
function writeProducts(products) {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// الحصول على جميع المنتجات
router.get('/', (req, res) => {
    try {
        const products = readProducts();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المنتجات',
            error: error.message
        });
    }
});

// الحصول على منتج واحد
router.get('/:id', (req, res) => {
    try {
        const products = readProducts();
        const product = products.find(p => p.id === req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المنتج',
            error: error.message
        });
    }
});

// إضافة منتج جديد
router.post('/', (req, res) => {
    try {
        const { name, price, description, sellerId } = req.body;

        // التحقق من البيانات
        if (!name || !price || !description || !sellerId) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const products = readProducts();

        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            description,
            sellerId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        products.push(newProduct);
        writeProducts(products);

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنتج بنجاح',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في إضافة المنتج',
            error: error.message
        });
    }
});

// تحديث منتج
router.put('/:id', (req, res) => {
    try {
        const { name, price, description } = req.body;
        const products = readProducts();
        const productIndex = products.findIndex(p => p.id === req.params.id);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود'
            });
        }

        products[productIndex] = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            price: price || products[productIndex].price,
            description: description || products[productIndex].description,
            updatedAt: new Date()
        };

        writeProducts(products);

        res.json({
            success: true,
            message: 'تم تحديث المنتج بنجاح',
            data: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث المنتج',
            error: error.message
        });
    }
});

// حذف منتج
router.delete('/:id', (req, res) => {
    try {
        let products = readProducts();
        const productIndex = products.findIndex(p => p.id === req.params.id);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود'
            });
        }

        const deletedProduct = products[productIndex];
        products = products.filter(p => p.id !== req.params.id);
        writeProducts(products);

        res.json({
            success: true,
            message: 'تم حذف المنتج بنجاح',
            data: deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف المنتج',
            error: error.message
        });
    }
});

module.exports = router;
