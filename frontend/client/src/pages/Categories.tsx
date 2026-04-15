import { useState, useEffect } from 'react';
import { PRODUCTS, formatPrice } from '../data/products';
import { useApp } from '../contexts/AppContext';
import { useLocation } from 'wouter';

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
  const { currentCat, setCurrentCat, showToast } = useApp();
  const [, setLocation] = useLocation();
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
      <div className="px-6 py-3.5 bg-white border-b border-gray-100 flex items-center gap-2">
        <span className="text-xs text-gray-500">🏠 الرئيسية</span>
        <span className="text-xs text-gray-400">◀</span>
        <span className="text-xs font-bold text-gray-900">تصفح المنتجات</span>
      </div>

      <div className="flex gap-0">
        {/* فلتر جانبي */}
        <div className="w-[220px] flex-shrink-0 p-5 border-l border-gray-100 bg-white hidden md:block">
          <div className="text-sm font-extrabold mb-3.5">🔽 الفلاتر</div>

          <div className="mb-5">
            <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">القسم</div>
            {CATS.map(cat => (
              <div key={cat.id} onClick={() => setCurrentCat(cat.id)} className={`flex items-center gap-2 py-1.5 cursor-pointer transition-colors ${currentCat === cat.id ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'}`}>
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center text-[10px] transition-colors ${currentCat === cat.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200'}`}>
                  {currentCat === cat.id ? '✓' : ''}
                </div>
                <span className="text-[13px]">{cat.label}</span>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">السعر (دج)</div>
            <div className="flex gap-2 items-center">
              <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} className="w-20 px-2 py-1.5 border border-gray-200 rounded-md font-cairo text-xs outline-none focus:border-primary" placeholder="من" />
              <span>—</span>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-20 px-2 py-1.5 border border-gray-200 rounded-md font-cairo text-xs outline-none focus:border-primary" placeholder="إلى" />
            </div>
            <button onClick={() => showToast('تم تطبيق الفلتر', 'success')} className="w-full mt-2 py-2 bg-primary text-white rounded-lg font-cairo text-[13px] font-bold hover:bg-primary-dark transition-colors">
              تطبيق
            </button>
          </div>
        </div>

        {/* المنتجات */}
        <div className="flex-1 p-5">
          {/* رقائق الفئات */}
          <div className="flex gap-2 flex-wrap mb-4">
            {CATS.map(cat => (
              <div key={cat.id} onClick={() => setCurrentCat(cat.id)} className={`px-3.5 py-1.5 border rounded-full cursor-pointer font-cairo text-[13px] font-semibold transition-all ${currentCat === cat.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'}`}>
                {cat.label}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[13px] text-gray-500">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {products.map((p) => (
                <div key={p.id} onClick={() => setLocation(`/product/${(p as any)._id || p.id}`)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-5xl">
                    {p.emoji}
                  </div>
                  <div className="p-3">
                    {p.isNew && <span className="bg-green-50 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 inline-block">جديد</span>}
                    <div className="font-bold text-[13px] mb-1 line-clamp-1">{p.name}</div>
                    <div className="text-[11px] text-gray-500 mb-2 line-clamp-2 leading-relaxed">{p.desc?.slice(0, 50)}...</div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-primary text-[15px]">{formatPrice(p.price)}</span>
                      <button onClick={e => { e.stopPropagation(); showToast('تمت الإضافة للسلة ✅', 'success'); }} className="px-3 py-1.5 bg-primary text-white rounded-lg font-cairo text-xs font-bold hover:bg-primary-dark transition-colors">
                        🛒 أضف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-3">🔍</div>
              <div className="text-lg font-bold text-gray-900 mb-1">لا توجد منتجات</div>
              <div className="text-[13px]">جرب تغيير الفلاتر أو البحث عن شيء آخر</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}