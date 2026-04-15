import { useState, useEffect } from 'react';
import { formatPrice } from '../data/products'; // قد تحتاج لتحديث أو حذف هذا الاستيراد إذا كانت جميع البيانات ستأتي من API
import ReviewSection from '../components/shared/ReviewSection';
import ProductCard from '../components/shared/ProductCard';
import { useApp } from '../contexts/AppContext';
import { useRoute, useLocation } from 'wouter';
import axios from 'axios'; // إضافة axios لجلب البيانات من API

const API_URL = import.meta.env.VITE_API_URL || '';

function Stars({ rating }: { rating: number }) {
  return <span className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className={`${i <= Math.floor(rating) ? 'text-amber-500' : 'text-gray-300'} text-sm`}>★</span>)}</span>;
}

export default function ProductPage() {
  const { addToCart, toggleWish, wishlist, showToast, token } = useApp();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/product/:id");
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<any>(null); // سيتم جلب المنتج من API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب بيانات المنتج من API
  useEffect(() => {
    async function fetchProduct() {
      if (!params?.id) {
        setLocation('/'); // العودة للرئيسية إذا لم يكن هناك ID
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_URL}/api/products/${params.id}`, { headers });
        if (res.data.success) {
          setProduct(res.data.data);
          setQty(1); // إعادة ضبط الكمية عند تغيير المنتج
          window.scrollTo(0, 0);
        } else {
          showToast(res.data.message || 'فشل جلب المنتج', 'error');
          setLocation('/categories'); // العودة لصفحة التصنيفات
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'خطأ في جلب بيانات المنتج');
        showToast(err.response?.data?.message || 'خطأ في جلب بيانات المنتج', 'error');
        setLocation('/categories'); // العودة لصفحة التصنيفات
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params?.id, token, setLocation, showToast]);

  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (product?.category) {
      const fetchRelated = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/products/search?category=${product.category}`);
          if (res.data.success) return res.data.data;
          return [];
        } catch (e) {
          return [];
        }
      };
      fetchRelated().then(data => {
        // فلترة المنتج الحالي إذا كانت البيانات الثابتة تحتوي عليه
        const filtered = data.filter((r:any) => r._id !== product._id);
        setRelated(filtered.slice(0, 4));
      });
    }
  }, [product]);


  if (loading) return <div className="p-20 text-center font-cairo font-bold text-gray-400">جاري تحميل المنتج...</div>;
  if (error) return <div className="p-20 text-center font-cairo font-bold text-red-500">{error}</div>;
  if (!product) return null; // لا شيء للعرض إذا لم يتم تحميل المنتج وبعد التحقق من الأخطاء

  const p = product;
  // const seller = getSellerById(p.sellerId); // يجب جلب معلومات البائع من API
  const inWish = wishlist.some(w => (w._id || w.id) === (p._id || p.id)); // Point: ID Consistency

  const bgClasses: Record<string, string> = {
    'gradient-1': 'from-blue-50 to-blue-200',
    'gradient-2': 'from-pink-50 to-pink-200',
    'gradient-3': 'from-green-50 to-green-200',
    'gradient-4': 'from-yellow-50 to-yellow-200',
    'gradient-5': 'from-purple-50 to-purple-200',
    'gradient-6': 'from-teal-50 to-teal-200',
  };

  return (
    <div className="font-cairo animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
        <button onClick={() => setLocation('/')} className="text-primary hover:underline">الرئيسية</button>
        <span className="text-gray-300 text-[10px]">◀</span>
        <button onClick={() => setLocation('/categories')} className="text-primary hover:underline">المنتجات</button>
        <span className="text-gray-300 text-[10px]">◀</span>
        <span className="font-bold text-gray-900">{p.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* معرض الصور */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className={`bg-gradient-to-br ${bgClasses[p.bg] || 'from-gray-50 to-gray-100'} rounded-2xl aspect-square flex items-center justify-center text-[130px] border border-gray-100 relative overflow-hidden shadow-inner`}>
            {p.image ? <img src={p.image} alt={p.name} className="object-cover w-full h-full" /> : <span className="drop-shadow-2xl transition-transform hover:scale-110 duration-300 cursor-zoom-in">📦</span>}
            {p.discount && <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">-{p.discount}%</div>}
          </div>
          <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
            {[p.image || '📦', '🔍','💡','⭐'].map((item, i) => ( // استخدام صورة المنتج إن وجدت
              <div key={i} className={`w-18 h-18 rounded-xl border-2 flex items-center justify-center text-3xl cursor-pointer transition-all ${i === 0 ? 'border-primary bg-green-50 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-primary/30'}`}>
                {typeof item === 'string' && item.startsWith('http') ? <img src={item} alt="thumbnail" className="object-cover w-full h-full rounded-lg"/> : item}
              </div>
            ))}
          </div>
        </div>

        {/* معلومات المنتج */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-primary font-black uppercase tracking-widest mb-1.5">{p.category || 'عام'}</div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">{p.name}</h1>

          {/* التقييم */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <Stars rating={p.averageRating} /> {/* استخدام averageRating من API */}
            <span className="font-bold text-gray-900">{p.averageRating}</span>
            <span className="text-sm text-gray-400">({p.reviewsCount} تقييم)</span> {/* استخدام reviewsCount من API */}
            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <span className="text-xs text-primary font-bold">تم البيع: {p.sold || 0} مرة</span> {/* لا يوجد sold حاليًا في API Product */}
            {/* {p.isNew && <span className="bg-green-50 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">جديد</span>} */}
            {/* {p.isFast && <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">⚡ شحن سريع</span>} */}
          </div>

          {/* السعر */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-primary">{formatPrice(p.price)} دج</span>
              {/* {p.oldPrice && <span className="text-lg text-gray-400 line-through font-bold">{formatPrice(p.oldPrice)} دج</span>} */}
              {/* {p.discount && <span className="bg-red-50 text-red-600 text-xs font-black px-2.5 py-1 rounded-lg">وفر {p.discount}%</span>} */}
            </div>
            <div className="text-[11px] text-gray-500 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-1.5"><span className="text-lg">🚚</span> توصيل مجاني فوق 5000 دج</div>
              <div className="flex items-center gap-1.5 font-bold text-gray-700"><span className="text-lg">📦</span> متوفر: {p.stock} قطعة</div>
              <div className="flex items-center gap-1.5"><span className="text-lg">↩️</span> إرجاع مجاني خلال 14 يوم</div>
            </div>
          </div>
          
          {/* الكمية */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-bold text-gray-700">الكمية:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 bg-gray-50 text-gray-700 border-r border-gray-100 text-lg font-bold hover:bg-gray-100 transition-colors">−</button>
              <span className="w-11 h-9 flex items-center justify-center font-bold text-base text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => Math.min(p.stock, q + 1))} className="w-9 h-9 bg-gray-50 text-gray-700 border-l border-gray-100 text-lg font-bold hover:bg-gray-100 transition-colors">+</button>
            </div>
            <span className="text-xs text-gray-500">({p.stock} متاح)</span>
          </div>

          {/* أزرار الشراء */}
          <div className="flex flex-col sm:flex-row gap-3.5 mb-5">
            <button onClick={() => { addToCart({ ...p, qty }); setLocation('/cart'); }} className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-green-100 hover:bg-primary-dark transition-all flex items-center justify-center gap-2" disabled={p.stock === 0}>
              🛒 اطلب الآن
            </button>
            <button onClick={() => addToCart({ ...p, qty })} className="flex-1 py-4 bg-white text-primary border-2 border-primary rounded-xl font-bold text-base hover:bg-green-50 transition-all flex items-center justify-center gap-2" disabled={p.stock === 0}>
              🛒 أضف للسلة
            </button>
          </div>

          {/* أزرار ثانوية */}
          <div className="flex gap-2.5 mb-6">
            <button onClick={() => toggleWish(p)} className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors border ${inWish ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}>
              {inWish ? '❤️ في المفضلة' : '🤍 أضف للمفضلة'}
            </button>
            <button onClick={() => showToast('تم نسخ رابط المنتج', 'success')} className="flex-1 py-2.5 bg-gray-50 text-gray-600 border border-gray-100 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors">
              🔗 مشاركة
            </button>
            <button onClick={() => showToast('تمت إضافة للمقارنة', 'info')} className="flex-1 py-2.5 bg-gray-50 text-gray-600 border border-gray-100 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors">
              ⚖️ مقارنة
            </button>
          </div>

          {/* ضمانات */}
          <div className="flex border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
            {[{ icon: '🛡️', title: 'ضمان الجودة', sub: '100% أصلي' }, { icon: '🚚', title: 'توصيل سريع', sub: '2-4 أيام' }, { icon: '↩️', title: 'إرجاع مجاني', sub: '14 يوم' }, { icon: '🔒', title: 'دفع آمن', sub: 'مشفر 100%' }].map((g, i) => (
              <div key={i} className={`flex-1 flex flex-col items-center gap-1.5 p-3 text-center text-xs text-gray-600 ${i > 0 ? 'border-l border-gray-100' : ''}`}>
                <span className="text-xl">{g.icon}</span>
                <strong className="text-sm font-bold text-gray-900">{g.title}</strong>
                <span className="text-[10px] text-gray-400">{g.sub}</span>
              </div>
            ))}
          </div>

          {/* الوصف */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="text-sm font-black text-gray-900 mb-3">📝 وصف المنتج</div>
            <p className="text-sm text-gray-700 leading-relaxed font-bold">{p.description}</p>
          </div>

          {/* بطاقة البائع */}
          {p.sellerId && ( // تأكد أن لديك بيانات البائع من API
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-green-50/50 p-4 flex items-center gap-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-xl font-black text-white shadow-lg shadow-green-100">{p.sellerId.name?.[0] || 'S'}</div>
                <div>
                  <div className="text-lg font-black text-gray-900">{p.sellerId.name} {p.sellerId.role === 'seller' && '✅'}</div>
                  <div className="text-xs text-primary font-bold mt-0.5">بائع موثق على ترسترا</div>
                </div>
              </div>
              <div className="flex p-4">
                {[{ val: p.sellerId.rating || 0, label: 'التقييم' }, { val: p.sellerId.reviewsCount || 0, label: 'تقييم' }, { val: p.sellerId.sales || 0, label: 'مبيعات' }].map((s, i) => (
                  <div key={i} className={`flex-1 text-center ${i > 0 ? 'border-l border-gray-100' : ''}`}>
                    <div className="text-lg font-black text-primary">{s.val}</div>
                    <div className="text-[11px] text-gray-400 font-bold">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5 p-4 pt-2">
                <button onClick={() => showToast(`تواصل مع ${p.sellerId.name}`, 'info')} className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-lg shadow-green-100 hover:bg-primary-dark transition-all">💬 تواصل مع البائع</button>
                <button onClick={() => showToast(`متجر ${p.sellerId.name}`, 'info')} className="flex-1 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all">🏪 تصفح المتجر</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* قسم التقييمات */}
      <div className="bg-gray-50/50 py-10">
        <ReviewSection productId={p._id} /> {/* استخدام _id للمنتج من API */}
      </div>

      {/* منتجات مشابهة */}
      {related.length > 0 && (
        <div className="px-6 py-12">
          <div className="text-xl font-black mb-6 flex items-center gap-2">📦 منتجات مشابهة قد تعجبك</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((r, i) => <ProductCard key={r._id} product={r} idx={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
