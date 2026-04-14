import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/shared/ProductCard';
import { formatPrice } from '../data/products';
import { useLocation } from 'wouter';

/* ===== ORDER SUCCESS ===== */
export function OrderSuccess() {
  const { orderNum } = useApp();
  const [, setLocation] = useLocation();
  return (
    <div className="max-w-[540px] mx-auto my-16 text-center px-6 font-cairo">
      <div className="text-8xl mb-4 animate-bounce">🎉</div>
      <h2 className="text-3xl font-black mb-2 text-primary-dark">تم تأكيد طلبك بنجاح!</h2>
      <p className="text-gray-500 mb-6">رقم الطلب: <strong className="text-primary text-lg tracking-widest">{orderNum || '#TR-8821'}</strong></p>
      <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100 text-right">
        {[
          { icon:'✅', title:'تم استلام الطلب', time:'الآن', done:true },
          { icon:'📦', title:'قيد التجهيز', time:'خلال 24 ساعة', done:false },
          { icon:'🚚', title:'في الطريق', time:'خلال 2-4 أيام', done:false },
        ].map((s,i) => (
          <div key={i} className={`flex items-center gap-4 ${i < 2 ? 'mb-4' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${s.done ? 'bg-primary text-white shadow-md shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>{s.icon}</div>
            <div className={s.done ? 'text-gray-900' : 'text-gray-400'}>
              <strong className="block text-sm">{s.title}</strong>
              <div className="text-[11px]">{s.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => setLocation('/account')} className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-primary-dark transition-all">متابعة طلباتي</button>
        <button onClick={() => setLocation('/')} className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">العودة للتسوق</button>
      </div>
    </div>
  );
}

/* ===== WISHLIST ===== */
export function Wishlist() {
  const { wishlist } = useApp();
  const [, setLocation] = useLocation();
  return (
    <div className="font-cairo">
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">❤️ المفضلة ({wishlist.length} منتج)</h1>
      </div>
      <div className="p-6">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map((p,i) => <ProductCard key={p.id} product={p} idx={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-7xl mb-4 grayscale opacity-50">❤️</div>
            <div className="text-xl font-bold text-gray-900 mb-2">قائمة المفضلة فارغة</div>
            <button onClick={() => setLocation('/categories')} className="mt-4 px-8 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all">استكشف المنتجات</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== ACCOUNT ===== */
export function Account() {
  const { showToast, user } = useApp();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState('orders');

  const ORDERS = [
    { id:'TRS-2025-4821', status:'في الطريق', statusColor:'#0284c7', statusBg:'#dbeafe', date:'8 أبريل 2025', items:2, total:5400 },
    { id:'TRS-2025-3190', status:'تم التوصيل', statusColor:'#1a7c2e', statusBg:'#edf7f0', date:'1 أبريل 2025', items:1, total:2500 },
    { id:'TRS-2025-2847', status:'قيد التجهيز', statusColor:'#f59e0b', statusBg:'#fef3c7', date:'28 مارس 2025', items:3, total:12300 },
  ];

  const sections: Record<string, React.ReactNode> = {
    orders: (
      <div>
        <h2 className="text-lg font-black mb-4">📦 طلباتي الأخيرة</h2>
        {ORDERS.map(o => (
          <div key={o.id} className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex items-center gap-4 hover:shadow-sm transition-all">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: o.statusBg }}>📦</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-gray-900 tracking-wider">{o.id}</div>
              <div className="text-[11px] text-gray-400 mt-1">{o.date} · {o.items} منتج</div>
            </div>
            <div className="text-left">
              <span className="px-3 py-1 rounded-full text-[10px] font-black block mb-2" style={{ backgroundColor: o.statusBg, color: o.statusColor }}>{o.status}</span>
              <div className="text-base font-black text-primary">{formatPrice(o.total)} دج</div>
            </div>
          </div>
        ))}
      </div>
    ),
    wallet: (
      <div>
        <h2 className="text-lg font-black mb-4">💰 رصيد المحفظة</h2>
        <div className="bg-gradient-to-br from-primary-dark to-primary rounded-3xl p-8 text-white mb-6 text-center shadow-lg shadow-green-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="text-xs opacity-70 mb-2 font-bold uppercase tracking-wider">الرصيد المتاح</div>
          <div className="text-5xl font-black">12,500 <span className="text-xl">دج</span></div>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => showToast('إيداع قريباً','info')} className="bg-white/20 px-6 py-2 rounded-xl text-sm font-bold backdrop-blur-md hover:bg-white/30 transition-all">إيداع</button>
            <button onClick={() => showToast('سحب قريباً','info')} className="bg-white/20 px-6 py-2 rounded-xl text-sm font-bold backdrop-blur-md hover:bg-white/30 transition-all">سحب</button>
          </div>
        </div>
      </div>
    ),
    messages: (
      <div>
        <h2 className="text-lg font-black mb-4">💬 الرسائل</h2>
        {[
          { name:'StyleHub', av:'S', color:'#1565c0', msg:'شكراً لتسوقك معنا! كيف يمكنني مساعدتك؟', time:'10:30', unread:2 },
          { name:'TechStore DZ', av:'T', color:'#2e7d32', msg:'تم تأكيد طلبك وسيصل خلال يومين.', time:'أمس', unread:0 },
        ].map((m,i) => (
          <div key={i} className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all" onClick={() => showToast(`فتح محادثة ${m.name}`,'info')}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm" style={{ backgroundColor: m.color }}>{m.av}</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-gray-900">{m.name}</div>
              <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{m.msg}</div>
            </div>
            <div className="text-left flex flex-col items-end">
              <div className="text-[10px] text-gray-400 font-bold mb-1">{m.time}</div>
              {m.unread > 0 && <div className="bg-primary text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md shadow-green-100">{m.unread}</div>}
            </div>
          </div>
        ))}
      </div>
    ),
    addresses: (
      <div>
        <h2 className="text-lg font-black mb-4">📍 عناويني المسجلة</h2>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🏠</span>
            <span className="font-bold text-gray-900">المنزل</span>
            <span className="bg-green-50 text-primary px-3 py-1 rounded-full text-[10px] font-black mr-auto uppercase">افتراضي</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-bold">حي المدينة الجديدة، شارع الاستقلال، الجزائر العاصمة</p>
          <button onClick={() => showToast('تعديل العنوان قريباً','info')} className="mt-4 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black text-gray-600 hover:bg-gray-100 transition-colors">تعديل العنوان</button>
        </div>
      </div>
    ),
    profile: (
      <div className="max-w-md">
        <h2 className="text-lg font-black mb-4 text-gray-900">✏️ تعديل الملف الشخصي</h2>
        {[
          { label:'الاسم الكامل', type:'text', val:'أحمد بن علي' },
          { label:'البريد الإلكتروني', type:'email', val:'ahmed@gmail.com' },
          { label:'رقم الهاتف', type:'tel', val:'06 12 34 56 78' },
        ].map((f,i) => (
          <div key={i} className="mb-4">
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">{f.label}</label>
            <input type={f.type} defaultValue={f.val} className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold focus:border-primary outline-none transition-all bg-gray-50/50" />
          </div>
        ))}
        <button onClick={() => showToast('تم حفظ التغييرات!','success')} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-base shadow-lg shadow-green-100 hover:bg-primary-dark transition-all mt-4">💾 حفظ التغييرات</button>
      </div>
    ),
  };

  const navItems = [
    { id:'orders', icon:'📦', label:'طلباتي', badge:'3' },
    { id:'wishlist', icon:'❤️', label:'المفضلة' },
    { id:'messages', icon:'💬', label:'الرسائل', badge:'2', red:true },
    { id:'wallet', icon:'💰', label:'محفظتي' },
    { id:'addresses', icon:'📍', label:'عناويني' },
    { id:'profile', icon:'✏️', label:'تعديل الملف' },
  ];

  return (
    <div className="font-cairo">
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">👤 حسابي الشخصي</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 p-6 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 text-center mb-4 border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg shadow-green-100 uppercase">
              {user?.name?.[0] || 'أ'}
            </div>
            <div className="font-black text-lg text-gray-900">{user?.name || 'أحمد بن علي'}</div>
            <div className="text-xs text-gray-400 mt-1 mb-4 font-bold tracking-tight lowercase">{user?.email || 'ahmed@gmail.com'}</div>
            <div className="bg-green-50 px-4 py-2 rounded-xl text-[10px] text-primary font-black uppercase inline-block border border-green-100">🛡️ Trust Score: 4.8 / 5</div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {navItems.map(item => (
              <div key={item.id} onClick={() => setSection(item.id)} className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all border-r-4 ${section === item.id ? 'bg-green-50 text-primary border-primary font-black' : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.red ? 'bg-red-500 text-white shadow-sm' : 'bg-primary text-white shadow-sm'}`}>{item.badge}</span>}
              </div>
            ))}
            <div onClick={() => showToast('تم تسجيل الخروج','success')} className="flex items-center gap-3 px-5 py-3.5 cursor-pointer text-red-500 font-black text-sm border-t border-gray-50 hover:bg-red-50 transition-colors">
              🚪 تسجيل الخروج
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">{sections[section] || sections['orders']}</div>
      </div>
    </div>
  );
}

/* ===== SELLER REGISTER ===== */
export function SellerRegister() {
  const { showToast } = useApp();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ storeName:'', fullName:'', phone:'', email:'', category:'electronics', password:'' });

  const handleSubmit = async () => {
    if (!form.storeName || !form.email || !form.password) { showToast('يرجى ملء كل الحقول','warning'); return; }
    if (!form.email.includes('@')) { showToast('البريد الإلكتروني غير صحيح','error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    showToast('تم إرسال طلب التسجيل! سنتواصل خلال 24 ساعة','success','🎉');
    setTimeout(() => setLocation('/'), 2500);
  };

  if (success) return (
    <div className="text-center py-24 px-6 font-cairo">
      <div className="text-8xl mb-6 animate-bounce">🎉</div>
      <h2 className="text-3xl font-black text-primary-dark mb-2">تم التسجيل بنجاح!</h2>
      <p className="text-gray-500 font-bold">سنتواصل معك عبر الهاتف خلال 24 ساعة لتفعيل متجرك</p>
    </div>
  );

  return (
    <div className="font-cairo">
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">🏪 الانضمام كبائع</h1>
      </div>
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 animate-pulse">🚀</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">ابدأ رحلة النجاح على ترسترا</h2>
            <p className="text-gray-500 text-sm font-bold">وصّل منتجاتك لآلاف المشترين في كل ولايات الجزائر</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">اسم المتجر التجاري</label>
              <input type="text" placeholder="مثال: Tech Store DZ" value={form.storeName} onChange={e => setForm(f=>({...f,storeName:e.target.value}))} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">الاسم الكامل</label>
                <input type="text" placeholder="اسمك كما في الهوية" value={form.fullName} onChange={e => setForm(f=>({...f,fullName:e.target.value}))} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">رقم الهاتف النشط</label>
                <input type="tel" placeholder="06 XX XX XX XX" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all text-left" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">البريد الإلكتروني المهني</label>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">فئة المنتجات الأساسية</label>
              <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all appearance-none cursor-pointer">
              <option value="electronics">إلكترونيات</option>
              <option value="fashion">أزياء</option>
              <option value="home">منزل</option>
              <option value="beauty">جمال</option>
              <option value="sports">رياضة</option>
              <option value="other">أخرى</option>
            </select>
          </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">كلمة المرور</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-green-100 hover:bg-primary-dark transition-all disabled:bg-gray-300">
            {loading ? '⏳ جاري التسجيل...' : '🏪 إنشاء حساب البائع'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== NOT FOUND ===== */
export function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="text-center py-24 px-6 font-cairo">
      <div className="text-8xl mb-4 grayscale opacity-40">🔍</div>
      <h1 className="text-5xl font-black text-primary mb-2">404</h1>
      <p className="text-gray-500 font-bold mb-8">نعتذر، الصفحة التي تبحث عنها غير موجودة أو تم نقلها</p>
      <button onClick={() => setLocation('/')} className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-primary-dark transition-all">
        🏠 العودة للرئيسية
      </button>
    </div>
  );
}
