
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Protected route session check:', session ? 'Session exists' : 'No session');
        setHasValidSession(!!session);
        setSessionChecked(true);
        
        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth event in protected route:', event);
          if (event === 'SIGNED_OUT') {
            navigate('/admin/login', { replace: true });
          } else if (event === 'SIGNED_IN' && session) {
            setHasValidSession(true);
          }
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error checking session in protected route:', error);
        setSessionChecked(true);
        setHasValidSession(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  // Show loading indicator while checking authentication
  if (loading || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated && !hasValidSession) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  console.log('Authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
