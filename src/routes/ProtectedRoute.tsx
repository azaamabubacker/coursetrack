import { useAuth } from '../store/auth';
import { Navigate, useLocation } from 'react-router';
import { toast } from 'sonner';
import { useEffect } from 'react';

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const token = useAuth((s) => s.token);
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.error('Please login to continue');
    }
  }, [token]);

  if (!token) {
    // send them to login and remember where they came from
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
