import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

const API_URL = import.meta.env.VITE_API_URL || '';

interface User    { _id: string; name: string; email: string; role: string; createdAt: string; }
interface Order   { _id: string; totalAmount: number; status: string; createdAt: string; buyerId: string; }
interface Product { _id: string; name: string; price: number; sellerId: string; category?: string; status?: string; }

type Section = 'overview' | 'orders' | 'products' | 'users';

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  message, onConfirm, onCancel,
}: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, borderRadius: '14px',
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', padding: '20px 24px',
        border: '1px solid #eef0f3', textAlign: 'center', minWidth: '220px',
      }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>تأكيد الحذف</div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>{message}</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            padding: '7px 18px', border: '1px solid #dde1e7', background: 'transparent',
            borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
          }}>إلغاء</button>
          <button onClick={onConfirm} style={{
            padding: '7px 18px', background: '#fef2f2', color: '#dc2626',
            border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12px',
            cursor: 'pointer', fontWeight: 700,
          }}>حذف</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, bg, color, trend }: {
  icon: string; label: string; value: string | number;
  bg: string; color: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '14px',
      border: '1px solid #eef0f3',
    }}>
      <div style={{
        width: '32px', height: '32px', background: bg, borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', marginBottom: '10px',
      }}>{icon}</div>
      <div style={{ fontSize: '20px', fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{label}</div>
      {trend && (
        <div style={{ fontSize: '10px', color: trend.startsWith('↑') ? '#1a7c2e' : '#dc2626', marginTop: '3px', fontWeight: 700 }}>
          {trend}
        </div>
      )}
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const SALES = [4200, 3100, 5800, 2900, 7200, 6100, 8400];
const MAX_SALE = Math.max(...SALES);

function BarChart() {
  const [tip, setTip] = useState('مرّر على الأعمدة');
  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '16px',
      border: '1px solid #eef0f3', marginBottom: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>المبيعات — آخر 7 أيام</span>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>{tip}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
        {SALES.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '100%', height: `${Math.round(v / MAX_SALE * 72)}px`,
                background: i === 6 ? '#1a7c2e' : '#bbf7d0',
                borderRadius: '3px 3px 0 0', cursor: 'pointer', transition: 'opacity .2s',
              }}
              onMouseEnter={() => setTip(`${DAYS[i]}: ${v.toLocaleString('ar-DZ')} دج`)}
              onMouseLeave={() => setTip('مرّر على الأعمدة')}
            />
            <span style={{ fontSize: '9px', color: '#6b7280' }}>{DAYS[i].slice(0, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Progress Bar Row ─────────────────────────────────────────────────────────
function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '3px' }}>
        <span>{label}</span><span>{value}%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: '#f3f4f6', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '3px', width: `${value}%`, background: color, transition: 'width .4s' }} />
      </div>
    </div>
  );
}

// ─── Status / Category badges ─────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: '#fef3c7', text: '#d97706', label: 'معلّق' },
  completed: { bg: '#edf7f0', text: '#1a7c2e', label: 'مكتمل' },
  cancelled: { bg: '#fef2f2', text: '#dc2626', label: 'ملغى' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#6b7280', label: status };
  return (
    <span style={{
      background: s.bg, color: s.text, padding: '3px 10px',
      borderRadius: '99px', fontSize: '11px', fontWeight: 700, flexShrink: 0,
    }}>{s.label}</span>
  );
}

// ─── Market Overlay ───────────────────────────────────────────────────────────
const MARKET_CATS = ['الكل', 'خضروات', 'فواكه', 'لحوم', 'زيوت', 'منتجات نحل'];

function MarketOverlay({
  products, onClose, initialCat = 'الكل',
}: { products: Product[]; onClose: () => void; initialCat?: string }) {
  const [cat, setCat] = useState(initialCat);
  const visible = cat === 'الكل' ? products : products.filter(p => p.category === cat);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#f5f7fa',
      zIndex: 20, borderRadius: '14px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'white', borderBottom: '1px solid #eef0f3',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <button onClick={onClose} style={{
          padding: '5px 12px', background: '#edf7f0', color: '#1a7c2e',
          border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
        }}>← رجوع</button>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>السوق — عرض المدير</span>
        <span style={{
          fontSize: '10px', background: '#fef3c7', color: '#d97706',
          padding: '2px 8px', borderRadius: '99px', fontWeight: 700,
        }}>وضع المراقبة</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
          {[
            { v: products.length, l: 'إجمالي المنتجات', c: '#111827' },
            { v: products.filter(p => p.status === 'pending').length, l: 'بانتظار الموافقة', c: '#d97706' },
            { v: 4, l: 'مُبلَّغ عنها', c: '#dc2626' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', border: '1px solid #eef0f3',
              borderRadius: '10px', padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {MARKET_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '4px 12px', borderRadius: '99px', fontSize: '11px', cursor: 'pointer',
              border: '1px solid',
              background: cat === c ? '#edf7f0' : 'white',
              color: cat === c ? '#1a7c2e' : '#6b7280',
              borderColor: cat === c ? '#edf7f0' : '#dde1e7',
              fontFamily: 'Cairo, sans-serif',
              transition: 'all .15s',
            }}>{c}</button>
          ))}
        </div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
          {visible.map(p => (
            <div key={p._id} style={{
              background: 'white', border: '1px solid #eef0f3',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <div style={{
                height: '70px', background: '#f5f7fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
              }}>📦</div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{p.category ?? '—'}</div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#1a7c2e', marginTop: '4px' }}>
                  {formatPrice(p.price)}
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                  بائع: {p.sellerId?.slice(-6)}
                </div>
                {p.status && (
                  <span style={{
                    fontSize: '9px', padding: '2px 6px', borderRadius: '99px', marginTop: '4px',
                    display: 'inline-block',
                    background: p.status === 'active' ? '#edf7f0' : '#fef3c7',
                    color: p.status === 'active' ? '#1a7c2e' : '#d97706',
                  }}>
                    {p.status === 'active' ? 'نشط' : 'معلّق'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '4px', padding: '0 10px 8px' }}>
                <button style={{
                  flex: 1, padding: '5px', background: '#edf7f0', color: '#1a7c2e',
                  border: 'none', borderRadius: '6px', fontSize: '10px',
                  cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700,
                }}>✓ موافقة</button>
                <button style={{
                  flex: 1, padding: '5px', background: '#fef2f2', color: '#dc2626',
                  border: 'none', borderRadius: '6px', fontSize: '10px',
                  cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
                }}>✕ إزالة</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ManagerDashboard() {
  const { user, token, showPage, showToast, logout } = useApp();
  const [section, setSection]       = useState<Section>('overview');
  const [users, setUsers]           = useState<User[]>([]);
  const [orders, setOrders]         = useState<Order[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [marketOpen, setMarketOpen] = useState(false);
  const [marketCat, setMarketCat]   = useState('الكل');

  // Confirm dialogs
  const [confirmOrder,   setConfirmOrder]   = useState<string | null>(null);
  const [confirmProduct, setConfirmProduct] = useState<string | null>(null);

  // Search / filter state
  const [orderSearch,  setOrderSearch]  = useState('');
  const [orderStatus,  setOrderStatus]  = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [userSearch,   setUserSearch]   = useState('');
  const [userRole,     setUserRole]     = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const [uRes, oRes, pRes] = await Promise.all([
        fetch(`${API_URL}/auth/users`, { headers }).catch(() => null),
        fetch(`${API_URL}/orders`,     { headers }),
        fetch(`${API_URL}/products`,   { headers }),
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

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((a, o) => a + o.totalAmount, 0);
  const sellers      = users.filter(u => u.role === 'seller');
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = orderSearch.toLowerCase();
    return (!q || o._id.toLowerCase().includes(q)) && (!orderStatus || o.status === orderStatus);
  }), [orders, orderSearch, orderStatus]);

  const filteredProducts = useMemo(() => products.filter(p => {
    const q = productSearch.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q);
  }), [products, productSearch]);

  const filteredUsers = useMemo(() => users.filter(u => {
    const q = userSearch.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (!userRole || u.role === userRole);
  }), [users, userSearch, userRole]);

  // ── Shared styles ─────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: 'white', borderRadius: '12px', padding: '12px 14px',
    border: '1px solid #eef0f3', display: 'flex', alignItems: 'center',
    gap: '10px', marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: '7px 10px', background: 'white',
    border: '1px solid #dde1e7', borderRadius: '8px',
    fontSize: '13px', fontFamily: 'Cairo, sans-serif', outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    padding: '7px 10px', background: 'white', border: '1px solid #dde1e7',
    borderRadius: '8px', fontSize: '12px', fontFamily: 'Cairo, sans-serif', outline: 'none', cursor: 'pointer',
  };

  const navItem = (key: Section, icon: string, label: string, badge?: number) => (
    <button key={key} onClick={() => setSection(key)} style={{
      width: '100%', padding: '10px 16px', border: 'none', textAlign: 'right',
      background: section === key ? '#edf7f0' : 'transparent',
      color: section === key ? '#1a7c2e' : '#374151',
      fontFamily: 'Cairo, sans-serif', fontSize: '13px',
      fontWeight: section === key ? 700 : 500, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '8px',
      borderRight: section === key ? '3px solid #1a7c2e' : '3px solid transparent',
    }}>
      <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{icon}</span>
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          marginRight: 'auto', background: '#fef3c7', color: '#d97706',
          fontSize: '10px', padding: '1px 7px', borderRadius: '99px', fontWeight: 700,
        }}>{badge}</span>
      )}
    </button>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', direction: 'rtl', position: 'relative' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div style={{
        width: '220px', background: 'white', borderLeft: '1px solid #eef0f3',
        padding: '0', flexShrink: 0, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #eef0f3' }}>
          <div style={{
            width: '40px', height: '40px', background: '#edf7f0', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', marginBottom: '8px',
          }}>👑</div>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>{user?.name ?? 'ياسين'}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>مدير المنصة</div>
        </div>

        <nav style={{ padding: '10px 0', flex: 1 }}>
          {navItem('overview',  '📊', 'الإحصائيات')}
          {navItem('orders',    '🛒', 'الطلبات',      pendingCount)}
          {navItem('products',  '📦', 'المنتجات')}
          {navItem('users',     '👥', 'المستخدمون')}
        </nav>

        {/* دخول السوق */}
        <div style={{ padding: '0 12px 10px' }}>
          <button onClick={() => { setMarketCat('الكل'); setMarketOpen(true); }} style={{
            width: '100%', padding: '10px', background: '#1a7c2e', color: 'white',
            border: 'none', borderRadius: '10px', fontFamily: 'Cairo, sans-serif',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>🏪 دخول السوق</button>
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid #eef0f3' }}>
          <button onClick={() => { logout(); showPage('home'); }} style={{
            width: '100%', padding: '9px', background: '#fef2f2', color: '#dc2626',
            border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
            fontSize: '12px', fontWeight: 700, cursor: 'pointer',
          }}>🚪 تسجيل الخروج</button>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '28px 24px', overflow: 'auto' }}>

        {/* ── Overview ──────────────────────────────────────────────── */}
        {section === 'overview' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '18px' }}>📊 إحصائيات المنصة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px', marginBottom: '20px' }}>
              <StatCard icon="👥" label="المستخدمون" value={users.length || '+50K'} bg="#edf7f0" color="#1a7c2e" trend="↑ 12% هذا الشهر" />
              <StatCard icon="🏪" label="البائعون"   value={sellers.length || '+3K'}  bg="#dbeafe" color="#1d4ed8" trend="↑ 8%" />
              <StatCard icon="🛒" label="الطلبات"    value={orders.length}             bg="#fef3c7" color="#d97706" trend="↑ 5%" />
              <StatCard icon="💰" label="الإيرادات"  value={formatPrice(totalRevenue)} bg="#fce7f3" color="#db2777" trend="↑ 18%" />
              <StatCard icon="📦" label="المنتجات"   value={products.length}           bg="#f3e8ff" color="#7c3aed" />
              <StatCard icon="⏳" label="طلبات معلّقة" value={pendingCount}            bg="#fff7ed" color="#ea580c" trend={pendingCount > 0 ? '↑ تحتاج مراجعة' : undefined} />
            </div>

            <BarChart />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #eef0f3' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>توزيع الطلبات</div>
                <ProgressRow label="مكتمل" value={65} color="#1a7c2e" />
                <ProgressRow label="معلّق"  value={23} color="#d97706" />
                <ProgressRow label="ملغى"   value={12} color="#dc2626" />
              </div>
              <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #eef0f3' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>أكثر الفئات مبيعاً</div>
                <ProgressRow label="خضروات"     value={38} color="#1a7c2e" />
                <ProgressRow label="فواكه"       value={25} color="#1a7c2e" />
                <ProgressRow label="لحوم"        value={20} color="#1a7c2e" />
                <ProgressRow label="زيوت"        value={17} color="#1a7c2e" />
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ────────────────────────────────────────────────── */}
        {section === 'orders' && (
          <div style={{ position: 'relative' }}>
            {confirmOrder && (
              <ConfirmDialog
                message="هذا الإجراء لا يمكن التراجع عنه"
                onConfirm={() => { deleteOrder(confirmOrder); setConfirmOrder(null); }}
                onCancel={() => setConfirmOrder(null)}
              />
            )}
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>
              🛒 جميع الطلبات ({filteredOrders.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                style={inputStyle} placeholder="بحث برقم الطلب..."
                value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
              />
              <select style={selectStyle} value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                <option value="">كل الحالات</option>
                <option value="pending">معلّق</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            {filteredOrders.length === 0
              ? <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>لا توجد طلبات مطابقة</div>
              : filteredOrders.map(o => (
                <div key={o._id} style={card}>
                  <div style={{ width: '36px', height: '36px', background: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🛒</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{o._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                  </div>
                  <StatusBadge status={o.status} />
                  <div style={{ fontWeight: 900, color: '#1a7c2e', minWidth: '90px', textAlign: 'left', fontSize: '13px' }}>
                    {formatPrice(o.totalAmount)}
                  </div>
                  <button onClick={() => setConfirmOrder(o._id)} style={{
                    padding: '5px 12px', background: '#fef2f2', color: '#dc2626',
                    border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  }}>حذف</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Products ──────────────────────────────────────────────── */}
        {section === 'products' && (
          <div style={{ position: 'relative' }}>
            {confirmProduct && (
              <ConfirmDialog
                message="هذا الإجراء لا يمكن التراجع عنه"
                onConfirm={() => { deleteProduct(confirmProduct); setConfirmProduct(null); }}
                onCancel={() => setConfirmProduct(null)}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>📦 جميع المنتجات ({filteredProducts.length})</h2>
              <button onClick={() => { setMarketCat('الكل'); setMarketOpen(true); }} style={{
                padding: '8px 16px', background: '#1a7c2e', color: 'white',
                border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}>🏪 فحص في السوق</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                style={inputStyle} placeholder="بحث بالاسم أو الفئة..."
                value={productSearch} onChange={e => setProductSearch(e.target.value)}
              />
            </div>
            {filteredProducts.length === 0
              ? <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>لا توجد منتجات مطابقة</div>
              : filteredProducts.map(p => (
                <div key={p._id} style={card}>
                  <div style={{ width: '36px', height: '36px', background: '#edf7f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📦</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {p.category ? `${p.category} · ` : ''}بائع: {p.sellerId?.slice(-6)}
                    </div>
                  </div>
                  {p.status && (
                    <span style={{
                      background: p.status === 'active' ? '#edf7f0' : '#fef3c7',
                      color: p.status === 'active' ? '#1a7c2e' : '#d97706',
                      padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                    }}>
                      {p.status === 'active' ? 'نشط' : 'معلّق'}
                    </span>
                  )}
                  <div style={{ fontWeight: 900, color: '#1a7c2e', fontSize: '13px' }}>{formatPrice(p.price)}</div>
                  <button
                    onClick={() => { setMarketCat(p.category ?? 'الكل'); setMarketOpen(true); }}
                    style={{
                      padding: '5px 10px', background: '#edf7f0', color: '#1a7c2e',
                      border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
                      fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    }}>فحص ↗</button>
                  <button onClick={() => setConfirmProduct(p._id)} style={{
                    padding: '5px 12px', background: '#fef2f2', color: '#dc2626',
                    border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  }}>حذف</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Users ─────────────────────────────────────────────────── */}
        {section === 'users' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>👥 المستخدمون ({filteredUsers.length})</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                style={inputStyle} placeholder="بحث بالاسم أو البريد..."
                value={userSearch} onChange={e => setUserSearch(e.target.value)}
              />
              <select style={selectStyle} value={userRole} onChange={e => setUserRole(e.target.value)}>
                <option value="">كل الأدوار</option>
                <option value="seller">بائع</option>
                <option value="buyer">زبون</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            {filteredUsers.length === 0
              ? <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>لا توجد نتائج</div>
              : filteredUsers.map(u => (
                <div key={u._id} style={card}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: u.role === 'seller' ? '#dbeafe' : u.role === 'admin' ? '#edf7f0' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                  }}>
                    {u.role === 'seller' ? '🏪' : u.role === 'admin' ? '👑' : '👤'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{u.email}</div>
                  </div>
                  <span style={{
                    background: u.role === 'seller' ? '#dbeafe' : '#edf7f0',
                    color: u.role === 'seller' ? '#1d4ed8' : '#1a7c2e',
                    padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                  }}>
                    {u.role === 'seller' ? 'بائع' : u.role === 'admin' ? 'مدير' : 'زبون'}
                  </span>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {new Date(u.createdAt).toLocaleDateString('ar-DZ')}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* ── Market Overlay ──────────────────────────────────────────── */}
      {marketOpen && (
        <MarketOverlay
          products={products}
          initialCat={marketCat}
          onClose={() => setMarketOpen(false)}
        />
      )}
    </div>
  );
}