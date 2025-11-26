
// --- Common Sub-Types ---

export interface AgentBase {
  confidence: number; // 0.0 to 1.0
  directives: string[]; // List of commands/warnings to other agents
}

// --- PHASE 1: Structural Analysis (Alpha - Helios) ---
export interface Phase1Structural {
  agentAlpha: AgentBase & { patternType: string; };
  agentBeta: AgentBase & { qualityMetric: string; noiseLevel: string; };
  agentGamma: AgentBase & { ridgeFlow: string; bifurcationCount: number; };
  agentDelta: AgentBase & { featureVectorSize: number; mathematicalComplexity: string; };
  agentEpsilon: AgentBase & { reconstructionNeeded: boolean; partialArea: string; };
  agentRho: AgentBase & { substrateAnalysis: string; indirectReflection: boolean; };
  agentLyra: AgentBase & { geometry: string; symmetry: string; };
  agentHelios: AgentBase & { lightingCorrection: string; shadowRemoved: boolean; };
}

// --- PHASE 2: Minutiae & Micro Analysis (Zeta - Quanta) ---
export interface Phase2Micro {
  agentZeta: AgentBase & { matchPrecision: string; minutiaePairs: number; };
  agentSigma: AgentBase & { poreCount: number; edgeShape: string; };
  agentTheta: AgentBase & { distortionDetected: boolean; torsionAngle: number; };
  agentKappa: AgentBase & { scaleRatio: number; subsetMatch: boolean; };
  agentIota: AgentBase & { anatomicalLandmarks: number; visualPath: string; };
  agentQuanta: AgentBase & { nanoDetails: string; subPixelAccuracy: number; };
}

// --- PHASE 3: Statistical & Linking (Phi - Spectra) ---
export interface Phase3Statistical {
  agentPhi: AgentBase & { likelihoodRatio: number; prc: string; };
  agentPsi: AgentBase & { crossLinkConfirmed: boolean; sourceIdentityConfidence: number; };
  agentAtlas: AgentBase & { globalDbSearch: string; frequencyRarity: string; };
  agentChronos: AgentBase & { timeDecay: string; ageEstimation: string; };
  agentTactus: AgentBase & { pressureMap: string; touchForce: number; };
  agentSpectra: AgentBase & { spectralAnalysis: string; chemicalResidueSimulation: string; };
}

// --- PHASE 4: Reconstruction & Simulation (Morphix - Fornax) ---
export interface Phase4Reconstruction {
  agentMorphix: AgentBase & { missingRidgeReconstruction: string; percentRestored: number; };
  agentOrion: AgentBase & { patternExtrapolation: string; };
  agentVulcan: AgentBase & { heatDistortionSim: string; plasticDeformation: boolean; };
  agentHermes: AgentBase & { transferMethod: string; motionBlurCorrection: string; };
  agentNemesis: AgentBase & { antiSpoofingAdvanced: string; livenessScore: number; };
  agentFornax: AgentBase & { digitalNoiseFilter: string; artifactRemoval: number; };
}

// --- PHASE 5: Consolidation (Aegis - Omega) ---
export interface Phase5Consolidation {
  agentAegis: AgentBase & { defenseRebuttal: string; loopholeCheck: string; };
  agentOmega: AgentBase & { 
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
  file1Data?: Blob;
  file2Data?: Blob;
  result: ComparisonResult;
}
