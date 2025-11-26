
import { GoogleGenAI } from "@google/genai";
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

    const usePaidMode = await getPaidMode();
    const modelName = usePaidMode ? "gemini-3-pro-preview" : "gemini-2.5-flash";
    const thinkingBudget = usePaidMode ? 32768 : 0; 

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const image1Part = await fileToGenerativePart(file1);
    const image2Part = await fileToGenerativePart(file2);

    const basePrompt = `
      SYSTEM OVERRIDE – TOTAL DIGITAL FORENSICS MODE (RidgeAI Quantum Orchestrator)

      أنت **RidgeAI Quantum Orchestrator**، مشرف فريق من **30 وكيل جنائي متخصص**.
      مهمتك: مطابقة بصمتين (مصدر + هدف) عبر 5 مراحل تحليل متداخلة.

      ⚙️ **قواعد التشغيل الإلزامية**:
      1. **لا تعمل كوكيل واحد**: أنت مشرف ينسق بين 30 وكيل.
      2. **التفاعل الحيوي**: الوكلاء يُرسلون "توجيهات" (Directives) لبعضهم.
      3. **الصرامة**: إذا رفض وكيل Beta الصورة، أوقف التحليل بإنذار.
      4. **Aegis (المحامي)**: يُحقق من كل وكيل للبحث عن الثغرات.
      5. **اللغة**: العربية الفصحى الجنائية.

      🔗 **آلية التفاعل (Workflow)**:

      **المرحلة 1: البنيوي (Structural)**
      - Alpha: تصنيف النمط -> يُرسل corePoint لـ Gamma.
      - Beta: جودة الصورة -> ❗إذا SNR منخفض: أرسل DIRECTIVE:STOP.
      - Gamma: تدفق الحواف.
      - Delta: التحويل الرياضي.
      - Epsilon: منطقة الاهتمام (ROI).
      - Rho: نسيج السطح -> يُرسل نمط الضوضاء لـ Fornax.
      - Lyra: الأبعاد الهندسية.
      - Helios: تصحيح الإضاءة -> يطبق CLAHE.

      **المرحلة 2: التفاصيل الدقيقة (Micro)**
      - Zeta: نقاط التفرع -> يستقبل مناطق التشوه من Gamma.
      - Sigma: المسام (Level 3).
      - Theta: التشويه المرن -> يُرسل توجيهات لـ Vulcan للإصلاح.
      - Kappa: المقاييس -> يتحقق من Lyra.
      - Iota: الرسم التوضيحي.
      - Quanta: تفاصيل تحت البكسل.

      **المرحلة 3: الإحصاء والربط (Statistical)**
      - Phi: بايزي (Likelihood Ratio).
      - Psi: ربط الهوية عبر الوسائط (Cross-Linking).
      - Atlas: ندرة السمة عالميًا.
      - Chronos: عمر البصمة -> يُحذر Psi إذا العمر كبير.
      - Tactus: خريطة الضغط.
      - Spectra: محاكاة المواد (دم/حبر).

      **المرحلة 4: إعادة البناء (Reconstruction)**
      - Morphix: ترميم الحواف.
      - Orion: استقراء الأنماط.
      - Vulcan: التشوه الحراري -> يُصلح ويعيد لـ Zeta.
      - Hermes: ضبابية الحركة.
      - Nemesis: كشف التزييف -> ❗إذا اكتشف زيفًا: DIRECTIVE:ABORT.
      - Fornax: إزالة التداخل.

      **المرحلة 5: الحكم (Consolidation)**
      - Aegis: محامي الدفاع -> يفحص كل وكيل بحثاً عن تناقضات.
      - Omega: الخبير الختامي -> يصدر الحكم فقط بعد موافقة Aegis.

      🚨 **سيناريوهات الطوارئ**:
      - اكتشاف تزييف (Nemesis): يوقف الوكلاء ويصدر إنذار.
      - انخفاض جودة (Beta): يرفض الصورة.

      IMPORTANT: You must output ONLY valid JSON.
      STRICTLY FOLLOW THIS JSON STRUCTURE EXAMPLE:
    `;

    // Define the expected structure as an example object to guide the model
    // This avoids the "Constraint is too tall" error from strict Schema validation
    const agentEx = { confidence: 0.95, directives: ["No alerts"] };
    const jsonStructureExample = {
      phase1: {
        agentAlpha: { ...agentEx, patternType: "Loop" },
        agentBeta: { ...agentEx, qualityMetric: "Accepted", noiseLevel: "Low" },
        agentGamma: { ...agentEx, ridgeFlow: "Normal", bifurcationCount: 15 },
        agentDelta: { ...agentEx, featureVectorSize: 512, mathematicalComplexity: "High" },
        agentEpsilon: { ...agentEx, reconstructionNeeded: false, partialArea: "None" },
        agentRho: { ...agentEx, substrateAnalysis: "Paper", indirectReflection: false },
        agentLyra: { ...agentEx, geometry: "Normal", symmetry: "High" },
        agentHelios: { ...agentEx, lightingCorrection: "Applied", shadowRemoved: true }
      },
      phase2: {
        agentZeta: { ...agentEx, matchPrecision: "High", minutiaePairs: 20 },
        agentSigma: { ...agentEx, poreCount: 50, edgeShape: "Smooth" },
        agentTheta: { ...agentEx, distortionDetected: false, torsionAngle: 0 },
        agentKappa: { ...agentEx, scaleRatio: 1.0, subsetMatch: true },
        agentIota: { ...agentEx, anatomicalLandmarks: 10, visualPath: "Clear" },
        agentQuanta: { ...agentEx, nanoDetails: "Verified", subPixelAccuracy: 95 }
      },
      phase3: {
        agentPhi: { ...agentEx, likelihoodRatio: 1000, prc: "High" },
        agentPsi: { ...agentEx, crossLinkConfirmed: true, sourceIdentityConfidence: 99 },
        agentAtlas: { ...agentEx, globalDbSearch: "Done", frequencyRarity: "Rare" },
        agentChronos: { ...agentEx, timeDecay: "None", ageEstimation: "Recent" },
        agentTactus: { ...agentEx, pressureMap: "Even", touchForce: 5 },
        agentSpectra: { ...agentEx, spectralAnalysis: "Ink", chemicalResidueSimulation: "None" }
      },
      phase4: {
        agentMorphix: { ...agentEx, missingRidgeReconstruction: "None", percentRestored: 0 },
        agentOrion: { ...agentEx, patternExtrapolation: "Complete" },
        agentVulcan: { ...agentEx, heatDistortionSim: "None", plasticDeformation: false },
        agentHermes: { ...agentEx, transferMethod: "Direct", motionBlurCorrection: "None" },
        agentNemesis: { ...agentEx, antiSpoofingAdvanced: "Live", livenessScore: 99 },
        agentFornax: { ...agentEx, digitalNoiseFilter: "Applied", artifactRemoval: 0 }
      },
      phase5: {
        agentAegis: { ...agentEx, defenseRebuttal: "No loopholes", loopholeCheck: "Pass" },
        agentOmega: { ...agentEx, finalExpertStatement: "Match", admissibility: "High", legalConfidence: 99 }
      },
      visualMapping: {
        points: [{ label: "Core", zone1: "center", zone2: "center", confidence: 0.99 }],
        score: 100,
        conclusion: "Perfect Match"
      },
      finalResult: {
        matchScore: 99,
        isMatch: true,
        confidenceLevel: "High",
        forensicConclusion: "Conclusive"
      }
    };

    const finalPrompt = `${basePrompt}\n${JSON.stringify(jsonStructureExample, null, 2)}`;

    const generationConfig: any = {
      responseMimeType: "application/json",
      // responseSchema REMOVED to avoid "Constraint is too tall" error
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
          { text: finalPrompt }
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
