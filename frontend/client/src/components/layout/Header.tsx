import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PRODUCTS } from '../../data/products';

export default function Header() {
  const { showPage, cartCount, wishCount, showToast, setCurrentProduct, setCurrentCat } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [activePage, setActivePage] = useState('home');

  const goTo = (page: any) => { showPage(page); setActivePage(page); };

  const performSearch = () => {
    if (!searchVal.trim()) return;
    setCurrentCat('all');
    showPage('categories');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-900 bg-primary-dark shadow-lg">
      {/* الشريط العلوي */}
      <div className="bg-primary-dark/80 px-6 py-1.5 flex items-center justify-between text-xs text-white/80">
        <div className="flex gap-5 items-center">
          <button onClick={() => goTo('home')} className="text-white/80 hover:text-white transition cursor-pointer">🏠 الرئيسية</button>
          <button onClick={() => goTo('seller-register')} className="text-white/80 hover:text-white transition cursor-pointer">🏪 بيع على ترسترا</button>
          <button onClick={() => showToast('دعم 24/7 متاح قريباً', 'info')} className="text-white/80 hover:text-white transition cursor-pointer">🎧 المساعدة</button>
        </div>
        <div className="flex gap-3 items-center text-xs">
          <span>🛡️ تسوق آمن 100%</span>
          <span>🚚 توصيل سريع</span>
          <span>↩️ إرجاع مجاني</span>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div className="px-6 py-2.5 flex items-center gap-4">
        {/* اللوغو */}
        <button onClick={() => goTo('home')} className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 hover:opacity-90 transition">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl font-black text-primary-dark">T</div>
          <span className="text-2xl font-black text-white tracking-tight">Trustera</span>
        </button>

        {/* شريط البحث */}
        <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden max-w-2xl shadow-sm">
          <select className="px-3 h-11 border-l border-gray-200 bg-gray-50 font-cairo text-sm cursor-pointer font-semibold focus:outline-none">
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
            className="flex-1 h-11 border-0 outline-none px-3.5 font-cairo text-sm"
            placeholder="ابحث عن منتج، بائع، أو تصنيفات..."
          />
          <button onClick={performSearch} className="w-12 h-11 bg-accent border-0 cursor-pointer flex items-center justify-center text-white text-lg hover:bg-orange-600 transition">
            🔍
          </button>
        </div>

        {/* أزرار العمليات */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => goTo('wishlist')} className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 border-0 bg-transparent cursor-pointer text-white/85 rounded-lg relative font-cairo hover:bg-white/10 transition">
            <span className="text-lg">❤️</span>
            <span className="text-xs font-semibold">المفضلة</span>
            {wishCount > 0 && <span className="absolute top-0.5 right-1 bg-accent text-white text-xs font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-primary-dark">{wishCount}</span>}
          </button>
          <button onClick={() => goTo('cart')} className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 border-0 bg-transparent cursor-pointer text-white/85 rounded-lg relative font-cairo hover:bg-white/10 transition">
            <span className="text-lg">🛒</span>
            <span className="text-xs font-semibold">السلة</span>
            {cartCount > 0 && <span className="absolute top-0.5 right-1 bg-accent text-white text-xs font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-primary-dark">{cartCount}</span>}
          </button>
          <button onClick={() => showToast('الإشعارات قريباً', 'info')} className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 border-0 bg-transparent cursor-pointer text-white/85 rounded-lg relative font-cairo hover:bg-white/10 transition">
            <span className="text-lg">🔔</span>
            <span className="text-xs font-semibold">إشعارات</span>
            <span className="absolute top-0.5 right-1 bg-red-600 text-white text-xs font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-primary-dark">3</span>
          </button>
          <button onClick={() => goTo('account')} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer text-white hover:bg-white/20 transition">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">أ</div>
            <div className="text-xs leading-tight">
              <div className="font-bold text-sm">أحمد بن علي</div>
              <div className="text-white/70 text-xs">ahmed@gmail.com</div>
            </div>
          </button>
        </div>
      </div>

      {/* شريط التنقل */}
      <nav className="bg-primary px-6 flex items-center overflow-x-auto">
        {[
          { id: 'home', label: 'الرئيسية', icon: '🏠' },
          { id: 'categories', label: 'الأقسام', icon: '📦' },
          { id: 'account', label: 'طلباتي', icon: '📋' },
          { id: 'wishlist', label: 'المفضلة', icon: '❤️' },
          { id: 'account', label: 'رسائلي', icon: '💬' },
          { id: 'account', label: 'محفظتي', icon: '💰' },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => goTo(item.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold cursor-pointer border-b-3 whitespace-nowrap transition-all ${
              activePage === item.id
                ? 'text-white border-b-white bg-white/10'
                : 'text-white/85 border-b-transparent hover:bg-white/5'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <button
          onClick={() => goTo('seller-register')}
          className="flex items-center gap-1.5 px-3.5 py-2.5 text-accent text-sm font-semibold cursor-pointer border-b-3 border-b-transparent whitespace-nowrap ml-auto hover:bg-orange-500/15 transition"
        >
          🏪 سجّل كبائع
        </button>
      </nav>
    </header>
  );
}
