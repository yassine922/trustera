import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

const API_URL = import.meta.env.VITE_API_URL || '';

interface User { _id: string; name: string; email: string; role: string; createdAt: string; }
interface Order { _id: string; totalAmount: number; status: string; createdAt: string; buyerId: string; }
interface Product { _id: string; name: string; price: number; sellerId: string; }

export default function ManagerDashboard() {
  const { user, token, showPage, showToast, logout } = useApp();
  const [section, setSection] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const [uRes, oRes, pRes] = await Promise.all([
        fetch(`${API_URL}/auth/users`, { headers }).catch(() => null),
        fetch(`${API_URL}/orders`, { headers }),
        fetch(`${API_URL}/products`, { headers }),
      ]);
      if (uRes) { const d = await uRes.json(); if (d.success) setUsers(d.data); }
      const oData = await oRes.json(); if (oData.success) setOrders(oData.data);
      const pData = await pRes.json(); if (pData.success) setProducts(pData.data);
    } catch {}
  }

  async function deleteOrder(id: string) {
    try {
      await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE', headers });
      showToast('تم حذف الطلب');
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch { showToast('حدث خطأ', 'error'); }
  }

  async function deleteProduct(id: string) {
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers });
      showToast('تم حذف المنتج');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { showToast('حدث خطأ', 'error'); }
  }

  const totalRevenue = orders.reduce((a, o) => a + o.totalAmount, 0);
  const sellers = users.filter(u => u.role === 'seller');
  const buyers = users.filter(u => u.role === 'buyer');

  const stats = [
    { icon: '👥', label: 'المستخدمون', value: users.length || '+50K', color: '#edf7f0', text: '#1a7c2e' },
    { icon: '🏪', label: 'البائعون', value: sellers.length || '+3K', color: '#dbeafe', text: '#1d4ed8' },
    { icon: '🛒', label: 'الطلبات', value: orders.length, color: '#fef3c7', text: '#d97706' },
    { icon: '💰', label: 'الإيرادات', value: formatPrice(totalRevenue), color: '#fce7f3', text: '#db2777' },
    { icon: '📦', label: 'المنتجات', value: products.length, color: '#f3e8ff', text: '#7c3aed' },
    { icon: '⏳', label: 'طلبات معلّقة', value: orders.filter(o => o.status === 'pending').length, color: '#fff7ed', text: '#ea580c' },
  ];

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#fef3c7', text: '#d97706' },
    completed: { bg: '#edf7f0', text: '#1a7c2e' },
    cancelled: { bg: '#fef2f2', text: '#dc2626' },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', direction: 'rtl' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: 'white', borderLeft: '1px solid #eef0f3', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #eef0f3' }}>
          <div style={{ width: '44px', height: '44px', background: '#edf7f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '8px' }}>👑</div>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>{user?.name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>مدير المنصة</div>
        </div>
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {[
            { key: 'overview', icon: '📊', label: 'الإحصائيات' },
            { key: 'orders', icon: '🛒', label: 'الطلبات' },
            { key: 'products', icon: '📦', label: 'المنتجات' },
            { key: 'users', icon: '👥', label: 'المستخدمون' },
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
        <div style={{ padding: '12px 20px', borderTop: '1px solid #eef0f3' }}>
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
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>📊 إحصائيات المنصة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px' }}>
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

        {section === 'orders' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>🛒 جميع الطلبات ({orders.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.map(o => {
                const sc = statusColors[o.status] || { bg: '#f3f4f6', text: '#6b7280' };
                return (
                  <div key={o._id} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{o._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                    </div>
                    <span style={{ background: sc.bg, color: sc.text, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                      {o.status === 'pending' ? 'معلّق' : o.status === 'completed' ? 'مكتمل' : 'ملغى'}
                    </span>
                    <div style={{ fontWeight: 900, color: '#1a7c2e', minWidth: '80px', textAlign: 'left' }}>{formatPrice(o.totalAmount)}</div>
                    <button onClick={() => deleteOrder(o._id)} style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>حذف</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {section === 'products' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>📦 جميع المنتجات ({products.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map(p => (
                <div key={p._id} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#edf7f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📦</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>بائع: {p.sellerId?.slice(-6)}</div>
                  </div>
                  <div style={{ fontWeight: 900, color: '#1a7c2e' }}>{formatPrice(p.price)}</div>
                  <button onClick={() => deleteProduct(p._id)} style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'users' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>👥 المستخدمون ({users.length})</h2>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                <div>لا توجد بيانات مستخدمين متاحة من الـ API</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {users.map(u => (
                  <div key={u._id} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #eef0f3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#edf7f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {u.role === 'seller' ? '🏪' : u.role === 'admin' ? '👑' : '👤'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{u.email}</div>
                    </div>
                    <span style={{ background: u.role === 'seller' ? '#dbeafe' : '#edf7f0', color: u.role === 'seller' ? '#1d4ed8' : '#1a7c2e', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                      {u.role === 'seller' ? 'بائع' : u.role === 'admin' ? 'مدير' : 'زبون'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
