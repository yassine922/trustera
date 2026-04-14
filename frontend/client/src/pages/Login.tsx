import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLocation } from 'wouter';

type Tab = 'login' | 'register';
type Role = 'buyer' | 'seller';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Login() {
  const { showToast, setUser } = useApp();
  const [, setLocation] = useLocation();
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
      if (r === 'admin') setLocation('/manager-dashboard');
      else if (r === 'seller') setLocation('/seller-dashboard');
      else setLocation('/');
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50 font-cairo" dir="rtl">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-primary">🛍️ Trustera</div>
          <div className="text-sm text-gray-500 mt-2">منصة التسوق الأولى في الجزائر</div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8">
          {(['login', 'register'] as Tab[]).map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
            </button>
          ))}
        </div>

        {/* Role selector (register only) */}
        {tab === 'register' && (
          <div className="flex gap-3 mb-6">
            {([['buyer', '🛍️ زبون'], ['seller', '🏪 بائع']] as [Role, string][]).map(([r, label]) => (
              <button 
                key={r} 
                onClick={() => setRole(r)} 
                className={`flex-1 py-3 border-2 rounded-2xl font-bold text-sm transition-all ${role === r ? 'border-primary bg-green-50 text-primary' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          {tab === 'register' && (
            <input className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all" placeholder="الاسم الكامل" value={form.name} onChange={e => set('name', e.target.value)} />
          )}
          <input className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => set('email', e.target.value)} />
          <input className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all" type="password" placeholder="كلمة المرور" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-xs font-bold mt-4 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <button 
          className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-black text-base shadow-lg shadow-green-100 hover:bg-primary-dark transition-all disabled:bg-gray-300 disabled:shadow-none" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? '⏳ جاري التحميل...' : tab === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
        </button>

        <div className="text-center mt-6 text-sm text-gray-500 font-bold">
          {tab === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب؟ '}
          <span onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="text-primary hover:underline cursor-pointer">
            {tab === 'login' ? 'سجّل الآن' : 'سجّل دخولك'}
          </span>
        </div>
      </div>
    </div>
  );
}
