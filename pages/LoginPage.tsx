
import React, { useState } from 'react';
import { MockDb } from '../services/mockDb';
import { User } from '../types';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }

    const user = MockDb.findUserByEmail(email);
    if (user && user.password === password) {
      MockDb.setCurrentUser(user);
      onLogin(user);
      onNavigate('dashboard');
    } else {
      setError('Wrong credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-black mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Email Address</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-all shadow-md"
        >
          Sign In
        </button>
      </form>
      <div className="mt-6 text-center text-black">
        Don't have an account? <button onClick={() => onNavigate('register')} className="text-indigo-600 font-bold hover:underline">Sign Up</button>
      </div>
      <button 
        onClick={() => onNavigate('landing')}
        className="mt-4 w-full text-slate-500 text-sm flex items-center justify-center hover:text-black"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Home
      </button>
    </div>
  );
};

export default LoginPage;
