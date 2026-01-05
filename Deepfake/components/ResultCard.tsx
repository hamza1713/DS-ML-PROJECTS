
import React from 'react';
import { DetectionResult } from '../types';
import { AlertCircle, CheckCircle2, Info, Fingerprint, ShieldAlert } from 'lucide-react';

interface ResultCardProps {
  result: DetectionResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isSuspicious = result.isAI || result.confidence > 70;
  
  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`p-6 rounded-2xl border-2 ${isSuspicious ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isSuspicious ? (
              <ShieldAlert className="w-8 h-8 text-red-500" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            )}
            <div>
              <h3 className="text-xl font-bold">
                {isSuspicious ? 'Synthetic Origin Detected' : 'Likely Authentic Content'}
              </h3>
              <p className="text-sm opacity-70">Forensic confidence: {result.confidence}%</p>
            </div>
          </div>
          <div className="text-3xl font-black mono">
            {result.confidence}%
          </div>
        </div>
        
        <p className="text-lg mb-6 leading-relaxed italic">"{result.summary}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-2 mb-3 text-blue-400">
            <Fingerprint className="w-5 h-5" />
            <h4 className="font-semibold uppercase text-xs tracking-wider">Detected Patterns</h4>
          </div>
          <ul className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h4 className="font-semibold uppercase text-xs tracking-wider">Forensic Artifacts</h4>
          </div>
          <ul className="space-y-2">
            {result.artifacts.map((artifact, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                {artifact}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="text-xs text-gray-400 leading-normal">
          DISCLAIMER: This detection is provided by Gemini-3 Flash analysis. While highly accurate, forensic tools should be used as one part of a wider verification process.
        </p>
      </div>
    </div>
  );
};
