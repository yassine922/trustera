import { Route, Switch } from 'wouter';
import Header from './components/layout/Header';
import Toast from './components/shared/Toast';
import ProtectedRoute from './components/shared/ProtectedRoute';

// استيراد الصفحات
import Home from './pages/Home';
import ProductPage from './pages/Product';
import ManagerDashboard from './pages/ManagerDashboard';
import Login from './pages/Login'; // تأكد من وجود هذا الملف

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* الرأس ثابت في كل الصفحات */}
      <Header />
      
      <main className="flex-1 pt-[70px] pb-20 md:pb-0">
        <Switch>
          {/* المسارات العامة */}
          <Route path="/" component={Home} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/login" component={Login} />
          
          {/* المسارات المحمية - نقطة الأمان (Point 22) */}
          <Route path="/manager-dashboard">
            <ProtectedRoute 
              component={ManagerDashboard} 
              allowedRoles={['admin']} 
            />
          </Route>

          <Route path="/seller-dashboard">
            <ProtectedRoute 
              component={() => <div>لوحة البائع قيد التطوير</div>} 
              allowedRoles={['seller', 'admin']} 
            />
          </Route>

          {/* صفحة 404 */}
          <Route>
            <div className="p-20 text-center font-bold">404 - الصفحة غير موجودة</div>
          </Route>
        </Switch>
      </main>

      <Toast />
    </div>
  );
}