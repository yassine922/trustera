import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Product { _id: string; name: string; price: number; description: string; }
interface Order { _id: string; totalAmount: number; status: string; createdAt: string; items: any[]; }

export default function SellerDashboard() {
  const { user, token, showPage, showToast, logout } = useApp();
  const [section, setSection] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '' });

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
      if (data.success) setOrders(data.data.filter((o: any) => o.buyerId === user?.id || true).slice(0, 10));
    } catch {}
  }

  async function addProduct() {
    if (!form.name || !form.price || !form.description) return showToast('يرجى ملء جميع الحقول', 'error');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST', headers,
        body: JSON.stringify({ ...form, price: Number(form.price), sellerId: user?.id }),
      });
      const data = await res.json();
      if (data.success) { showToast('تم إضافة المنتج ✅'); setForm({ name: '', price: '', description: '' }); fetchProducts(); }
      else showToast(data.message || 'حدث خطأ', 'error');
    } catch { showToast('خطأ في الاتصال', 'error'); }
    finally { setLoading(false); }
  }

  async function deleteProduct(id: string) {
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers });
      showToast('تم حذف المنتج');
      fetchProducts();
    } catch { showToast('خطأ في الحذف', 'error'); }
  }

  const stats = [
    { icon: '📦', label: 'منتجاتي', value: products.length, color: '#edf7f0', text: '#1a7c2e' },
    { icon: '🛒', label: 'الطلبات', value: orders.length, color: '#dbeafe', text: '#1d4ed8' },
    { icon: '💰', label: 'الإيرادات', value: formatPrice(orders.reduce((a, o) => a + o.totalAmount, 0)), color: '#fef3c7', text: '#d97706' },
    { icon: '⭐', label: 'التقييم', value: '4.8', color: '#fce7f3', text: '#db2777' },
  ];

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #dde1e7',
    fontFamily: 'Cairo,sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box', direction: 'rtl',
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#fef3c7', text: '#d97706' },
    completed: { bg: '#edf7f0', text: '#1a7c2e' },
    cancelled: { bg: '#fef2f2', text: '#dc2626' },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', direction: 'rtl' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: 'white', borderLeft: '1px solid #eef0f3', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #eef0f3' }}>
          <div style={{ width: '44px', height: '44px', background: '#edf7f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '8px' }}>🏪</div>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>{user?.name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>بائع موثّق ✅</div>
        </div>
        <nav style={{ padding: '12px 0' }}>
          {[
            { key: 'overview', icon: '📊', label: 'نظرة عامة' },
            { key: 'products', icon: '📦', label: 'منتجاتي' },
            { key: 'add-product', icon: '➕', label: 'إضافة منتج' },
            { key: 'orders', icon: '🛒', label: 'الطلبات' },
          ].map(item => (
            <button key={item.key} onClick={() => setSection(item.key)} style={{
              width: '100%', padding: '11px 20px', border: 'none', textAlign: 'right',
              background: section === item.key ? '#edf7f0' : 'transparent',
              color: section === item.key ? '#1a7c2e' : '#374151',
              fontFamily: 'Cairo,sans-serif', fontSize: '14px', fontWeight: section === item.key ? 700 : 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              borderRight: section === item.key ? '3px solid #1a7c2e' : '3px solid transparent',
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 20px', marginTop: 'auto', borderTop: '1px solid #eef0f3' }}>
          <button onClick={() => { logout(); showPage('home'); }} style={{
            width: '100%', padding: '10px', background: '#fef2f2', color: '#dc2626',
            border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>🚪 تسجيل الخروج</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '28px 24px', overflow: 'auto' }}>
        {section === 'overview' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>مرحباً {user?.name} 👋</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px', marginBottom: '28px' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eef0f3' }}>
                  <div style={{ width: '40px', height: '40px', background: s.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>{s.icon}</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: s.text }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'products' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>📦 منتجاتي ({products.length})</h2>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                <div style={{ fontWeight: 700 }}>لا توجد منتجات بعد</div>
                <button onClick={() => setSection('add-product')} style={{ marginTop: '12px', padding: '10px 24px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontWeight: 700, cursor: 'pointer' }}>إضافة أول منتج</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {products.map(p => (
                  <div key={p._id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', background: '#edf7f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📦</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{p.description.slice(0, 60)}...</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '16px', marginLeft: '12px' }}>{formatPrice(p.price)}</div>
                    <button onClick={() => deleteProduct(p._id)} style={{ padding: '7px 14px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>حذف</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === 'add-product' && (
          <div style={{ maxWidth: '480px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>➕ إضافة منتج جديد</h2>
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #eef0f3', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>اسم المنتج</label>
                <input style={inp} placeholder="مثال: حذاء رياضي نايك" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>السعر (دج)</label>
                <input style={inp} type="number" placeholder="مثال: 3500" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>الوصف</label>
                <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' } as any} placeholder="وصف المنتج..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <button onClick={addProduct} disabled={loading} style={{ padding: '13px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Cairo,sans-serif', fontSize: '15px', fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ جاري الإضافة...' : '➕ إضافة المنتج'}
              </button>
            </div>
          </div>
        )}

        {section === 'orders' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>🛒 الطلبات ({orders.length})</h2>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                <div style={{ fontWeight: 700 }}>لا توجد طلبات بعد</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map(o => {
                  const sc = statusColors[o.status] || { bg: '#f3f4f6', text: '#6b7280' };
                  return (
                    <div key={o._id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', background: sc.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🛒</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{o._id.slice(-8).toUpperCase()}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                      </div>
                      <span style={{ background: sc.bg, color: sc.text, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>{o.status === 'pending' ? 'معلّق' : o.status === 'completed' ? 'مكتمل' : 'ملغى'}</span>
                      <div style={{ fontWeight: 900, color: '#1a7c2e' }}>{formatPrice(o.totalAmount)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
