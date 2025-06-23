import { Navigate } from 'react-router-dom';
import { authService } from '@/lib/auth';

const Index = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
