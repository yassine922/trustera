import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

type Tab = 'login' | 'register';
type Role = 'buyer' | 'seller';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Login() {
  const { showPage, showToast, setUser } = useApp();
  const [tab, setTab] = useState<Tab>('login');
  const [role, setRole] = useState<Role>('buyer');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', storeName: '', phone: '' });
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit() {
    setError('');
    if (!form.email || !form.password) return setError('يرجى ملء جميع الحقول');
    if (tab === 'register' && !form.name) return setError('يرجى إدخال الاسم');

    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) return setError(data.message || 'حدث خطأ');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user, data.token);
      showToast('مرحباً بك! 👋', 'success');

      const r = data.user.role;
      if (r === 'admin') showPage('manager-dashboard');
      else if (r === 'seller') showPage('seller-dashboard');
      else showPage('home');
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1.5px solid #dde1e7', fontFamily: 'Cairo,sans-serif',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: '#fafafa', direction: 'rtl',
  };
  const btn: React.CSSProperties = {
    width: '100%', padding: '13px', background: '#1a7c2e', color: 'white',
    border: 'none', borderRadius: '10px', fontFamily: 'Cairo,sans-serif',
    fontSize: '15px', fontWeight: 800, cursor: 'pointer',
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f5f7fa' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#1a7c2e' }}>🛍️ Trustera</div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>منصة التسوق الأولى في الجزائر</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
          {(['login', 'register'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px', border: 'none', borderRadius: '8px', fontFamily: 'Cairo,sans-serif',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#1a7c2e' : '#6b7280',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>
              {t === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
            </button>
          ))}
        </div>

        {/* Role selector (register only) */}
        {tab === 'register' && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            {([['buyer', '🛍️ زبون'], ['seller', '🏪 بائع']] as [Role, string][]).map(([r, label]) => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '10px', border: `2px solid ${role === r ? '#1a7c2e' : '#dde1e7'}`,
                borderRadius: '10px', fontFamily: 'Cairo,sans-serif', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', background: role === r ? '#edf7f0' : 'white',
                color: role === r ? '#1a7c2e' : '#6b7280',
              }}>{label}</button>
            ))}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tab === 'register' && (
            <input style={inp} placeholder="الاسم الكامل" value={form.name} onChange={e => set('name', e.target.value)} />
          )}
          <input style={inp} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => set('email', e.target.value)} />
          <input style={inp} type="password" placeholder="كلمة المرور" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginTop: '12px', textAlign: 'right' }}>
            ⚠️ {error}
          </div>
        )}

        <button style={{ ...btn, marginTop: '20px', opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ جاري التحميل...' : tab === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
          {tab === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب؟ '}
          <span onClick={() => setTab(tab === 'login' ? 'register' : 'login')} style={{ color: '#1a7c2e', fontWeight: 700, cursor: 'pointer' }}>
            {tab === 'login' ? 'سجّل الآن' : 'سجّل دخولك'}
          </span>
        </div>
      </div>
    </div>
  );
}
