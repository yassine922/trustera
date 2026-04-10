import { useState } from 'react';
import { PRODUCTS, getByCategory, formatPrice } from '../data/products';
import ProductCard from '../components/shared/ProductCard';
import { useApp } from '../contexts/AppContext';

const CATS = [
  { id: 'all', label: '🏪 الكل', count: PRODUCTS.length },
  { id: 'electronics', label: '📱 إلكترونيات', count: PRODUCTS.filter(p=>p.cat==='electronics').length },
  { id: 'fashion', label: '👗 أزياء', count: PRODUCTS.filter(p=>p.cat==='fashion').length },
  { id: 'home', label: '🏠 منزل', count: PRODUCTS.filter(p=>p.cat==='home').length },
  { id: 'beauty', label: '💄 جمال', count: PRODUCTS.filter(p=>p.cat==='beauty').length },
  { id: 'sports', label: '⚽ رياضة', count: PRODUCTS.filter(p=>p.cat==='sports').length },
];

export default function Categories() {
  const { currentCat, setCurrentCat, showToast } = useApp();
  const [sort, setSort] = useState('popular');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);

  let products = getByCategory(currentCat);

  // فلترة السعر
  products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // الترتيب
  if (sort === 'price-asc') products = [...products].sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') products = [...products].sort((a,b) => b.price - a.price);
  else if (sort === 'rating') products = [...products].sort((a,b) => b.rating - a.rating);
  else if (sort === 'newest') products = [...products].filter(p => p.isNew);
  else products = [...products].sort((a,b) => b.sold - a.sold);

  return (
    <div>
      <div style={{ padding: '14px 24px', background: 'white', borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>🏠 الرئيسية</span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>◀</span>
        <span style={{ fontSize: '12px', fontWeight: 700 }}>تصفح المنتجات</span>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* فلتر جانبي */}
        <div style={{ width: '220px', flexShrink: 0, padding: '20px 16px', borderLeft: '1px solid #eef0f3', background: 'white' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🔽 الفلاتر
          </div>

          {/* القسم */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>القسم</div>
            {CATS.map(cat => (
              <div key={cat.id} onClick={() => setCurrentCat(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', color: currentCat === cat.id ? '#1a7c2e' : '#374151', fontWeight: currentCat === cat.id ? 700 : 400 }}>
                <div style={{ width: '16px', height: '16px', border: `2px solid ${currentCat === cat.id ? '#1a7c2e' : '#dde1e7'}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentCat === cat.id ? '#1a7c2e' : 'white', color: 'white', fontSize: '10px' }}>
                  {currentCat === cat.id ? '✓' : ''}
                </div>
                <span style={{ fontSize: '13px', flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>{cat.count}</span>
              </div>
            ))}
          </div>

          {/* نطاق السعر */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>السعر (دج)</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', border: '1px solid #dde1e7', borderRadius: '6px', fontFamily: 'Cairo, sans-serif', fontSize: '12px' }} placeholder="من" />
              <span>—</span>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', border: '1px solid #dde1e7', borderRadius: '6px', fontFamily: 'Cairo, sans-serif', fontSize: '12px' }} placeholder="إلى" />
            </div>
            <button onClick={() => showToast('تم تطبيق الفلتر', 'success')} style={{ width: '100%', padding: '9px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
              تطبيق
            </button>
          </div>

          {/* التقييم */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>التقييم</div>
            {[5,4,3].map(r => (
              <div key={r} onClick={() => showToast(`فلتر ${r} نجوم`, 'info')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid #dde1e7', borderRadius: '4px' }} />
                <span style={{ fontSize: '13px' }}>{'⭐'.repeat(r)} {r}+</span>
              </div>
            ))}
          </div>
        </div>

        {/* المنتجات */}
        <div style={{ flex: 1, padding: '20px' }}>
          {/* الرقائق */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATS.map(cat => (
              <div key={cat.id} onClick={() => setCurrentCat(cat.id)} style={{ padding: '6px 14px', border: `1px solid ${currentCat === cat.id ? '#1a7c2e' : '#dde1e7'}`, borderRadius: '99px', background: currentCat === cat.id ? '#1a7c2e' : 'white', color: currentCat === cat.id ? 'white' : '#374151', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' }}>
                {cat.label}
              </div>
            ))}
          </div>

          {/* شريط الأدوات */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>عرض <strong style={{ color: '#111827' }}>{products.length}</strong> منتج</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', background: 'white', outline: 'none' }}>
              <option value="popular">الأكثر طلباً</option>
              <option value="newest">الأحدث</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>

          {/* الشبكة */}
          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
              {products.map((p, i) => <ProductCard key={p.id} product={p} idx={i} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>لا توجد نتائج</div>
              <div style={{ fontSize: '13px' }}>جرب تغيير الفلاتر أو البحث بكلمات مختلفة</div>
            </div>
          )}

          <button onClick={() => showToast('جاري تحميل المزيد...', 'info')} style={{ width: '100%', padding: '12px', background: 'white', border: '2px solid #dde1e7', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '20px', transition: 'all 0.2s' }}>
            ➕ تحميل المزيد
          </button>
        </div>
      </div>
    </div>
  );
}
