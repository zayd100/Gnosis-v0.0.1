import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import bgVideo from '../assets/prev.mp4';
import logo from '../assets/logo.png';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const result = await login(email, password);

    if (!result.success) {
      setErrorMessage(result.error);
    }

    setIsLoading(false);
  };

  const quickLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@sentinelx.com', password: 'admin123' },
      warmer: { email: 'maya@sentinelx.com', password: 'warmer123' },
      closer: { email: 'ivy@sentinelx.com', password: 'closer123' }
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);

    setIsLoading(true);
    await login(credentials[role].email, credentials[role].password);
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      {/* Background Video */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[-1]" />

      <div className="max-w-md w-full">
        {/* Logo */}
     <div className="text-center mb-8">
  {/* Logo without white box */}
  <img 
    src={logo} 
    alt="SentinelX Logo" 
    className="w-40 h-40 mx-auto object-contain mb-4" 
  />

  {/* Title */}
  <h1 className="text-4xl font-bold text-white mb-2">Gnosis</h1>

  {/* Subtitle */}
  <p className="text-purple-200">Lead Management System</p>
</div>


        {/* Login Form */}
        <div className="bg-white/20 border border-white/30 backdrop-blur-[1px] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-300/30 rounded-lg text-red-200 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/30 text-white placeholder-gray-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/30 text-white placeholder-gray-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-gray-200 mb-3 text-center">
              Quick Login (Demo-Click-for-dummy-userdata)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 bg-red-500/20 text-red-200 text-xs font-medium rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('warmer')}
                className="px-3 py-2 bg-purple-500/20 text-purple-200 text-xs font-medium rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                Warmer
              </button>
              <button
                onClick={() => quickLogin('closer')}
                className="px-3 py-2 bg-indigo-500/20 text-indigo-200 text-xs font-medium rounded-lg hover:bg-indigo-500/30 transition-colors"
              >
                Closer
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-purple-200 text-sm mt-8">
          © 2026 NoetisAI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
