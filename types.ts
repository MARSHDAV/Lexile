export interface AnalysisResult {
  readingAge: number;
  schoolYear: string;
  ageGroup: string;
  profession: string;
  pearsonSyllabus: string;
}

export interface TermAnalysis {
  definition: string;
  analysis: AnalysisResult;
}

export interface FullAnalysisResponse {
  isValidTerm: boolean;
  suggestions: string[];
  analyses: TermAnalysis[];
}