
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { dbRoleToDisplayRole } from "@/utils/roleUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const ProtectedRoute = ({ 
  children, 
  roles = [] 
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isCheckingRoles, setIsCheckingRoles] = useState(false);
  
  // Get all user roles from the database
  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) return;
      
      setIsCheckingRoles(true);
      try {
        // First try RPC function
        try {
          const { data, error } = await supabase
            .rpc('get_user_roles', { user_id: user.id });
            
          if (data && data.length > 0 && !error) {
            // Convert to display roles
            const displayRoles = data.map(role => dbRoleToDisplayRole(role));
            setUserRoles(displayRoles);
            setIsCheckingRoles(false);
            return;
          }
        } catch (rpcError) {
          console.error("Error in RPC call:", rpcError);
        }
        
        // Then try metadata
        if (user.user_metadata?.role) {
          setUserRoles([dbRoleToDisplayRole(user.user_metadata.role)]);
          setIsCheckingRoles(false);
          return;
        }
        
        // Fallback
        setUserRoles(['Learner']);
      } catch (error) {
        console.error("Error in fetchUserRoles:", error);
        setUserRoles(['Learner']);
      } finally {
        setIsCheckingRoles(false);
      }
    };
    
    if (user) {
      fetchUserRoles();
    } else {
      setUserRoles([]);
    }
  }, [user]);

  if (loading || isCheckingRoles) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If roles are specified and user doesn't have any of the required roles
  if (roles.length > 0 && !userRoles.some(role => roles.includes(role))) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="p-4 bg-amber-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Access Restricted</h2>
          <p className="text-muted-foreground mt-2">
            You don't have the required permissions to access this page. This area requires 
            {roles.length === 1 ? ` ${roles[0]} ` : ` one of these roles: ${roles.join(', ')} `}
            privileges.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
