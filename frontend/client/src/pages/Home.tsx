import { useState, useEffect } from 'react';
import ProductCard from '../components/shared/ProductCard';
import { useApp } from '../contexts/AppContext';

// ✅ إضافة: منتجات حقيقية مع SKU
const REAL_PRODUCTS = [
  {
    id: 'TR-001-FASH',
    sku: 'TR-001-FASH',
    name: 'تيشيرت صيفي قطن 100%',
    price: 1800,
    originalPrice: 2500,
    emoji: '👕',
    seller: 'StyleHub',
    sellerId: 'SELL-001',
    category: 'fashion',
    rating: 4.6,
    reviews: 238,
    sold: 1200,
    isReal: true
  },
  {
    id: 'TR-002-ELEC',
    sku: 'TR-002-ELEC',
    name: 'سماعات بلوتوث لاسلكية Pro',
    price: 2500,
    originalPrice: 3800,
    emoji: '🎧',
    seller: 'TechStore DZ',
    sellerId: 'SELL-002',
    category: 'electronics',
    rating: 4.8,
    reviews: 412,
    sold: 800,
    isReal: true
  },
  {
    id: 'TR-003-FASH',
    sku: 'TR-003-FASH',
    name: 'حذاء رياضي أبيض كلاسيك',
    price: 3500,
    originalPrice: 4500,
    emoji: '👟',
    seller: 'ShoesWorld',
    sellerId: 'SELL-003',
    category: 'fashion',
    rating: 4.4,
    reviews: 156,
    sold: 600,
    isReal: true
  },
  {
    id: 'TR-004-ELEC',
    sku: 'TR-004-ELEC',
    name: 'ساعة ذكية Smart Watch Pro',
    price: 8900,
    originalPrice: 12000,
    emoji: '⌚',
    seller: 'TechStore DZ',
    sellerId: 'SELL-002',
    category: 'electronics',
    rating: 4.7,
    reviews: 89,
    sold: 400,
    isReal: true
  },
  {
    id: 'TR-005-BEAU',
    sku: 'TR-005-BEAU',
    name: 'مجموعة عناية بالبشرة طبيعية',
    price: 2800,
    originalPrice: 3500,
    emoji: '🧴',
    seller: 'BeautyZone',
    sellerId: 'SELL-004',
    category: 'beauty',
    rating: 4.5,
    reviews: 167,
    sold: 500,
    isReal: true
  },
  {
    id: 'TR-006-ELEC',
    sku: 'TR-006-ELEC',
    name: 'هاتف ذكي Android 256GB',
    price: 45000,
    originalPrice: 55000,
    emoji: '📱',
    seller: 'TechStore DZ',
    sellerId: 'SELL-002',
    category: 'electronics',
    rating: 4.6,
    reviews: 332,
    sold: 1000,
    isReal: true
  }
];

// ✅ إضافة: دالة جلب من API (مستقبلية)
async function fetchProductsFromAPI() {
  try {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      return data.map((p: any) => ({ ...p, isReal: true }));
    }
  } catch (e) {
    console.log('API غير متاح، استخدام البيانات المحلية');
  }
  return null;
}

function Countdown() {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) return;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex gap-2">
      {[{ val: time.h, label: 'ساعة' }, { val: time.m, label: 'دقيقة' }, { val: time.s, label: 'ثانية' }].map((u, i) => (
        <div key={i} className="bg-white/15 rounded-lg px-2.5 py-1.5 text-center min-w-13">
          <span className="text-5xl font-black block">{u.val}</span>
          <span className="text-xs text-white/70">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { showPage } = useApp();
  const [products, setProducts] = useState(REAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // ✅ إضافة: جلب من API عند التحميل
  useEffect(() => {
    const loadProducts = async () => {
      const apiProducts = await fetchProductsFromAPI();
      if (apiProducts) {
        setProducts(apiProducts);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  const featured = products.slice(0, 4);
  const newest = products.slice(2, 6);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>;
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light px-8 py-10 text-white relative overflow-hidden min-h-56 flex items-center">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/4 translate-y-1/3 translate-x-1/4" />
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold mb-3.5">
            🎉 منصة التسوق الأولى في الجزائر
          </div>
          <h1 className="text-4xl font-black leading-tight mb-2.5">
            تسوّق بثقة،<br /><span className="text-green-300">بيع بسهولة</span>
          </h1>
          <p className="text-sm text-white/80 mb-5.5 max-w-96">
            اكتشف آلاف المنتجات من بائعين موثوقين في الجزائر. جودة مضمونة وتوصيل سريع.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => showPage('categories')} 
              className="px-7 py-2.75 bg-white text-primary-dark border-0 rounded-lg font-cairo text-sm font-black cursor-pointer transition-all hover:shadow-lg"
            >
              🛍️ تسوق الآن
            </button>
            <button 
              onClick={() => showPage('seller-register')} 
              className="px-7 py-2.75 bg-white/15 text-white border-2 border-white/35 rounded-lg font-cairo text-sm font-bold cursor-pointer hover:bg-white/25 transition"
            >
              🏪 ابدأ البيع
            </button>
          </div>
        </div>

        <div className="w-96 flex-shrink-0 relative z-10 flex items-center justify-center">
          <div className="w-52 h-52 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-9xl animate-bounce">
            🛍️
          </div>
        </div>

        {/* Trust badges */}
        <div className="absolute bottom-0 left-0 right-0 flex bg-black/20 border-t border-white/10">
          {[
            { icon: '🛡️', title: 'تسوق آمن 100%', sub: 'حماية كاملة لبياناتك' },
            { icon: '🚚', title: 'توصيل سريع', sub: 'خلال 2-4 أيام عمل' },
            { icon: '↩️', title: 'إرجاع مجاني', sub: 'خلال 14 يوم' },
            { icon: '🏆', title: 'ضمان الجودة', sub: 'منتجات موثوقة 100%' },
          ].map((b, i) => (
            <div key={i} className="flex-1 flex items-center gap-2.5 px-5 py-3 border-l border-white/10 first:border-l-0 text-white/85 text-xs">
              <span className="text-base">{b.icon}</span>
              <div>
                <div className="font-bold">{b.title}</div>
                <div className="opacity-70">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قسم المنتجات الرائجة */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-black flex items-center gap-2">
            🔥 المنتجات الرائجة
          </div>
          <button 
            onClick={() => showPage('categories')} 
            className="text-sm text-primary font-semibold cursor-pointer flex items-center gap-1 hover:underline"
          >
            عرض الكل ◀
          </button>
        </div>
        <div className="grid grid-cols-auto-fill gap-3.5">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} idx={i} />
          ))}
        </div>
      </div>

      {/* بانر العروض */}
      <div className="mx-6 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-7 flex items-center gap-4 text-white">
        <span className="text-6xl">⚡</span>
        <div className="flex-1">
          <div className="text-2xl font-black mb-1">عروض اليوم الحصرية</div>
          <div className="text-sm text-white/80">تنتهي خلال:</div>
          <div className="mt-2"><Countdown /></div>
        </div>
        <button 
          onClick={() => showPage('categories')} 
          className="px-6 py-2.5 bg-white text-indigo-600 border-0 rounded-lg font-cairo text-sm font-black cursor-pointer hover:shadow-lg transition whitespace-nowrap"
        >
          🏷️ تصفح العروض
        </button>
      </div>

      {/* المنتجات الجديدة */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-black flex items-center gap-2">
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
            منتجات جديدة
          </div>
          <button 
            onClick={() => showPage('categories')} 
            className="text-sm text-primary font-semibold cursor-pointer hover:underline"
          >
            عرض الكل ◀
          </button>
        </div>
        <div className="grid grid-cols-auto-fill gap-3.5">
          {newest.map((p, i) => (
            <ProductCard key={p.id} product={p} idx={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: float 3s ease-in-out infinite;
        }
        .grid-cols-auto-fill {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
