
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparisonResult } from "../types";
import { getApiKey } from "./db";

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
    // Retrieve API Key from IndexedDB
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error("مفتاح API غير موجود. يرجى إضافته من قائمة الإعدادات.");
    }

    // Initialize client with the retrieved key
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const image1Part = await fileToGenerativePart(file1);
    const image2Part = await fileToGenerativePart(file2);

    const prompt = `
      أنت نظام ذكاء اصطناعي متقدم لتحليل الأدلة الجنائية. مهمتك هي محاكاة فريق من ثلاثة وكلاء (Agents) متخصصين لفحص ومقارنة بصمتي أصابع بدقة متناهية.

      الوكيل الأول (Agent Alpha): خبير استخراج الميزات. مهمته تحليل الصورة الأولى فقط واستخراج نمط البصمة (Loop, Whorl, Arch)، جودة الحواف، وتقدير عدد النقاط الدقيقة (Minutiae)، وأي علامات مميزة.
      الوكيل الثاني (Agent Beta): خبير استخراج الميزات. يقوم بنفس المهمة للصورة الثانية بشكل مستقل.
      الوكيل الثالث (Agent Gamma): كبير الفاحصين. يقوم بمقارنة تقارير الوكيلين الأول والثاني. يبحث عن التطابق في النوع العام، ويحاول مطابقة النقاط الدقيقة، ويحدد الاختلافات الجوهرية.

      يجب أن تكون النتيجة دقيقة جداً ومفصلة.
      
      قم بإرجاع تقرير JSON منظم يمثل مخرجات هذا الفريق.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        agent1Analysis: {
          type: Type.OBJECT,
          description: "تحليل الوكيل الأول للبصمة الأولى",
          properties: {
            patternType: { type: Type.STRING, description: "نوع النمط (قوس، حلقة، دوامة)" },
            ridgeQuality: { type: Type.STRING, enum: ["ممتازة", "جيدة", "ضعيفة", "غير واضحة"] },
            estimatedMinutiaeCount: { type: Type.INTEGER },
            distinctiveFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            imperfections: { type: Type.ARRAY, items: { type: Type.STRING }, description: "العيوب مثل الندوب أو الضوضاء" }
          },
          required: ["patternType", "ridgeQuality", "estimatedMinutiaeCount", "distinctiveFeatures", "imperfections"]
        },
        agent2Analysis: {
          type: Type.OBJECT,
          description: "تحليل الوكيل الثاني للبصمة الثانية",
          properties: {
            patternType: { type: Type.STRING },
            ridgeQuality: { type: Type.STRING, enum: ["ممتازة", "جيدة", "ضعيفة", "غير واضحة"] },
            estimatedMinutiaeCount: { type: Type.INTEGER },
            distinctiveFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            imperfections: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["patternType", "ridgeQuality", "estimatedMinutiaeCount", "distinctiveFeatures", "imperfections"]
        },
        comparisonAgent: {
          type: Type.OBJECT,
          description: "مقارنة الوكيل الثالث",
          properties: {
            patternMatch: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              },
              required: ["score", "explanation"]
            },
            minutiaeMatch: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                commonPointsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
                differencesFound: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["score", "commonPointsFound", "differencesFound"]
            }
          },
          required: ["patternMatch", "minutiaeMatch"]
        },
        finalResult: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER, description: "النتيجة النهائية 0-100" },
            isMatch: { type: Type.BOOLEAN },
            confidenceLevel: { type: Type.STRING, enum: ["عالية", "متوسطة", "منخفضة"] },
            forensicConclusion: { type: Type.STRING, description: "الخلاصة الجنائية الشاملة" }
          },
          required: ["matchScore", "isMatch", "confidenceLevel", "forensicConclusion"]
        }
      },
      required: ["agent1Analysis", "agent2Analysis", "comparisonAgent", "finalResult"]
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
        thinkingConfig: { thinkingBudget: 2048 } 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ComparisonResult;
    } else {
      throw new Error("لم يتم استلام رد صالح من النموذج.");
    }

  } catch (error) {
    console.error("Error comparing fingerprints:", error);
    throw error;
  }
};
