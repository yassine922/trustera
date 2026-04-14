import { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';
import { useLocation } from 'wouter';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Product {
  _id: string; name: string; price: number; description: string;
  category: string; image: string; stock: number; sellerName: string;
}
interface Order {
  _id: string; totalAmount: number; status: string;
  createdAt: string; items: any[]; buyerId: string;
}

const CATEGORIES = [
  { id: 'electronics', label: '📱 إلكترونيات' },
  { id: 'fashion', label: '👗 أزياء' },
  { id: 'home', label: '🏠 منزل ومطبخ' },
  { id: 'beauty', label: '💄 جمال وعناية' },
  { id: 'sports', label: '⚽ رياضة' },
  { id: 'other', label: '📦 أخرى' },
];

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: 'معلّق',          bg: '#fef3c7', text: '#d97706' },
  processing: { label: 'قيد التجهيز',   bg: '#dbeafe', text: '#1d4ed8' },
  shipped:    { label: 'تم الشحن',       bg: '#f3e8ff', text: '#7c3aed' },
  completed:  { label: 'تم التوصيل',    bg: '#edf7f0', text: '#1a7c2e' },
  cancelled:  { label: 'ملغى',           bg: '#fef2f2', text: '#dc2626' },
};

export default function SellerDashboard() {
  const { user, token, showToast, logout } = useApp();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', price: '', description: '',
    category: 'other', stock: '', image: '',
  });

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // إعداد Socket.io للاستماع للإشعارات الفورية
  useEffect(() => {
    if (!token || !user) return;

    const socket = io(API_URL.replace('/api', ''), {
      auth: { token },
      query: { userId: user.id }
    });

    socket.on('connect', () => {
      // انضمام لغرفة خاصة بالبائع (Room) بناءً على معرفه
      socket.emit('join', user.id);
    });

    socket.on('notification', (data) => {
      // تشغيل صوت تنبيه بسيط (اختياري)
      showToast(`🔔 إشعار جديد: ${data.message}`, 'info');
      // تحديث البيانات تلقائياً دون تحديث الصفحة
      fetchOrders();
      if (section === 'overview') fetchProducts(); 
    });

    return () => { socket.disconnect(); };
  }, [token, user, section]);

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  async function fetchProducts() {
    try {
      // أمنياً: نطلب مساراً خاصاً بمنتجات البائع الحالي فقط
      const res = await fetch(`${API_URL}/products/my-products`, { headers });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch { 
      showToast('خطأ في جلب المنتجات', 'error'); 
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_URL}/orders`, { headers });
      const data = await res.json();
      if (data.success) setOrders(data.data.slice(0, 20));
    } catch { showToast('خطأ في جلب الطلبات', 'error'); }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('حجم الصورة يجب أن يكون أقل من 2MB', 'error');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      setForm(f => ({ ...f, image: base64 }));
    };
    reader.readAsDataURL(file);
  }

  async function addProduct() {
    if (!form.name || !form.price || !form.description)
      return showToast('يرجى ملء الحقول المطلوبة', 'error');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST', headers,
        body: JSON.stringify({
          name: form.name, price: Number(form.price),
          description: form.description, category: form.category,
          stock: Number(form.stock) || 0, image: form.image,
          sellerId: user?.id, sellerName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم إضافة المنتج ✅');
        setForm({ name: '', price: '', description: '', category: 'other', stock: '', image: '' });
        setImagePreview('');
        fetchProducts();
        setSection('products');
      } else showToast(data.message || 'حدث خطأ', 'error');
    } catch { showToast('خطأ في الاتصال', 'error'); }
    finally { setLoading(false); }
  }

  async function deleteProduct(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers });
      showToast('تم حذف المنتج');
      fetchProducts();
    } catch { showToast('خطأ في الحذف', 'error'); }
  }

  async function updateOrderStatus(id: string, status: string) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) { showToast('تم تحديث حالة الطلب ✅'); fetchOrders(); }
    } catch { showToast('خطأ في التحديث', 'error'); }
  }

  const totalRevenue = orders.reduce((a, o) => a + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const navItems = [
    { key: 'overview',    icon: '📊', label: 'نظرة عامة' },
    { key: 'products',    icon: '📦', label: 'منتجاتي' },
    { key: 'add-product', icon: '➕', label: 'إضافة منتج' },
    { key: 'orders',      icon: '🛒', label: 'الطلبات', badge: pendingOrders },
    { key: 'health',      icon: '💚', label: 'صحة الحساب' },
  ];

  function handleNavClick(key: string) {
    setSection(key);
    setSidebarOpen(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-cairo" dir="rtl">

      {/* ===== Top Bar ===== */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
        <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl text-primary">
          ☰
        </button>

        <div className="flex-1 font-black text-sm text-gray-800">
          {navItems.find(n => n.key === section)?.icon} {navItems.find(n => n.key === section)?.label}
        </div>

        <button onClick={() => setLocation('/')} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold transition-all hover:bg-primary-dark">
          🛍️ المتجر
        </button>
      </div>

      <div className="flex flex-1 relative">

        {/* Overlay */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" />}

        {/* ===== Sidebar ===== */}
        <div className={`fixed inset-y-0 right-0 w-64 bg-white border-l border-gray-100 flex flex-col z-[300] transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">🏪</div>
              <div>
                <div className="font-black text-sm">{user?.name}</div>
                <div className="text-[10px] text-primary font-bold">✅ بائع موثّق</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="bg-gray-100 rounded-lg w-8 h-8 flex items-center justify-center text-gray-500">✕</button>
          </div>

          <nav className="py-4 flex-1">
            {navItems.map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)} className={`w-full px-5 py-3 flex items-center gap-3 transition-all border-r-4 ${section === item.key ? 'bg-green-50 text-primary border-primary font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 text-right text-sm">{item.label}</span>
                {item.badge ? <span className="bg-red-500 text-white rounded-full text-[10px] font-black px-2 py-0.5">{item.badge}</span> : null}
              </button>
            ))}
            
            <div className="mx-5 my-3 h-px bg-gray-50" />
            
            <button onClick={() => { setLocation('/'); setSidebarOpen(false); }} className="w-full px-5 py-3 flex items-center gap-3 text-gray-900 font-bold text-sm">
              <span>🛍️</span> تفقد السوق
            </button>
          </nav>

          <div className="p-5 border-t border-gray-50">
            <button onClick={() => { logout(); setLocation('/'); }} className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black transition-colors hover:bg-red-100">
              🚪 تسجيل الخروج
            </button>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-65px)]">
          {section === 'overview' && (
             <div>
               <h2 className="text-xl font-black mb-1">مرحباً {user?.name} 👋</h2>
               <p className="text-gray-500 text-xs mb-6">إليك ملخص نشاطك اليوم</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                 {[
                   { icon: '📦', label: 'منتجاتي', value: products.length, bg: 'bg-green-50', text: 'text-primary' },
                   { icon: '🛒', label: 'إجمالي الطلبات', value: orders.length, bg: 'bg-blue-50', text: 'text-blue-700' },
                   { icon: '⏳', label: 'طلبات معلّقة', value: pendingOrders, bg: 'bg-amber-50', text: 'text-amber-600' },
                   { icon: '💰', label: 'الإيرادات', value: formatPrice(totalRevenue), bg: 'bg-emerald-50', text: 'text-emerald-700' },
                 ].map((s, i) => (
                   <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                     <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                     <div className={`text-lg font-black ${s.text}`}>{s.value}</div>
                     <div className="text-[11px] text-gray-400 mt-1 font-bold">{s.label}</div>
                   </div>
                 ))}
               </div>
               {/* آخر الطلبات */}
               {orders.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div className="font-black text-sm text-gray-800 flex items-center gap-2">🛒 آخر الطلبات</div>
                    <button onClick={() => setSection('orders')} className="text-primary text-xs font-bold hover:underline">عرض الكل</button>
                  </div>
                  {orders.slice(0, 5).map(o => {
                    const sc = STATUS_MAP[o.status] || STATUS_MAP.pending;
                    return (
                      <div key={o._id} className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-4 transition-colors hover:bg-gray-50/30">
                        <div className="flex-1">
                          <div className="font-bold text-[13px] text-gray-900 leading-none">#{o._id.slice(-6).toUpperCase()}</div>
                          <div className="text-[10px] text-gray-400 mt-1.5">{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                        </div>
                        <span style={{ backgroundColor: sc.bg, color: sc.text }} className="px-3 py-1 rounded-full text-[10px] font-black">{sc.label}</span>
                        <div className="font-black text-primary text-sm">{formatPrice(o.totalAmount)} دج</div>
                      </div>
                    );
                  })}
                </div>
              )}
             </div>
          )}

          {section === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-900">📦 منتجاتي ({products.length})</h2>
                <button onClick={() => setSection('add-product')} className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 transition-transform hover:scale-105">➕ إضافة منتج جديد</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {products.map(p => (
                  <div key={p._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md">
                    <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-4xl">📦</span>}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="font-bold text-[13px] text-gray-900 mb-1 line-clamp-1 h-[1.2rem]">{p.name}</div>
                      <div className="font-black text-primary text-base mb-3">{formatPrice(p.price)}</div>
                      <button onClick={() => deleteProduct(p._id)} className="mt-auto w-full py-2 bg-red-50 text-red-600 rounded-lg text-[11px] font-black transition-colors hover:bg-red-100 flex items-center justify-center gap-1.5">🗑️ حذف المنتج</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'add-product' && (
            <div className="max-w-xl mx-auto">
              <h2 className="text-lg font-black mb-6 text-gray-900">➕ إضافة منتج جديد</h2>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-5">
                 <div>
                    <label className="text-xs font-black text-gray-500 block mb-2 uppercase tracking-wider">📸 صورة المنتج الرئيسية</label>
                    <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 transition-colors hover:bg-gray-50">
                      {imagePreview ? <img src={imagePreview} alt="p" className="max-h-32 mx-auto rounded-xl shadow-sm" /> : <div className="py-4 text-gray-400 font-bold text-xs">اضغط هنا لرفع صورة المنتج</div>}
                    </div>
                    <input ref={fileRef} type="file" hidden onChange={handleImageChange} />
                 </div>
                 
                 <div className="space-y-4">
                    <input className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 text-sm font-bold outline-none focus:border-primary transition-colors" placeholder="اسم المنتج..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    <input className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 text-sm font-bold outline-none focus:border-primary transition-colors" type="number" placeholder="السعر (دج)..." value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    <textarea className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 text-sm font-bold outline-none focus:border-primary transition-colors min-h-[100px]" placeholder="وصف مفصل للمنتج..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                 </div>

                 <button onClick={addProduct} disabled={loading} className="w-full py-4 bg-primary text-white rounded-2xl text-base font-black shadow-lg shadow-green-100 transition-all hover:bg-primary-dark disabled:bg-gray-300">
                   {loading ? '⏳ جاري الحفظ...' : 'حفظ المنتج'}
                 </button>
              </div>
            </div>
          )}
          
          {section === 'orders' && (
             <div className="max-w-4xl">
               <h2 className="text-lg font-black mb-6 text-gray-900">🛒 إدارة الطلبات الواردة</h2>
               <div className="flex flex-col gap-3">
                 {orders.map(o => (
                   <div key={o._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
                     <div className="flex justify-between items-center">
                       <span className="font-black text-gray-400 text-xs tracking-widest">#{o._id.slice(-8).toUpperCase()}</span>
                       <span className="font-black text-primary text-base">{formatPrice(o.totalAmount)} دج</span>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {Object.keys(STATUS_MAP).map(st => (
                         <button key={st} onClick={() => updateOrderStatus(o._id, st)} className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${o.status === st ? 'shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`} style={{ backgroundColor: o.status === st ? STATUS_MAP[st].bg : '', color: o.status === st ? STATUS_MAP[st].text : '', borderColor: o.status === st ? 'transparent' : '' }}>{STATUS_MAP[st].label}</button>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
