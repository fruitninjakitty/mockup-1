
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function useRouteGuard(requiredAuth = true, allowedRoles: string[] = []) {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get all user roles from user metadata
  const getUserRoles = (): string[] => {
    if (!user) return [];
    
    // First try to get roles from user_metadata (for newer implementations)
    const userRoles = user.user_metadata?.roles;
    if (userRoles && Array.isArray(userRoles) && userRoles.length > 0) {
      return userRoles;
    }
    
    // Fallback to single role from user_metadata or app_metadata
    const singleRole = user.user_metadata?.role || user.app_metadata?.role;
    return singleRole ? [singleRole] : [];
  };

  const userRoles = getUserRoles();

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

    // If specific roles are required, check if the user has at least one of the required roles
    if (requiredAuth && isAuthenticated && allowedRoles.length > 0) {
      const userHasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
      
      if (!userHasRequiredRole) {
        // We don't redirect here - just let the component handle the UI for unauthorized users
        console.log(`User does not have required role(s): ${allowedRoles.join(', ')}`);
      }
    }
  }, [isAuthenticated, loading, navigate, location, requiredAuth, allowedRoles, userRoles]);

  return { isAuthenticated, loading, userRoles };
}
