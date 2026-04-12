import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/products';

export type Page = 'home' | 'categories' | 'product' | 'cart' | 'checkout' | 'order-success' | 'wishlist' | 'account' | 'seller-register' | 'login' | 'seller-dashboard' | 'manager-dashboard';

interface CartItem extends Product { qty: number; }

export interface AuthUser { id: string; name: string; email: string; role: string; }

interface AppState {
  currentPage: Page;
  cart: CartItem[];
  wishlist: Product[];
  currentProduct: Product | null;
  currentCat: string;
  orderNum: string | null;
  searchQuery: string;
  toast: { msg: string; type: string; icon?: string } | null;
  user: AuthUser | null;
  token: string | null;
}

interface AppContextType extends AppState {
  showPage: (page: Page) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string | number) => void;  // ✅ تغيير لـ string | number
  updateQty: (id: string | number, qty: number) => void;  // ✅ تغيير لـ string | number
  clearCart: () => void;
  setCart: (cart: CartItem[]) => void;  // ✅ إضافة جديدة
  toggleWish: (product: Product) => void;
  setCurrentProduct: (p: Product | null) => void;
  setCurrentCat: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  placeOrder: (orderData?: any) => Promise<boolean>;  // ✅ تغيير لـ async
  showToast: (msg: string, type?: string, icon?: string) => void;
  cartCount: number;
  cartTotal: number;
  wishCount: number;
  setUser: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Load persisted auth
const savedUser = (() => { 
  try { 
    return JSON.parse(localStorage.getItem('user') || 'null'); 
  } catch { 
    return null; 
  } 
})();

const savedToken = localStorage.getItem('token');

// ✅ إضافة: تحميل السلة المحفوظة
const loadSavedCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('trustera_cart_v2');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentPage: 'home',
    cart: loadSavedCart(),  // ✅ تحميل السلة المحفوظة
    wishlist: [],
    currentProduct: null,
    currentCat: 'all',
    orderNum: null,
    searchQuery: '',
    toast: null,
    user: savedUser,
    token: savedToken,
  });

  const showPage = (page: Page) => setState(s => ({ ...s, currentPage: page }));

  const setUser = (user: AuthUser, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setState(s => ({ ...s, user, token }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState(s => ({ ...s, user: null, token: null, currentPage: 'home' }));
  };

  // ✅ إضافة: setCart مباشر
  const setCart = (cart: CartItem[]) => {
    setState(s => ({ ...s, cart }));
    localStorage.setItem('trustera_cart_v2', JSON.stringify(cart));
  };

  const addToCart = (product: Product) => {
    // ✅ إضافة: التحقق من وجود SKU
    const productWithSku = {
      ...product,
      sku: product.sku || `TR-${String(product.id).padStart(3, '0')}-${product.category?.substring(0, 3).toUpperCase() || 'GEN'}`,
      isReal: !!product.sku || typeof product.id === 'string'
    };

    setState(s => {
      const exists = s.cart.find(i => i.id === product.id);
      const cart = exists
        ? s.cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...s.cart, { ...productWithSku, qty: 1 }];
      
      // ✅ إضافة: حفظ تلقائي في localStorage
      localStorage.setItem('trustera_cart_v2', JSON.stringify(cart));
      
      return { ...s, cart };
    });
    
    showToast('تمت الإضافة للسلة ✅', 'success');
  };

  const removeFromCart = (id: string | number) =>
    setState(s => {
      const cart = s.cart.filter(i => i.id !== id);
      localStorage.setItem('trustera_cart_v2', JSON.stringify(cart));
      return { ...s, cart };
    });

  const updateQty = (id: string | number, qty: number) =>
    setState(s => {
      const cart = s.cart.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i);
      localStorage.setItem('trustera_cart_v2', JSON.stringify(cart));
      return { ...s, cart };
    });

  const clearCart = () => {
    setState(s => ({ ...s, cart: [] }));
    localStorage.removeItem('trustera_cart_v2');
  };

  const toggleWish = (product: Product) => {
    setState(s => {
      const exists = s.wishlist.some(w => w.id === product.id);
      const wishlist = exists ? s.wishlist.filter(w => w.id !== product.id) : [...s.wishlist, product];
      return { ...s, wishlist };
    });
  };

  const setCurrentProduct = (p: Product | null) => setState(s => ({ ...s, currentProduct: p }));
  const setCurrentCat = (cat: string) => setState(s => ({ ...s, currentCat: cat }));
  const setSearchQuery = (q: string) => setState(s => ({ ...s, searchQuery: q }));

  // ✅ تغيير: placeOrder كاملة ومتقدمة
  const placeOrder = async (orderData?: any): Promise<boolean> => {
    try {
      const num = 'TRS-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      
      const finalOrder = {
        id: num,
        date: new Date().toISOString(),
        status: 'pending',
        items: state.cart.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          qty: item.qty,
          seller: item.seller
        })),
        total: state.cart.reduce((a, i) => a + i.price * i.qty, 0) + 400,
        shipping: 400,
        ...orderData
      };

      // ✅ حفظ في localStorage
      const existingOrders = JSON.parse(localStorage.getItem('trustera_orders') || '[]');
      existingOrders.push(finalOrder);
      localStorage.setItem('trustera_orders', JSON.stringify(existingOrders));

      // ✅ مسح السلة
      setState(s => ({ ...s, orderNum: num, cart: [], currentPage: 'order-success' }));
      localStorage.removeItem('trustera_cart_v2');
      
      return true;
    } catch (error) {
      showToast('حدث خطأ في إتمام الطلب', 'error');
      return false;
    }
  };

  const showToast = (msg: string, type = 'success', icon?: string) => {
    setState(s => ({ ...s, toast: { msg, type, icon } }));
    setTimeout(() => setState(s => ({ ...s, toast: null })), 3200);
  };

  const cartCount = state.cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = state.cart.reduce((a, i) => a + i.price * i.qty, 0);
  const wishCount = state.wishlist.length;

  return (
    <AppContext.Provider value={{
      ...state, 
      showPage, 
      addToCart, 
      removeFromCart, 
      updateQty, 
      clearCart,
      setCart,  // ✅ إضافة جديدة
      toggleWish, 
      setCurrentProduct, 
      setCurrentCat, 
      setSearchQuery,
      placeOrder,  // ✅ تغيير
      showToast, 
      cartCount, 
      cartTotal, 
      wishCount,
      setUser, 
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
