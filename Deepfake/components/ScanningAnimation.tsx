
import React from 'react';

export const ScanningAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
      {/* Horizontal Bar */}
      <div className="w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(400px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
