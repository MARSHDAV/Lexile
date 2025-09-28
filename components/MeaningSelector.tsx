import React from 'react';
import type { TermAnalysis, AnalysisResult } from '../types';

interface MeaningSelectorProps {
  term: string;
  analyses: TermAnalysis[];
  onSelect: (result: AnalysisResult) => void;
}

const MeaningSelector: React.FC<MeaningSelectorProps> = ({ term, analyses, onSelect }) => {
  return (
    <div className="mt-8 w-full animate-fade-in">
      <h3 className="text-lg font-semibold text-center text-slate-700 mb-4">
        The term "<span className="font-bold text-blue-600">{term}</span>" has multiple meanings.
      </h3>
      <p className="text-center text-slate-500 mb-6">Please select the context you're interested in.</p>
      <div className="space-y-4">
        {analyses.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(item.analysis)}
            className="w-full text-left p-4 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            aria-label={`Select meaning: ${item.definition}`}
          >
            <p className="font-semibold text-slate-800">Meaning {index + 1}</p>
            <p className="text-slate-600 mt-1">{item.definition}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MeaningSelector;
