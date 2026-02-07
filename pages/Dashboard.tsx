
import React, { useState, useEffect } from 'react';
import { User, UserRole, Job, Application } from '../types';
import { MockDb } from '../services/mockDb';
import { fetchJobsFromBackend } from '../services/backendApiService';

interface DashboardProps {
  user: User | null;
  onNavigate: (page: string, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const remote = await fetchJobsFromBackend();
        if (remote && Array.isArray(remote) && remote.length > 0) {
          setJobs(remote as any);
        } else {
          setJobs(MockDb.getJobs());
        }
      } catch (err) {
        setJobs(MockDb.getJobs());
      }

      setApplications(MockDb.getApplications());
    };

    load();
  }, []);

  const handleApply = (jobId: string) => {
    // If student has already applied
    const existing = applications.find(a => a.studentId === user?.id && a.jobId === jobId);
    if (existing) {
      if (existing.status === 'APPLIED') {
        onNavigate('assessment', { jobId });
      } else {
        alert('You have already completed this assessment');
      }
      return;
    }

    // PDF Resume upload logic placeholder
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
          const newApp: Application = {
            id: Math.random().toString(36).substr(2, 9),
            jobId,
            studentId: user!.id,
            studentName: user!.fullName,
            status: 'APPLIED',
            resumeUrl: URL.createObjectURL(file)
          };
          MockDb.saveApplication(newApp);
          setApplications([...applications, newApp]);
          setIsUploading(false);
          onNavigate('assessment', { jobId });
        }, 1500);
      }
    };
    fileInput.click();
  };

  const recruiterJobs = jobs.filter(j => j.recruiterId === user?.id);
  const studentApps = applications.filter(a => a.studentId === user?.id);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.fullName}</h1>
          <p className="text-slate-500">Manage your {user.role === UserRole.RECRUITER ? 'job postings' : 'applications'} here.</p>
        </div>
        {user.role === UserRole.RECRUITER && (
          <button 
            onClick={() => onNavigate('create-job')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-transform flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Post New Job
          </button>
        )}
      </div>

      {user.role === UserRole.RECRUITER ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <i className="fas fa-briefcase mr-2 text-indigo-500"></i> Your Job Postings ({recruiterJobs.length})
          </h2>
          {recruiterJobs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-lg">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recruiterJobs.map(job => (
                <JobCard key={job.id} job={job} role={UserRole.RECRUITER} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <i className="fas fa-search mr-2 text-indigo-500"></i> Available Jobs ({jobs.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map(job => (
                <JobRow 
                  key={job.id} 
                  job={job} 
                  applied={studentApps.some(a => a.jobId === job.id)}
                  onApply={() => handleApply(job.id)}
                  isUploading={isUploading}
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <i className="fas fa-tasks mr-2 text-indigo-500"></i> Your Applications ({studentApps.length})
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
              {studentApps.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No applications yet.</div>
              ) : (
                studentApps.map(app => (
                  <div key={app.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{MockDb.getJobById(app.jobId)?.title || 'Job'}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    {app.status === 'COMPLETED' && (
                      <button 
                        onClick={() => onNavigate('report', { appId: app.id })}
                        className="text-indigo-600 text-sm font-bold hover:underline"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const JobCard: React.FC<{ job: Job, role: UserRole, onNavigate: any }> = ({ job, role, onNavigate }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
        <i className="fas fa-laptop-code text-xl"></i>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
        job.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : job.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
      }`}>
        {job.difficulty}
      </span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{job.description}</p>
    <div className="flex items-center text-xs text-slate-400 mb-6 space-x-4">
      <span><i className="far fa-calendar-alt mr-1"></i> {new Date(job.deadline).toLocaleDateString()}</span>
      <span><i className="far fa-clock mr-1"></i> {job.durationMinutes} mins</span>
    </div>
    <div className="flex space-x-2">
      <button 
        onClick={() => onNavigate('create-job', { jobId: job.id })}
        className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg font-bold text-sm hover:bg-slate-50"
      >
        Edit
      </button>
      <button 
        onClick={() => onNavigate('dashboard')} // In a real app, this would show candidates
        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700"
      >
        Candidates
      </button>
    </div>
  </div>
);

const JobRow: React.FC<{ job: Job, applied: boolean, onApply: any, isUploading: boolean }> = ({ job, applied, onApply, isUploading }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-indigo-200 transition-colors">
    <div className="flex items-center space-x-4 mb-4 md:mb-0">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
        <i className="fas fa-building"></i>
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{job.title}</h4>
        <div className="flex space-x-3 text-xs text-slate-500">
          <span>{job.recruiterName}</span>
          <span>•</span>
          <span className="text-indigo-600 font-semibold">{job.difficulty}</span>
          <span>•</span>
          <span className="text-red-500">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-4 w-full md:w-auto">
      <div className="hidden md:block text-right mr-4">
        <p className="text-xs text-slate-400">Questions</p>
        <p className="font-bold text-slate-700">{job.questionCount}</p>
      </div>
      <button 
        disabled={isUploading}
        onClick={onApply}
        className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold transition-all ${
          applied ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
        }`}
      >
        {isUploading ? <i className="fas fa-spinner fa-spin"></i> : applied ? 'In Progress' : 'Apply Now'}
      </button>
    </div>
  </div>
);

export default Dashboard;
