import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PRODUCTS } from '../../data/products';

export default function Header() {
  const { showPage, cartCount, wishCount, showToast, setCurrentProduct, setCurrentCat, showPage: nav } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [activePage, setActivePage] = useState('home');

  const goTo = (page: any) => { showPage(page); setActivePage(page); };

  const performSearch = () => {
    if (!searchVal.trim()) return;
    setCurrentCat('all');
    showPage('categories');
  };

  return (
    <header style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 900, background: '#145c22', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
      {/* الشريط العلوي */}
      <div style={{ background: '#0f5120', padding: '6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a onClick={() => goTo('home')} style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', textDecoration: 'none' }}>🏠 الرئيسية</a>
          <a onClick={() => goTo('seller-register')} style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', textDecoration: 'none' }}>🏪 بيع على ترسترا</a>
          <a onClick={() => showToast('دعم 24/7 متاح قريباً', 'info')} style={{ color: 'rgba(255,255,255,0.8)', cursor: 'pointer', textDecoration: 'none' }}>🎧 المساعدة</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px' }}>
          <span>🛡️ تسوق آمن 100%</span>
          <span>🚚 توصيل سريع</span>
          <span>↩️ إرجاع مجاني</span>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* اللوغو */}
        <div onClick={() => goTo('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '38px', height: '38px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, color: '#145c22' }}>T</div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Trustera</span>
        </div>

        {/* شريط البحث */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', overflow: 'hidden', maxWidth: '680px' }}>
          <select style={{ padding: '0 12px', height: '42px', border: 'none', borderLeft: '1px solid #dde1e7', background: '#f4f6f8', fontFamily: 'Cairo, sans-serif', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            <option>كل الأقسام</option>
            <option>إلكترونيات</option>
            <option>أزياء</option>
            <option>منزل</option>
            <option>جمال</option>
            <option>رياضة</option>
          </select>
          <input
            id="searchInput"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && performSearch()}
            style={{ flex: 1, height: '42px', border: 'none', outline: 'none', padding: '0 14px', fontFamily: 'Cairo, sans-serif', fontSize: '14px' }}
            placeholder="ابحث عن منتج، بائع، أو تصنيفات..."
          />
          <button onClick={performSearch} style={{ width: '48px', height: '42px', background: '#ff6b00', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px' }}>
            🔍
          </button>
        </div>

        {/* أزرار العمليات */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => goTo('wishlist')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', borderRadius: '8px', position: 'relative', fontFamily: 'Cairo, sans-serif' }}>
            <span style={{ fontSize: '18px' }}>❤️</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>المفضلة</span>
            {wishCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '4px', background: '#ff6b00', color: 'white', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #145c22' }}>{wishCount}</span>}
          </button>
          <button onClick={() => goTo('cart')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', borderRadius: '8px', position: 'relative', fontFamily: 'Cairo, sans-serif' }}>
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>السلة</span>
            {cartCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '4px', background: '#ff6b00', color: 'white', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #145c22' }}>{cartCount}</span>}
          </button>
          <button onClick={() => showToast('الإشعارات قريباً', 'info')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', borderRadius: '8px', position: 'relative', fontFamily: 'Cairo, sans-serif' }}>
            <span style={{ fontSize: '18px' }}>🔔</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>إشعارات</span>
            <span style={{ position: 'absolute', top: '2px', right: '4px', background: '#d32f2f', color: 'white', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #145c22' }}>3</span>
          </button>
          <div onClick={() => goTo('account')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>أ</div>
            <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>أحمد بن علي</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>ahmed@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط التنقل */}
      <nav style={{ background: '#1a7c2e', padding: '0 24px', display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
        {[
          { id: 'home', label: 'الرئيسية', icon: '🏠' },
          { id: 'categories', label: 'الأقسام', icon: '📦' },
          { id: 'account', label: 'طلباتي', icon: '📋' },
          { id: 'wishlist', label: 'المفضلة', icon: '❤️' },
          { id: 'account', label: 'رسائلي', icon: '💬' },
          { id: 'account', label: 'محفظتي', icon: '💰' },
        ].map((item, i) => (
          <a
            key={i}
            onClick={() => goTo(item.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 14px', color: activePage === item.id ? 'white' : 'rgba(255,255,255,0.85)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              borderBottom: activePage === item.id ? '3px solid white' : '3px solid transparent',
              whiteSpace: 'nowrap', textDecoration: 'none', transition: 'all 0.2s',
              background: activePage === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            }}
          >
            {item.icon} {item.label}
          </a>
        ))}
        <a
          onClick={() => goTo('seller-register')}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 14px', color: '#ffb060', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', borderBottom: '3px solid transparent',
            whiteSpace: 'nowrap', textDecoration: 'none', marginRight: 'auto',
            background: 'rgba(255,107,0,0.15)',
          }}
        >
          🏪 سجّل كبائع
        </a>
      </nav>
    </header>
  );
}
