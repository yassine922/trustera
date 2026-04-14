import { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // التأكد من المسار الصحيح في نفس المجلد
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
      return data.success ? data.data.map((p: any) => ({ ...p, id: p._id, isReal: true })) : null;
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
    <div className="pb-24 md:pb-0">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-8 py-12 text-white relative overflow-hidden min-h-[400px] flex items-center rounded-b-[40px] md:rounded-b-[60px] shadow-2xl">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-500/5 translate-y-1/3 translate-x-1/4 blur-3xl" />
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-4 py-1.5 text-xs font-black mb-5 uppercase tracking-widest animate-pulse">
            🎉 منصة التسوق الأولى في الجزائر
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            تسوّق بثقة،<br /><span className="text-amber-400 underline decoration-amber-500/30 decoration-8 underline-offset-12">بيع بسهولة</span>
          </h1>
          <p className="text-base text-white/70 mb-8 max-w-lg font-medium leading-relaxed">
            اكتشف آلاف المنتجات من بائعين موثوقين في الجزائر. جودة مضمونة وتوصيل سريع.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => showPage('categories')} 
              className="px-8 py-3.5 bg-amber-500 text-green-950 border-0 rounded-xl font-cairo text-sm font-black cursor-pointer transition-all hover:scale-105 shadow-xl shadow-amber-500/20"
            >
              🛍️ تسوق الآن
            </button>
            <button 
              onClick={() => showPage('seller-register')} 
              className="px-8 py-3.5 bg-white/10 text-white border-2 border-white/20 rounded-xl font-cairo text-sm font-black cursor-pointer hover:bg-white/20 transition backdrop-blur-md"
            >
              🏪 ابدأ البيع
            </button>
          </div>
        </div>

        <div className="hidden lg:flex w-96 flex-shrink-0 relative z-10 items-center justify-center">
          <div className="w-64 h-64 rounded-[40px] bg-gradient-to-br from-amber-400 to-amber-600 border-8 border-white/10 flex items-center justify-center text-[150px] animate-bounce shadow-2xl rotate-6">
            🛍️
          </div>
        </div>

        {/* Trust badges */}
        <div className="absolute bottom-0 left-0 right-0 hidden md:flex bg-black/30 backdrop-blur-xl border-t border-white/10">
          {[
            { icon: '🛡️', title: 'تسوق آمن 100%', sub: 'حماية كاملة لبياناتك' },
            { icon: '🚚', title: 'توصيل سريع', sub: 'خلال 2-4 أيام عمل' },
            { icon: '↩️', title: 'إرجاع مجاني', sub: 'خلال 14 يوم' },
            { icon: '🏆', title: 'ضمان الجودة', sub: 'منتجات موثوقة 100%' },
          ].map((b, i) => (
            <div key={i} className="flex-1 flex items-center gap-3 px-6 py-4 border-l border-white/10 first:border-l-0 text-white text-[10px] font-black uppercase tracking-tighter">
              <span className="text-xl">{b.icon}</span>
              <div>
                <div className="font-bold">{b.title}</div>
                <div className="opacity-50">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قسم المنتجات الرائجة */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-black flex items-center gap-2 text-green-950">
            🔥 المنتجات الرائجة
          </div>
          <button 
            onClick={() => showPage('categories')} 
            className="text-xs text-amber-600 font-black cursor-pointer flex items-center gap-1 hover:underline uppercase tracking-widest"
          >
            View All ◀
          </button>
        </div>
        <div className="grid grid-cols-auto-fill gap-3.5">
          {featured.map((p, i) => (
            <ProductCard key={p.id || (p as any)._id || i} product={p} idx={i} />
          ))}
        </div>
      </div>

      {/* بانر العروض */}
      <div className="mx-6 mt-8 bg-gradient-to-br from-green-900 to-green-950 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <span className="text-7xl animate-pulse">⚡</span>
        <div className="flex-1">
          <div className="text-3xl font-black mb-2 text-amber-400 uppercase tracking-tighter">عروض الصفقات الذهبية</div>
          <div className="text-sm text-white/60 font-bold mb-4">تنتهي العروض الحصرية في:</div>
          <Countdown />
        </div>
        <button 
          onClick={() => showPage('categories')} 
          className="px-10 py-4 bg-amber-500 text-green-950 border-0 rounded-2xl font-cairo text-sm font-black cursor-pointer hover:bg-amber-400 hover:scale-105 transition shadow-xl shadow-amber-500/20 whitespace-nowrap"
        >
          🏷️ تصفح العروض
        </button>
      </div>

      {/* المنتجات الجديدة */}
      <div className="px-6 py-12">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-black flex items-center gap-2 text-green-950">
            <span className="bg-amber-500 text-green-950 text-[10px] px-3 py-1 rounded-lg font-black tracking-[0.2em] uppercase">New</span>
            وصل حديثاً
          </div>
          <button 
            onClick={() => showPage('categories')} 
            className="text-xs text-amber-600 font-black cursor-pointer hover:underline uppercase tracking-widest"
          >
            View All ◀
          </button>
        </div>
        <div className="grid grid-cols-auto-fill gap-3.5">
          {newest.map((p, i) => (
            <ProductCard key={p.id || (p as any)._id || i} product={p} idx={i} />
          ))}
        </div>
      </div>

      {/* قسم تطبيق الجوال (App Promotion) */}
      <div className="mx-6 my-10 bg-green-900 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex-1 relative z-10 text-center md:text-right">
          <div className="text-amber-400 font-black text-sm mb-2">تجربة تسوق أسرع ⚡</div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">حمل تطبيق ترسترا الآن</h2>
          <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto md:mr-0">
            احصل على تنبيهات فورية للطلبات، عروض حصرية، وتجربة تصفح سلسة وموفرة للبيانات.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button className="flex items-center gap-3 bg-black text-white px-6 py-2.5 rounded-xl border border-white/20 hover:bg-gray-900 transition-all">
              <span className="text-2xl">🤖</span>
              <div className="text-right">
                <div className="text-[10px] opacity-60">Get it on</div>
                <div className="text-xs font-bold">Google Play</div>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-black text-white px-6 py-2.5 rounded-xl border border-white/20 hover:bg-gray-900 transition-all">
              <span className="text-2xl">🍎</span>
              <div className="text-right">
                <div className="text-[10px] opacity-60">Download on</div>
                <div className="text-xs font-bold">App Store</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="w-48 h-48 md:w-64 md:h-64 bg-white/5 rounded-full flex items-center justify-center text-8xl md:text-9xl relative z-10 border border-white/10 animate-pulse">
          📱
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
