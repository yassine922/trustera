import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

export default function Checkout() {
  const { cart, cartTotal, placeOrder } = useApp();
  const shipping = 400;

  return (
    <div>
      <div style={{ padding: '14px 24px', background: 'white', borderBottom: '1px solid #eef0f3' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800 }}>🚚 إتمام الطلب</h1>
      </div>
      <div style={{ display: 'flex', gap: '20px', padding: '20px 24px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* عنوان التوصيل */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>📍 عنوان التوصيل</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { label: 'الاسم الكامل', type: 'text', val: 'أحمد بن علي' },
                { label: 'رقم الهاتف', type: 'tel', val: '06 12 34 56 78' },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>{f.label}</label>
                  <input type={f.type} defaultValue={f.val} style={{ width: '100%', padding: '10px 12px', border: '1px solid #dde1e7', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>العنوان الكامل</label>
                <input type="text" defaultValue="حي المدينة الجديدة، شارع الاستقلال، الجزائر العاصمة" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dde1e7', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>الولاية</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #dde1e7', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', outline: 'none', background: 'white' }}>
                  <option>الجزائر العاصمة</option><option>وهران</option><option>قسنطينة</option><option>سطيف</option><option>عنابة</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>البلدية</label>
                <input type="text" defaultValue="باب الزوار" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dde1e7', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>💳 طريقة الدفع</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '2px solid #1a7c2e', borderRadius: '8px', cursor: 'pointer', background: '#edf7f0' }}>
                <input type="radio" name="payment" defaultChecked />
                <span style={{ fontSize: '18px' }}>💵</span>
                <div><div style={{ fontWeight: 700 }}>دفع عند الاستلام</div><div style={{ fontSize: '12px', color: '#6b7280' }}>ادفع بعد استلام طلبك</div></div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '2px solid #dde1e7', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="payment" />
                <span style={{ fontSize: '18px' }}>📮</span>
                <div><div style={{ fontWeight: 700 }}>CCP / بريد جزائر</div><div style={{ fontSize: '12px', color: '#6b7280' }}>تحويل عبر بريد جزائر</div></div>
              </label>
            </div>
          </div>
        </div>

        {/* ملخص */}
        <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '130px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #eef0f3' }}>ملخص الطلب</div>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                <div style={{ flex: 1, fontSize: '12px' }}>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: '#6b7280' }}>x{item.qty}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #eef0f3', marginTop: '12px', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span>المجموع</span><span style={{ fontWeight: 700 }}>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                <span>الشحن</span><span style={{ color: '#1a7c2e', fontWeight: 700 }}>{formatPrice(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, paddingTop: '10px', borderTop: '2px solid #eef0f3' }}>
                <span>الإجمالي</span><span style={{ color: '#145c22' }}>{formatPrice(cartTotal + shipping)}</span>
              </div>
            </div>
            <button onClick={placeOrder} style={{ width: '100%', padding: '13px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '15px', fontWeight: 800, cursor: 'pointer', marginTop: '16px' }}>
              ✅ تأكيد الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
