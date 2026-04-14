import { useApp } from '../../contexts/AppContext';
import { Redirect } from 'wouter';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  component: Component, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, token } = useApp();

  if (!token) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Redirect to="/" />;
  }

  return <Component />;
}