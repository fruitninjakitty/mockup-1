
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function useRouteGuard(requiredAuth = true, allowedRoles: string[] = []) {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = user?.user_metadata?.role || '';

  useEffect(() => {
    if (loading) return;

    // If authentication is required but user is not authenticated
    if (requiredAuth && !isAuthenticated) {
      navigate('/', { state: { from: location.pathname } });
      return;
    }
    
    // If user is authenticated but tries to access login page
    if (!requiredAuth && isAuthenticated) {
      navigate('/courses');
      return;
    }

    // If specific roles are required, check if the user has the right role
    if (requiredAuth && isAuthenticated && allowedRoles.length > 0) {
      const userHasRequiredRole = allowedRoles.includes(userRole);
      
      if (!userHasRequiredRole) {
        // We don't redirect here - just let the component handle the UI for unauthorized users
        console.log(`User does not have required role(s): ${allowedRoles.join(', ')}`);
      }
    }
  }, [isAuthenticated, loading, navigate, location, requiredAuth, allowedRoles, userRole]);

  return { isAuthenticated, loading, userRole };
}
