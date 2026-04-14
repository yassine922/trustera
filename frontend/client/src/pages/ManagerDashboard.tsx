import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';
import { useLocation } from 'wouter';

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
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-2xl backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center min-w-[280px] shadow-xl">
        <div className="font-bold text-sm mb-1.5 text-gray-900">تأكيد الحذف</div>
        <div className="text-xs text-gray-500 mb-5">{message}</div>
        <div className="flex gap-2 justify-center">
          <button onClick={onCancel} className="px-5 py-2 border border-gray-200 bg-white rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">إلغاء</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">تأكيد الحذف</button>
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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-xl mb-4`}>{icon}</div>
      <div className="text-xl font-black mb-0.5" style={{ color }}>{value}</div>
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</div>
      {trend && (
        <div className={`text-[10px] mt-2 font-bold ${trend.startsWith('↑') ? 'text-primary' : 'text-red-500'}`}>
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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm font-black text-gray-800">📊 تحليل المبيعات — آخر 7 أيام</span>
        <span className="text-[10px] font-bold text-primary bg-green-50 px-2 py-1 rounded-md">{tip}</span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {SALES.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div
              className={`w-full rounded-t-lg transition-all cursor-pointer group-hover:opacity-80 ${i === 6 ? 'bg-primary shadow-lg shadow-green-100' : 'bg-green-100'}`}
              style={{ height: `${Math.round(v / MAX_SALE * 100)}%` }}
              onMouseEnter={() => setTip(`${DAYS[i]}: ${v.toLocaleString('ar-DZ')} دج`)}
              onMouseLeave={() => setTip('مرّر على الأعمدة')}
            />
            <span className="text-[9px] font-bold text-gray-400">{DAYS[i].slice(0, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Progress Bar Row ─────────────────────────────────────────────────────────
function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-[11px] font-black mb-1.5">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-50 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
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
    <span className="px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
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
    <div className="absolute inset-0 bg-gray-50 z-20 rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3">
        <button onClick={onClose} className="px-4 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-black hover:bg-green-100 transition-colors">← رجوع</button>
        <span className="text-sm font-black text-gray-800 flex-1">السوق — عرض المدير</span>
        <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-black uppercase">وضع المراقبة</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {[
            { v: products.length, l: 'إجمالي المنتجات', c: 'text-gray-900', bg: 'bg-white' },
            { v: products.filter(p => p.status === 'pending').length, l: 'بانتظار الموافقة', c: 'text-amber-600', bg: 'bg-amber-50/30' },
            { v: 4, l: 'مُبلَّغ عنها', c: 'text-red-600', bg: 'bg-red-50/30' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border border-gray-100 rounded-xl p-4 text-center shadow-sm`}>
              <div className={`text-xl font-black ${s.c}`}>{s.v}</div>
              <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {MARKET_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${cat === c ? 'bg-primary border-primary text-white shadow-md shadow-green-100' : 'bg-white border-gray-100 text-gray-500 hover:border-primary hover:text-primary'}`}>{c}</button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {visible.map(p => (
            <div key={p._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col group transition-all hover:shadow-md">
              <div className="h-24 bg-gray-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">📦</div>
              <div className="p-3.5 flex-1 flex flex-col">
                <div className="text-[11px] font-black text-gray-900 line-clamp-1">{p.name}</div>
                <div className="text-[9px] font-bold text-gray-400 mt-0.5">{p.category ?? 'بدون فئة'}</div>
                <div className="text-sm font-black text-primary mt-2">{formatPrice(p.price)} دج</div>
                <div className="text-[9px] text-gray-400 mt-1 border-t border-gray-50 pt-1.5 flex justify-between items-center">
                  <span>بائع: {p.sellerId?.slice(-6)}</span>
                  {p.status && (
                    <span className={`px-2 py-0.5 rounded-full font-black ${p.status === 'active' ? 'bg-green-50 text-primary' : 'bg-amber-50 text-amber-600'}`}>
                      {p.status === 'active' ? 'نشط' : 'معلّق'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 p-3 pt-0">
                <button className="flex-1 py-1.5 bg-green-50 text-primary rounded-lg text-[10px] font-black hover:bg-primary hover:text-white transition-all">✓ موافقة</button>
                <button className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black hover:bg-red-500 hover:text-white transition-all">✕ إزالة</button>
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
  const { user, token, showToast, logout } = useApp();
  const [, setLocation] = useLocation();
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
        fetch(`${API_URL}/api/auth/users`, { headers }).catch(() => null),
        fetch(`${API_URL}/api/orders`,     { headers }),
        fetch(`${API_URL}/api/products`,   { headers }),
      ]);
      if (uRes) { const d = await uRes.json(); if (d.success) setUsers(d.data); }
      const oData = await oRes.json(); if (oData.success) setOrders(oData.data);
      const pData = await pRes.json(); if (pData.success) setProducts(pData.data);
    } catch {}
  }

  async function deleteOrder(id: string) {
    try {
      await fetch(`${API_URL}/api/orders/${id}`, { method: 'DELETE', headers });
      showToast('تم حذف الطلب');
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch { showToast('حدث خطأ', 'error'); }
  }

  async function deleteProduct(id: string) {
    try {
      await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE', headers });
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

  const navItem = (key: Section, icon: string, label: string, badge?: number) => (
    <button key={key} onClick={() => setSection(key)} className={`w-full px-5 py-3 flex items-center gap-3 transition-all border-r-4 ${section === key ? 'bg-green-50 text-primary border-primary font-black' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'}`}>
      <span className="text-lg w-6 flex justify-center">{icon}</span>
      <span className="flex-1 text-right text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-black">{badge}</span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-cairo" dir="rtl">
      
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div className="w-64 bg-white border-l border-gray-100 flex flex-col sticky top-0 h-screen shadow-sm z-30">
        <div className="p-6 border-b border-gray-50">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-sm shadow-green-100">👑</div>
          <div className="font-black text-base text-gray-900">{user?.name ?? 'ياسين'}</div>
          <div className="text-xs font-bold text-primary mt-0.5">مدير المنصة</div>
        </div>

        <nav className="py-6 flex-1">
          {navItem('overview',  '📊', 'الإحصائيات')}
          {navItem('orders',    '🛒', 'الطلبات',      pendingCount)}
          {navItem('products',  '📦', 'المنتجات')}
          {navItem('users',     '👥', 'المستخدمون')}
        </nav>

        {/* دخول السوق */}
        <div className="px-5 pb-4">
          <button onClick={() => { setMarketCat('الكل'); setMarketOpen(true); }} className="w-full py-3 bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 flex items-center justify-center gap-2">
            🏪 دخول السوق
          </button>
        </div>

        <div className="p-5 border-t border-gray-50">
          <button onClick={() => { logout(); setLocation('/'); }} className="w-full py-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-black transition-colors hover:bg-red-100">
            🚪 تسجيل الخروج
          </button>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────────────── */}
      <div className="flex-1 p-8 overflow-y-auto max-w-[1400px] mx-auto w-full">

        {/* ── Overview ──────────────────────────────────────────────── */}
        {section === 'overview' && (
          <div>
            <h2 className="text-xl font-black mb-6 text-gray-900">📊 إحصائيات المنصة الشاملة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <StatCard icon="👥" label="المستخدمون" value={users.length || '+50K'} bg="bg-green-50" color="#1a7c2e" trend="↑ 12% هذا الشهر" />
              <StatCard icon="🏪" label="البائعون"   value={sellers.length || '+3K'}  bg="bg-blue-50" color="#1d4ed8" trend="↑ 8%" />
              <StatCard icon="🛒" label="الطلبات"    value={orders.length}             bg="bg-amber-50" color="#d97706" trend="↑ 5%" />
              <StatCard icon="💰" label="الإيرادات"  value={formatPrice(totalRevenue)} bg="bg-pink-50" color="#db2777" trend="↑ 18%" />
              <StatCard icon="📦" label="المنتجات"   value={products.length}           bg="bg-purple-50" color="#7c3aed" />
              <StatCard icon="⏳" label="طلبات معلّقة" value={pendingCount}            bg="bg-orange-50" color="#ea580c" trend={pendingCount > 0 ? '↑ تحتاج مراجعة' : undefined} />
            </div>

            <BarChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-sm font-black mb-5 text-gray-800">توزيع حالات الطلبات</div>
                <ProgressRow label="مكتمل" value={65} color="#1a7c2e" />
                <ProgressRow label="معلّق"  value={23} color="#d97706" />
                <ProgressRow label="ملغى"   value={12} color="#dc2626" />
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-sm font-black mb-5 text-gray-800">أكثر الفئات مبيعاً (رائد)</div>
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
          <div className="relative">
            {confirmOrder && (
              <ConfirmDialog
                message="هذا الإجراء لا يمكن التراجع عنه"
                onConfirm={() => { deleteOrder(confirmOrder); setConfirmOrder(null); }}
                onCancel={() => setConfirmOrder(null)}
              />
            )}
            <h2 className="text-xl font-black mb-6 text-gray-900">
              🛒 جميع الطلبات ({filteredOrders.length})
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary transition-colors" placeholder="بحث برقم الطلب..."
                value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
              />
              <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer" value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                <option value="">كل الحالات</option>
                <option value="pending">معلّق</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            <div className="space-y-3">
              {filteredOrders.length === 0
                ? <div className="text-center py-16 text-gray-400 font-bold">لا توجد طلبات مطابقة</div>
                : filteredOrders.map(o => (
                  <div key={o._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🛒</div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-gray-900 tracking-wider">#{o._id.slice(-8).toUpperCase()}</div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{new Date(o.createdAt).toLocaleDateString('ar-DZ')}</div>
                    </div>
                    <StatusBadge status={o.status} />
                    <div className="font-black text-primary text-sm min-w-[100px] text-left">
                      {formatPrice(o.totalAmount)} دج
                    </div>
                    <button onClick={() => setConfirmOrder(o._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[11px] font-black hover:bg-red-100 transition-colors">حذف</button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ── Products ──────────────────────────────────────────────── */}
        {section === 'products' && (
          <div className="relative">
            {confirmProduct && (
              <ConfirmDialog
                message="هذا الإجراء لا يمكن التراجع عنه"
                onConfirm={() => { deleteProduct(confirmProduct); setConfirmProduct(null); }}
                onCancel={() => setConfirmProduct(null)}
              />
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">📦 مستودع المنتجات ({filteredProducts.length})</h2>
              <button onClick={() => { setMarketCat('الكل'); setMarketOpen(true); }} className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-green-100 transition-all hover:bg-primary-dark">🏪 فحص في السوق</button>
            </div>
            <div className="mb-6">
              <input
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary transition-colors" placeholder="بحث بالاسم أو الفئة..."
                value={productSearch} onChange={e => setProductSearch(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              {filteredProducts.length === 0
                ? <div className="text-center py-16 text-gray-400 font-bold">لا توجد منتجات مطابقة</div>
                : filteredProducts.map(p => (
                  <div key={p._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📦</div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1">
                        {p.category ? `${p.category} · ` : ''}بائع: <span className="text-primary tracking-widest">{p.sellerId?.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                    {p.status && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${p.status === 'active' ? 'bg-green-50 text-primary' : 'bg-amber-50 text-amber-600'}`}>
                        {p.status === 'active' ? 'نشط' : 'معلّق'}
                      </span>
                    )}
                    <div className="font-black text-primary text-sm min-w-[90px] text-left">{formatPrice(p.price)} دج</div>
                    <button
                      onClick={() => { setMarketCat(p.category ?? 'الكل'); setMarketOpen(true); }}
                      className="px-4 py-2 bg-green-50 text-primary rounded-lg text-[10px] font-black hover:bg-primary hover:text-white transition-all"
                    >فحص ↗</button>
                    <button onClick={() => setConfirmProduct(p._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black hover:bg-red-100 transition-colors">حذف</button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ── Users ─────────────────────────────────────────────────── */}
        {section === 'users' && (
          <div>
            <h2 className="text-xl font-black mb-6 text-gray-900">👥 قاعدة بيانات المستخدمين ({filteredUsers.length})</h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary transition-colors" placeholder="بحث بالاسم أو البريد..."
                value={userSearch} onChange={e => setUserSearch(e.target.value)}
              />
              <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer" value={userRole} onChange={e => setUserRole(e.target.value)}>
                <option value="">كل الأدوار</option>
                <option value="seller">بائع</option>
                <option value="buyer">زبون</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            <div className="space-y-3">
              {filteredUsers.length === 0
                ? <div className="text-center py-16 text-gray-400 font-bold">لا توجد نتائج مطابقة</div>
                : filteredUsers.map(u => (
                  <div key={u._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${u.role === 'seller' ? 'bg-blue-50' : u.role === 'admin' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      {u.role === 'seller' ? '🏪' : u.role === 'admin' ? '👑' : '👤'}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-gray-900">{u.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase">{u.email}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${u.role === 'seller' ? 'bg-blue-50 text-blue-600' : u.role === 'admin' ? 'bg-green-50 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                      {u.role === 'seller' ? 'بائع' : u.role === 'admin' ? 'مدير' : 'زبون'}
                    </span>
                    <div className="text-[10px] text-gray-400 font-black min-w-[80px] text-left">
                      {new Date(u.createdAt).toLocaleDateString('ar-DZ')}
                    </div>
                  </div>
                ))
              }
            </div>
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