import React, { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import WarmerDashboard from './pages/WarmerDashboard';
import CloserDashboard from './pages/CloserDashboard';

function App() {
  const [role, setRole] = useState('admin');

  const renderDashboard = () => {
    switch(role) {
      case 'admin': return <AdminDashboard />;
      case 'warmer': return <WarmerDashboard />;
      case 'closer': return <CloserDashboard />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="App">
      {/* 🚨 DEV TOOL - Will be replaced with authentication */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-lg p-3">
          <p className="text-xs font-bold text-yellow-800 mb-2">
            ⚠️ DEV ONLY - Will be removed
          </p>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white text-gray-900 font-medium border-2 border-yellow-400 focus:outline-none cursor-pointer text-sm"
          >
            <option value="admin">👨‍💼 Admin View</option>
            <option value="warmer">🔥 Warmer View</option>
            <option value="closer">💼 Closer View</option>
          </select>
        </div>
      </div>
      
      {renderDashboard()}
    </div>
  );
}

export default App;