import React from 'react';

interface SuggestionDisplayProps {
  term: string;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({ term, suggestions, onSelect }) => {
  return (
    <div className="mt-8 w-full animate-fade-in text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        Did you mean?
      </h3>
      <p className="text-slate-600 mb-4">
        We couldn't find a result for "<span className="font-semibold">{term}</span>".
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionDisplay;
