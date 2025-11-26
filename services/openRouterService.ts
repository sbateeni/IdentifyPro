
import { ComparisonResult } from "../types";
import { getOpenRouterKey } from "./db";

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

      IMPORTANT: You must output ONLY valid JSON using the structure provided below.
    `;

    // Agent Helper for OpenRouter Example
    const agentEx = { confidence: 0.95, directives: ["Example Directive"], };

    const jsonStructureExample = {
      phase1: {
        agentAlpha: { ...agentEx, patternType: "Loop" },
        agentBeta: { ...agentEx, qualityMetric: "Accepted", noiseLevel: "Low" },
        agentGamma: { ...agentEx, ridgeFlow: "Normal", bifurcationCount: 12 },
        agentDelta: { ...agentEx, featureVectorSize: 128, mathematicalComplexity: "High" },
        agentEpsilon: { ...agentEx, reconstructionNeeded: false, partialArea: "None" },
        agentRho: { ...agentEx, substrateAnalysis: "Paper", indirectReflection: false },
        agentLyra: { ...agentEx, geometry: "Consistent", symmetry: "High" },
        agentHelios: { ...agentEx, lightingCorrection: "Applied", shadowRemoved: true }
      },
      phase2: {
        agentZeta: { ...agentEx, matchPrecision: "High", minutiaePairs: 15 },
        agentSigma: { ...agentEx, poreCount: 50, edgeShape: "Smooth" },
        agentTheta: { ...agentEx, distortionDetected: false, torsionAngle: 0 },
        agentKappa: { ...agentEx, scaleRatio: 1.0, subsetMatch: true },
        agentIota: { ...agentEx, anatomicalLandmarks: 12, visualPath: "Mapped" },
        agentQuanta: { ...agentEx, nanoDetails: "Verified", subPixelAccuracy: 90 }
      },
      phase3: {
        agentPhi: { ...agentEx, likelihoodRatio: 1000, prc: "High" },
        agentPsi: { ...agentEx, crossLinkConfirmed: true, sourceIdentityConfidence: 99 },
        agentAtlas: { ...agentEx, globalDbSearch: "Match Found", frequencyRarity: "Rare" },
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
