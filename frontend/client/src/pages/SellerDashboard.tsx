import { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

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

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  border: '1.5px solid #dde1e7', fontFamily: 'Cairo,sans-serif',
  fontSize: '13px', outline: 'none', boxSizing: 'border-box', direction: 'rtl',
};

export default function SellerDashboard() {
  const { user, token, showPage, showToast, logout } = useApp();
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

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/products`, { headers });
      const data = await res.json();
      if (data.success) setProducts(data.data.filter((p: any) => p.sellerId === user?.id));
    } catch { showToast('خطأ في جلب المنتجات', 'error'); }
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f7fa', direction: 'rtl' }}>

      {/* ===== Top Bar المحدث ===== */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', background: 'white',
        borderBottom: '1px solid #eef0f3', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
      }}>
        <button 
          onClick={() => setSidebarOpen(true)} 
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#f3f4f6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            color: '#1a7c2e'
          }}>
          ☰
        </button>

        <div style={{ flex: 1, fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo,sans-serif', color: '#1f2937' }}>
          {navItems.find(n => n.key === section)?.icon} {navItems.find(n => n.key === section)?.label}
        </div>

        <button 
          onClick={() => {
            setSection('overview'); // إعادة ضبط الحالة للعودة السليمة مستقبلاً
            showPage('home');
          }} 
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: '#1a7c2e', color: 'white',
            border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>
          🛍️ المتجر
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* Overlay */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200,
            backdropFilter: 'blur(2px)'
          }} />
        )}

        {/* ===== Sidebar المحدث ===== */}
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '260px',
          background: 'white', borderLeft: '1px solid #eef0f3',
          display: 'flex', flexDirection: 'column', zIndex: 300,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: sidebarOpen ? '-5px 0 25px rgba(0,0,0,0.15)' : 'none',
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', background: '#edf7f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏪</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', fontFamily: 'Cairo,sans-serif' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#1a7c2e' }}>✅ بائع موثّق</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '30px', height: '30px', fontSize: '14px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
          </div>

          <nav style={{ padding: '15px 0', flex: 1 }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)} style={{
                width: '100%', padding: '12px 20px', border: 'none', textAlign: 'right',
                background: section === item.key ? '#edf7f0' : 'transparent',
                color: section === item.key ? '#1a7c2e' : '#4b5563',
                fontFamily: 'Cairo,sans-serif', fontSize: '14px',
                fontWeight: section === item.key ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                borderRight: section === item.key ? '4px solid #1a7c2e' : '4px solid transparent',
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? <span style={{ background: '#dc2626', color: 'white', borderRadius: '99px', fontSize: '11px', fontWeight: 900, padding: '2px 8px' }}>{item.badge}</span> : null}
              </button>
            ))}
            
            <div style={{ margin: '15px 20px', height: '1px', background: '#f3f4f6' }} />
            
            <button onClick={() => { showPage('home'); setSidebarOpen(false); }} style={{
              width: '100%', padding: '12px 20px', border: 'none', textAlign: 'right',
              background: 'transparent', color: '#1f2937', fontFamily: 'Cairo,sans-serif',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span>🛍️</span> تفقد السوق
            </button>
          </nav>

          <div style={{ padding: '20px', borderTop: '1px solid #eef0f3' }}>
            <button onClick={() => { logout(); showPage('home'); }} style={{
              width: '100%', padding: '12px', background: '#fff1f2', color: '#be123c',
              border: 'none', borderRadius: '10px', fontFamily: 'Cairo,sans-serif',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>🚪 تسجيل الخروج</button>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', height: 'calc(100vh - 65px)' }}>
          {/* محتوى الأقسام يبقى كما هو... */}
          {section === 'overview' && (
             /* ... كود نظرة عامة ... */
             <div>
               <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>مرحباً {user?.name} 👋</h2>
               <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>إليك ملخص نشاطك اليوم</p>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '14px', marginBottom: '28px' }}>
                 {[
                   { icon: '📦', label: 'منتجاتي', value: products.length, color: '#edf7f0', text: '#1a7c2e' },
                   { icon: '🛒', label: 'إجمالي الطلبات', value: orders.length, color: '#dbeafe', text: '#1d4ed8' },
                   { icon: '⏳', label: 'طلبات معلّقة', value: pendingOrders, color: '#fef3c7', text: '#d97706' },
                   { icon: '💰', label: 'الإيرادات', value: formatPrice(totalRevenue), color: '#f0fdf4', text: '#15803d' },
                 ].map((s, i) => (
                   <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eef0f3', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                     <div style={{ width: '40px', height: '40px', background: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>{s.icon}</div>
                     <div style={{ fontSize: '18px', fontWeight: 900, color: s.text }}>{s.value}</div>
                     <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
                   </div>
                 ))}
               </div>
               {/* آخر الطلبات */}
               {orders.length > 0 && (
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #eef0f3', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #eef0f3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>🛒 آخر الطلبات</div>
                    <button onClick={() => setSection('orders')} style={{ color: '#1a7c2e', background: 'none', border: 'none', fontFamily: 'Cairo,sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>عرض الكل</button>
                  </div>
                  {orders.slice(0, 5).map(o => {
                    const sc = STATUS_MAP[o.status] || STATUS_MAP.pending;
                    return (
                      <div key={o._id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>#{o._id.slice(-6).toUpperCase()}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                        </div>
                        <span style={{ background: sc.bg, color: sc.text, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>{sc.label}</span>
                        <div style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '14px' }}>{formatPrice(o.totalAmount)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
             </div>
          )}

          {section === 'products' && (
            /* ... كود قسم المنتجات ... */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 900 }}>📦 منتجاتي ({products.length})</h2>
                <button onClick={() => setSection('add-product')} style={{ padding: '9px 18px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
                {products.map(p => (
                  <div key={p._id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #eef0f3', overflow: 'hidden' }}>
                    <div style={{ height: '130px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px' }}>📦</span>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', height: '18px', overflow: 'hidden' }}>{p.name}</div>
                      <div style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '15px' }}>{formatPrice(p.price)}</div>
                      <button onClick={() => deleteProduct(p._id)} style={{ width: '100%', marginTop: '10px', padding: '6px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', fontFamily: 'Cairo,sans-serif', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>🗑️ حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تكرار باقي الأقسام (add-product, orders, health) حسب كودك الأصلي */}
          {section === 'add-product' && (
            <div style={{ maxWidth: '500px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>➕ إضافة منتج</h2>
              {/* نفس فورم الإضافة مع تأكد من وجود زر الإغلاق Sidebar */}
              <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #eef0f3', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {/* كود الفورم */}
                 <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>📸 صورة المنتج</label>
                    <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #dde1e7', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                      {imagePreview ? <img src={imagePreview} alt="p" style={{ maxHeight: '120px', borderRadius: '8px' }} /> : <span>اضغط للرفع</span>}
                    </div>
                    <input ref={fileRef} type="file" hidden onChange={handleImageChange} />
                 </div>
                 <input style={inp} placeholder="اسم المنتج" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                 <input style={inp} type="number" placeholder="السعر" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                 <textarea style={{...inp, minHeight: '80px'} as any} placeholder="الوصف" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                 <button onClick={addProduct} disabled={loading} style={{ padding: '12px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>
                   {loading ? '⏳ جاري الحفظ...' : 'حفظ المنتج'}
                 </button>
              </div>
            </div>
          )}
          
          {section === 'orders' && (
             <div>
               <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>🛒 إدارة الطلبات</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {orders.map(o => (
                   <div key={o._id} style={{ background: 'white', borderRadius: '12px', padding: '15px', border: '1px solid #eef0f3' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ fontWeight: 700 }}>#{o._id.slice(-6).toUpperCase()}</span>
                       <span style={{ fontWeight: 900, color: '#1a7c2e' }}>{formatPrice(o.totalAmount)}</span>
                     </div>
                     <div style={{ display: 'flex', gap: '5px' }}>
                       {Object.keys(STATUS_MAP).map(st => (
                         <button key={st} onClick={() => updateOrderStatus(o._id, st)} style={{
                           padding: '4px 10px', fontSize: '10px', borderRadius: '99px', border: '1px solid #dde1e7',
                           background: o.status === st ? STATUS_MAP[st].bg : 'white',
                           color: o.status === st ? STATUS_MAP[st].text : '#666'
                         }}>{STATUS_MAP[st].label}</button>
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
