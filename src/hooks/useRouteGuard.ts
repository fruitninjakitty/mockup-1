
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { dbRoleToDisplayRole } from '@/utils/roleUtils';

export function useRouteGuard(requiredAuth = true, allowedRoles: string[] = []) {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get all user roles from database safely
  const getUserRoles = async (): Promise<string[]> => {
    if (!user) return [];
    
    try {
      // First try to get roles from the dedicated RPC function
      const { data, error } = await supabase
        .rpc('get_user_roles', { user_id: user.id });
        
      if (data && !error) {
        // Convert to display roles
        return data.map(role => dbRoleToDisplayRole(role));
      }
      
      // Fallback: If RPC fails, check user metadata for a role
      if (user.user_metadata?.role) {
        const metadataRole = dbRoleToDisplayRole(user.user_metadata.role);
        return [metadataRole];
      }
      
      // Ultimate fallback: return Learner role
      return ['Learner'];
    } catch (error) {
      console.error("Error in getUserRoles:", error);
      return ['Learner']; // Default fallback role
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
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
        const userRoles = await getUserRoles();
        const userHasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
        
        if (!userHasRequiredRole) {
          // We don't redirect here - just let the component handle the UI for unauthorized users
          console.log(`User does not have required role(s): ${allowedRoles.join(', ')}`);
        }
      }
    };
    
    checkAuth();
  }, [isAuthenticated, loading, navigate, location, requiredAuth, allowedRoles, user]);

  return { isAuthenticated, loading };
}
