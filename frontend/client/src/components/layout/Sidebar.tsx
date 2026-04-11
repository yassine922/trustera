import { useApp } from '../../contexts/AppContext';

export default function Sidebar() {
  const { showPage, wishCount } = useApp();
  
  return (
    <aside className="w-52 flex-shrink-0 bg-white border-l border-gray-100 pt-4 sticky top-28 h-[calc(100vh-112px)] overflow-y-auto">
      <button 
        onClick={() => showPage('seller-register')} 
        className="w-11/12 mx-auto mb-2.5 py-2 bg-primary text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-primary-dark transition"
      >
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
        <div 
          key={i} 
          onClick={() => showPage(item.page as any)} 
          className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-gray-700 text-sm font-semibold border-r-3 border-r-transparent transition-all hover:bg-primary-bg hover:text-primary hover:border-r-primary"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </div>
          <div className="flex items-center gap-2">
            {item.extra && <span className="text-xs text-primary font-bold">{item.extra}</span>}
            {item.badge && (
              <span className={`text-xs font-black px-1.5 py-0.5 rounded-full ${
                item.badgeRed 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-primary-bg text-primary'
              }`}>
                {item.badge}
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="h-px bg-gray-100 my-2 mx-4" />

      <div className="mx-3 mt-3 p-3.5 bg-primary-bg rounded-lg border border-green-200">
        <div className="text-xs font-bold mb-1.5">هل أنت بائع؟</div>
        <p className="text-xs text-gray-700 leading-relaxed mb-2.5">ابدأ البيع الآن ووصل لآلاف الزبائن</p>
        <button 
          onClick={() => showPage('seller-register')} 
          className="w-full py-2 bg-primary text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer hover:bg-primary-dark transition"
        >
          🏪 تسجيل كبائع
        </button>
      </div>
    </aside>
  );
}
