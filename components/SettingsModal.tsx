
import React, { useState, useEffect } from 'react';
import { X, Server, Key, Save, Trash2, CheckCircle, ShieldAlert, ExternalLink, Zap, Cpu, Gauge } from 'lucide-react';
import { saveApiKey, getApiKey, removeApiKey, savePaidMode, getPaidMode } from '../services/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [usePaidApi, setUsePaidApi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkExistingKey();
      checkPaidMode();
    }
  }, [isOpen]);

  const checkExistingKey = async () => {
    const key = await getApiKey();
    if (key) {
      setHasKey(true);
      setApiKey(key); 
    } else {
      setHasKey(false);
      setApiKey('');
    }
  };

  const checkPaidMode = async () => {
    const isPaid = await getPaidMode();
    setUsePaidApi(isPaid);
  };

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    try {
      await saveApiKey(apiKey.trim());
      await savePaidMode(usePaidApi);
      setIsSaved(true);
      setHasKey(true);
      setStatusMsg('تم حفظ الإعدادات بنجاح');
      setTimeout(() => {
        setIsSaved(false);
        setStatusMsg('');
      }, 3000);
    } catch (e) {
      setStatusMsg('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async () => {
    try {
      await removeApiKey();
      setApiKey('');
      setHasKey(false);
      setStatusMsg('تم حذف المفتاح');
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 transform transition-all scale-100">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            إعدادات النظام
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* API Config Section */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-500" />
              إعداد مفتاح API
            </h4>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                لكي يعمل التطبيق، يجب توفير مفتاح Gemini API. سيتم تخزين المفتاح محلياً في متصفحك (IndexedDB).
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">مفتاح Gemini API</label>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium hover:underline"
                    >
                      <span>الحصول على المفتاح من Google</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="أدخل المفتاح هنا (AIza...)"
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-mono"
                    />
                    {hasKey && (
                       <div className="absolute left-2 top-2 text-green-500">
                         <CheckCircle className="w-5 h-5" />
                       </div>
                    )}
                  </div>
                </div>

                {/* Performance Mode Toggle */}
                <div 
                  className={`bg-white p-3 rounded-lg border flex items-center justify-between transition-all ${usePaidApi ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-slate-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full transition-colors ${usePaidApi ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {usePaidApi ? <Cpu className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                         {usePaidApi ? "الوضع الخارق (Gemini 3 Pro)" : "الوضع القياسي (Gemini 2.5 Flash)"}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {usePaidApi 
                          ? "أقصى ذكاء وتحليل عميق (32k Thinking Tokens)." 
                          : "سرعة عالية وتوفير في الاستهلاك."}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={usePaidApi}
                      onChange={(e) => setUsePaidApi(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    حفظ الإعدادات
                  </button>
                  {hasKey && (
                    <button 
                      onClick={handleDelete}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      title="حذف المفتاح"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {statusMsg && (
                  <div className={`text-xs font-bold text-center mt-2 ${statusMsg.includes('حذف') ? 'text-red-500' : 'text-green-600'}`}>
                    {statusMsg}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500 bg-blue-50 p-2 rounded border border-blue-100">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-blue-500" />
              <span>
                ملاحظة: "الوضع الخارق" يعمل مع الحسابات المجانية ولكنه يستهلك حصة (RPM) أعلى. إذا واجهت أخطاء 429، عد إلى الوضع القياسي.
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button 
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
