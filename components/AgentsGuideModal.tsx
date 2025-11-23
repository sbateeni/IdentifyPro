
import React from 'react';
import { X, Bot, Layers, Microscope, Calculator, Wand2, Gavel, Cpu, Info } from 'lucide-react';

interface AgentsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgentsGuideModal: React.FC<AgentsGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const phases = [
    {
      id: 1,
      title: "Phase 1: التحليل البنيوي (Structural Analysis)",
      description: "المرحلة الأولى: تجهيز البيانات وفهم الهندسة الكلية للبصمة.",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Layers,
      agents: [
        { 
          name: "Alpha", 
          role: "Pattern Classifier", 
          desc: "يقوم بتصنيف البصمة وفق نظام 'هنري' (Henry Classification). يحدد النمط العام (Loop, Whorl, Arch) ويحدد نقاط المركز (Core) والمثلثات (Delta) لتوجيه باقي الوكلاء." 
        },
        { 
          name: "Beta", 
          role: "Quality Control", 
          desc: "يقيس نسبة الإشارة إلى الضوضاء (SNR) والتباين. يحدد ما إذا كانت الصورة صالحة للفحص الجنائي أم أنها مشوشة جداً وتتطلب رفضاً تلقائياً." 
        },
        { 
          name: "Gamma", 
          role: "Ridge Flow Mapper", 
          desc: "يتتبع استمرارية الخطوط (Ridge Continuity) ويحسب اتجاه الحقول المتجهة (Vector Fields) لفهم انسيابية البصمة، مما يساعد في كشف التشوهات الهيكلية." 
        },
        { 
          name: "Delta", 
          role: "Feature Vectorizer", 
          desc: "يحول الصورة البصرية إلى معادلات رياضية ومتجهات رقمية (Feature Vectors) باستخدام خوارزميات Gabor Filtering، مما يجعل البصمة قابلة للمعالجة الرقمية." 
        },
        { 
          name: "Epsilon", 
          role: "Segmentation & ROI", 
          desc: "يقوم بفصل البصمة عن الخلفية (Segmentation)، وتحديد منطقة الاهتمام (ROI) التي تحتوي على المعلومات المفيدة، واستبعاد المناطق الفارغة." 
        },
        { 
          name: "Rho", 
          role: "Substrate Analysis", 
          desc: "يحلل نسيج السطح الذي طبعت عليه البصمة (خشب، زجاج، ورق). يقوم بفصل 'ضوضاء الخلفية' (Background Noise) عن 'أثر البصمة' باستخدام فصل الترددات." 
        },
        { 
          name: "Lyra", 
          role: "Geometric Geometry", 
          desc: "يقيس الأبعاد الهندسية والمسافات الإقليدية (Euclidean Distances) بين النقاط الرئيسية للتأكد من عدم وجود تلاعب في أبعاد الصورة (Aspect Ratio)." 
        },
        { 
          name: "Helios", 
          role: "Illumination Normalizer", 
          desc: "يستخدم خوارزمية CLAHE (Contrast Limited Adaptive Histogram Equalization) لمعالجة مشاكل الإضاءة والظلال، مما يبرز التفاصيل في المناطق المظلمة." 
        }
      ]
    },
    {
      id: 2,
      title: "Phase 2: التحليل الدقيق (Micro & Minutiae)",
      description: "المرحلة الثانية: الغوص في التفاصيل المجهرية (Level 2 & 3).",
      color: "bg-teal-50 text-teal-700 border-teal-200",
      icon: Microscope,
      agents: [
        { 
          name: "Zeta", 
          role: "Minutiae Extractor", 
          desc: "يستخرج تفاصيل 'غالتون' (Galton Details): النهايات (Endings)، التفرعات (Bifurcations)، النقاط (Dots)، والبحيرات (Enclosures). يقوم برسم خريطة مكانية لهذه النقاط." 
        },
        { 
          name: "Sigma", 
          role: "Poroscopy & Edgeoscopy", 
          desc: "محلل المستوى الثالث (Level 3 Details). يدرس أشكال حواف الخطوط (مسننة، ملساء) ومواقع مسام التعرق داخل الخطوط، وهي بصمة فريدة داخل البصمة." 
        },
        { 
          name: "Theta", 
          role: "Elastic Distortion", 
          desc: "يكتشف التشوهات المرنة الناتجة عن حركة الجلد. يستخدم نماذج فيزيائية لتقدير كيف تغير شكل البصمة بسبب الضغط أو الانزلاق ويعوض هذا التشويه." 
        },
        { 
          name: "Kappa", 
          role: "Scale & Subset", 
          desc: "يحلل دقة الطباعة (DPI) ويطابق المقاييس. يحدد بذكاء ما إذا كانت 'الصورة 2' هي جزء مقتطع (Subset) ومكبر من 'الصورة 1' حتى لو اختلفت الأبعاد." 
        },
        { 
          name: "Iota", 
          role: "Visual Mapper", 
          desc: "المسؤول عن إنشاء 'اللوحة التوضيحية'. يختار أهم النقاط المتطابقة ويرسم خطوط الربط البصرية (Visual Connectors) لعرضها على المحقق البشري." 
        },
        { 
          name: "Quanta", 
          role: "Sub-pixel Analysis", 
          desc: "يعمل على مستوى ما دون البكسل (Sub-pixel). يستخدم الاستقراء الرياضي لفحص الحواف التي تقع بين البكسلات في الصور منخفضة الدقة." 
        }
      ]
    },
    {
      id: 3,
      title: "Phase 3: الإحصاء والربط (Statistical)",
      description: "المرحلة الثالثة: التقييم الرياضي لقوة الدليل.",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: Calculator,
      agents: [
        { 
          name: "Phi", 
          role: "Bayesian Evaluator", 
          desc: "يطبق نظرية بايز (Bayesian Theorem) لحساب 'نسبة الترجيح' (Likelihood Ratio). يجيب على السؤال: ما احتمال ظهور هذا التطابق صدفة مقابل كونه من نفس المصدر؟" 
        },
        { 
          name: "Psi", 
          role: "Cross-Modality Linker", 
          desc: "يربط بين أنواع مختلفة من الآثار (مثلاً: بصمة حبرية مقابل بصمة كامنة). يتأكد من أن الخصائص البيومترية متسقة عبر وسائط مختلفة." 
        },
        { 
          name: "Atlas", 
          role: "Rarity Estimator", 
          desc: "يحاكي البحث في قواعد بيانات عالمية لتقدير 'الندرة'. هل الميزة المكتشفة شائعة (مثل Loop) أم نادرة جداً (مثل Triple Bifurcation)؟ كلما زادت الندرة زادت قوة الدليل." 
        },
        { 
          name: "Chronos", 
          role: "Temporal Analyst", 
          desc: "يحاول تقدير عمر الأثر. يدرس علامات التلاشي (Fading) والأكسدة الافتراضية للخطوط لتقدير ما إذا كانت البصمة حديثة أم قديمة." 
        },
        { 
          name: "Tactus", 
          role: "Pressure Topography", 
          desc: "يبني خريطة ثلاثية الأبعاد (3D Map) افتراضية بناءً على عرض الخطوط وكثافتها، لمحاكاة توزيع ضغط الإصبع لحظة اللمس." 
        },
        { 
          name: "Spectra", 
          role: "Chemical Simulator", 
          desc: "محاكاة طيفية للمكونات. يحاول استنتاج نوع المادة المكونة للبصمة (زيوت طبيعية، دم، حبر) بناءً على سلوك البكسلات وتفاعلها مع الضوء." 
        }
      ]
    },
    {
      id: 4,
      title: "Phase 4: إعادة البناء (Reconstruction)",
      description: "المرحلة الرابعة: الترميم الذكي ومكافحة التزييف.",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Wand2,
      agents: [
        { 
          name: "Morphix", 
          role: "Inpainting AI", 
          desc: "يستخدم نماذج التوليد (Generative Fill) لترميم الفجوات الصغيرة في الخطوط المتقطعة، بناءً على التدفق المحيط، لاستعادة الشكل الأصلي." 
        },
        { 
          name: "Orion", 
          role: "Pattern Extrapolator", 
          desc: "يستقرئ النمط خارج الحدود المرئية. إذا كانت البصمة جزئية، يتوقع Orion شكل باقي البصمة للمساعدة في توجيه البحث." 
        },
        { 
          name: "Vulcan", 
          role: "Thermal & Plastic Sim", 
          desc: "يحاكي تأثير الحرارة أو الأسطح اللدنة (مثل الشمع). يستطيع عكس تأثير ذوبان أو تمدد الخطوط لاستعادة الشكل الهندسي الأصلي." 
        },
        { 
          name: "Hermes", 
          role: "Motion Deblur", 
          desc: "يستخدم خوارزميات 'Wiener Deconvolution' لإزالة ضبابية الحركة (Motion Blur) الناتجة عن اهتزاز يد المشتبه به أو الكاميرا." 
        },
        { 
          name: "Nemesis", 
          role: "Liveness Detection", 
          desc: "مكافحة الاحتيال (Anti-Spoofing). يحلل النسيج المجهري لكشف محاولات التزييف باستخدام صور مطبوعة، أصابع سيليكون، أو جيلاتين." 
        },
        { 
          name: "Fornax", 
          role: "FFT Denoising", 
          desc: "يستخدم تحويل فورييه السريع (FFT) لإزالة الأنماط المتكررة الدورية (مثل بكسلات الشاشات أو نسيج الورق المنتظم) التي تشوش على البصمة." 
        }
      ]
    },
    {
      id: 5,
      title: "Phase 5: الدمج النهائي (Consolidation)",
      description: "المرحلة الخامسة والأخيرة: الحكم القانوني.",
      color: "bg-slate-100 text-slate-800 border-slate-300",
      icon: Gavel,
      agents: [
        { 
          name: "Aegis", 
          role: "Devil's Advocate", 
          desc: "يلعب دور 'محامي الدفاع'. يبحث بنشاط عن أي ثغرة، تناقض، أو ضعف في الأدلة التي جمعها الوكلاء السابقون لمحاولة دحض التطابق." 
        },
        { 
          name: "Omega", 
          role: "Expert Witness", 
          desc: "العقل المدبر النهائي. يجمع مخرجات الـ 29 وكيلاً، يوازن بين الأدلة الإيجابية والسلبية، ويصيغ التقرير النهائي بلغة قانونية معيارية مقبولة في المحاكم." 
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">دليل الوكلاء الذكية</h3>
              <p className="text-xs text-slate-500 font-medium">RidgeAI Quantum Orchestrator Architecture • 30 Specialized Agents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-10">
          
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                كيف يعمل العقل الرقمي؟
              </h4>
              <p className="text-sm text-indigo-100 leading-relaxed max-w-4xl">
                يعمل نظام <strong>RidgeAI</strong> ليس كخوارزمية واحدة، بل كـ <strong>فريق جنائي كامل</strong>. 
                يتم تمرير الصور عبر 5 مراحل متسلسلة (Pipeline). في كل مرحلة، يقوم وكلاء متخصصون باستخراج بيانات محددة جداً (رياضية، بصرية، إحصائية)، 
                ولا يتم إصدار الحكم النهائي إلا بعد أن يمر الدليل عبر <strong>30 طبقة من التحليل</strong> والتدقيق، تماماً كما يحدث في المختبرات الجنائية المتقدمة.
              </p>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>

          {phases.map((phase) => (
            <section key={phase.id} className="animate-fade-up">
              <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl border-l-4 shadow-sm bg-white ${phase.color.replace('bg-', 'border-').split(' ')[2]} ${phase.color.split(' ')[2]}`}>
                <div className={`p-2 rounded-lg ${phase.color.split(' ')[0]}`}>
                  <phase.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-800">{phase.title}</h4>
                  <p className="text-xs font-medium opacity-70 uppercase tracking-widest">{phase.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phase.agents.map((agent, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all group duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:from-indigo-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-black text-slate-800 text-base group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                          {agent.name}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200 uppercase tracking-tighter">
                          {agent.role}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed text-justify">
                        {agent.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white text-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-200 active:scale-95"
          >
            إغلاق الدليل والعودة
          </button>
        </div>

      </div>
    </div>
  );
};

export default AgentsGuideModal;
