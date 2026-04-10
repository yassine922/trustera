import { useState, useEffect } from 'react';
import { getFeatured, getNew } from '../data/products';
import ProductCard from '../components/shared/ProductCard';
import { useApp } from '../contexts/AppContext';

function Countdown() {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) return;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[{ val: time.h, label: 'ساعة' }, { val: time.m, label: 'دقيقة' }, { val: time.s, label: 'ثانية' }].map((u, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center', minWidth: '52px' }}>
          <span style={{ fontSize: '20px', fontWeight: 900, display: 'block' }}>{u.val}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{u.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { showPage, showToast } = useApp();
  const featured = getFeatured();
  const newest = getNew();

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(130deg,#0d4a1a 0%,#1a7c2e 50%,#2ea84a 100%)', padding: '40px 32px', color: 'white', position: 'relative', overflow: 'hidden', minHeight: '220px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '200px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>
            🎉 منصة التسوق الأولى في الجزائر
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.25, marginBottom: '10px' }}>
            تسوّق بثقة،<br /><span style={{ color: '#86efac' }}>بيع بسهولة</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '22px', maxWidth: '400px' }}>
            اكتشف آلاف المنتجات من بائعين موثوقين في الجزائر. جودة مضمونة وتوصيل سريع.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => showPage('categories')} style={{ padding: '11px 28px', background: 'white', color: '#145c22', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
              🛍️ تسوق الآن
            </button>
            <button onClick={() => showPage('seller-register')} style={{ padding: '11px 28px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.35)', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              🏪 ابدأ البيع
            </button>
          </div>
        </div>
        <div style={{ width: '380px', flexShrink: 0, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '90px', animation: 'float 3s ease-in-out infinite' }}>
            🛍️
          </div>
        </div>
        {/* Trust badges */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { icon: '🛡️', title: 'تسوق آمن 100%', sub: 'حماية كاملة لبياناتك' },
            { icon: '🚚', title: 'توصيل سريع', sub: 'خلال 2-4 أيام عمل' },
            { icon: '↩️', title: 'إرجاع مجاني', sub: 'خلال 14 يوم' },
            { icon: '🏆', title: 'ضمان الجودة', sub: 'منتجات موثوقة 100%' },
          ].map((b, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>
              <span style={{ fontSize: '18px' }}>{b.icon}</span>
              <div><div style={{ fontWeight: 700 }}>{b.title}</div><div style={{ opacity: 0.7 }}>{b.sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* قسم المنتجات الرائجة */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔥 المنتجات الرائجة
          </div>
          <a onClick={() => showPage('categories')} style={{ fontSize: '13px', color: '#1a7c2e', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            عرض الكل ◀
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
          {featured.map((p, i) => <ProductCard key={p.id} product={p} idx={i} />)}
        </div>
      </div>

      {/* بانر العروض */}
      <div style={{ margin: '24px 24px 0', background: 'linear-gradient(130deg,#7c3aed,#4f46e5)', borderRadius: '14px', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
        <span style={{ fontSize: '48px' }}>⚡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '4px' }}>عروض اليوم الحصرية</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>تنتهي خلال:</div>
          <div style={{ marginTop: '8px' }}><Countdown /></div>
        </div>
        <button onClick={() => showPage('categories')} style={{ padding: '10px 24px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          🏷️ تصفح العروض
        </button>
      </div>

      {/* المنتجات الجديدة */}
      <div style={{ padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '17px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#1a7c2e', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>NEW</span>
            منتجات جديدة
          </div>
          <a onClick={() => showPage('categories')} style={{ fontSize: '13px', color: '#1a7c2e', fontWeight: 600, cursor: 'pointer' }}>عرض الكل ◀</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '14px' }}>
          {newest.map((p, i) => <ProductCard key={p.id} product={p} idx={i} />)}
        </div>
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );
}
