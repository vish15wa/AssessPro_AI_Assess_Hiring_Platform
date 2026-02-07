
import React, { useState, useEffect } from 'react';
import { MockDb } from '../services/mockDb';
import { Application, Job } from '../types';

interface LeaderboardProps {
  onNavigate: (page: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onNavigate }) => {
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  useEffect(() => {
    const allApps = MockDb.getApplications().filter(a => a.status === 'COMPLETED' || a.status === 'QUALIFIED');
    setApps(allApps);
    const allJobs = MockDb.getJobs();
    setJobs(allJobs);
    if (allJobs.length > 0) setSelectedJobId(allJobs[0].id);
  }, []);

  const filteredApps = apps
    .filter(a => a.jobId === selectedJobId && (a.result?.scores.total || 0) >= (MockDb.getJobById(selectedJobId)?.threshold || 0))
    .sort((a, b) => (b.result?.scores.total || 0) - (a.result?.scores.total || 0));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-black mb-2">Global Leaderboard</h1>
          <p className="text-slate-500 italic">"Talent speaks louder than resumes."</p>
        </div>
        <select
          className="mt-6 md:mt-0 w-full md:w-64 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-black outline-none focus:border-indigo-500 font-bold"
          value={selectedJobId}
          onChange={e => setSelectedJobId(e.target.value)}
        >
          {jobs.map(j => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-8 py-5">Rank</th>
              <th className="px-8 py-5">Candidate</th>
              <th className="px-8 py-5">Score</th>
              <th className="px-8 py-5">Time Taken</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-lg">
                  No candidates have qualified for this job yet.
                </td>
              </tr>
            ) : (
              filteredApps.map((app, idx) => (
                <tr key={app.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-600' : 
                      idx === 1 ? 'bg-slate-200 text-slate-600' : 
                      idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3 font-bold uppercase">
                        {app.studentName.charAt(0)}
                      </div>
                      <span className="font-bold text-black">{app.studentName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-indigo-600">
                    {app.result?.scores.total}
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm">
                    {app.result?.timeTakenMinutes} mins
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase">
                      Qualified
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={() => onNavigate(-1 as any)} 
        className="mt-10 mx-auto block text-slate-400 hover:text-black font-bold transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>
    </div>
  );
};

export default Leaderboard;
