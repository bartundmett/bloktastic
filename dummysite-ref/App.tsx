import React, { Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import FeatureCard from './components/FeatureCard';
import LibrarySection from './components/LibrarySection';
import Logo from './components/Logo';
import { Layers, Zap, Layout, Box, Shield, PenTool, Github, Slack, Figma } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full min-h-[600px] lg:h-[850px] flex items-center overflow-hidden">
        {/* 3D Background Layer */}
        <div className="absolute inset-0 z-0 w-full h-full">
           <Suspense fallback={<div className="w-full h-full bg-slate-50"></div>}>
             <Hero3D />
           </Suspense>
           {/* Gradient fade at bottom to blend into next section */}
           <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pointer-events-none">
          <div className="max-w-3xl text-center lg:text-left pointer-events-auto pt-20 lg:pt-0">
            <h1 className="text-5xl lg:text-8xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight drop-shadow-sm">
              Accelerate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Storyblok</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Rapidly Configure & Deploy Components. The ultimate platform for speed and flexibility with our block-based architecture.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95">
                Explore Now
              </button>
              <button className="bg-white/60 backdrop-blur-md text-slate-900 border border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-sm">
                Documentation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Features</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to build faster and scale your applications with modular block components.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Layout} 
              title="Easy Design" 
              description="Utilize the agile summaries and ensure your perceptions match reality with our design tools."
              color="teal"
            />
            <FeatureCard 
              icon={Shield} 
              title="All-use Reliability" 
              description="Descriptive clueless and with cement potions for rock solid stability."
              color="orange"
            />
             <FeatureCard 
              icon={Zap} 
              title="Recommendation" 
              description="Unlimited and vermores blocks and commendable speed optimizations."
              color="blue"
            />
            <FeatureCard 
              icon={Layers} 
              title="Interaction Design" 
              description="Explore oneness showfille, eperoler, and erstiations for best UX."
              color="green"
            />
            <FeatureCard 
              icon={Box} 
              title="Ready Features" 
              description="Project componentization radical and document re-election processes."
              color="purple"
            />
             <FeatureCard 
              icon={PenTool} 
              title="Security" 
              description="Muscle and decline components and administrate content securely."
              color="red"
            />
        </div>
      </section>

      {/* Library Section */}
      <LibrarySection />

      {/* Integrations Section */}
      <section className="py-24 px-6 lg:px-12 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto text-center">
             <h2 className="text-2xl font-bold text-slate-900 mb-12">Integrations</h2>
             <div className="flex flex-wrap justify-center gap-12 lg:gap-20 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <Github size={48} className="text-slate-800" />
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <Slack size={48} className="text-slate-800" />
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <Figma size={48} className="text-slate-800" />
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                     {/* Placeholder for generic integration */}
                    <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-transparent animate-spin"></div>
                 </div>
             </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                 <Logo />
              </div>
              <div className="flex gap-8 text-sm font-medium text-slate-500">
                  <a href="#" className="hover:text-slate-900 transition-colors">Components</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Links</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
              </div>
              <div className="text-sm text-slate-400">
                  Custom cursor
              </div>
          </div>
      </footer>
    </div>
  );
};

export default App;