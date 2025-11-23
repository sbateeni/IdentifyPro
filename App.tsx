
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Results from './components/Results';
import SettingsModal from './components/SettingsModal';
import HistorySidebar from './components/HistorySidebar';
import AgentsGuideModal from './components/AgentsGuideModal';
import { compareFingerprints } from './services/geminiService';
import { compareFingerprintsOpenRouter } from './services/openRouterService';
import { saveHistory, getProvider } from './services/db';
import { ComparisonResult, HistoryRecord } from './types';
import { ScanLine, Loader2, ShieldCheck, Users, Key, History, BookOpen, Settings, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const provider = await getProvider();
      let analysis: ComparisonResult;

      console.log(`Starting analysis using provider: ${provider}`);

      if (provider === 'openrouter') {
        analysis = await compareFingerprintsOpenRouter(file1, file2);
      } else {
        // Default to Gemini
        analysis = await compareFingerprints(file1, file2);
      }

      setResult(analysis);
      
      // Save to History automatically INCLUDING file data (Blobs)
      try {
        await saveHistory({
          timestamp: Date.now(),
          file1Name: file1.name,
          file2Name: file2.name,
          file1Data: file1, // Store the blob/file
          file2Data: file2, // Store the blob/file
          result: analysis
        });
      } catch (saveErr) {
        console.error("Could not save to history", saveErr);
      }

    } catch (err: any) {
      console.error("Scan Error:", err);
      let errorMessage = err.message || "حدث خطأ غير معروف";
      
      // Try to parse JSON error message if present
      if (typeof errorMessage === 'string' && errorMessage.includes('{')) {
         try {
           const jsonPart = errorMessage.substring(errorMessage.indexOf('{'));
           const parsed = JSON.parse(jsonPart);
           if (parsed.error && parsed.error.message) {
             errorMessage = parsed.error.message;
           }
         } catch (e) {
           // ignore parsing error
         }
      }

      // Check for API Key specific errors
      const isAuthError = 
        errorMessage.includes("API key") || 
        errorMessage.includes("PERMISSION_DENIED") || 
        errorMessage.includes("403") ||
        errorMessage.includes("401") ||
        errorMessage.toLowerCase().includes("permission") ||
        errorMessage.includes("مفتاح");

      if (isAuthError) {
        setError(`خطأ في المصادقة: ${errorMessage}`);
        setIsSettingsOpen(true);
      } else {
        setError(`حدث خطأ أثناء التحليل: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (record: HistoryRecord) => {
    setResult(record.result);
    
    // Restore the files from the saved Blob data
    // Added safety check: ensure file1Data exists before creating File object
    if (record.file1Data) {
      try {
        const restoredFile1 = new File([record.file1Data], record.file1Name, { type: record.file1Data.type });
        setFile1(restoredFile1);
      } catch (e) {
        console.error("Error restoring file 1", e);
        setFile1(null);
      }
    } else {
      setFile1(null);
    }

    // Added safety check: ensure file2Data exists before creating File object
    if (record.file2Data) {
      try {
        const restoredFile2 = new File([record.file2Data], record.file2Name, { type: record.file2Data.type });
        setFile2(restoredFile2);
      } catch (e) {
        console.error("Error restoring file 2", e);
        setFile2(null);
      }
    } else {
      setFile2(null);
    }
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const reset = () => {
    setFile1(null);
    setFile2(null);
    setResult(null);
    setError(null);
  };

  const isReady = file1 && file2;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-tajawal relative overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-900">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <ScanLine className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">RidgeAI</h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hidden md:flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>دليل الوكلاء</span>
            </button>
            
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-all flex items-center gap-2"
              title="سجل العمليات"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">الأرشيف</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">الإعدادات / API</span>
            </button>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelectRecord={handleHistorySelect}
      />
      <AgentsGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {!result && (
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-4 md:hidden" onClick={() => setIsGuideOpen(true)}>
               <Users className="w-3 h-3" />
               نظام يعمل بـ 30 وكيلاً ذكياً
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              نظام التحليل الجنائي <span className="text-indigo-600">الذكي</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg">
              RidgeAI يستخدم شبكة من وكلاء الذكاء الاصطناعي لمطابقة البصمات بدقة متناهية، كشف التزييف، واستخراج الأدلة الجنائية في ثوانٍ.
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className={`bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-white ring-1 ring-slate-100 mb-10 transition-all duration-500 ${result ? 'hidden print:hidden' : 'block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start relative">
            
            {/* VS Badge */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full z-10 shadow-lg border border-slate-100 text-slate-300 font-black text-sm">
              VS
            </div>

            <ImageUpload 
              label="البصمة المرجعية (المصدر)" 
              imageFile={file1} 
              onImageChange={(f) => { setFile1(f); setResult(null); }} 
            />
            <ImageUpload 
              label="بصمة المشتبه به (المقارنة)" 
              imageFile={file2} 
              onImageChange={(f) => { setFile2(f); setResult(null); }} 
            />
          </div>

          {/* Action Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleCompare}
              disabled={!isReady || loading}
              className={`
                relative overflow-hidden group px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 w-full md:w-auto min-w-[300px] shadow-lg
                ${isReady 
                  ? 'bg-indigo-600 text-white shadow-indigo-300/50 hover:shadow-indigo-400/60 hover:bg-indigo-700 hover:-translate-y-1' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جاري تحليل الوكلاء...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    بدء الفحص الجنائي
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 animate-fade-up">
             <ShieldAlert className="w-5 h-5 flex-shrink-0" />
             <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        {result && (
          <div id="results">
             {/* Pass actual file objects to Results for Visual Mapping */}
             <Results result={result} file1={file1} file2={file2} />
             
             <div className="mt-10 text-center no-print">
               <button 
                 onClick={reset}
                 className="text-slate-500 hover:text-indigo-600 font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
               >
                 ← عودة للفحص الجديد
               </button>
             </div>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-mono mb-2">
            RidgeAI Forensic System v3.0 • Quantum Orchestrator Engine
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-300 uppercase tracking-widest">
            <span>Secure</span> • <span>Encrypted</span> • <span>Client-Side Processing</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
