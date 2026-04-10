import { useState } from 'react';
import { getById, getSellerById, getByCategory, formatPrice } from '../data/products';
import ReviewSection from '../components/shared/ReviewSection';
import ProductCard from '../components/shared/ProductCard';
import { useApp } from '../contexts/AppContext';

function Stars({ rating }: { rating: number }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.floor(rating) ? '#f59e0b' : '#d1d5db', fontSize: '14px' }}>★</span>)}</span>;
}

export default function ProductPage() {
  const { currentProduct, addToCart, toggleWish, wishlist, showPage, showToast } = useApp();
  const [qty, setQty] = useState(1);
  const [selColor, setSelColor] = useState<string | null>(null);
  const [selSize, setSelSize] = useState<string | null>(null);

  if (!currentProduct) { showPage('home'); return null; }

  const p = currentProduct;
  const seller = getSellerById(p.sellerId);
  const related = getByCategory(p.cat).filter(r => r.id !== p.id).slice(0, 4);
  const inWish = wishlist.some(w => w.id === p.id);

  const gradients: Record<string, string> = {
    'gradient-1': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
    'gradient-2': 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
    'gradient-3': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
    'gradient-4': 'linear-gradient(135deg,#fef9c3,#fef08a)',
    'gradient-5': 'linear-gradient(135deg,#f3e8ff,#e9d5ff)',
    'gradient-6': 'linear-gradient(135deg,#ccfbf1,#99f6e4)',
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ padding: '14px 24px', background: 'white', borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
        <a onClick={() => showPage('home')} style={{ color: '#1a7c2e', cursor: 'pointer' }}>الرئيسية</a> ◀
        <a onClick={() => showPage('categories')} style={{ color: '#1a7c2e', cursor: 'pointer' }}>المنتجات</a> ◀
        <span style={{ fontWeight: 700 }}>{p.name}</span>
      </div>

      {/* تفاصيل المنتج */}
      <div style={{ display: 'flex', gap: '24px', padding: '20px 24px' }}>
        {/* معرض الصور */}
        <div style={{ width: '400px', flexShrink: 0 }}>
          <div style={{ background: gradients[p.bg] || gradients['gradient-1'], borderRadius: '14px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '130px', border: '1px solid #eef0f3', position: 'relative', overflow: 'hidden' }}>
            <span style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>{p.emoji}</span>
            {p.discount && <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#d32f2f', color: 'white', fontSize: '13px', fontWeight: 800, padding: '4px 10px', borderRadius: '99px' }}>-{p.discount}%</div>}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {['📦','🔍','💡','⭐'].map((icon, i) => (
              <div key={i} style={{ width: '72px', height: '72px', borderRadius: '8px', border: `2px solid ${i === 0 ? '#1a7c2e' : '#dde1e7'}`, background: i === 0 ? '#edf7f0' : '#f4f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', cursor: 'pointer' }}>
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* معلومات المنتج */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', color: '#1a7c2e', fontWeight: 700, marginBottom: '6px' }}>{p.catLabel}</div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '12px', lineHeight: 1.3 }}>{p.name}</h1>

          {/* التقييم */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <Stars rating={p.rating} />
            <span style={{ fontWeight: 700 }}>{p.rating}</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>({p.reviews} تقييم)</span>
            <span style={{ fontSize: '12px', color: '#1a7c2e', fontWeight: 600 }}>تم البيع: {p.sold.toLocaleString()} مرة</span>
            {p.isNew && <span style={{ background: '#edf7f0', color: '#1a7c2e', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>جديد</span>}
            {p.isFast && <span style={{ background: '#dbeafe', color: '#0284c7', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>⚡ شحن سريع</span>}
          </div>

          {/* السعر */}
          <div style={{ background: '#f4f6f8', borderRadius: '10px', padding: '16px', marginBottom: '18px', border: '1px solid #eef0f3' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#145c22' }}>{formatPrice(p.price)}</span>
              {p.oldPrice && <span style={{ fontSize: '16px', color: '#6b7280', textDecoration: 'line-through' }}>{formatPrice(p.oldPrice)}</span>}
              {p.discount && <span style={{ background: '#fee2e2', color: '#d32f2f', fontSize: '13px', fontWeight: 700, padding: '3px 8px', borderRadius: '99px' }}>وفّر {p.discount}%</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#374151', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>🚚 توصيل مجاني فوق 5000 دج</span>
              <span>📦 متوفر في المخزن: {p.stock} قطعة</span>
              <span>↩️ إرجاع مجاني خلال 14 يوم</span>
            </div>
          </div>

          {/* الألوان */}
          {p.colors.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                اللون: <em style={{ fontStyle: 'normal', color: '#1a7c2e' }}>{selColor || 'اختر لوناً'}</em>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {p.colors.map(c => (
                  <div key={c} onClick={() => setSelColor(c)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, cursor: 'pointer', border: `3px solid ${selColor === c ? '#1a7c2e' : 'transparent'}`, boxShadow: '0 0 0 1px #dde1e7', transform: selColor === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.2s' }} />
                ))}
              </div>
            </div>
          )}

          {/* المقاسات */}
          {p.sizes.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                المقاس: <em style={{ fontStyle: 'normal', color: '#1a7c2e' }}>{selSize || 'اختر مقاساً'}</em>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {p.sizes.map(s => (
                  <button key={s} onClick={() => setSelSize(s)} style={{ padding: '7px 14px', border: `2px solid ${selSize === s ? '#1a7c2e' : '#dde1e7'}`, borderRadius: '7px', background: selSize === s ? '#edf7f0' : 'white', color: selSize === s ? '#1a7c2e' : '#374151', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* الكمية */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>الكمية:</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dde1e7', borderRadius: '8px', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', border: 'none', background: '#f4f6f8', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}>−</button>
              <span style={{ width: '44px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(p.stock, q + 1))} style={{ width: '36px', height: '36px', border: 'none', background: '#f4f6f8', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}>+</button>
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>({p.stock} متاح)</span>
          </div>

          {/* أزرار الشراء */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <button onClick={() => { addToCart(p); showPage('cart'); }} style={{ flex: 1, padding: '13px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '15px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
              🛒 اطلب الآن
            </button>
            <button onClick={() => addToCart(p)} style={{ flex: 1, padding: '13px', background: 'white', color: '#1a7c2e', border: '2px solid #1a7c2e', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '15px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
              🛒 أضف للسلة
            </button>
          </div>

          {/* أزرار ثانوية */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            <button onClick={() => toggleWish(p)} style={{ flex: 1, padding: '8px', background: inWish ? '#fee2e2' : '#f4f6f8', color: inWish ? '#d32f2f' : '#374151', border: `1px solid ${inWish ? '#fca5a5' : '#dde1e7'}`, borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {inWish ? '❤️ في المفضلة' : '🤍 أضف للمفضلة'}
            </button>
            <button onClick={() => showToast('تم نسخ رابط المنتج', 'success')} style={{ flex: 1, padding: '8px', background: '#f4f6f8', color: '#374151', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              🔗 مشاركة
            </button>
            <button onClick={() => showToast('تمت إضافة للمقارنة', 'info')} style={{ flex: 1, padding: '8px', background: '#f4f6f8', color: '#374151', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              ⚖️ مقارنة
            </button>
          </div>

          {/* ضمانات */}
          <div style={{ display: 'flex', border: '1px solid #eef0f3', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
            {[{ icon: '🛡️', title: 'ضمان الجودة', sub: '100% أصلي' }, { icon: '🚚', title: 'توصيل سريع', sub: '2-4 أيام' }, { icon: '↩️', title: 'إرجاع مجاني', sub: '14 يوم' }, { icon: '🔒', title: 'دفع آمن', sub: 'مشفر 100%' }].map((g, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 6px', textAlign: 'center', fontSize: '11px', color: '#374151', borderLeft: i > 0 ? '1px solid #eef0f3' : 'none' }}>
                <span style={{ fontSize: '18px' }}>{g.icon}</span>
                <strong style={{ fontSize: '12px', fontWeight: 700 }}>{g.title}</strong>
                <span>{g.sub}</span>
              </div>
            ))}
          </div>

          {/* الوصف */}
          <div style={{ background: '#f4f6f8', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>📝 وصف المنتج</div>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
          </div>

          {/* بطاقة البائع */}
          {seller && (
            <div style={{ border: '1px solid #eef0f3', borderRadius: '14px', overflow: 'hidden', background: 'white' }}>
              <div style={{ background: '#edf7f0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eef0f3' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: seller.avColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: 'white' }}>{seller.av}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{seller.name} {seller.verified && '✅'}</div>
                  <div style={{ fontSize: '12px', color: '#1a7c2e', fontWeight: 600 }}>بائع موثق على ترسترا</div>
                </div>
              </div>
              <div style={{ display: 'flex', padding: '12px 16px', gap: 0 }}>
                {[{ val: seller.rating, label: 'التقييم' }, { val: seller.reviews.toLocaleString(), label: 'تقييم' }, { val: seller.sales, label: 'مبيعات' }, { val: seller.responseRate + '%', label: 'استجابة' }].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', borderLeft: i > 0 ? '1px solid #eef0f3' : 'none' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#145c22' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => showToast(`تواصل مع ${seller.name}`, 'info')} style={{ flex: 1, padding: '8px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>💬 تواصل مع البائع</button>
                <button onClick={() => showToast(`متجر ${seller.name}`, 'info')} style={{ flex: 1, padding: '8px', background: 'white', color: '#374151', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>🏪 تصفح المتجر</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* قسم التقييمات */}
      <ReviewSection productId={p.id} />

      {/* منتجات مشابهة */}
      {related.length > 0 && (
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>📦 منتجات مشابهة</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
            {related.map((r, i) => <ProductCard key={r.id} product={r} idx={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
