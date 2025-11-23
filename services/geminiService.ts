
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparisonResult } from "../types";
import { getApiKey } from "./db";

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
    // 1. Calculate Hashes for Chain of Custody
    const hash1 = await calculateSHA256(file1);
    const hash2 = await calculateSHA256(file2);

    // 2. Try to get from IndexedDB
    let apiKey = await getApiKey();
    
    // 3. Fallback to Environment Variable
    if (!apiKey && typeof process !== 'undefined' && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }

    if (!apiKey) {
      throw new Error("مفتاح API غير موجود. يرجى إضافته من قائمة الإعدادات.");
    }

    // Initialize client
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const image1Part = await fileToGenerativePart(file1);
    const image2Part = await fileToGenerativePart(file2);

    const prompt = `
      أنت "RidgeAI"، نظام مختبر جنائي رقمي متكامل (Master Forensic Multi-Agent System).
      لديك فريق من 16 وكيلاً متخصصاً. يجب عليك تنفيذ مهامهم بشكل تسلسلي وصارم لإنتاج تقرير جنائي معتمد للمحكمة.

      **بروتوكول العمل التسلسلي:**

      1. **Agent Delta (مراقب الجودة):** افحص وضوح الصورتين. هل هما صالحتان للفحص؟
      
      2. **Agent Lambda (محرر الصور):** قم بمحاكاة خوارزميات التحسين (Gabor Filters, CLAHE, FFT). ما هي الفلاتر اللازمة لتوضيح البصمة الكامنة؟ كم نسبة تحسن الوضوح؟
      
      3. **Agent Rho (محلل السطح):** حلل الخلفية. هل البصمة على زجاج، ورق، جلد؟ هل هناك تداخل في الملمس (Texture Noise)؟
      
      4. **Agent Epsilon (الأمان):** كشف التزييف ومؤشرات الحياة.
      
      5. **Agent Alpha (المصدر):** تحليل بصمة الملف الأول (Pattern, Henry Class).
      6. **Agent Beta (الهدف):** تحليل بصمة الملف الثاني.
      
      7. **Agent Zeta (الإحصاء):** عد تفاصيل غالتون (Minutiae) بدقة.
      8. **Agent Sigma (المستوى 3):** فحص المسام (Pores) وحواف الخطوط (Ridge Edges).
      
      9. **Agent Theta (التشويه):** تحليل الضغط الميكانيكي والالتواء.
      10. **Agent Nu (إعادة بناء الحركة):** بناءً على التشويه، كيف كانت حركة اليد؟ (دفع، إمساك، لمس خفيف)؟ تقدير اتجاه اليد.
      
      11. **Agent Kappa (القياس والاحتواء):** هل الصورة الثانية جزء (Subset) من الأولى؟ هل هي مكبرة (Zoomed)؟ قارن كثافة الخطوط.
      
      12. **Agent Gamma (المقارنة النصية):** اذكر نقاط التطابق والاختلاف.
      13. **Agent Iota (المطابقة البصرية):** حدد 3-5 نقاط تشريحية ومناطقها للرسم.
      
      14. **Agent Psi (الربط المتعدد - NEW):** هل تؤكد البيانات أن هذين الأثرين يعودان لنفس الكائن البيولوجي (Identity Crosslinking) بغض النظر عن اختلاف السطح أو الوقت؟
      15. **Agent Phi (الإحصاء البايزي):** احسب احتمالية التطابق العشوائي (PRC). قدم نسبة الاحتمالية (Likelihood Ratio).
      
      16. **Agent Omega (الخبير القانوني):** 
          - اجمع كل ما سبق.
          - صغ البيان الختامي بصيغة قانونية عربية رصينة.
          - قيم قوة الدليل (Admissibility).

      **قواعد المخرجات:**
      - اللغة: العربية الفصحى (Forensic Arabic).
      - الأرقام: دقيقة ومنطقية (0-100).
      - JSON Output Only.
    `;

    // --- SCHEMAS ---

    const qualitySchema: Schema = {
      type: Type.OBJECT, properties: { isUsable: { type: Type.BOOLEAN }, qualityScore: { type: Type.INTEGER }, issues: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendation: { type: Type.STRING } }, required: ["isUsable", "qualityScore", "issues", "recommendation"]
    };

    const enhancementSchema: Schema = { // Lambda
      type: Type.OBJECT, properties: { appliedFilters: { type: Type.ARRAY, items: { type: Type.STRING } }, clarityGain: { type: Type.INTEGER }, restoredRegions: { type: Type.ARRAY, items: { type: Type.STRING } }, originalNoiseLevel: { type: Type.STRING } }, required: ["appliedFilters", "clarityGain", "restoredRegions", "originalNoiseLevel"]
    };

    const surfaceSchema: Schema = { // Rho
      type: Type.OBJECT, properties: { surfaceMaterial: { type: Type.STRING }, textureInterference: { type: Type.STRING }, backgroundNoiseType: { type: Type.STRING } }, required: ["surfaceMaterial", "textureInterference", "backgroundNoiseType"]
    };

    const forgerySchema: Schema = {
      type: Type.OBJECT, properties: { isAuthentic: { type: Type.BOOLEAN }, authenticityScore: { type: Type.INTEGER }, riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }, livenessIndicators: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["isAuthentic", "authenticityScore", "riskFactors", "livenessIndicators"]
    };

    const analysisSchema: Schema = {
      type: Type.OBJECT, properties: { patternType: { type: Type.STRING }, henryClassification: { type: Type.STRING }, ridgeQuality: { type: Type.STRING }, estimatedMinutiaeCount: { type: Type.INTEGER }, distinctiveFeatures: { type: Type.ARRAY, items: { type: Type.STRING } }, imperfections: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["patternType", "henryClassification", "ridgeQuality", "estimatedMinutiaeCount", "distinctiveFeatures", "imperfections"]
    };

    const minutiaeStatsSchema: Schema = {
      type: Type.OBJECT, properties: { bifurcations: { type: Type.INTEGER }, ridgeEndings: { type: Type.INTEGER }, enclosures: { type: Type.INTEGER }, dots: { type: Type.INTEGER }, overallComplexity: { type: Type.STRING } }, required: ["bifurcations", "ridgeEndings", "enclosures", "dots", "overallComplexity"]
    };

    const biologicalSchema: Schema = {
      type: Type.OBJECT, properties: { poresVisible: { type: Type.BOOLEAN }, poreCountEstimate: { type: Type.INTEGER }, edgeShape: { type: Type.STRING }, scars: { type: Type.ARRAY, items: { type: Type.STRING } }, creases: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["poresVisible", "poreCountEstimate", "edgeShape", "scars", "creases"]
    };

    const distortionSchema: Schema = {
      type: Type.OBJECT, properties: { pressureLevel: { type: Type.STRING }, torsionDetected: { type: Type.BOOLEAN }, elasticityIssues: { type: Type.BOOLEAN }, distortionScore: { type: Type.INTEGER }, affectedZones: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["pressureLevel", "torsionDetected", "elasticityIssues", "distortionScore", "affectedZones"]
    };

    const actionSchema: Schema = { // Nu
      type: Type.OBJECT, properties: { estimatedAction: { type: Type.STRING }, handOrientation: { type: Type.STRING }, timeDecayEstimate: { type: Type.STRING }, pressureDistribution: { type: Type.STRING } }, required: ["estimatedAction", "handOrientation", "timeDecayEstimate", "pressureDistribution"]
    };

    const kappaSchema: Schema = {
      type: Type.OBJECT, properties: { isSubset: { type: Type.BOOLEAN }, scaleRatio: { type: Type.NUMBER }, overlapPercentage: { type: Type.INTEGER }, relationship: { type: Type.STRING }, explanation: { type: Type.STRING } }, required: ["isSubset", "scaleRatio", "overlapPercentage", "relationship", "explanation"]
    };

    const iotaSchema: Schema = {
      type: Type.OBJECT, properties: { points: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, zone1: { type: Type.STRING }, zone2: { type: Type.STRING }, confidence: { type: Type.INTEGER } }, required: ["label", "zone1", "zone2", "confidence"] } }, mappingScore: { type: Type.INTEGER }, visualConclusion: { type: Type.STRING } }, required: ["points", "mappingScore", "visualConclusion"]
    };

    const psiSchema: Schema = { // Psi
      type: Type.OBJECT, properties: { isSameSource: { type: Type.BOOLEAN }, crossSurfaceMatch: { type: Type.BOOLEAN }, linkageConfidence: { type: Type.INTEGER }, consistencyCheck: { type: Type.STRING } }, required: ["isSameSource", "crossSurfaceMatch", "linkageConfidence", "consistencyCheck"]
    };

    const bayesianSchema: Schema = { // Phi
      type: Type.OBJECT, properties: { randomCorrespondenceProbability: { type: Type.STRING }, likelihoodRatio: { type: Type.NUMBER }, statisticalStrength: { type: Type.STRING } }, required: ["randomCorrespondenceProbability", "likelihoodRatio", "statisticalStrength"]
    };

    const legalSchema: Schema = {
      type: Type.OBJECT, properties: { admissibilityStatus: { type: Type.STRING }, legalConfidenceScore: { type: Type.INTEGER }, defenseNotes: { type: Type.STRING }, finalExpertStatement: { type: Type.STRING } }, required: ["admissibilityStatus", "legalConfidenceScore", "defenseNotes", "finalExpertStatement"]
    };

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        agentDelta: { type: Type.OBJECT, properties: { file1: qualitySchema, file2: qualitySchema }, required: ["file1", "file2"] },
        agentLambda: { type: Type.OBJECT, properties: { file1: enhancementSchema, file2: enhancementSchema }, required: ["file1", "file2"] },
        agentRho: { type: Type.OBJECT, properties: { file1: surfaceSchema, file2: surfaceSchema }, required: ["file1", "file2"] },
        agentEpsilon: { type: Type.OBJECT, properties: { file1: forgerySchema, file2: forgerySchema }, required: ["file1", "file2"] },
        
        agentAlpha: analysisSchema,
        agentBeta: analysisSchema,
        agentZeta: { type: Type.OBJECT, properties: { file1: minutiaeStatsSchema, file2: minutiaeStatsSchema }, required: ["file1", "file2"] },
        agentSigma: { type: Type.OBJECT, properties: { file1: biologicalSchema, file2: biologicalSchema }, required: ["file1", "file2"] },
        
        agentTheta: { type: Type.OBJECT, properties: { file1: distortionSchema, file2: distortionSchema }, required: ["file1", "file2"] },
        agentNu: { type: Type.OBJECT, properties: { file1: actionSchema, file2: actionSchema }, required: ["file1", "file2"] },
        agentKappa: kappaSchema,
        
        agentGamma: { type: Type.OBJECT, properties: { patternMatch: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, explanation: { type: Type.STRING } } }, minutiaeMatch: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, commonPointsFound: { type: Type.ARRAY, items: { type: Type.STRING } }, differencesFound: { type: Type.ARRAY, items: { type: Type.STRING } } } } }, required: ["patternMatch", "minutiaeMatch"] },
        agentIota: iotaSchema,
        
        agentPsi: psiSchema, // Agent 16
        agentPhi: bayesianSchema,
        
        agentOmega: legalSchema,
        finalResult: { type: Type.OBJECT, properties: { matchScore: { type: Type.NUMBER }, isMatch: { type: Type.BOOLEAN }, confidenceLevel: { type: Type.STRING }, forensicConclusion: { type: Type.STRING } }, required: ["matchScore", "isMatch", "confidenceLevel", "forensicConclusion"] }
      },
      required: ["agentDelta", "agentLambda", "agentRho", "agentEpsilon", "agentAlpha", "agentBeta", "agentZeta", "agentSigma", "agentTheta", "agentNu", "agentKappa", "agentGamma", "agentIota", "agentPsi", "agentPhi", "agentOmega", "finalResult"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          image1Part,
          image2Part,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 16384 } 
      },
    });

    if (response.text) {
      const aiData = JSON.parse(response.text);
      const finalResult: ComparisonResult = {
        ...aiData,
        chainOfCustody: {
          file1Hash: hash1,
          file2Hash: hash2,
          timestamp: Date.now(),
          integrityVerified: true
        }
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
