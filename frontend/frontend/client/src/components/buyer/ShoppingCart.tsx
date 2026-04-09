/**
 * Shopping Cart Component
 * مكون سلة المشتريات مع إمكانية تعديل الكميات والحذف
 */

import { useState } from 'react';
import { CartItem } from '@/services/buyerService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartProps) {
  const [couponCode, setCouponCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 400; // دج
  const total = subtotal + shippingCost;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">سلتك فارغة</h2>
        <p className="text-muted-foreground mb-6">أضف منتجات للمتابعة</p>
        <Button>تسوق الآن</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="col-span-2 space-y-4">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Product Image Placeholder */}
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-3">
                    {(item.price * item.quantity).toLocaleString('ar-DZ')} دج
                  </p>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-12 text-center h-8"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {item.price.toLocaleString('ar-DZ')} دج / قطعة
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>ملخص الطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span>المجموع</span>
              <span className="font-bold">{subtotal.toLocaleString('ar-DZ')} دج</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm">
              <span>الشحن</span>
              <span className="text-primary font-bold">{shippingCost.toLocaleString('ar-DZ')} دج</span>
            </div>

            {/* Divider */}
            <div className="border-t pt-4" />

            {/* Total */}
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-primary">{total.toLocaleString('ar-DZ')} دج</span>
            </div>

            {/* Coupon */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="كود الخصم"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <Button variant="outline" className="w-full text-sm">
                تطبيق الكود
              </Button>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={onCheckout}
              className="w-full h-11 font-bold"
            >
              متابعة الشراء
            </Button>

            {/* Safe Payment Info */}
            <p className="text-xs text-muted-foreground text-center">
              🔒 دفع آمن 100%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
