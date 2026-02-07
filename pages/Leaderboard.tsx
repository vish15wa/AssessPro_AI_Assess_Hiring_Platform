
import React, { useState, useEffect } from 'react';
import { MockDb } from '../services/mockDb';
import { getLeaderboard, fetchJobsFromBackend } from '../services/backendApiService';
import { Application, Job } from '../types';

interface LeaderboardProps {
  onNavigate: (page: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onNavigate }) => {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const backendJobs = await fetchJobsFromBackend();
        if (backendJobs && Array.isArray(backendJobs)) {
          setJobs(backendJobs);
          if (backendJobs.length > 0) {
            setSelectedJobId(String(backendJobs[0].id));
          }
        } else {
          throw new Error('No jobs');
        }
      } catch (err) {
        console.warn('Failed to load jobs from backend, using MockDb:', err);
        const mockJobs = MockDb.getJobs();
        setJobs(mockJobs);
        if (mockJobs.length > 0) {
          setSelectedJobId(mockJobs[0].id);
        }
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!selectedJobId) return;
      
      setIsLoading(true);
      try {
        const jobNum = parseInt(selectedJobId);
        const data = await getLeaderboard(jobNum);
        if (data && Array.isArray(data)) {
          setLeaderboardData(data);
        } else {
          throw new Error('Invalid leaderboard data');
        }
      } catch (err) {
        console.warn('Failed to load leaderboard from backend, using MockDb:', err);
        // Fallback to MockDb
        const apps = MockDb.getApplications()
          .filter(a => a.jobId === selectedJobId && (a.status === 'COMPLETED' || a.status === 'QUALIFIED'))
          .sort((a, b) => (b.result?.scores.total || 0) - (a.result?.scores.total || 0));
        
        setLeaderboardData(apps.map((app, idx) => ({
          id: app.id,
          rank: idx + 1,
          name: app.studentName,
          email: app.studentName.toLowerCase().replace(/\s+/g, '.') + '@example.com',
          total_score: app.result?.scores.total || 0,
          percentage: ((app.result?.scores.total || 0) / (app.result?.scores.total || 1)) * 100,
          time_taken_minutes: app.result?.timeTakenMinutes || 0,
          qualified: app.status === 'QUALIFIED',
          fraud_risk: 'low'
        })));
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [selectedJobId]);

  const getRankColor = (idx: number) => {
    if (idx === 0) return 'bg-yellow-100 text-yellow-600';
    if (idx === 1) return 'bg-slate-200 text-slate-600';
    if (idx === 2) return 'bg-orange-100 text-orange-600';
    return 'bg-slate-100 text-slate-400';
  };

  const getFraudRiskColor = (risk: string) => {
    if (risk === 'high') return 'bg-red-100 text-red-700';
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

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
            <option key={j.id || j.jobId} value={String(j.id || j.jobId)}>{j.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {isLoading ? (
          <div className="px-8 py-20 text-center text-slate-400">Loading leaderboard...</div>
        ) : leaderboardData.length === 0 ? (
          <div className="px-8 py-20 text-center text-slate-400 text-lg">
            No candidates have qualified for this job yet.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Candidate</th>
                <th className="px-8 py-5">Score</th>
                <th className="px-8 py-5">Time Taken</th>
                <th className="px-8 py-5">Risk Level</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboardData.map((entry: any, idx: number) => (
                <tr key={entry.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(idx)}`}>
                      {entry.rank || idx + 1}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3 font-bold uppercase">
                        {(entry.name || entry.studentName || 'C').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-black">{entry.name || entry.studentName}</div>
                        <div className="text-xs text-slate-500">{entry.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-indigo-600">
                    {Math.round(entry.total_score || 0)}
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm">
                    {entry.time_taken_minutes || 0} mins
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full uppercase ${getFraudRiskColor(entry.fraud_risk || 'low')}`}>
                      {entry.fraud_risk || 'low'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase">
                      {entry.qualified ? 'Qualified' : 'Submitted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <button 
        onClick={() => onNavigate('dashboard')} 
        className="mt-10 mx-auto block text-slate-400 hover:text-black font-bold transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>
    </div>
  );
};

export default Leaderboard;
