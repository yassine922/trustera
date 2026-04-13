إليك الكود كاملاً:

```tsx
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
    } catch {}
  }

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_URL}/orders`, { headers });
      const data = await res.json();
      if (data.success) setOrders(data.data.slice(0, 20));
    } catch {}
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

      {/* ===== Top Bar ===== */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px', background: 'white',
        borderBottom: '1px solid #eef0f3', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button onClick={() => setSidebarOpen(true)} style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: '#edf7f0', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
        }}>☰</button>

        <div style={{ flex: 1, fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo,sans-serif' }}>
          {navItems.find(n => n.key === section)?.icon} {navItems.find(n => n.key === section)?.label || 'لوحة البائع'}
        </div>

        <button onClick={() => showPage('home')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', background: '#1a7c2e', color: 'white',
          border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
        }}>🛍️ المتجر</button>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* Overlay */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200,
          }} />
        )}

        {/* ===== Sidebar ===== */}
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '240px',
          background: 'white', borderLeft: '1px solid #eef0f3',
          display: 'flex', flexDirection: 'column', zIndex: 300,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          boxShadow: sidebarOpen ? '-4px 0 20px rgba(0,0,0,0.1)' : 'none',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#edf7f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏪</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', fontFamily: 'Cairo,sans-serif' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#1a7c2e' }}>✅ بائع موثّق</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
          </div>

          <nav style={{ padding: '10px 0', flex: 1 }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.key)} style={{
                width: '100%', padding: '11px 20px', border: 'none', textAlign: 'right',
                background: section === item.key ? '#edf7f0' : 'transparent',
                color: section === item.key ? '#1a7c2e' : '#374151',
                fontFamily: 'Cairo,sans-serif', fontSize: '13px',
                fontWeight: section === item.key ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                borderRight: section === item.key ? '3px solid #1a7c2e' : '3px solid transparent',
              }}>
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? <span style={{ background: '#dc2626', color: 'white', borderRadius: '99px', fontSize: '11px', fontWeight: 900, padding: '1px 7px' }}>{item.badge}</span> : null}
              </button>
            ))}
            <div style={{ margin: '8px 12px', height: '1px', background: '#eef0f3' }} />
            <button onClick={() => { showPage('home'); setSidebarOpen(false); }} style={{
              width: '100%', padding: '11px 20px', border: 'none', textAlign: 'right',
              background: 'transparent', color: '#374151', fontFamily: 'Cairo,sans-serif',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
              borderRight: '3px solid transparent',
            }}>
              <span>🛍️</span> تفقد السوق
            </button>
          </nav>

          <div style={{ padding: '12px 16px', borderTop: '1px solid #eef0f3' }}>
            <button onClick={() => { logout(); showPage('home'); }} style={{
              width: '100%', padding: '10px', background: '#fef2f2', color: '#dc2626',
              border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>🚪 تسجيل الخروج</button>
          </div>
        </div>

        {/* ===== Main ===== */}
        <div style={{ flex: 1, padding: '28px 24px', overflow: 'auto' }}>

          {section === 'overview' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>مرحباً {user?.name} 👋</h2>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>إليك ملخص نشاطك اليوم</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '14px', marginBottom: '28px' }}>
                {[
                  { icon: '📦', label: 'منتجاتي', value: products.length, color: '#edf7f0', text: '#1a7c2e' },
                  { icon: '🛒', label: 'إجمالي الطلبات', value: orders.length, color: '#dbeafe', text: '#1d4ed8' },
                  { icon: '⏳', label: 'طلبات معلّقة', value: pendingOrders, color: '#fef3c7', text: '#d97706' },
                  { icon: '💰', label: 'الإيرادات', value: formatPrice(totalRevenue), color: '#f0fdf4', text: '#15803d' },
                  { icon: '⭐', label: 'التقييم', value: '4.8 / 5', color: '#fce7f3', text: '#db2777' },
                  { icon: '💚', label: 'صحة الحساب', value: 'ممتازة', color: '#edf7f0', text: '#1a7c2e' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eef0f3' }}>
                    <div style={{ width: '40px', height: '40px', background: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>{s.icon}</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: s.text }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {orders.length > 0 && (
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #eef0f3', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #eef0f3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>🛒 آخر الطلبات</div>
                    <button onClick={() => setSection('orders')} style={{ color: '#1a7c2e', background: 'none', border: 'none', fontFamily: 'Cairo,sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>عرض الكل</button>
                  </div>
                  {orders.slice(0, 4).map(o => {
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 900 }}>📦 منتجاتي ({products.length})</h2>
                <button onClick={() => setSection('add-product')} style={{ padding: '9px 20px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة منتج</button>
              </div>
              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280', background: 'white', borderRadius: '14px', border: '1px solid #eef0f3' }}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>📦</div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>لا توجد منتجات بعد</div>
                  <button onClick={() => setSection('add-product')} style={{ padding: '10px 28px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>إضافة أول منتج</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '14px' }}>
                  {products.map(p => (
                    <div key={p._id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #eef0f3', overflow: 'hidden' }}>
                      <div style={{ height: '140px', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '48px' }}>📦</span>}
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{CATEGORIES.find(c => c.id === p.category)?.label || '📦 أخرى'}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '15px' }}>{formatPrice(p.price)}</span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>المخزون: {p.stock || 0}</span>
                        </div>
                        <button onClick={() => deleteProduct(p._id)} style={{ width: '100%', padding: '7px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>🗑️ حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'add-product' && (
            <div style={{ maxWidth: '520px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>➕ إضافة منتج جديد</h2>
              <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #eef0f3', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>📸 صورة المنتج</label>
                  <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #dde1e7', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <div>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>اضغط لرفع صورة</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>JPG, PNG — أقل من 2MB</div>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  {imagePreview && (
                    <button onClick={() => { setImagePreview(''); setForm(f => ({ ...f, image: '' })); }} style={{ marginTop: '6px', color: '#dc2626', background: 'none', border: 'none', fontFamily: 'Cairo,sans-serif', fontSize: '12px', cursor: 'pointer' }}>✕ إزالة الصورة</button>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>اسم المنتج *</label>
                  <input style={inp} placeholder="مثال: حذاء رياضي نايك" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>التصنيف *</label>
                    <select style={{ ...inp }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>السعر (دج) *</label>
                    <input style={inp} type="number" placeholder="3500" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>الكمية المتاحة</label>
                  <input style={inp} type="number" placeholder="مثال: 50" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>وصف المنتج *</label>
                  <textarea style={{ ...inp, minHeight: '90px', resize: 'vertical' } as any} placeholder="اكتب وصفاً مفصلاً للمنتج..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <button onClick={addProduct} disabled={loading} style={{ padding: '13px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Cairo,sans-serif', fontSize: '15px', fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? '⏳ جاري الإضافة...' : '✅ إضافة المنتج'}
                </button>
              </div>
            </div>
          )}

          {section === 'orders' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>🛒 الطلبات ({orders.length})</h2>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280', background: 'white', borderRadius: '14px', border: '1px solid #eef0f3' }}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>🛒</div>
                  <div style={{ fontWeight: 700 }}>لا توجد طلبات بعد</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {orders.map(o => {
                    const sc = STATUS_MAP[o.status] || STATUS_MAP.pending;
                    return (
                      <div key={o._id} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid #eef0f3' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '42px', height: '42px', background: sc.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🛒</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>#{o._id.slice(-8).toUpperCase()}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                          </div>
                          <span style={{ background: sc.bg, color: sc.text, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>{sc.label}</span>
                          <div style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '15px' }}>{formatPrice(o.totalAmount)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {Object.entries(STATUS_MAP).map(([key, val]) => (
                            <button key={key} onClick={() => updateOrderStatus(o._id, key)} style={{
                              padding: '5px 12px', border: `1px solid ${o.status === key ? val.text : '#dde1e7'}`,
                              borderRadius: '99px', background: o.status === key ? val.bg : 'white',
                              color: o.status === key ? val.text : '#6b7280',
                              fontFamily: 'Cairo,sans-serif', fontSize: '11px', fontWeight: 700,
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}>{val.label}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {section === 'health' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>💚 صحة الحساب</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '14px' }}>
                {[
                  { icon: '⭐', label: 'متوسط التقييم', value: '4.8 / 5', status: 'ممتاز', color: '#edf7f0', text: '#1a7c2e' },
                  { icon: '📦', label: 'معدل التوصيل في الوقت', value: '96%', status: 'ممتاز', color: '#edf7f0', text: '#1a7c2e' },
                  { icon: '↩️', label: 'معدل الإرجاع', value: '2%', status: 'جيد', color: '#fef3c7', text: '#d97706' },
                  { icon: '❌', label: 'معدل الإلغاء', value: '1%', status: 'ممتاز', color: '#edf7f0', text: '#1a7c2e' },
                  { icon: '💬', label: 'معدل الرد على العملاء', value: '98%', status: 'ممتاز', color: '#edf7f0', text: '#1a7c2e' },
                  { icon: '🛡️', label: 'حالة الحساب', value: 'نشط', status: 'موثّق', color: '#edf7f0', text: '#1a7c2e' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #eef0f3' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{item.icon}</span>
                      <span style={{ background: item.color, color: item.text, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: item.text, marginBottom: '4px' }}>{item.value}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', background: '#edf7f0', borderRadius: '14px', padding: '20px', border: '1px solid #c8e6c9' }}>
                <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '8px', color: '#1a7c2e' }}>🎯 نصائح لتحسين أدائك</div>
                <ul style={{ margin: 0, padding: '0 20px', color: '#374151', fontSize: '13px', lineHeight: 2 }}>
                  <li>أضف صوراً عالية الجودة لمنتجاتك لزيادة المبيعات</li>
                  <li>رد على استفسارات العملاء خلال أقل من 24 ساعة</li>
                  <li>حدّث الكميات المتاحة بانتظام لتجنب الطلبات الملغاة</li>
                  <li>أضف وصفاً مفصلاً لكل منتج لتحسين ظهوره في البحث</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
```
