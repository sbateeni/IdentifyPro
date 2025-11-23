
// --- Common Sub-Types ---

export interface AgentResult {
  agentName: string;
  status: 'Active' | 'Idle';
  outputSummary: string;
  score?: number; // 0-100
  details?: Record<string, string | number | boolean>;
}

// --- PHASE 1: Structural Analysis (Alpha - Helios) ---
export interface Phase1Structural {
  agentAlpha: { patternType: string; confidence: number; };
  agentBeta: { qualityMetric: string; noiseLevel: string; };
  agentGamma: { ridgeFlow: string; bifurcationCount: number; };
  agentDelta: { featureVectorSize: number; mathematicalComplexity: string; };
  agentEpsilon: { reconstructionNeeded: boolean; partialArea: string; };
  agentRho: { substrateAnalysis: string; indirectReflection: boolean; }; // Moved Rho here as per prompt pipeline
  agentLyra: { geometry: string; symmetry: string; }; // Hypothetical agent from "Helios" group in prompt
  agentHelios: { lightingCorrection: string; shadowRemoved: boolean; };
}

// --- PHASE 2: Minutiae & Micro Analysis (Zeta - Quanta) ---
export interface Phase2Micro {
  agentZeta: { matchPrecision: string; minutiaePairs: number; };
  agentSigma: { poreCount: number; edgeShape: string; };
  agentTheta: { distortionDetected: boolean; torsionAngle: number; };
  agentKappa: { scaleRatio: number; subsetMatch: boolean; };
  agentIota: { anatomicalLandmarks: number; visualPath: string; };
  agentQuanta: { nanoDetails: string; subPixelAccuracy: number; };
}

// --- PHASE 3: Statistical & Linking (Phi - Spectra) ---
export interface Phase3Statistical {
  agentPhi: { likelihoodRatio: number; prc: string; }; // Bayesian
  agentPsi: { crossLinkConfirmed: boolean; sourceIdentityConfidence: number; };
  agentAtlas: { globalDbSearch: string; frequencyRarity: string; };
  agentChronos: { timeDecay: string; ageEstimation: string; };
  agentTactus: { pressureMap: string; touchForce: number; };
  agentSpectra: { spectralAnalysis: string; chemicalResidueSimulation: string; };
}

// --- PHASE 4: Reconstruction & Simulation (Morphix - Fornax) ---
export interface Phase4Reconstruction {
  agentMorphix: { missingRidgeReconstruction: string; percentRestored: number; };
  agentOrion: { patternExtrapolation: string; };
  agentVulcan: { heatDistortionSim: string; plasticDeformation: boolean; };
  agentHermes: { transferMethod: string; motionBlurCorrection: string; };
  agentNemesis: { antiSpoofingAdvanced: string; livenessScore: number; };
  agentFornax: { digitalNoiseFilter: string; artifactRemoval: number; };
}

// --- PHASE 5: Consolidation (Psi - Aegis) ---
export interface Phase5Consolidation {
  agentAegis: { defenseRebuttal: string; loopholeCheck: string; };
  agentOmega: { 
    finalExpertStatement: string; 
    admissibility: 'High' | 'Medium' | 'Low'; 
    legalConfidence: number; 
  };
}

// --- MAIN RESULT INTERFACE ---

export interface ChainOfCustody {
  file1Hash: string;
  file2Hash: string;
  timestamp: number;
  integrityVerified: boolean;
}

export interface AnatomicalMapping {
  points: Array<{ label: string; zone1: string; zone2: string; confidence: number; }>;
  score: number;
  conclusion: string;
}

export interface ComparisonResult {
  chainOfCustody: ChainOfCustody;
  
  // The 5 Phases of the Quantum Orchestrator
  phase1: Phase1Structural;
  phase2: Phase2Micro;
  phase3: Phase3Statistical;
  phase4: Phase4Reconstruction;
  phase5: Phase5Consolidation;

  // Visual Mapping Data (Passed from Agent Iota)
  visualMapping?: AnatomicalMapping;

  // Final Verdict
  finalResult: {
    matchScore: number; // 0-100
    isMatch: boolean;
    confidenceLevel: 'High' | 'Medium' | 'Low';
    forensicConclusion: string;
  };
}

export interface HistoryRecord {
  id?: number;
  timestamp: number;
  file1Name: string;
  file2Name: string;
  file1Data?: Blob; // Store the actual image blob
  file2Data?: Blob; // Store the actual image blob
  result: ComparisonResult;
}
