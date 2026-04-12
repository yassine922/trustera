import { useState, useEffect } from 'react';
import { PRODUCTS, formatPrice } from '../data/products';
import { useApp } from '../contexts/AppContext';

const API_URL = import.meta.env.VITE_API_URL || '';

const CATS = [
  { id: 'all', label: '🏪 الكل' },
  { id: 'electronics', label: '📱 إلكترونيات' },
  { id: 'fashion', label: '👗 أزياء' },
  { id: 'home', label: '🏠 منزل' },
  { id: 'beauty', label: '💄 جمال' },
  { id: 'sports', label: '⚽ رياضة' },
];

interface ApiProduct {
  _id: string; name: string; price: number; description: string;
  sellerId: string; createdAt: string; category?: string;
}

export default function Categories() {
  const { currentCat, setCurrentCat, showToast, showPage, setCurrentProduct } = useApp();
  const [sort, setSort] = useState('popular');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setApiProducts(data.data);
      }
    } catch {}
    finally { setLoading(false); }
  }

  // دمج المنتجات: API أولاً ثم المحلية
  const allProducts = apiProducts.length > 0
    ? apiProducts.map((p, i) => ({
        id: 9000 + i,
        _id: p._id,
        name: p.name,
        price: p.price,
        cat: p.category || 'all',
        catLabel: 'منتج',
        desc: p.description,
        seller: 'بائع',
        sellerId: 0,
        rating: 4.5,
        reviews: 0,
        stock: 10,
        isNew: true,
        isFeatured: true,
        isFast: false,
        emoji: '📦',
        colors: [],
        sizes: [],
        bg: 'gradient-1',
        sold: 0,
        isFromApi: true,
      }))
    : PRODUCTS.map(p => ({ ...p, isFromApi: false }));

  let products = currentCat === 'all'
    ? allProducts
    : allProducts.filter(p => p.cat === currentCat);

  products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

  if (sort === 'price-asc') products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') products = [...products].sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest') products = [...products].filter(p => p.isNew);

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
          <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '14px' }}>🔽 الفلاتر</div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#6b7280', marginBottom: '8px' }}>القسم</div>
            {CATS.map(cat => (
              <div key={cat.id} onClick={() => setCurrentCat(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', color: currentCat === cat.id ? '#1a7c2e' : '#374151', fontWeight: currentCat === cat.id ? 700 : 400 }}>
                <div style={{ width: '16px', height: '16px', border: `2px solid ${currentCat === cat.id ? '#1a7c2e' : '#dde1e7'}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentCat === cat.id ? '#1a7c2e' : 'white', color: 'white', fontSize: '10px' }}>
                  {currentCat === cat.id ? '✓' : ''}
                </div>
                <span style={{ fontSize: '13px' }}>{cat.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#6b7280', marginBottom: '8px' }}>السعر (دج)</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', border: '1px solid #dde1e7', borderRadius: '6px', fontFamily: 'Cairo, sans-serif', fontSize: '12px' }} placeholder="من" />
              <span>—</span>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', border: '1px solid #dde1e7', borderRadius: '6px', fontFamily: 'Cairo, sans-serif', fontSize: '12px' }} placeholder="إلى" />
            </div>
            <button onClick={() => showToast('تم تطبيق الفلتر', 'success')} style={{ width: '100%', padding: '9px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
              تطبيق
            </button>
          </div>
        </div>

        {/* المنتجات */}
        <div style={{ flex: 1, padding: '20px' }}>
          {/* رقائق الفئات */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATS.map(cat => (
              <div key={cat.id} onClick={() => setCurrentCat(cat.id)} style={{ padding: '6px 14px', border: `1px solid ${currentCat === cat.id ? '#1a7c2e' : '#dde1e7'}`, borderRadius: '99px', background: currentCat === cat.id ? '#1a7c2e' : 'white', color: currentCat === cat.id ? 'white' : '#374151', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                {cat.label}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              عرض <strong style={{ color: '#111827' }}>{products.length}</strong> منتج
              {apiProducts.length > 0 && <span style={{ marginRight: '8px', color: '#1a7c2e', fontSize: '11px' }}>✅ منتجات حقيقية</span>}
              {loading && <span style={{ marginRight: '8px', color: '#6b7280', fontSize: '11px' }}>⏳ جاري التحميل...</span>}
            </span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', background: 'white', outline: 'none' }}>
              <option value="popular">الأكثر طلباً</option>
              <option value="newest">الأحدث</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
              {products.map((p) => (
                <div key={p.id} onClick={() => showToast(p.name, 'info')} style={{ background: 'white', borderRadius: '14px', border: '1px solid #eef0f3', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg,#edf7f0,#c8e6c9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
                    {p.emoji}
                  </div>
                  <div style={{ padding: '12px' }}>
                    {p.isNew && <span style={{ background: '#edf7f0', color: '#1a7c2e', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', marginBottom: '6px', display: 'inline-block' }}>جديد</span>}
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', lineHeight: 1.4 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{p.desc?.slice(0, 50)}...</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '15px' }}>{formatPrice(p.price)}</span>
                      <button onClick={e => { e.stopPropagation(); showToast('تمت الإضافة للسلة ✅', 'success'); }} style={{ padding: '6px 12px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        🛒 أضف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>لا توجد منتجات</div>
              <div style={{ fontSize: '13px' }}>جرب تغيير الفلاتر</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}