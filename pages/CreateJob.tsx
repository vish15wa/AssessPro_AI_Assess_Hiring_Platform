
import React, { useState, useEffect } from 'react';
import { User, Job, Difficulty, Question } from '../types';
import { MockDb } from '../services/mockDb';
import { generateQuestionsViaBackend, createJobViaBackend } from '../services/backendApiService';

interface CreateJobProps {
  user: User | null;
  onNavigate: (page: string) => void;
  editJobId?: string | null;
}

const CreateJob: React.FC<CreateJobProps> = ({ user, onNavigate, editJobId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    deadline: '',
    durationMinutes: undefined, // Empty initially
    questionCount: 10, // Default 10
    difficulty: Difficulty.MEDIUM,
    threshold: 30
  });

  useEffect(() => {
    if (editJobId) {
      const job = MockDb.getJobById(editJobId);
      if (job) setFormData(job);
    }
  }, [editJobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.durationMinutes) {
        alert("Please set a duration for the assessment.");
        return;
    }

    setLoading(true);
    try {
      // Call backend API instead of Gemini
      // Create job on backend (it will generate questions server-side)
      const payload = {
        title: formData.title || '',
        description: formData.description || '',
        durationMinutes: formData.durationMinutes,
        difficulty: formData.difficulty || Difficulty.MEDIUM,
        threshold: formData.threshold || 30,
      };

      const created = await createJobViaBackend(payload);

      // Also save locally so MockDb-based parts keep working
      const newJob: Job = {
        ...formData,
        id: String(created.id || editJobId || Math.random().toString(36).substr(2, 9)),
        recruiterId: user.id,
        recruiterName: user.fullName,
        createdAt: new Date().toISOString(),
        questions: created.questions || [],
        requirements: [] 
      } as Job;

      MockDb.saveJob(newJob);
      alert("Job created successfully");
      onNavigate('dashboard');
    } catch (err) {
      console.error('Backend error:', err);
      alert("Error generating assessment. Please ensure the backend API is running at http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
      <button onClick={() => onNavigate('dashboard')} className="mb-6 font-bold text-slate-400 hover:text-black">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <h2 className="text-3xl font-black text-black mb-8">{editJobId ? 'Edit' : 'Create'} Intelligent Job Assessment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Role Title</label>
              <input
                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-black outline-none focus:border-indigo-500"
                placeholder="e.g. Frontend Engineer"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Role Description (JD)</label>
              <textarea
                rows={5}
                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-black outline-none focus:border-indigo-500"
                placeholder="AI will extract skills and generate questions from this..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Duration (Minutes)</label>
              <input
                type="number"
                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-black outline-none focus:border-indigo-500"
                value={formData.durationMinutes === undefined ? '' : formData.durationMinutes}
                onChange={e => setFormData({...formData, durationMinutes: e.target.value ? parseInt(e.target.value) : undefined})}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Questions Count</label>
              <input
                type="number"
                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-black outline-none focus:border-indigo-500"
                value={formData.questionCount}
                onChange={e => setFormData({...formData, questionCount: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Closing Date</label>
              <input
                type="date"
                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-black outline-none focus:border-indigo-500"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Qualifying Mark</label>
              <input
                type="number"
                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-black outline-none focus:border-indigo-500"
                value={formData.threshold}
                onChange={e => setFormData({...formData, threshold: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl mt-6 transition-all ${
              loading ? 'bg-indigo-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? <><i className="fas fa-robot animate-bounce mr-2"></i> AI Generating Assessment...</> : 'Launch Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
