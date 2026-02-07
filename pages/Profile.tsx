
import React from 'react';
// Fix: Import User from the types file instead of mockDb
import { User } from '../types';
import { MockDb } from '../services/mockDb';

interface ProfileProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigate }) => {
  if (!user) return null;

  const applications = MockDb.getApplications().filter(a => a.studentId === user.id);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
        <div className="px-10 pb-10">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg">
              <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 text-4xl font-bold">
                {user.fullName.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{user.fullName}</h1>
              <p className="text-slate-500">@{user.username}</p>
            </div>
            <button className="mt-4 md:mt-0 border border-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <InfoItem icon="fa-envelope" label="Email" value={user.email} />
            <InfoItem icon="fa-phone" label="Contact" value={user.contactNumber} />
            <InfoItem icon="fa-calendar" label="Date of Birth" value={user.dob} />
            <InfoItem icon="fa-clock" label="Joined On" value={new Date(user.createdAt).toLocaleDateString()} />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Application History</h2>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-slate-400 italic">No applications recorded.</p>
            ) : (
              applications.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">{MockDb.getJobById(app.jobId)?.title || 'Role'}</h4>
                    <p className="text-xs text-slate-500">Applied on {new Date(app.id.length > 0 ? Date.now() : 0).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Status</p>
                      <span className={`text-xs font-bold ${
                        app.status === 'QUALIFIED' ? 'text-green-600' : app.status === 'DISQUALIFIED' ? 'text-red-500' : 'text-indigo-600'
                      }`}>
                        {app.status === 'COMPLETED' ? (app.result?.status || 'PENDING') : app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={() => onNavigate(-1 as any)} 
        className="mt-10 mx-auto block text-slate-400 hover:text-indigo-600 font-bold transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>
    </div>
  );
};

const InfoItem: React.FC<{ icon: string, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

export default Profile;
