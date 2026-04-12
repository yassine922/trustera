import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

// بيانات ثابتة - لا تحتاج AI
const NAV_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: '🏠' },
  { id: 'categories', label: 'الأقسام', icon: '📦' },
  { id: 'orders', label: 'طلباتي', icon: '📋' },
  { id: 'wishlist', label: 'المفضلة', icon: '❤️' },
  { id: 'wallet', label: 'محفظتي', icon: '💰' },
] as const;

const CATEGORIES = [
  'كل الأقسام',
  'إلكترونيات',
  'أزياء',
  'منزل',
  'جمال',
  'رياضة',
] as const;

export default function Header() {
  const { showPage, cartCount, wishCount, showToast, setCurrentCat, user, logout } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const goTo = (page: string) => {
    showPage(page);
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const performSearch = () => {
    if (!searchVal.trim()) return;
    setCurrentCat('all');
    showPage('categories');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') performSearch();
  };

  const handleUserClick = () => {
    if (!user) {
      showPage('login');
      return;
    }
    const pages: Record<string, string> = {
      admin: 'manager-dashboard',
      seller: 'seller-dashboard',
    };
    showPage(pages[user.role] || 'account');
  };

  const handleLogout = () => {
    logout();
    showToast('تم تسجيل الخروج', 'info');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: '👑 مدير',
      seller: '🏪 بائع',
    };
    return labels[role] || '🛍️ زبون';
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-primary-dark shadow-lg">
      {/* === الشريط العلوي - مخفي في الموبايل === */}
      <div className="hidden md:flex bg-primary-dark/80 px-4 lg:px-6 py-1.5 items-center justify-between text-xs text-white/80">
        <div className="flex gap-3 lg:gap-5 items-center">
          <TopBarButton onClick={() => goTo('home')}>🏠 الرئيسية</TopBarButton>
          <TopBarButton onClick={() => user?.role === 'seller' ? goTo('seller-dashboard') : goTo('seller-register')}>
            🏪 بيع على ترسترا
          </TopBarButton>
          <TopBarButton onClick={() => showToast('دعم 24/7 متاح', 'info')}>
            🎧 المساعدة
          </TopBarButton>
        </div>
        <div className="hidden lg:flex gap-3 items-center">
          <span>🛡️ تسوق آمن</span>
          <span>🚚 توصيل سريع</span>
          <span>↩️ إرجاع مجاني</span>
        </div>
      </div>

      {/* === الشريط الرئيسي === */}
      <div className="px-3 md:px-4 lg:px-6 py-2 flex items-center gap-2 md:gap-4">
        {/* زر الموبايل */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white text-xl"
          aria-label="القائمة"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* اللوغو */}
        <button 
          onClick={() => goTo('home')} 
          className="flex items-center gap-1.5 md:gap-2.5 flex-shrink-0 hover:opacity-90 transition"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center text-lg md:text-xl font-black text-primary-dark">
            T
          </div>
          <span className="text-lg md:text-2xl font-black text-white tracking-tight hidden sm:block">
            Trustera
          </span>
        </button>

        {/* شريط البحث - متجاوب */}
        <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden max-w-2xl shadow-sm mx-1 md:mx-0">
          <select className="hidden sm:block px-2 md:px-3 h-9 md:h-11 border-l border-gray-200 bg-gray-50 text-xs md:text-sm font-semibold focus:outline-none cursor-pointer">
            {CATEGORIES.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-9 md:h-11 border-0 outline-none px-2 md:px-3.5 text-xs md:text-sm min-w-0"
            placeholder="ابحث عن منتج..."
          />
          <button 
            onClick={performSearch} 
            className="w-9 md:w-12 h-9 md:h-11 bg-accent flex items-center justify-center text-white hover:bg-orange-600 transition flex-shrink-0"
          >
            <span className="text-sm md:text-lg">🔍</span>
          </button>
        </div>

        {/* أزرار العمليات - مُبسّطة للموبايل */}
        <div className="flex items-center gap-0.5 md:gap-1.5 flex-shrink-0">
          <IconButton 
            onClick={() => goTo('wishlist')} 
            count={wishCount}
            icon="❤️"
            label="المفضلة"
            showLabel={false}
          />
          <IconButton 
            onClick={() => goTo('cart')} 
            count={cartCount}
            icon="🛒"
            label="السلة"
            showLabel={false}
          />
          
          {/* زر المستخدم - نسخة مُختصرة للموبايل */}
          {user ? (
            <div className="flex items-center gap-1 md:gap-1.5">
              <button 
                onClick={handleUserClick} 
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center text-xs md:text-sm font-bold">
                  {user.name?.charAt(0) || 'م'}
                </div>
                <div className="hidden md:block text-xs leading-tight text-left">
                  <div className="font-bold text-sm truncate max-w-[80px]">{user.name}</div>
                  <div className="text-white/70 text-xs">{getRoleLabel(user.role)}</div>
                </div>
              </button>
              <button 
                onClick={handleLogout} 
                className="hidden sm:block px-2 py-1.5 bg-red-500/20 text-white rounded-lg text-xs font-bold hover:bg-red-500/40 transition"
              >
                خروج
              </button>
            </div>
          ) : (
            <button 
              onClick={() => showPage('login')} 
              className="px-2 md:px-4 py-1.5 md:py-2 bg-white text-primary-dark rounded-lg text-xs md:text-sm font-bold hover:bg-gray-100 transition whitespace-nowrap"
            >
              <span className="sm:hidden">🔑</span>
              <span className="hidden sm:inline">دخول / تسجيل</span>
            </button>
          )}
        </div>
      </div>

      {/* === شريط التنقل - سطح المكتب === */}
      <nav className="hidden md:flex bg-primary px-4 lg:px-6 items-center overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activePage === item.id}
            onClick={() => goTo(item.id)}
          />
        ))}
        
        {/* زر البائع/المدير */}
        {user?.role === 'seller' && (
          <ActionButton onClick={() => goTo('seller-dashboard')} icon="🏪">
            لوحة البائع
          </ActionButton>
        )}
        {user?.role === 'admin' && (
          <ActionButton onClick={() => goTo('manager-dashboard')} icon="👑">
            لوحة المدير
          </ActionButton>
        )}
        {!user && (
          <ActionButton onClick={() => goTo('seller-register')} icon="🏪">
            سجّل كبائع
          </ActionButton>
        )}
      </nav>

      {/* === قائمة الموبايل === */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10">
          <div className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activePage === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            {user?.role === 'seller' && (
              <button
                onClick={() => goTo('seller-dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-accent hover:bg-orange-500/15 transition"
              >
                <span>🏪</span> لوحة البائع
              </button>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-300 hover:bg-red-500/20 transition mt-2 border-t border-white/10 pt-3"
              >
                <span>🚪</span> تسجيل الخروج
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// === مكونات مساعدة ===

function TopBarButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="text-white/80 hover:text-white transition text-xs"
    >
      {children}
    </button>
  );
}

function IconButton({ 
  onClick, 
  icon, 
  label, 
  count, 
  showLabel = true 
}: { 
  onClick: () => void; 
  icon: string; 
  label: string; 
  count?: number;
  showLabel?: boolean;
}) {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center gap-0.5 px-1.5 md:px-2.5 py-1 md:py-1.5 text-white/85 rounded-lg relative hover:bg-white/10 transition min-w-[44px] touch-manipulation"
      aria-label={label}
    >
      <span className="text-base md:text-lg">{icon}</span>
      {showLabel && <span className="text-[10px] md:text-xs font-semibold hidden sm:block">{label}</span>}
      {count && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 md:top-0.5 md:right-1 bg-accent text-white text-[10px] md:text-xs font-bold w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center border-2 border-primary-dark">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function NavButton({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: typeof NAV_ITEMS[number]; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
        isActive
          ? 'text-white border-white bg-white/10'
          : 'text-white/85 border-transparent hover:bg-white/5'
      }`}
    >
      <span>{item.icon}</span>
      {item.label}
    </button>
  );
}

function ActionButton({ 
  children, 
  onClick, 
  icon 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  icon: string;
}) {
  return (
    <button 
      onClick={onClick} 
      className="flex items-center gap-1.5 px-2.5 lg:px-3.5 py-2.5 text-accent text-sm font-semibold whitespace-nowrap ml-auto hover:bg-orange-500/15 transition border-b-2 border-transparent"
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}
