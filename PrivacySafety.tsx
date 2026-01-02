
import React from 'react';

const PrivacySafety: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Privacy & Safety</h2>
      
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-emerald-800 mb-2">Your Privacy Matters</h3>
        <p className="text-emerald-700 text-sm">
          Swasth AI is designed with privacy in mind. We do not store personal medical records or identifiable health data 
          beyond the current session's conversation context needed to provide accurate information.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">1. Data Usage</h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            Input data is processed using Google Gemini's secure API. Information is used solely to generate health awareness 
            responses. We do not sell or share your conversational data with third parties.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">2. Safety Guidelines</h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            The system is hard-coded to never provide diagnosis or specific medication prescriptions. Its primary role 
            is awareness—explaining symptoms and preventive measures.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">3. Medical Emergency</h4>
          <p className="text-slate-600 text-sm leading-relaxed font-semibold">
            If you are experiencing a medical emergency, please stop using this app and call your local emergency services 
            immediately. This AI is not a substitute for professional medical care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySafety;
