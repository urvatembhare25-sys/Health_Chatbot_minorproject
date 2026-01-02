
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md my-4 shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <i className="fas fa-exclamation-triangle text-amber-400"></i>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700 font-medium">
            Important Medical Disclaimer
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Swasth AI is an informational tool for health awareness only. It does not provide medical diagnosis, 
            professional advice, or treatment. Always seek the advice of a qualified healthcare professional 
            with any questions regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
