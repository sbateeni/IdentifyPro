
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Results from './components/Results';
import SettingsModal from './components/SettingsModal';
import { compareFingerprints } from './services/geminiService';
import { ComparisonResult } from './types';
import { ScanLine, Loader2, ShieldCheck, Users, Settings, Key } from 'lucide-react';

const App: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await compareFingerprints(file1, file2);
      setResult(analysis);
    } catch (err) {
      setError("حدث خطأ أثناء تحليل الصور. يرجى التأكد من وضوح الصور والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile1(null);
    setFile2(null);
    setResult(null);
    setError(null);
  };

  const isReady = file1 && file2;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-tajawal">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <ScanLine className="w-7 h-7" />
            <h1 className="text-xl font-bold tracking-tight">مطابق البصمات الاحترافي</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-xs font-medium bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700 border border-indigo-100">
              <Users className="w-3 h-3" />
              <span>نظام الوكلاء المتعدد</span>
            </div>
            
            {/* API Quick Access Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API Key</span>
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-all"
              title="الإعدادات"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">تحليل ومقارنة البصمات الجنائي</h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            يقوم النظام بتشغيل 3 وكلاء ذكاء اصطناعي: وكيلان لاستخراج التفاصيل الدقيقة من كل بصمة بشكل مستقل، ووكيل ثالث لإجراء مقارنة جنائية وحساب نسبة التطابق بدقة عالية.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start relative">
            
            {/* Divider for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-2 rounded-full z-10 border border-slate-200">
              <span className="text-slate-400 font-bold text-xs">VS</span>
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
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCompare}
              disabled={!isReady || loading}
              className={`
                relative overflow-hidden group px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 w-full md:w-auto min-w-[280px]
                ${isReady 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 hover:-translate-y-0.5' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري تحليل الوكلاء...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    بدء الفحص الدقيق
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 text-center animate-fade-in flex items-center justify-center gap-2">
             <ShieldCheck className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div id="results">
            <Results result={result} />
            <div className="mt-10 text-center pb-8">
              <button 
                onClick={reset}
                className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                إجراء فحص جديد
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
