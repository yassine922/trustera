import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import Toast from './components/shared/Toast';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductPage from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { OrderSuccess, Wishlist, Account, SellerRegister, NotFound } from './pages/OtherPages';
import './index.css';

function AppContent() {
  const { currentPage } = useApp();
  const pages: Record<string, React.ReactNode> = {
    'home': <Home />,
    'categories': <Categories />,
    'product': <ProductPage />,
    'cart': <Cart />,
    'checkout': <Checkout />,
    'order-success': <OrderSuccess />,
    'wishlist': <Wishlist />,
    'account': <Account />,
    'seller-register': <SellerRegister />,
  };
  return (
    <div>
      <Header />
      <div id="app">
        <div className="layout">
          <Sidebar />
          <main id="main">{pages[currentPage] || <NotFound />}</main>
          <RightPanel />
        </div>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
