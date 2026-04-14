import { Route, Switch } from "wouter";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ProductPage from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import { OrderSuccess, Wishlist, Account, SellerRegister, NotFound } from "./pages/OtherPages";
import { AppProvider } from "./contexts/AppContext";

function App() {
  return (
    <AppProvider>
      <Layout>
        <Switch>
          {/* المسارات العامة */}
          <Route path="/" component={Home} />
          <Route path="/categories" component={Categories} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/cart" component={Cart} />
          <Route path="/login" component={Login} />
          <Route path="/seller-register" component={SellerRegister} />
          
          {/* مسارات الحساب والطلبات */}
          <Route path="/checkout" component={Checkout} />
          <Route path="/order-success" component={OrderSuccess} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/account" component={Account} />

          {/* لوحات التحكم (محمية برمجياً داخل المكونات) */}
          <Route path="/seller-dashboard" component={SellerDashboard} />
          <Route path="/manager-dashboard" component={ManagerDashboard} />

          {/* صفحة 404 */}
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </AppProvider>
  );
}

export default App;