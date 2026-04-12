import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

// ✅ إضافة: تنسيق السعر الآمن
const formatPrice = (price: number) => {
  return price?.toLocaleString?.('ar-DZ') || String(price);
};

// ✅ إضافة: بيانات المستخدم الحقيقية (من localStorage)
const getUserData = () => {
  try {
    const user = JSON.parse(localStorage.getItem('trustera_user') || '{}');
    return {
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      wilaya: user.wilaya || 'الجزائر العاصمة',
      baladia: user.baladia || ''
    };
  } catch {
    return { name: '', phone: '', address: '', wilaya: 'الجزائر العاصمة', baladia: '' };
  }
};

export default function Checkout() {
  const { cart, cartTotal, showToast, showPage, setCart } = useApp();
  const shipping = 400;
  
  // ✅ إضافة: state للبيانات (قابلة للتعديل)
  const [formData, setFormData] = useState(getUserData());
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ إضافة: validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'الهاتف مطلوب';
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (!formData.baladia.trim()) newErrors.baladia = 'البلدية مطلوبة';
    
    // التحقق من رقم الهاتف الجزائري
    const phoneRegex = /^(0[5-7][0-9]{8})$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم هاتف جزائري غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ إضافة: دالة الطلب الحقيقية
  const placeOrder = async () => {
    if (!validate()) {
      showToast('يرجى تعبئة جميع الحقول المطلوبة', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('السلة فارغة', 'error');
      return;
    }

    setIsSubmitting(true);

    // ✅ إضافة: بناء بيانات الطلب الحقيقية
    const orderData = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      customer: formData,
      items: cart.map(item => ({
        sku: item.sku || `TR-${item.id}`,
        name: item.name,
        price: item.price,
        qty: item.qty,
        seller: item.seller
      })),
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'awaiting_transfer'
      },
      shipping: shipping,
      total: cartTotal + shipping,
      status: 'pending'
    };

    try {
      // ✅ TODO: إرسال للـ Backend
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });

      // ✅ مؤقت: حفظ في localStorage
      const existingOrders = JSON.parse(localStorage.getItem('trustera_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('trustera_orders', JSON.stringify(existingOrders));

      // ✅ إضافة: مسح السلة بعد الطلب الناجح
      setCart([]);
      localStorage.removeItem('trustera_cart_v2');

      showToast('تم تأكيد طلبك بنجاح!', 'success');
      showPage('order-success');
      
    } catch (error) {
      showToast('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ إضافة: التحقق من المنتجات الوهمية
  const hasDemoProducts = cart.some((item: any) => !item.sku && typeof item.id === 'number');

  return (
    <div>
      <div style={{ padding: '14px 24px', background: 'white', borderBottom: '1px solid #eef0f3' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800 }}>🚚 إتمام الطلب</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', padding: '20px 24px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* عنوان التوصيل */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 عنوان التوصيل
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* الاسم */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>
                  الاسم الكامل *
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أحمد بن علي"
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${errors.name ? '#d32f2f' : '#dde1e7'}`, 
                    borderRadius: '8px', 
                    fontFamily: 'Cairo, sans-serif', 
                    fontSize: '13px', 
                    outline: 'none',
                    boxSizing: 'border-box'
                  }} 
                />
                {errors.name && <span style={{ color: '#d32f2f', fontSize: '11px' }}>{errors.name}</span>}
              </div>

              {/* الهاتف */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>
                  رقم الهاتف *
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="06 12 34 56 78"
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${errors.phone ? '#d32f2f' : '#dde1e7'}`, 
                    borderRadius: '8px', 
                    fontFamily: 'Cairo, sans-serif', 
                    fontSize: '13px', 
                    outline: 'none',
                    boxSizing: 'border-box',
                    direction: 'ltr'
                  }} 
                />
                {errors.phone && <span style={{ color: '#d32f2f', fontSize: '11px' }}>{errors.phone}</span>}
              </div>

              {/* العنوان الكامل */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>
                  العنوان الكامل *
                </label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="حي المدينة الجديدة، شارع الاستقلال"
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${errors.address ? '#d32f2f' : '#dde1e7'}`, 
                    borderRadius: '8px', 
                    fontFamily: 'Cairo, sans-serif', 
                    fontSize: '13px', 
                    outline: 'none',
                    boxSizing: 'border-box'
                  }} 
                />
                {errors.address && <span style={{ color: '#d32f2f', fontSize: '11px' }}>{errors.address}</span>}
              </div>

              {/* الولاية */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>
                  الولاية
                </label>
                <select 
                  value={formData.wilaya}
                  onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #dde1e7', 
                    borderRadius: '8px', 
                    fontFamily: 'Cairo, sans-serif', 
                    fontSize: '13px', 
                    outline: 'none', 
                    background: 'white' 
                  }}
                >
                  <option>الجزائر العاصمة</option>
                  <option>وهران</option>
                  <option>قسنطينة</option>
                  <option>سطيف</option>
                  <option>عنابة</option>
                  <option>باتنة</option>
                  <option>البليدة</option>
                  <option>تيارت</option>
                </select>
              </div>

              {/* البلدية */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#374151' }}>
                  البلدية *
                </label>
                <input 
                  type="text" 
                  value={formData.baladia}
                  onChange={(e) => setFormData({...formData, baladia: e.target.value})}
                  placeholder="باب الزوار"
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: `1px solid ${errors.baladia ? '#d32f2f' : '#dde1e7'}`, 
                    borderRadius: '8px', 
                    fontFamily: 'Cairo, sans-serif', 
                    fontSize: '13px', 
                    outline: 'none',
                    boxSizing: 'border-box'
                  }} 
                />
                {errors.baladia && <span style={{ color: '#d32f2f', fontSize: '11px' }}>{errors.baladia}</span>}
              </div>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💳 طريقة الدفع
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label 
                onClick={() => setPaymentMethod('cod')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px', 
                  border: `2px solid ${paymentMethod === 'cod' ? '#1a7c2e' : '#dde1e7'}`, 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  background: paymentMethod === 'cod' ? '#edf7f0' : 'white' 
                }}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span style={{ fontSize: '18px' }}>💵</span>
                <div>
                  <div style={{ fontWeight: 700 }}>دفع عند الاستلام</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>ادفع بعد استلام طلبك</div>
                </div>
              </label>
              
              <label 
                onClick={() => setPaymentMethod('ccp')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px', 
                  border: `2px solid ${paymentMethod === 'ccp' ? '#1a7c2e' : '#dde1e7'}`, 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  background: paymentMethod === 'ccp' ? '#edf7f0' : 'white' 
                }}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'ccp'}
                  onChange={() => setPaymentMethod('ccp')}
                />
                <span style={{ fontSize: '18px' }}>📮</span>
                <div>
                  <div style={{ fontWeight: 700 }}>CCP / بريد جزائر</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>تحويل عبر بريد جزائر</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '130px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eef0f3' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #eef0f3' }}>
              ملخص الطلب
            </div>
            
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                <div style={{ flex: 1, fontSize: '12px' }}>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: '#6b7280' }}>x{item.qty}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>{formatPrice(item.price * item.qty)} دج</span>
              </div>
            ))}
            
            <div style={{ borderTop: '1px solid #eef0f3', marginTop: '12px', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span>المجموع</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(cartTotal)} دج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                <span>الشحن</span>
                <span style={{ color: '#1a7c2e', fontWeight: 700 }}>{formatPrice(shipping)} دج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, paddingTop: '10px', borderTop: '2px solid #eef0f3' }}>
                <span>الإجمالي</span>
                <span style={{ color: '#145c22' }}>{formatPrice(cartTotal + shipping)} دج</span>
              </div>
            </div>

            <button 
              onClick={placeOrder}
              disabled={isSubmitting || cart.length === 0}
              style={{ 
                width: '100%', 
                padding: '13px', 
                background: isSubmitting ? '#ccc' : '#1a7c2e', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontFamily: 'Cairo, sans-serif', 
                fontSize: '15px', 
                fontWeight: 800, 
                cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                marginTop: '16px',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? '⏳ جاري التأكيد...' : '✅ تأكيد الطلب'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
