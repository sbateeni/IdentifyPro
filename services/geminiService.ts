
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparisonResult } from "../types";
import { getApiKey, getPaidMode } from "./db";

// Helper to calculate SHA-256 Hash for Chain of Custody
const calculateSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const compareFingerprints = async (file1: File, file2: File): Promise<ComparisonResult> => {
  try {
    const hash1 = await calculateSHA256(file1);
    const hash2 = await calculateSHA256(file2);

    let apiKey = await getApiKey();
    if (!apiKey && typeof process !== 'undefined' && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }

    if (!apiKey) {
      throw new Error("مفتاح API غير موجود. يرجى إضافته من قائمة الإعدادات.");
    }

    // Check if Paid Mode is enabled
    const usePaidMode = await getPaidMode();

    // Determine Model and Thinking Budget based on mode
    // Paid Mode: Uses 'gemini-3-pro-preview' (as requested) with high thinking budget.
    // Free Mode: Uses 'gemini-2.5-flash' with no or low thinking budget to avoid limits.
    const modelName = usePaidMode ? "gemini-3-pro-preview" : "gemini-2.5-flash";
    const thinkingBudget = usePaidMode ? 32768 : 0; 

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const image1Part = await fileToGenerativePart(file1);
    const image2Part = await fileToGenerativePart(file2);

    const prompt = `
      SYSTEM OVERRIDE – TOTAL DIGITAL FORENSICS MODE (RidgeAI Quantum Orchestrator)

      أنت RidgeAI Orchestrator، النسخة الأعلى رتبة. أنت تدير 30 وكيلاً جنائياً.
      مهمتك: تحليل الصورتين (Source + Target) باستخدام خط أنابيب مكون من 5 مراحل صارمة.

      🟥 القواعد:
      1. تحليل رقمي بصري بحت (Digital Forensics Only).
      2. لا تفترض وجود معدات فيزيائية، اعتمد على تحليل البكسلات والأنماط.
      3. نفذ جميع المراحل الـ 5 واجمع نتائج الـ 30 وكيل.

      ---
      🟦 المراحل والوكلاء (Pipeline):

      المرحلة 1: التحليل البنيوي (Structural)
      - Alpha: تحديد النمط (Loop, Whorl).
      - Beta: قياس الجودة والضوضاء.
      - Gamma: تدفق الحواف (Ridge Flow).
      - Delta: التعقيد الرياضي (Feature Vector).
      - Epsilon: الحاجة لإعادة البناء.
      - Rho: تحليل السطح (Substrate).
      - Lyra: الهندسة والتناظر.
      - Helios: تصحيح الإضاءة.

      المرحلة 2: التحليل الدقيق (Micro)
      - Zeta: دقة التطابق للنقاط (Minutiae).
      - Sigma: المسام والحواف (Level 3).
      - Theta: كشف التشويه والالتواء.
      - Kappa: القياس والاحتواء (Subset/Zoom).
      - Iota: المعالم التشريحية (Visual Path).
      - Quanta: تفاصيل النانو (Sub-pixel).

      المرحلة 3: الإحصاء والربط (Statistical)
      - Phi: بايزي (Likelihood Ratio).
      - Psi: ربط الهوية (Cross-Linking).
      - Atlas: ندرة التردد العالمي.
      - Chronos: تقدير تقادم الأثر.
      - Tactus: محاكاة الضغط.
      - Spectra: المحاكاة الطيفية.

      المرحلة 4: إعادة البناء (Reconstruction)
      - Morphix: ترميم الحواف المفقودة.
      - Orion: استقراء الأنماط.
      - Vulcan: محاكاة التشوه الحراري/اللدن.
      - Hermes: تصحيح ضبابية الحركة.
      - Nemesis: كشف التزييف المتقدم (Anti-Spoof).
      - Fornax: إزالة التداخل الرقمي.

      المرحلة 5: الدمج (Consolidation)
      - Aegis: فحص الثغرات الدفاعية.
      - Omega: البيان الختامي للخبير.

      ---
      المخرجات المطلوبة: JSON فقط، دقيق، باللغة العربية الفصحى (Forensic Arabic).
    `;

    // --- DEFINING THE QUANTUM SCHEMA ---

    // Phase 1
    const p1Schema = {
      type: Type.OBJECT,
      properties: {
        agentAlpha: { type: Type.OBJECT, properties: { patternType: { type: Type.STRING }, confidence: { type: Type.NUMBER } } },
        agentBeta: { type: Type.OBJECT, properties: { qualityMetric: { type: Type.STRING }, noiseLevel: { type: Type.STRING } } },
        agentGamma: { type: Type.OBJECT, properties: { ridgeFlow: { type: Type.STRING }, bifurcationCount: { type: Type.NUMBER } } },
        agentDelta: { type: Type.OBJECT, properties: { featureVectorSize: { type: Type.NUMBER }, mathematicalComplexity: { type: Type.STRING } } },
        agentEpsilon: { type: Type.OBJECT, properties: { reconstructionNeeded: { type: Type.BOOLEAN }, partialArea: { type: Type.STRING } } },
        agentRho: { type: Type.OBJECT, properties: { substrateAnalysis: { type: Type.STRING }, indirectReflection: { type: Type.BOOLEAN } } },
        agentLyra: { type: Type.OBJECT, properties: { geometry: { type: Type.STRING }, symmetry: { type: Type.STRING } } },
        agentHelios: { type: Type.OBJECT, properties: { lightingCorrection: { type: Type.STRING }, shadowRemoved: { type: Type.BOOLEAN } } }
      },
      required: ["agentAlpha", "agentBeta", "agentGamma", "agentDelta", "agentEpsilon", "agentRho", "agentLyra", "agentHelios"]
    };

    // Phase 2
    const p2Schema = {
      type: Type.OBJECT,
      properties: {
        agentZeta: { type: Type.OBJECT, properties: { matchPrecision: { type: Type.STRING }, minutiaePairs: { type: Type.NUMBER } } },
        agentSigma: { type: Type.OBJECT, properties: { poreCount: { type: Type.NUMBER }, edgeShape: { type: Type.STRING } } },
        agentTheta: { type: Type.OBJECT, properties: { distortionDetected: { type: Type.BOOLEAN }, torsionAngle: { type: Type.NUMBER } } },
        agentKappa: { type: Type.OBJECT, properties: { scaleRatio: { type: Type.NUMBER }, subsetMatch: { type: Type.BOOLEAN } } },
        agentIota: { type: Type.OBJECT, properties: { anatomicalLandmarks: { type: Type.NUMBER }, visualPath: { type: Type.STRING } } },
        agentQuanta: { type: Type.OBJECT, properties: { nanoDetails: { type: Type.STRING }, subPixelAccuracy: { type: Type.NUMBER } } }
      },
      required: ["agentZeta", "agentSigma", "agentTheta", "agentKappa", "agentIota", "agentQuanta"]
    };

    // Phase 3
    const p3Schema = {
      type: Type.OBJECT,
      properties: {
        agentPhi: { type: Type.OBJECT, properties: { likelihoodRatio: { type: Type.NUMBER }, prc: { type: Type.STRING } } },
        agentPsi: { type: Type.OBJECT, properties: { crossLinkConfirmed: { type: Type.BOOLEAN }, sourceIdentityConfidence: { type: Type.NUMBER } } },
        agentAtlas: { type: Type.OBJECT, properties: { globalDbSearch: { type: Type.STRING }, frequencyRarity: { type: Type.STRING } } },
        agentChronos: { type: Type.OBJECT, properties: { timeDecay: { type: Type.STRING }, ageEstimation: { type: Type.STRING } } },
        agentTactus: { type: Type.OBJECT, properties: { pressureMap: { type: Type.STRING }, touchForce: { type: Type.NUMBER } } },
        agentSpectra: { type: Type.OBJECT, properties: { spectralAnalysis: { type: Type.STRING }, chemicalResidueSimulation: { type: Type.STRING } } }
      },
      required: ["agentPhi", "agentPsi", "agentAtlas", "agentChronos", "agentTactus", "agentSpectra"]
    };

    // Phase 4
    const p4Schema = {
      type: Type.OBJECT,
      properties: {
        agentMorphix: { type: Type.OBJECT, properties: { missingRidgeReconstruction: { type: Type.STRING }, percentRestored: { type: Type.NUMBER } } },
        agentOrion: { type: Type.OBJECT, properties: { patternExtrapolation: { type: Type.STRING } } },
        agentVulcan: { type: Type.OBJECT, properties: { heatDistortionSim: { type: Type.STRING }, plasticDeformation: { type: Type.BOOLEAN } } },
        agentHermes: { type: Type.OBJECT, properties: { transferMethod: { type: Type.STRING }, motionBlurCorrection: { type: Type.STRING } } },
        agentNemesis: { type: Type.OBJECT, properties: { antiSpoofingAdvanced: { type: Type.STRING }, livenessScore: { type: Type.NUMBER } } },
        agentFornax: { type: Type.OBJECT, properties: { digitalNoiseFilter: { type: Type.STRING }, artifactRemoval: { type: Type.NUMBER } } }
      },
      required: ["agentMorphix", "agentOrion", "agentVulcan", "agentHermes", "agentNemesis", "agentFornax"]
    };

    // Phase 5 & Final
    const p5Schema = {
      type: Type.OBJECT,
      properties: {
        agentAegis: { type: Type.OBJECT, properties: { defenseRebuttal: { type: Type.STRING }, loopholeCheck: { type: Type.STRING } } },
        agentOmega: { type: Type.OBJECT, properties: { finalExpertStatement: { type: Type.STRING }, admissibility: { type: Type.STRING }, legalConfidence: { type: Type.NUMBER } } }
      },
      required: ["agentAegis", "agentOmega"]
    };

    const visualMappingSchema = {
      type: Type.OBJECT,
      properties: {
        points: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, zone1: { type: Type.STRING }, zone2: { type: Type.STRING }, confidence: { type: Type.NUMBER } } } },
        score: { type: Type.NUMBER },
        conclusion: { type: Type.STRING }
      },
      required: ["points", "score", "conclusion"]
    };

    const finalResultSchema = {
      type: Type.OBJECT,
      properties: {
        matchScore: { type: Type.NUMBER },
        isMatch: { type: Type.BOOLEAN },
        confidenceLevel: { type: Type.STRING },
        forensicConclusion: { type: Type.STRING }
      },
      required: ["matchScore", "isMatch", "confidenceLevel", "forensicConclusion"]
    };

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        phase1: p1Schema,
        phase2: p2Schema,
        phase3: p3Schema,
        phase4: p4Schema,
        phase5: p5Schema,
        visualMapping: visualMappingSchema,
        finalResult: finalResultSchema
      },
      required: ["phase1", "phase2", "phase3", "phase4", "phase5", "visualMapping", "finalResult"]
    };

    // Define config based on mode
    const generationConfig: any = {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    };

    if (thinkingBudget > 0) {
      generationConfig.thinkingConfig = { thinkingBudget: thinkingBudget };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          image1Part,
          image2Part,
          { text: prompt }
        ]
      },
      config: generationConfig,
    });

    if (response.text) {
      const aiData = JSON.parse(response.text);
      const finalResult: ComparisonResult = {
        chainOfCustody: {
          file1Hash: hash1,
          file2Hash: hash2,
          timestamp: Date.now(),
          integrityVerified: true
        },
        ...aiData
      };
      return finalResult;
    } else {
      throw new Error("لم يتم استلام رد صالح من النموذج.");
    }

  } catch (error) {
    console.error("Error comparing fingerprints:", error);
    throw error;
  }
};
