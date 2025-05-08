
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function useRouteGuard(requiredAuth = true) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // If authentication is required but user is not authenticated
    if (requiredAuth && !isAuthenticated) {
      navigate('/', { state: { from: location.pathname } });
    }
    
    // If user is authenticated but tries to access login page
    if (!requiredAuth && isAuthenticated) {
      navigate('/courses');
    }
  }, [isAuthenticated, loading, navigate, location, requiredAuth]);

  return { isAuthenticated, loading };
}
