import React, { useState, useCallback, useEffect } from 'react';
import { analyzeTerm } from './services/geminiService';
import type { AnalysisResult, TermAnalysis } from './types';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import MeaningSelector from './components/MeaningSelector';
import SuggestionDisplay from './components/SuggestionDisplay';

const App: React.FC = () => {
  const [term, setTerm] = useState<string>('');
  const [submittedTerm, setSubmittedTerm] = useState<string>('');
  const [analyses, setAnalyses] = useState<TermAnalysis[] | null>(null);
  const [finalResult, setFinalResult] = useState<AnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (termToAnalyze: string) => {
    if (!termToAnalyze.trim()) {
      setError('Please enter a word or phrase to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalyses(null);
    setFinalResult(null);
    setSuggestions(null);
    setSubmittedTerm(termToAnalyze);

    try {
      const response = await analyzeTerm(termToAnalyze);
      
      if (!response.isValidTerm && response.suggestions?.length > 0) {
        setSuggestions(response.suggestions);
      } else if (response.analyses && response.analyses.length > 0) {
        if (response.analyses.length === 1) {
          setFinalResult(response.analyses[0].analysis);
        } else {
          setAnalyses(response.analyses);
        }
      } else {
        setError(`Could not analyze "${termToAnalyze}". It may be a typo or a made-up word. Please check the spelling.`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectMeaning = useCallback((result: AnalysisResult) => {
    setFinalResult(result);
  }, []);

  const handleSelectSuggestion = useCallback((suggestion: string) => {
    setTerm(suggestion);
    performAnalysis(suggestion);
  }, [performAnalysis]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      performAnalysis(term);
    }
  };

  const WelcomeMessage: React.FC = () => (
    <div className="text-center text-slate-500 mt-8">
      <p>Enter a word or phrase to estimate its reading complexity.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col items-center justify-center p-4 font-sans">
      <main className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-10 border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Reading Age Estimator</h1>
          <p className="text-slate-600 mt-2">Discover the complexity of any term or phrase.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Leverage, Constitution"
            className="flex-grow w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            disabled={isLoading}
          />
          <button
            onClick={() => performAnalysis(term)}
            disabled={isLoading || !term.trim()}
            className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : "Analyze"}
          </button>
        </div>

        <div className="mt-6 min-h-[150px]">
          {isLoading && <Spinner />}
          
          {error && (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {suggestions && !isLoading && (
            <SuggestionDisplay 
              term={submittedTerm}
              suggestions={suggestions} 
              onSelect={handleSelectSuggestion} 
            />
          )}
          
          {!isLoading && !error && !suggestions && (
            <>
              {finalResult ? (
                <ResultDisplay term={submittedTerm} result={finalResult} />
              ) : analyses ? (
                <MeaningSelector term={submittedTerm} analyses={analyses} onSelect={handleSelectMeaning} />
              ) : (
                <WelcomeMessage />
              )}
            </>
          )}
        </div>
      </main>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
