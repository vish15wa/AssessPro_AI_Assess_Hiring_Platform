
import React from 'react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-left mb-12 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Hire Smart, <br/>
              <span className="text-indigo-600">Eliminate Noise.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              AssessPro leverages AI to create role-specific, data-backed assessments that verify true skill and eliminate unqualified applications.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => onNavigate('register')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center"
              >
                Get Started Free <i className="fas fa-arrow-right ml-2"></i>
              </button>
              <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <img src="https://picsum.photos/id/1/600/600" alt="Tech" className="relative rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose AssessPro?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our platform ensures every candidate is evaluated fairly using the most advanced AI technology.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fa-magic" 
              title="AI Question Generation" 
              desc="Automatically generate role-specific MCQs, subjective, and coding questions based on JDs." 
            />
            <FeatureCard 
              icon="fa-shield-halved" 
              title="Anti-Fake Mechanisms" 
              desc="Identify guesswork and skill-resume mismatches using sophisticated AI heuristics." 
            />
            <FeatureCard 
              icon="fa-chart-line" 
              title="Detailed Analytics" 
              desc="Get comprehensive reports with skill gap analysis, ranking, and explainable AI insights." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6 text-xl">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
