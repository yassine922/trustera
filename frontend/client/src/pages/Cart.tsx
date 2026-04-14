import { useApp } from '../contexts/AppContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const CART_STORAGE_KEY = 'trustera_cart_v2';

function usePersistedCart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const persistCart = (items: any[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('فشل حفظ السلة:', e);
    }
  };

  const clearPersistedCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const loadSavedCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  };

  return { isLoaded, persistCart, clearPersistedCart, loadSavedCart };
}

const formatPrice = (price: number) => {
  return price?.toLocaleString?.('ar-DZ') || String(price);
};

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQty, 
    clearCart, 
    cartTotal, 
    showToast,
    setCart 
  } = useApp();
  const [, setLocation] = useLocation();
  
  const { isLoaded, persistCart, clearPersistedCart, loadSavedCart } = usePersistedCart();
  const shipping = 400;
  const total = cartTotal + shipping;

  useEffect(() => {
    if (isLoaded && cart.length >= 0) {
      persistCart(cart);
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    
    const savedItems = loadSavedCart();
    if (savedItems && savedItems.length > 0 && cart.length === 0 && setCart) {
      setCart(savedItems);
    }
  }, [isLoaded]);

  if (cart.length === 0) {
    const savedCount = loadSavedCart()?.length || 0;

    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>سلتك فارغة</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          {savedCount > 0 ? `لديك ${savedCount} منتج محفوظ` : 'أضف منتجات للمتابعة'}
        </p>
        <button 
          onClick={() => showPage('categories')} 
          style={{ 
            padding: '12px 32px', 
            background: '#1a7c2e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontFamily: 'Cairo, sans-serif', 
            fontSize: '14px', 
            fontWeight: 700, 
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          🛍️ تسوق الآن
        </button>
        {savedCount > 0 && (
          <button 
            onClick={() => {
              const saved = loadSavedCart();
              if (saved && setCart) {
                setCart(saved);
                showToast('تم استرجاع السلة', 'success');
              }
            }}
            style={{ 
              padding: '12px 32px', 
              background: '#f4f6f8', 
              color: '#1a7c2e', 
              border: '1px solid #1a7c2e', 
              borderRadius: '8px', 
              fontFamily: 'Cairo, sans-serif', 
              fontSize: '14px', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
          >
            استرجاع
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '14px 24px', background: 'white', borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800 }}>
          🛒 سلة التسوق ({cart.length} منتج)
        </h1>
        <button 
          onClick={() => { 
            clearCart(); 
            clearPersistedCart();
            showToast('تم إفراغ السلة', 'info');
          }} 
          style={{ 
            padding: '8px 14px', 
            background: 'none', 
            border: '1px solid #d32f2f', 
            color: '#d32f2f', 
            borderRadius: '7px', 
            fontFamily: 'Cairo, sans-serif', 
            fontSize: '13px', 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
        >
          🗑️ إفراغ السلة
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', padding: '20px 24px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {cart.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '16px', 
                marginBottom: '12px', 
                border: '1px solid #eef0f3', 
                display: 'flex', 
                gap: '14px', 
                alignItems: 'center'
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '10px', 
                background: '#f4f6f8', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '40px', 
                flexShrink: 0
              }}>
                {item.emoji}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  🏪 {item.seller}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#145c22' }}>
                  {formatPrice(item.price * item.qty)} دج
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dde1e7', borderRadius: '8px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)} 
                    style={{ width: '32px', height: '32px', border: 'none', background: '#f4f6f8', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
                  >
                    −
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, item.qty + 1)} 
                    style={{ width: '32px', height: '32px', border: 'none', background: '#f4f6f8', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => {
                    removeFromCart(item.id);
                    showToast('تم الحذف', 'success');
                  }} 
                  style={{ width: '32px', height: '32px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#d32f2f' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[320px] lg:sticky lg:top-32">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="text-base font-black mb-4 pb-3 border-b-2 border-gray-50 text-gray-900">
              ملخص الطلب
            </div>
            
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-gray-900">{formatPrice(cartTotal)} دج</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>الشحن</span>
                <span className="text-primary font-bold">{formatPrice(shipping)} دج</span>
              </div>
              <div className="pt-3 border-t-2 border-gray-50 flex justify-between text-lg font-black text-primary">
                <span>الإجمالي</span>
                <span>{formatPrice(total)} دج</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="رمز الخصم..." 
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-cairo text-xs focus:border-primary outline-none" 
              />
              <button 
                onClick={() => showToast('رمز غير صحيح', 'warning')} 
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
              >
                تطبيق
              </button>
            </div>

            <button onClick={() => setLocation('/checkout')} className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-dark transition-all shadow-lg shadow-green-100 mb-3">
              💳 إتمام الطلب
            </button>
            <div className="text-center text-[11px] text-gray-400">
              🔒 دفع آمن ومحمي
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
