
import { ComparisonResult } from "../types";
import { getOpenRouterKey } from "./db";

// Helper: SHA-256 for Chain of Custody
const calculateSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Helper: Convert File to Base64 (without data: prefix for some APIs, but OpenRouter usually takes full data URI or URL)
// We will use standard data URI for OpenRouter message content
const fileToDataURL = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const compareFingerprintsOpenRouter = async (file1: File, file2: File): Promise<ComparisonResult> => {
  try {
    const apiKey = await getOpenRouterKey();
    if (!apiKey) {
      throw new Error("مفتاح OpenRouter غير موجود. يرجى إضافته من قائمة الإعدادات.");
    }

    const hash1 = await calculateSHA256(file1);
    const hash2 = await calculateSHA256(file2);
    
    const image1DataUrl = await fileToDataURL(file1);
    const image2DataUrl = await fileToDataURL(file2);

    const systemPrompt = `
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
      
      IMPORTANT: You must output ONLY valid JSON. No markdown, no conversational text.
    `;

    // A sample JSON structure to guide the model, since we can't use strict schemas like Gemini easily across all OR models
    const jsonStructureExample = {
      phase1: {
        agentAlpha: { patternType: "String", confidence: 0 },
        agentBeta: { qualityMetric: "String", noiseLevel: "String" },
        agentGamma: { ridgeFlow: "String", bifurcationCount: 0 },
        agentDelta: { featureVectorSize: 0, mathematicalComplexity: "String" },
        agentEpsilon: { reconstructionNeeded: false, partialArea: "String" },
        agentRho: { substrateAnalysis: "String", indirectReflection: false },
        agentLyra: { geometry: "String", symmetry: "String" },
        agentHelios: { lightingCorrection: "String", shadowRemoved: false }
      },
      phase2: {
        agentZeta: { matchPrecision: "String", minutiaePairs: 0 },
        agentSigma: { poreCount: 0, edgeShape: "String" },
        agentTheta: { distortionDetected: false, torsionAngle: 0 },
        agentKappa: { scaleRatio: 0, subsetMatch: false },
        agentIota: { anatomicalLandmarks: 0, visualPath: "String" },
        agentQuanta: { nanoDetails: "String", subPixelAccuracy: 0 }
      },
      phase3: {
        agentPhi: { likelihoodRatio: 0, prc: "String" },
        agentPsi: { crossLinkConfirmed: false, sourceIdentityConfidence: 0 },
        agentAtlas: { globalDbSearch: "String", frequencyRarity: "String" },
        agentChronos: { timeDecay: "String", ageEstimation: "String" },
        agentTactus: { pressureMap: "String", touchForce: 0 },
        agentSpectra: { spectralAnalysis: "String", chemicalResidueSimulation: "String" }
      },
      phase4: {
        agentMorphix: { missingRidgeReconstruction: "String", percentRestored: 0 },
        agentOrion: { patternExtrapolation: "String" },
        agentVulcan: { heatDistortionSim: "String", plasticDeformation: false },
        agentHermes: { transferMethod: "String", motionBlurCorrection: "String" },
        agentNemesis: { antiSpoofingAdvanced: "String", livenessScore: 0 },
        agentFornax: { digitalNoiseFilter: "String", artifactRemoval: 0 }
      },
      phase5: {
        agentAegis: { defenseRebuttal: "String", loopholeCheck: "String" },
        agentOmega: { finalExpertStatement: "String", admissibility: "High/Medium/Low", legalConfidence: 0 }
      },
      visualMapping: {
        points: [{ label: "String", zone1: "top-left", zone2: "top-right", confidence: 0 }],
        score: 0,
        conclusion: "String"
      },
      finalResult: {
        matchScore: 0,
        isMatch: false,
        confidenceLevel: "High/Medium/Low",
        forensicConclusion: "String"
      }
    };

    const messages = [
      {
        role: "system",
        content: systemPrompt + `\n\nReturn the result in strictly valid JSON format matching this structure:\n${JSON.stringify(jsonStructureExample)}`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze these two fingerprints for a forensic match." },
          { type: "image_url", image_url: { url: image1DataUrl } },
          { type: "image_url", image_url: { url: image2DataUrl } }
        ]
      }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href, // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "RidgeAI Forensic App",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4.1-fast",
        messages: messages,
        response_format: { type: "json_object" } // Force JSON mode if supported
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `OpenRouter Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("لم يتم استلام رد من النموذج (OpenRouter).");
    }

    // Attempt to parse JSON (sometimes models add markdown blocks like ```json ... ```)
    let parsedData;
    try {
      // Clean potential markdown wrappers
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      parsedData = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse OpenRouter JSON", content);
      throw new Error("فشل في تحليل استجابة النموذج (JSON Error).");
    }

    // Merge with Chain of Custody
    const finalResult: ComparisonResult = {
      chainOfCustody: {
        file1Hash: hash1,
        file2Hash: hash2,
        timestamp: Date.now(),
        integrityVerified: true
      },
      ...parsedData
    };

    return finalResult;

  } catch (error) {
    console.error("OpenRouter Comparison Error:", error);
    throw error;
  }
};
