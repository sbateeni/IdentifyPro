
export interface FingerprintAnalysis {
  patternType: string;
  ridgeQuality: 'ممتازة' | 'جيدة' | 'ضعيفة' | 'غير واضحة';
  estimatedMinutiaeCount: number;
  distinctiveFeatures: string[];
  imperfections: string[];
}

export interface DetailedComparison {
  patternMatch: {
    score: number;
    explanation: string;
  };
  minutiaeMatch: {
    score: number;
    commonPointsFound: string[];
    differencesFound: string[];
  };
}

export interface ComparisonResult {
  agent1Analysis: FingerprintAnalysis;
  agent2Analysis: FingerprintAnalysis;
  comparisonAgent: DetailedComparison;
  finalResult: {
    matchScore: number;
    isMatch: boolean;
    confidenceLevel: 'عالية' | 'متوسطة' | 'منخفضة';
    forensicConclusion: string;
  };
}

export enum UploadSide {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
