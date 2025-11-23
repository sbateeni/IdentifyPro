
import React, { useState, useEffect } from 'react';
import { X, Server, Key, Save, Trash2, CheckCircle, ShieldAlert, ExternalLink, Cpu, Gauge, Globe, Zap } from 'lucide-react';
import { 
  saveApiKey, getApiKey, removeApiKey, 
  savePaidMode, getPaidMode,
  saveProvider, getProvider,
  saveOpenRouterKey, getOpenRouterKey
} from '../services/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  
  // Gemini State
  const [geminiKey, setGeminiKey] = useState('');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [usePaidApi, setUsePaidApi] = useState(false);

  // OpenRouter State
  const [orKey, setOrKey] = useState('');
  const [hasOrKey, setHasOrKey] = useState(false);

  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    // Provider
    const savedProvider = await getProvider();
    setProvider(savedProvider);

    // Gemini
    const gKey = await getApiKey();
    if (gKey) {
      setHasGeminiKey(true);
      setGeminiKey(gKey);
    } else {
      setHasGeminiKey(false);
      setGeminiKey('');
    }
    const isPaid = await getPaidMode();
    setUsePaidApi(isPaid);

    // OpenRouter
    const oKey = await getOpenRouterKey();
    if (oKey) {
      setHasOrKey(true);
      setOrKey(oKey);
    } else {
      setHasOrKey(false);
      setOrKey('');
    }
  };

  const handleSave = async () => {
    try {
      await saveProvider(provider);
      
      if (provider === 'gemini') {
        if (geminiKey.trim()) {
          await saveApiKey(geminiKey.trim());
          setHasGeminiKey(true);
        }
        await savePaidMode(usePaidApi);
      } else {
        if (orKey.trim()) {
          await saveOpenRouterKey(orKey.trim());
          setHasOrKey(true);
        }
      }

      setStatusMsg('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (e) {
      setStatusMsg('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDeleteGemini = async () => {
    await removeApiKey();
    setGeminiKey('');
    setHasGeminiKey(false);
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
          
          {/* PROVIDER SELECTION */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              مزود الذكاء الاصطناعي (AI Provider)
            </h4>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setProvider('gemini')}
                className={`text-xs font-bold py-2 rounded-md transition-all ${provider === 'gemini' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Google Gemini
              </button>
              <button 
                onClick={() => setProvider('openrouter')}
                className={`text-xs font-bold py-2 rounded-md transition-all ${provider === 'openrouter' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                OpenRouter (Grok)
              </button>
            </div>
          </div>

          {/* GEMINI CONFIG */}
          {provider === 'gemini' && (
            <div className="animate-fade-up">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700">مفتاح Gemini API</label>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 flex items-center gap-1 hover:underline">
                    <span>احصل عليه هنا</span> <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative mb-4">
                  <input 
                    type="password" 
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                  />
                  {hasGeminiKey && <div className="absolute left-2 top-2.5 text-green-500"><CheckCircle className="w-5 h-5" /></div>}
                </div>

                <div className={`bg-white p-3 rounded-lg border flex items-center justify-between transition-all ${usePaidApi ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${usePaidApi ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {usePaidApi ? <Cpu className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">الوضع الخارق (Gemini 3 Pro)</div>
                      <div className="text-[10px] text-slate-500">أذكى، تفكير عميق (32k Tokens)</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={usePaidApi} onChange={(e) => setUsePaidApi(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {hasGeminiKey && <button onClick={handleDeleteGemini} className="text-[10px] text-red-500 mt-2 underline">حذف المفتاح</button>}
              </div>
            </div>
          )}

          {/* OPENROUTER CONFIG */}
          {provider === 'openrouter' && (
            <div className="animate-fade-up">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700">مفتاح OpenRouter API</label>
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 flex items-center gap-1 hover:underline">
                    <span>احصل عليه هنا</span> <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative mb-2">
                  <input 
                    type="password" 
                    value={orKey}
                    onChange={(e) => setOrKey(e.target.value)}
                    placeholder="sk-or-..."
                    className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                  />
                  {hasOrKey && <div className="absolute left-2 top-2.5 text-green-500"><CheckCircle className="w-5 h-5" /></div>}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-blue-50 p-2 rounded">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span>الموديل المستخدم: <strong>x-ai/grok-4.1-fast</strong></span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>

          {statusMsg && (
            <div className="text-xs font-bold text-center mt-2 text-green-600">
              {statusMsg}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button onClick={onClose} className="w-full px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
