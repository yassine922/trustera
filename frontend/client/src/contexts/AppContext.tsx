import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from './Product';
import { normalizeProduct, getProductId } from './normalizeProduct';

const API_URL = import.meta.env.VITE_API_URL || '';

interface AppContextType {
  user: any;
  token: string | null;
  cart: Product[];
  wishlist: Product[];
  cartCount: number;
  wishCount: number;
  cartTotal: number;
  orderNum: string | null;
  toast: { msg: string; type: string; icon?: string } | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info', icon?: string) => void;
  login: (userData: any, token: string) => void;
  logout: () => void;
  setUser: (userData: any, token: string) => void;
  addToCart: (product: Product | any) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  toggleWish: (product: Product | any) => void;
  setCurrentCat: (cat: string) => void;
  currentCat: string;
  currentProduct: Product | null;
  setCurrentProduct: (product: Product | null) => void;
  currentPage: string;
  showPage: (page: string) => void;
  placeOrder: (orderData: any) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [cart, setCart] = useState<Product[]>(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [wishlist, setWishlist] = useState<Product[]>(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [toast, setToast] = useState<AppContextType['toast']>(null);
  const [currentCat, setCurrentCat] = useState('all');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [orderNum, setOrderNum] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast: AppContextType['showToast'] = (msg, type = 'success', icon) => {
    setToast({ msg, type, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const showPage = (page: string) => setCurrentPage(page);

  const login = (userData: any, userToken: string) => {
    setUserState(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const setUser = (userData: any, userToken: string) => login(userData, userToken);

  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addToCart = (product: any) => {
    const p = normalizeProduct(product);
    setCart(prev => {
      const exists = prev.find(item => getProductId(item) === getProductId(p));
      if (exists) {
        return prev.map(item =>
          getProductId(item) === getProductId(p)
            ? { ...item, qty: (item.qty || 0) + (p.qty || 1) }
            : item
        );
      }
      return [...prev, p];
    });
    showToast('تمت الإضافة للسلة');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => getProductId(item) !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev =>
      prev.map(item =>
        getProductId(item) === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWish = (product: any) => {
    const p = normalizeProduct(product);
    setWishlist(prev => {
      const id = getProductId(p);
      const exists = prev.find(item => getProductId(item) === id);
      if (exists) {
        showToast('تمت الإزالة من المفضلة', 'info');
        return prev.filter(item => getProductId(item) !== id);
      }
      showToast('تمت الإضافة للمفضلة');
      return [...prev, p];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);

  const placeOrder = async (orderData: any): Promise<boolean> => {
    if (!token) { showToast('يرجى تسجيل الدخول أولاً', 'error'); return false; }
    try {
      const response = await axios.post(`${API_URL}/api/orders`, {
        items: cart.map(item => ({ productId: getProductId(item), qty: item.qty, price: item.price, sellerId: item.sellerId })),
        totalAmount: cartTotal + 400,
        shippingAddress: orderData.address
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setOrderNum(response.data.orderNum || `#TR-${Math.floor(Math.random() * 9000) + 1000}`);
        setCart([]);
        showToast('تم إرسال الطلب بنجاح! 🎉');
        return true;
      }
      return false;
    } catch (error: any) {
      showToast(error.response?.data?.message || 'حدث خطأ في إتمام الطلب', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user, token, cart, wishlist,
      cartCount: cart.length, wishCount: wishlist.length,
      cartTotal, orderNum,
      toast, showToast,
      login, logout, setUser,
      addToCart, removeFromCart, updateQty, clearCart, setCart,
      toggleWish, setCurrentCat, currentCat,
      currentProduct, setCurrentProduct,
      currentPage, showPage,
      placeOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
