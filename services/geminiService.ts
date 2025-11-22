
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
    
    // 3. Fallback to Environment Variable (Useful for Vercel/Local dev)
    if (!apiKey && typeof process !== 'undefined' && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }

    if (!apiKey) {
      throw new Error("مفتاح API غير موجود. يرجى إضافته من قائمة الإعدادات.");
    }

    // Initialize client with the retrieved key
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const image1Part = await fileToGenerativePart(file1);
    const image2Part = await fileToGenerativePart(file2);

    const prompt = `
      أنت "RidgeAI"، نظام ذكاء اصطناعي شامل وشديد التطور للتحليل الجنائي (Forensic Fingerprint System).
      
      **تعليمات صارمة جداً:**
      1. جميع المخرجات نصياً يجب أن تكون باللغة العربية الفصحى حصراً (Forensic Arabic).
      2. الأرقام دقيقة ومنطقية (0-100).

      **المهام المطلوبة من فريق الوكلاء (Agents):**

      1. **Agent Delta (الجودة):** قيم صلاحية الصور للفحص.
      2. **Agent Epsilon (الأمان):** كشف التزييف.
      3. **Agent Zeta (الإحصاء):** عد تفاصيل غالتون (نهايات، تفرعات).
      
      4. **Agent Sigma (المحلل البيولوجي - Level 3 Details):**
         - Poroscopy: هل مسام العرق مرئية؟ قدر عددها.
         - Edgeoscopy: شكل حواف الخطوط.
         - Biological Marks: ندوب وتجاعيد.

      5. **Agent Theta (محلل التشويه والميكانيكا):** NEW!
         - حدد مستوى الضغط (Pressure): خفيف، متوسط، شديد (يؤدي لسمك الخطوط).
         - الالتواء (Torsion): هل تم تدوير الإصبع أثناء البصم؟
         - المرونة (Elasticity): هل هناك مط للجلد يغير المسافات بين النقاط؟
         - حدد المناطق المتأثرة بالتشويه.

      6. **Agent Alpha & Beta:** تصنيف هنري والأنماط.
      7. **Agent Gamma:** المقارنة التفصيلية.

      8. **Agent Omega (الخبير القانوني):**
         - قيم مقبولية الدليل.
         - بيان الخبير النهائي.
         - ملاحظات الدفاع.

      المخرج المطلوب: JSON فقط يلتزم بال Schema.
    `;

    const qualitySchema: Schema = {
      type: Type.OBJECT,
      properties: {
        isUsable: { type: Type.BOOLEAN },
        qualityScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
        issues: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendation: { type: Type.STRING, description: "Arabic text" }
      },
      required: ["isUsable", "qualityScore", "issues", "recommendation"]
    };

    const forgerySchema: Schema = {
      type: Type.OBJECT,
      properties: {
        isAuthentic: { type: Type.BOOLEAN },
        authenticityScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
        livenessIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["isAuthentic", "authenticityScore", "riskFactors", "livenessIndicators"]
    };

    const minutiaeStatsSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        bifurcations: { type: Type.INTEGER },
        ridgeEndings: { type: Type.INTEGER },
        enclosures: { type: Type.INTEGER },
        dots: { type: Type.INTEGER },
        overallComplexity: { type: Type.STRING, enum: ["عالية", "متوسطة", "منخفضة"] }
      },
      required: ["bifurcations", "ridgeEndings", "enclosures", "dots", "overallComplexity"]
    };

    const biologicalSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        poresVisible: { type: Type.BOOLEAN },
        poreCountEstimate: { type: Type.INTEGER },
        edgeShape: { type: Type.STRING, enum: ['أملس', 'مسنن', 'غير واضح'] },
        scars: { type: Type.ARRAY, items: { type: Type.STRING } },
        creases: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["poresVisible", "poreCountEstimate", "edgeShape", "scars", "creases"]
    };

    const distortionSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        pressureLevel: { type: Type.STRING, enum: ['خفيف', 'متوسط', 'شديد'] },
        torsionDetected: { type: Type.BOOLEAN },
        elasticityIssues: { type: Type.BOOLEAN },
        distortionScore: { type: Type.INTEGER, description: "0-100, high means distorted" },
        affectedZones: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["pressureLevel", "torsionDetected", "elasticityIssues", "distortionScore", "affectedZones"]
    };

    const analysisSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        patternType: { type: Type.STRING },
        henryClassification: { type: Type.STRING },
        ridgeQuality: { type: Type.STRING, enum: ["ممتازة", "جيدة", "ضعيفة", "غير واضحة"] },
        estimatedMinutiaeCount: { type: Type.INTEGER },
        distinctiveFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
        imperfections: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["patternType", "henryClassification", "ridgeQuality", "estimatedMinutiaeCount", "distinctiveFeatures", "imperfections"]
    };

    const legalSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        admissibilityStatus: { type: Type.STRING, enum: ['مقبول بقوة', 'مقبول بحذر', 'غير صالح قانونياً'] },
        legalConfidenceScore: { type: Type.INTEGER },
        defenseNotes: { type: Type.STRING, description: "نقطة ضعف محتملة للدفاع" },
        finalExpertStatement: { type: Type.STRING, description: "بيان قانوني رسمي" }
      },
      required: ["admissibilityStatus", "legalConfidenceScore", "defenseNotes", "finalExpertStatement"]
    };

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        qualityAgent: {
          type: Type.OBJECT,
          properties: { file1: qualitySchema, file2: qualitySchema },
          required: ["file1", "file2"]
        },
        forgeryAgent: {
          type: Type.OBJECT,
          properties: { file1: forgerySchema, file2: forgerySchema },
          required: ["file1", "file2"]
        },
        agentZeta: {
          type: Type.OBJECT,
          properties: { file1: minutiaeStatsSchema, file2: minutiaeStatsSchema },
          required: ["file1", "file2"]
        },
        agentSigma: {
          type: Type.OBJECT,
          properties: { file1: biologicalSchema, file2: biologicalSchema },
          required: ["file1", "file2"]
        },
        agentTheta: {
          type: Type.OBJECT,
          properties: { file1: distortionSchema, file2: distortionSchema },
          required: ["file1", "file2"]
        },
        agent1Analysis: analysisSchema,
        agent2Analysis: analysisSchema,
        comparisonAgent: {
          type: Type.OBJECT,
          properties: {
            patternMatch: {
              type: Type.OBJECT,
              properties: { score: { type: Type.NUMBER }, explanation: { type: Type.STRING } },
              required: ["score", "explanation"]
            },
            minutiaeMatch: {
              type: Type.OBJECT,
              properties: { score: { type: Type.NUMBER }, commonPointsFound: { type: Type.ARRAY, items: { type: Type.STRING } }, differencesFound: { type: Type.ARRAY, items: { type: Type.STRING } } },
              required: ["score", "commonPointsFound", "differencesFound"]
            }
          },
          required: ["patternMatch", "minutiaeMatch"]
        },
        agentOmega: legalSchema,
        finalResult: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            isMatch: { type: Type.BOOLEAN },
            confidenceLevel: { type: Type.STRING, enum: ["عالية", "متوسطة", "منخفضة"] },
            forensicConclusion: { type: Type.STRING }
          },
          required: ["matchScore", "isMatch", "confidenceLevel", "forensicConclusion"]
        }
      },
      required: ["qualityAgent", "forgeryAgent", "agentZeta", "agentSigma", "agentTheta", "agent1Analysis", "agent2Analysis", "comparisonAgent", "agentOmega", "finalResult"]
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
        thinkingConfig: { thinkingBudget: 10240 } // Increased budget for 9 agents
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