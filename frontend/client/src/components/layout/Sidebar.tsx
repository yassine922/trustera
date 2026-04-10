import { useApp } from '../../contexts/AppContext';

export default function Sidebar() {
  const { showPage, cartCount, wishCount } = useApp();
  return (
    <aside style={{ width: '210px', flexShrink: 0, background: 'white', borderLeft: '1px solid #eef0f3', padding: '16px 0', position: 'sticky', top: '112px', height: 'calc(100vh - 112px)', overflowY: 'auto' }}>
      <button onClick={() => showPage('seller-register')} style={{ width: 'calc(100% - 24px)', margin: '0 12px 10px', padding: '9px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        ➕ إضافة منتج
      </button>
      {[
        { icon: '🏠', label: 'الرئيسية', page: 'home', badge: null },
        { icon: '📦', label: 'الأقسام', page: 'categories', badge: null },
        { icon: '📋', label: 'طلباتي', page: 'account', badge: '3' },
        { icon: '❤️', label: 'المفضلة', page: 'wishlist', badge: wishCount > 0 ? String(wishCount) : null },
        { icon: '💬', label: 'رسائلي', page: 'account', badge: '2', badgeRed: true },
        { icon: '💰', label: 'محفظتي', page: 'account', badge: null, extra: '12,500 دج' },
        { icon: '⚙️', label: 'الإعدادات', page: 'account', badge: null },
      ].map((item, i) => (
        <div key={i} onClick={() => showPage(item.page as any)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', color: '#374151', fontSize: '13.5px', fontWeight: 600, borderRight: '3px solid transparent', transition: 'all 0.2s' }} className="sidebar-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </div>
          {item.extra && <span style={{ fontSize: '11px', color: '#1a7c2e', fontWeight: 700 }}>{item.extra}</span>}
          {item.badge && (
            <span style={{ background: item.badgeRed ? '#fee2e2' : '#edf7f0', color: item.badgeRed ? '#d32f2f' : '#1a7c2e', fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '99px' }}>{item.badge}</span>
          )}
        </div>
      ))}

      <div style={{ height: '1px', background: '#eef0f3', margin: '8px 16px' }} />

      <div style={{ margin: '12px 12px 0', padding: '14px', background: '#edf7f0', borderRadius: '10px', border: '1px solid #c8e6c9' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>هل أنت بائع؟</div>
        <p style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5, marginBottom: '10px' }}>ابدأ البيع الآن ووصل لآلاف الزبائن</p>
        <button onClick={() => showPage('seller-register')} style={{ width: '100%', padding: '8px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          🏪 تسجيل كبائع
        </button>
      </div>

      <style>{`.sidebar-item:hover { background: #edf7f0; color: #1a7c2e; border-right-color: #1a7c2e !important; }`}</style>
    </aside>
  );
}
