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
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWish: (product: Product) => void;
  setCurrentProduct: (p: Product | null) => void;
  setCurrentCat: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  placeOrder: () => void;
  showToast: (msg: string, type?: string, icon?: string) => void;
  cartCount: number;
  cartTotal: number;
  wishCount: number;
  setUser: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Load persisted auth
const savedUser = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
const savedToken = localStorage.getItem('token');

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentPage: 'home',
    cart: [],
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
    setState(s => ({ ...s, user, token }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState(s => ({ ...s, user: null, token: null, currentPage: 'home' }));
  };

  const addToCart = (product: Product) => {
    setState(s => {
      const exists = s.cart.find(i => i.id === product.id);
      const cart = exists
        ? s.cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...s.cart, { ...product, qty: 1 }];
      return { ...s, cart };
    });
    showToast('تمت الإضافة للسلة ✅', 'success');
  };

  const removeFromCart = (id: number) =>
    setState(s => ({ ...s, cart: s.cart.filter(i => i.id !== id) }));

  const updateQty = (id: number, qty: number) =>
    setState(s => ({ ...s, cart: s.cart.map(i => i.id === id ? { ...i, qty } : i) }));

  const clearCart = () => setState(s => ({ ...s, cart: [] }));

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

  const placeOrder = () => {
    const num = 'TRS-2025-' + Math.floor(Math.random() * 9000 + 1000);
    setState(s => ({ ...s, orderNum: num, cart: [], currentPage: 'order-success' }));
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
      ...state, showPage, addToCart, removeFromCart, updateQty, clearCart,
      toggleWish, setCurrentProduct, setCurrentCat, setSearchQuery,
      placeOrder, showToast, cartCount, cartTotal, wishCount,
      setUser, logout,
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
