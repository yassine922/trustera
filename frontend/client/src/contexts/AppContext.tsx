import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

interface AppContextType {
  user: any;
  token: string | null;
  cart: any[];
  wishlist: any[];
  cartCount: number;
  wishCount: number;
  cartTotal: number;
  toast: { msg: string; type: string; icon?: string } | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info', icon?: string) => void;
  login: (userData: any, token: string) => void;
  logout: () => void;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  toggleWish: (product: any) => void;
  setCurrentCat: (cat: string) => void;
  currentCat: string;
  currentProduct: any | null;
  setCurrentProduct: (product: any) => void;
  currentPage: string;
  showPage: (page: string) => void;
  placeOrder: (orderData: any) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [cart, setCart] = useState<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  const [wishlist, setWishlist] = useState<any[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [toast, setToast] = useState<any>(null);
  const [currentCat, setCurrentCat] = useState('all');
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string, type: any = 'success', icon?: string) => {
    setToast({ msg, type, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const showPage = (page: string) => {
    setCurrentPage(page);
  };

  const login = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === (product._id || product.id));
      if (exists) {
        return prev.map(item => item._id === (product._id || product.id) ? { ...item, qty: item.qty + (product.qty || 1) } : item);
      }
      return [...prev, { ...product, _id: product._id || product.id, qty: product.qty || 1 }];
    });
    showToast('تمت الإضافة للسلة');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item._id !== productId && item.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        (item._id === productId || item.id === productId) ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWish = (product: any) => {
    setWishlist(prev => {
      const id = product._id || product.id;
      const exists = prev.find(item => (item._id || item.id) === id);
      if (exists) {
        showToast('تمت الإزالة من المفضلة', 'info');
        return prev.filter(item => (item._id || item.id) !== id);
      }
      showToast('تمت الإضافة للمفضلة');
      return [...prev, product];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) * (item.qty || 1)), 0);

  const placeOrder = async (orderData: any): Promise<boolean> => {
    if (!token) {
      showToast('يرجى تسجيل الدخول أولاً', 'error');
      return false;
    }
    try {
      const response = await axios.post(`${API_URL}/api/orders`, {
        items: cart.map(item => ({
          productId: item._id,
          qty: item.qty,
          price: Number(item.price),
          sellerId: item.sellerId
        })),
        totalAmount: cartTotal + 400,
        shippingAddress: orderData.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
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
      cartCount: cart.length,
      wishCount: wishlist.length,
      cartTotal,
      toast, showToast, login, logout,
      addToCart, removeFromCart, updateQty, clearCart, setCart,
      toggleWish,
      setCurrentCat, currentCat,
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