import { useApp } from '../../contexts/AppContext';
import { useLocation } from 'wouter';

export default function Sidebar() {
  const { wishCount, user } = useApp();
  const [, setLocation] = useLocation();

  const buyerItems = [
    { icon: '🏠', label: 'الرئيسية', page: 'home', badge: null },
    { icon: '📦', label: 'الأقسام', page: 'categories', badge: null },
    { icon: '📋', label: 'طلباتي', page: 'account', badge: null },
    { icon: '❤️', label: 'المفضلة', page: 'wishlist', badge: wishCount > 0 ? String(wishCount) : null },
    { icon: '💰', label: 'محفظتي', page: 'account', badge: null },
    { icon: '⚙️', label: 'الإعدادات', page: 'account', badge: null },
  ];

  const sellerItems = [
    { icon: '📊', label: 'نظرة عامة', page: 'seller-dashboard', badge: null },
    { icon: '📦', label: 'منتجاتي', page: 'seller-dashboard', badge: null },
    { icon: '🛒', label: 'الطلبات', page: 'seller-dashboard', badge: null },
    { icon: '🏠', label: 'المتجر', page: 'home', badge: null },
  ];

  const adminItems = [
    { icon: '📊', label: 'الإحصائيات', page: 'manager-dashboard', badge: null },
    { icon: '🛒', label: 'الطلبات', page: 'manager-dashboard', badge: null },
    { icon: '📦', label: 'المنتجات', page: 'manager-dashboard', badge: null },
    { icon: '👥', label: 'المستخدمون', page: 'manager-dashboard', badge: null },
  ];

  const items = user?.role === 'admin' ? adminItems : user?.role === 'seller' ? sellerItems : buyerItems;

  return (
    <aside className="w-52 flex-shrink-0 bg-white border-l border-gray-100 pt-4 sticky top-28 h-[calc(100vh-112px)] overflow-y-auto">

      {/* زر الإجراء الرئيسي */}
      {user?.role === 'seller' ? (
        <button
          onClick={() => setLocation('/seller-dashboard')}
          className="w-11/12 mx-auto mb-2.5 py-2 bg-primary text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-primary-dark transition"
        >
          🏪 لوحة البائع
        </button>
      ) : user?.role === 'admin' ? (
        <button
          onClick={() => setLocation('/manager-dashboard')}
          className="w-11/12 mx-auto mb-2.5 py-2 bg-primary text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-primary-dark transition"
        >
          👑 لوحة المدير
        </button>
      ) : (
        <button
          onClick={() => setLocation(user ? '/seller-register' : '/login')}
          className="w-11/12 mx-auto mb-2.5 py-2 bg-primary text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-primary-dark transition"
        >
          ➕ إضافة منتج
        </button>
      )}

      {/* قائمة التنقل */}
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => setLocation(item.page === 'home' ? '/' : '/' + item.page)}
          className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-gray-700 text-sm font-semibold border-r-3 border-r-transparent transition-all hover:bg-primary-bg hover:text-primary hover:border-r-primary"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </div>
          {item.badge && (
            <span className="text-xs font-black px-1.5 py-0.5 rounded-full bg-primary-bg text-primary">
              {item.badge}
            </span>
          )}
        </div>
      ))}

      <div className="h-px bg-gray-100 my-2 mx-4" />

      {/* بطاقة البائع - للزبائن غير المسجلين أو المسجلين كزبون */}
      {(!user || user.role === 'buyer') && (
        <div className="mx-3 mt-3 p-3.5 bg-primary-bg rounded-lg border border-green-200">
          <div className="text-xs font-bold mb-1.5">هل أنت بائع؟</div>
          <p className="text-xs text-gray-700 leading-relaxed mb-2.5">ابدأ البيع الآن ووصل لآلاف الزبائن</p>
          <button
            onClick={() => setLocation(user ? '/seller-register' : '/login')}
            className="w-full py-2 bg-primary text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer hover:bg-primary-dark transition"
          >
            🏪 تسجيل كبائع
          </button>
        </div>
      )}

      {/* بطاقة تسجيل الدخول - للزوار */}
      {!user && (
        <div className="mx-3 mt-3 p-3.5 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-bold mb-1.5 text-blue-800">👋 مرحباً بك</div>
          <p className="text-xs text-blue-700 leading-relaxed mb-2.5">سجّل دخولك للوصول لجميع المميزات</p>
          <button
            onClick={() => setLocation('/login')}
            className="w-full py-2 bg-blue-600 text-white border-0 rounded-lg font-cairo text-sm font-bold cursor-pointer hover:bg-blue-700 transition"
          >
            🔑 تسجيل الدخول
          </button>
        </div>
      )}
    </aside>
  );
}
