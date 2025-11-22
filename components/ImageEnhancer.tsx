
import React, { useState } from 'react';
import { Sun, Contrast, EyeOff, RotateCcw, ZoomIn } from 'lucide-react';

interface ImageEnhancerProps {
  src: string;
  fileName: string;
  onRemove: () => void;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ src, fileName, onRemove }) => {
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [invert, setInvert] = useState(0);
  const [grayscale, setGrayscale] = useState(0);

  const resetFilters = () => {
    setContrast(100);
    setBrightness(100);
    setInvert(0);
    setGrayscale(0);
  };

  const filterString = `contrast(${contrast}%) brightness(${brightness}%) invert(${invert}%) grayscale(${grayscale}%)`;

  return (
    <div className="w-full">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden group shadow-inner">
        {/* Grid Overlay for measurement feel */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-10" 
             style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        
        <img 
          src={src} 
          alt="Fingerprint analysis" 
          className="w-full h-full object-contain p-4 transition-all duration-200" 
          style={{ filter: filterString }}
        />
        
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono z-20">
          FORENSIC LAB VIEW
        </div>

        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded z-20 transition-colors text-xs font-bold"
        >
          إزالة
        </button>
      </div>

      {/* Forensic Toolbar */}
      <div className="mt-2 bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-2 border-b border-slate-700 pb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <ZoomIn className="w-3 h-3" />
            معمل تحسين الصورة
          </span>
          <button onClick={resetFilters} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            إعادة ضبط
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Invert */}
          <button 
            onClick={() => setInvert(prev => prev === 0 ? 100 : 0)}
            className={`flex flex-col items-center justify-center p-2 rounded text-[10px] transition-colors ${invert > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            <EyeOff className="w-4 h-4 mb-1" />
            قلب الألوان
          </button>

          {/* Contrast */}
          <div className="col-span-3 grid grid-cols-2 gap-2">
             <div className="flex items-center gap-2 bg-slate-700/50 px-2 rounded border border-slate-700">
               <Contrast className="w-3 h-3 text-slate-400" />
               <input 
                 type="range" min="50" max="200" 
                 value={contrast} onChange={(e) => setContrast(Number(e.target.value))}
                 className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
               />
             </div>
             <div className="flex items-center gap-2 bg-slate-700/50 px-2 rounded border border-slate-700">
               <Sun className="w-3 h-3 text-slate-400" />
               <input 
                 type="range" min="50" max="200" 
                 value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
                 className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancer;
