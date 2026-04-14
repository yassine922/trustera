import { useState, useEffect } from 'react';
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

// تعريف نوع لجميع معرفات الصفحات المحتملة
type NavItemIds = (typeof NAV_ITEMS)[number]['id'];
type DynamicPageIds = 'login' | 'manager-dashboard' | 'seller-dashboard' | 'account' | 'seller-register' | 'categories' | 'cart'; 
type PageId = NavItemIds | DynamicPageIds;

export default function Header() {
  const { showPage, cartCount, wishCount, showToast, setCurrentCat, user, logout } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    } else {
      showToast('تطبيق ترسترا متاح للتثبيت مباشرة من المتصفح', 'info');
    }
  };

  const goTo = (page: PageId) => {
    showPage(page as any);
    setActivePage(page);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);

    // التمرير السلس إلى أعلى الصفحة عند الانتقال
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // إغلاق قائمة الموبايل عند تكبير الشاشة لسطح المكتب
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const performSearch = () => {
    if (!searchVal.trim()) return;
    setCurrentCat('all');
    goTo('categories');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') performSearch();
  };

  const handleUserClick = () => {
    if (!user) {
      goTo('login');
      return;
    }
    const pages: Record<string, PageId> = {
      admin: 'manager-dashboard',
      seller: 'seller-dashboard',
    };
    goTo(pages[user.role] || 'account');
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
    <header className="fixed top-0 right-0 left-0 z-50 bg-primary-dark/90 backdrop-blur-lg border-b border-white/5 shadow-2xl transition-all duration-300">
      {/* === الشريط الرئيسي === */}
      <div className="relative px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between min-h-[70px]">
        {isMobileSearchOpen ? (
          /* وضع البحث النشط في الموبايل */
          <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <span className="text-amber-400">🔍</span>
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none px-3 text-sm text-white placeholder-white/60 w-full"
                placeholder="ما الذي تبحث عنه؟"
              />
            </div>
            <button onClick={() => setIsMobileSearchOpen(false)} className="text-white text-[10px] font-bold uppercase tracking-widest px-1">إلغاء</button>
          </div>
        ) : (
          <>
            {/* القسم الأيسر: القائمة والبحث (Desktop) */}
            <div className="flex items-center gap-2 md:gap-6 flex-1">
              <button 
                onClick={handleInstallApp}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all group"
                title="تحميل التطبيق"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">📱</span>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter hidden xl:block">App</span>
              </button>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>

              {/* شريط بحث هادئ (Desktop) */}
              <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:w-80 focus-within:bg-white/10 transition-all group">
                <span className="text-white/40 group-focus-within:text-amber-400 transition-colors font-bold">🔍</span>
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none px-3 text-xs text-white placeholder-white/30 flex-1"
                  placeholder="بحث عن منتجات..."
                />
              </div>
              
              {/* أيقونة البحث للموبايل */}
              <button onClick={() => setIsMobileSearchOpen(true)} className="lg:hidden p-2 text-white/80">
                🔍
              </button>
            </div>

            {/* اللوغو المركزي */}
            <button 
              onClick={() => goTo('home')} 
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 group"
            >
              <span className="text-xl md:text-3xl font-light text-white tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all group-hover:text-amber-400">
                Trustera
              </span>
              <span className="w-6 h-[1px] bg-amber-500/50 group-hover:w-12 transition-all duration-700"></span>
            </button>

            {/* القسم الأيمن: أيقونات العمليات */}
            <div className="flex items-center gap-1 md:gap-5 flex-1 justify-end">
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
              
              {user ? (
                <button onClick={handleUserClick} className="p-1">
                  <div className="w-8 h-8 rounded-full border border-accent/30 p-0.5 group-hover:border-accent transition-colors">
                    <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                </button>
              ) : (
                <button 
                  onClick={() => goTo('login')} 
                  className="ml-2 md:px-5 py-2 bg-amber-500 text-white rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase hover:bg-white hover:text-primary-dark transition-all shadow-lg shadow-amber-500/20"
                >
                  Login
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* === شريط التنقل - سطح المكتب === */}
      <nav className="hidden md:flex bg-green-800 px-4 lg:px-6 items-center overflow-x-auto shadow-inner">
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
        <div className="md:hidden bg-primary-dark border-t border-white/10 animate-in slide-in-from-right duration-300 max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-2">
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
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-amber-400 hover:bg-white/10 transition border border-amber-400/20"
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

      {/* === شريط التنقل السفلي (للموبايل فقط) === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-green-900/95 backdrop-blur-lg border-t border-white/10 flex justify-around items-center py-2 pb-safe z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        <BottomNavItem icon="🏠" label="الرئيسية" isActive={activePage === 'home'} onClick={() => goTo('home')} />
        <BottomNavItem icon="📦" label="الأقسام" isActive={activePage === 'categories'} onClick={() => goTo('categories')} />
        <BottomNavItem icon="🛒" label="السلة" isActive={activePage === 'cart'} onClick={() => goTo('cart')} count={cartCount} />
        <BottomNavItem icon="❤️" label="المفضلة" isActive={activePage === 'wishlist'} onClick={() => goTo('wishlist')} count={wishCount} />
        <BottomNavItem 
          icon={user ? (user.role === 'admin' ? '👑' : user.role === 'seller' ? '🏪' : '👤') : '👤'} 
          label={user ? 'حسابي' : 'دخول'} 
          isActive={['account', 'manager-dashboard', 'seller-dashboard', 'login'].includes(activePage)} 
          onClick={handleUserClick} 
        />
      </nav>
    </header>
  );
}

// === مكونات مساعدة ===

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
      className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-white/85 rounded-lg relative hover:bg-white/10 transition min-w-[40px] touch-manipulation active:scale-95"
      aria-label={label}
    >
      <span className="text-base md:text-lg">{icon}</span>
      {showLabel && <span className="text-[10px] md:text-xs font-semibold hidden sm:block">{label}</span>}
      {count && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 md:top-0.5 md:right-1 bg-amber-500 text-white text-[10px] md:text-xs font-bold w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center border-2 border-primary-dark shadow-sm">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function BottomNavItem({ 
  icon, 
  label, 
  isActive, 
  onClick, 
  count 
}: { 
  icon: string; 
  label: string; 
  isActive: boolean; 
  onClick: () => void; 
  count?: number;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-all active:scale-90 relative ${
        isActive ? 'text-amber-400' : 'text-white/60'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-bold tracking-tight">{label}</span>
      {count && count > 0 && (
        <span className="absolute top-0 right-1 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-green-900 shadow-sm">
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
      className="flex items-center gap-1.5 px-2.5 lg:px-3.5 py-2.5 text-amber-400 text-sm font-semibold whitespace-nowrap ml-auto hover:bg-amber-500/10 transition border-b-2 border-transparent"
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}
