
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">How Swasth AI Works</h2>
      
      <div className="space-y-8">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-brain text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Semantic Search</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Unlike traditional keyword-based search, Swasth AI uses transformer-based sentence embeddings to understand the 
            <strong> intent</strong> behind your queries. This means if you ask about "sugar problems," the AI understands 
            you are referring to Diabetes.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-language text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Multilingual Knowledge</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Swasth AI supports 7 major languages including Hindi, English, Spanish, and more. It processes natural language 
            input (text or voice) and retrieves medical information in the user's preferred language.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-microphone-alt text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Voice Recognition</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Equipped with native audio processing, Swasth AI allows users to describe their symptoms verbally. This 
            increases accessibility for users who may have difficulty typing or prefer natural conversation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
