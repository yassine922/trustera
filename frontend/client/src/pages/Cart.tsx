import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, showPage, showToast } = useApp();
  const shipping = 400;
  const total = cartTotal + shipping;

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>🛒</div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>سلتك فارغة</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>أضف منتجات للمتابعة</p>
      <button onClick={() => showPage('categories')} style={{ padding: '12px 32px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
        🛍️ تسوق الآن
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ padding: '14px 24px', background: 'white', borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800 }}>🛒 سلة التسوق ({cart.length} منتج)</h1>
        <button onClick={clearCart} style={{ padding: '8px 14px', background: 'none', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          🗑️ إفراغ السلة
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', padding: '20px 24px', alignItems: 'flex-start' }}>
        {/* عناصر السلة */}
        <div style={{ flex: 1 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #eef0f3', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: '#f4f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', flexShrink: 0 }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>🏪 {item.seller}</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#145c22' }}>{formatPrice(item.price * item.qty)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dde1e7', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#f4f6f8', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>−</button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: '32px', height: '32px', border: 'none', background: '#f4f6f8', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ width: '32px', height: '32px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#d32f2f' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '130px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #eef0f3' }}>ملخص الطلب</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span>المجموع الفرعي</span><span style={{ fontWeight: 700 }}>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span>الشحن</span><span style={{ color: '#1a7c2e', fontWeight: 700 }}>{formatPrice(shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingTop: '12px', borderTop: '2px solid #eef0f3', fontSize: '16px', fontWeight: 900 }}>
              <span>الإجمالي</span><span style={{ color: '#145c22' }}>{formatPrice(total)}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              <input type="text" placeholder="رمز الخصم..." style={{ flex: 1, padding: '8px 10px', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', outline: 'none' }} />
              <button onClick={() => showToast('رمز غير صحيح', 'warning')} style={{ padding: '8px 12px', background: '#f4f6f8', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>تطبيق</button>
            </div>
            <button onClick={() => showPage('checkout')} style={{ width: '100%', padding: '13px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '15px', fontWeight: 800, cursor: 'pointer', marginBottom: '8px' }}>
              💳 إتمام الطلب
            </button>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>🔒 دفع آمن ومحمي</div>
          </div>
        </div>
      </div>
    </div>
  );
}
