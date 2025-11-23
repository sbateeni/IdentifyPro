
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

// Agent Sigma (Biological/Level 3 Details)
export interface BiologicalAnalysis {
  poresVisible: boolean;
  poreCountEstimate: number; // Poroscopy
  edgeShape: 'أملس' | 'مسنن' | 'غير واضح'; // Edgeoscopy
  scars: string[]; // Permanent
  creases: string[]; // Temporary
}

// Agent Theta (Distortion & Mechanical)
export interface DistortionAnalysis {
  pressureLevel: 'خفيف' | 'متوسط' | 'شديد';
  torsionDetected: boolean; // Is there twisting?
  elasticityIssues: boolean; // Skin stretching?
  distortionScore: number; // 0-100 (Higher means more distorted)
  affectedZones: string[]; // Zones like "Central Core", "Upper Delta"
}

// Agent Iota (Visual Anatomical Mapping)
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

// Agent Kappa (Scale & Subset Analyzer)
export interface ScaleAnalysis {
  isSubset: boolean; // Is file2 a part of file1?
  scaleRatio: number; // e.g., 1.0 = same, 2.0 = 2x zoom, 0.5 = zoomed out
  overlapPercentage: number; // 0-100
  relationship: 'identical' | 'subset_master' | 'partial_overlap' | 'no_overlap';
  explanation: string;
}

// Agent Lambda (Forensic Enhancer)
export interface ForensicEnhancement {
  appliedFilters: string[]; // e.g., "CLAHE", "Gabor Filter", "FFT"
  clarityGain: number; // Estimated percentage of improvement
  restoredRegions: string[]; // Areas where details were recovered
  originalNoiseLevel: 'Low' | 'Medium' | 'High';
}

// Agent Rho (Surface/Substrate)
export interface SurfaceAnalysis {
  surfaceMaterial: string; // e.g., "Glass", "Paper", "Tape", "Skin"
  textureInterference: 'None' | 'Low' | 'High';
  backgroundNoiseType: string; // e.g., "Grainy", "Patterned"
}

// Agent Phi (Bayesian Stats)
export interface BayesianAnalysis {
  randomCorrespondenceProbability: string; // e.g., "1 in 10 Billion"
  likelihoodRatio: number; // Numeric ratio
  statisticalStrength: 'Conclusive' | 'Very Strong' | 'Strong' | 'Moderate' | 'Weak';
}

// Agent Nu (Action/Timeline)
export interface ActionReconstruction {
  estimatedAction: string; // e.g., "Grasping", "Pushing", "Touching"
  handOrientation: string; // e.g., "Vertical", "Angled 45deg"
  timeDecayEstimate: string; // e.g., "Fresh (<24h)", "Old"
  pressureDistribution: string; // Description of force
}

// NEW: Agent Psi (Multi-Fingerprint Crosslinker)
export interface CrossLinkingAnalysis {
  isSameSource: boolean; // Does the agent believe they are from the same biological entity?
  crossSurfaceMatch: boolean; // Do they match despite different surfaces?
  linkageConfidence: number; // 0-100
  consistencyCheck: string; // e.g. "Consistent ridge flow across surfaces"
}

// Agent Omega (Legal/Expert Witness)
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
  
  // Pre-processing Agents
  agentDelta: { file1: QualityAnalysis; file2: QualityAnalysis; }; // Quality
  agentLambda: { file1: ForensicEnhancement; file2: ForensicEnhancement; }; // Enhancement
  agentRho: { file1: SurfaceAnalysis; file2: SurfaceAnalysis; }; // Surface

  // Security
  agentEpsilon: { file1: ForgeryAnalysis; file2: ForgeryAnalysis; }; // Forgery

  // Core Analysis Agents
  agentAlpha: FingerprintAnalysis; // Source
  agentBeta: FingerprintAnalysis; // Target
  agentZeta: { file1: MinutiaeStats; file2: MinutiaeStats; }; // Galton
  agentSigma: { file1: BiologicalAnalysis; file2: BiologicalAnalysis; }; // Level 3

  // Mechanical & Context Agents
  agentTheta: { file1: DistortionAnalysis; file2: DistortionAnalysis; }; // Distortion
  agentNu: { file1: ActionReconstruction; file2: ActionReconstruction; }; // Action/Timeline
  agentKappa: ScaleAnalysis; // Scale/Subset

  // Comparison Agents
  agentGamma: DetailedComparison; // Text Comparison
  agentIota: AnatomicalMapping; // Visual Mapping
  
  // Advanced Stats & Linking
  agentPhi: BayesianAnalysis; // Bayesian Stats
  agentPsi: CrossLinkingAnalysis; // Crosslinker (Agent 16)

  // Final Legal
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
