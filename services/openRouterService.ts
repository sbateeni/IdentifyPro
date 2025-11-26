
import { ComparisonResult } from "../types";
import { getOpenRouterKey, saveTokenUsage } from "./db";

const calculateSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

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

      أنت **RidgeAI Quantum Orchestrator**، مشرف فريق من **30 وكيل جنائي متخصص**.
      مهمتك: مطابقة بصمتين (مصدر + هدف) عبر 5 مراحل تحليل متداخلة.

      ⚙️ **قواعد التشغيل الإلزامية**:
      1. **لا تعمل كوكيل واحد**: أنت مشرف ينسق بين 30 وكيل.
      2. **التفاعل الحيوي**: الوكلاء يُرسلون "توجيهات" (Directives) لبعضهم.
      3. **الصرامة**: إذا رفض وكيل Beta الصورة، أوقف التحليل بإنذار.
      4. **Aegis (المحامي)**: يُحقق من كل وكيل للبحث عن الثغرات.
      5. **اللغة**: العربية الفصحى الجنائية.

      🚨 **IMPORTANT INSTRUCTION ON LANGUAGE**:
      All JSON string values (like "High", "Low", "Match") MUST be output in **ARABIC** (e.g., "عالية", "منخفضة", "متطابق"). Do NOT use English for values. Keys must remain in English.

      IMPORTANT: You must output ONLY valid JSON using the structure provided below.
    `;

    // Agent Helper for OpenRouter Example
    const agentEx = { confidence: 0.95, directives: ["لا توجد تنبيهات"], };

    const jsonStructureExample = {
      phase1: {
        agentAlpha: { ...agentEx, patternType: "حلقة" },
        agentBeta: { ...agentEx, qualityMetric: "مقبولة", noiseLevel: "منخفضة" },
        // ... (truncated for brevity, assumes model follows structure)
      },
      // ... minimal example provided to save context tokens for OpenRouter
      finalResult: {
        matchScore: 99,
        isMatch: true,
        confidenceLevel: "High",
        forensicConclusion: "قطعي"
      }
    };

    const messages = [
      {
        role: "system",
        content: systemPrompt + `\n\nReturn the result in strictly valid JSON format matching this structure (Values in Arabic):\n${JSON.stringify(jsonStructureExample)}`
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
        "HTTP-Referer": window.location.href,
        "X-Title": "RidgeAI Forensic App",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4.1-fast",
        messages: messages,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `OpenRouter Error: ${response.status}`);
    }

    const data = await response.json();
    
    // 1. Save Token Usage
    if (data.usage && data.usage.total_tokens) {
      await saveTokenUsage(data.usage.total_tokens);
    }

    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("لم يتم استلام رد من النموذج (OpenRouter).");
    }

    let parsedData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      parsedData = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse OpenRouter JSON", content);
      throw new Error("فشل في تحليل استجابة النموذج (JSON Error).");
    }

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
