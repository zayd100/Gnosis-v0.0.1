import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import WarmerDashboard from './pages/WarmerDashboard';
import CloserDashboard from './pages/CloserDashboard';

const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Route based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'warmer':
      return <WarmerDashboard />;
    case 'closer':
      return <CloserDashboard />;
    default:
      return <Login />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;