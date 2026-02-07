
import React, { useState } from 'react';
import { MockDb } from '../services/mockDb';
import { UserRole } from '../types';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: UserRole.STUDENT,
    contactNumber: '',
    dob: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email.includes('@')) {
      setError('Email invalid');
      return;
    }

    if (MockDb.findUserByEmail(formData.email)) {
      setError('Account already exists with this email');
      return;
    }

    const newUser = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    MockDb.saveUser(newUser);
    setMessage('Account Created');
    setTimeout(() => {
      onNavigate('login');
    }, 4000);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 mb-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-black mb-6 text-center">Create Your Account</h2>
      <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">Full Name</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="John Doe"
            required
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="john@example.com"
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Username</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="johndoe123"
            required
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Contact Number</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="9876543210"
            required
            onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            required
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Role</label>
          <select
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
          >
            <option value={UserRole.STUDENT}>Student / Candidate</option>
            <option value={UserRole.RECRUITER}>Verified Talent Acquisition</option>
          </select>
        </div>
        <div className="md:col-span-2">
          {error && <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          {message && <div className="text-green-600 mb-4 bg-green-50 p-3 rounded-lg border border-green-100 flex items-center">
            <i className="fas fa-check-circle mr-2"></i> {message}
          </div>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
          >
            Create Account
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button onClick={() => onNavigate('login')} className="text-slate-500 hover:text-indigo-600">Already have an account? Login</button>
      </div>
      <button 
        onClick={() => onNavigate(-1 as any)} 
        className="mt-6 w-full text-sm text-slate-400 hover:text-black flex items-center justify-center"
      >
        <i className="fas fa-chevron-left mr-1"></i> Back
      </button>
    </div>
  );
};

export default RegisterPage;
