
export interface FingerprintAnalysis {
  patternType: string;
  henryClassification: string; // Added Henry System
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

export interface MinutiaeStats {
  bifurcations: number; // تفرعات
  ridgeEndings: number; // نهايات
  enclosures: number; // بحيرات/جزر
  dots: number; // نقاط
  overallComplexity: 'عالية' | 'متوسطة' | 'منخفضة';
}

// NEW: Agent Sigma (Biological/Level 3 Details)
export interface BiologicalAnalysis {
  poresVisible: boolean;
  poreCountEstimate: number; // Poroscopy
  edgeShape: 'أملس' | 'مسنن' | 'غير واضح'; // Edgeoscopy
  scars: string[]; // Permanent
  creases: string[]; // Temporary
}

// NEW: Agent Theta (Distortion & Mechanical)
export interface DistortionAnalysis {
  pressureLevel: 'خفيف' | 'متوسط' | 'شديد';
  torsionDetected: boolean; // Is there twisting?
  elasticityIssues: boolean; // Skin stretching?
  distortionScore: number; // 0-100 (Higher means more distorted)
  affectedZones: string[]; // Zones like "Central Core", "Upper Delta"
}

// NEW: Agent Iota (Visual Anatomical Mapping)
export interface AnatomicalPoint {
  label: string; // e.g., "Core Bifurcation"
  zone1: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  zone2: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  confidence: number;
}

export interface AnatomicalMapping {
  points: AnatomicalPoint[];
  mappingScore: number;
  visualConclusion: string;
}

// NEW: Agent Omega (Legal/Expert Witness)
export interface LegalAssessment {
  admissibilityStatus: 'مقبول بقوة' | 'مقبول بحذر' | 'غير صالح قانونياً';
  legalConfidenceScore: number; // 0-100
  defenseNotes: string; // What might the defense lawyer argue?
  finalExpertStatement: string; // Formal Arabic statement
}

export interface QualityAnalysis {
  isUsable: boolean;
  qualityScore: number;
  issues: string[];
  recommendation: string;
}

export interface ForgeryAnalysis {
  isAuthentic: boolean;
  authenticityScore: number;
  riskFactors: string[];
  livenessIndicators: string[];
}

export interface ChainOfCustody {
  file1Hash: string;
  file2Hash: string;
  timestamp: number;
  integrityVerified: boolean;
}

export interface ComparisonResult {
  chainOfCustody: ChainOfCustody;
  qualityAgent: {
    file1: QualityAnalysis;
    file2: QualityAnalysis;
  };
  forgeryAgent: {
    file1: ForgeryAnalysis;
    file2: ForgeryAnalysis;
  };
  // Agent Zeta for Galton Details
  agentZeta: {
    file1: MinutiaeStats;
    file2: MinutiaeStats;
  };
  // Agent Sigma (Biological)
  agentSigma: {
    file1: BiologicalAnalysis;
    file2: BiologicalAnalysis;
  };
  // Agent Theta (Distortion)
  agentTheta: {
    file1: DistortionAnalysis;
    file2: DistortionAnalysis;
  };
  // Agent Iota (Visual Mapping)
  agentIota: AnatomicalMapping;
  
  agent1Analysis: FingerprintAnalysis;
  agent2Analysis: FingerprintAnalysis;
  comparisonAgent: DetailedComparison;
  // Agent Omega (Legal)
  agentOmega: LegalAssessment;
  
  finalResult: {
    matchScore: number;
    isMatch: boolean;
    confidenceLevel: 'عالية' | 'متوسطة' | 'منخفضة';
    forensicConclusion: string;
  };
}

export interface HistoryRecord {
  id?: number;
  timestamp: number;
  file1Name: string;
  file2Name: string;
  result: ComparisonResult;
}

export enum UploadSide {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
