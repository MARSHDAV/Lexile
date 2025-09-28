import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  term: string;
  result: AnalysisResult;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; }> = ({ icon, title, value }) => {
    return (
        <div className="bg-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm h-full">
            <div className="text-blue-600 mb-2">{icon}</div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-slate-800">{value}</p>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ term, result }) => {
  return (
    <div className="mt-8 w-full animate-fade-in">
        <h3 className="text-lg font-semibold text-center text-slate-700 mb-4">
            Analysis for "<span className="font-bold text-blue-600">{term}</span>"
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard 
                icon={<BookIcon />} 
                title="Reading Age" 
                value={result.readingAge} 
            />
            <InfoCard 
                icon={<SchoolIcon />} 
                title="School Year" 
                value={result.schoolYear} 
            />
            <InfoCard 
                icon={<UsersIcon />} 
                title="Age Group" 
                value={result.ageGroup} 
            />
            <InfoCard 
                icon={<SyllabusIcon />} 
                title="Pearson Syllabus" 
                value={result.pearsonSyllabus} 
            />
        </div>
        <div className="bg-slate-100 rounded-xl p-4 mt-4 flex items-center shadow-sm">
            <div className="text-blue-600 mr-4 flex-shrink-0">{<BriefcaseIcon />}</div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-slate-500">Profession(s)</p>
                <p className="text-lg font-bold text-slate-800 break-words">{result.profession}</p>
            </div>
        </div>
    </div>
  );
};

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const SchoolIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h14a2 2 0 002-2v-7" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const SyllabusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export default ResultDisplay;