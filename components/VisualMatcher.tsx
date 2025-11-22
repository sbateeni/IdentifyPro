
import React, { useEffect, useState, useRef } from 'react';
import { AnatomicalMapping } from '../types';
import { Scan, Fingerprint, List, Info } from 'lucide-react';

interface VisualMatcherProps {
  data: AnatomicalMapping;
  file1: File | null; 
  file2: File | null; 
}

const VisualMatcher: React.FC<VisualMatcherProps> = ({ data, file1, file2 }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [img1Url, setImg1Url] = useState<string | null>(null);
  const [img2Url, setImg2Url] = useState<string | null>(null);

  useEffect(() => {
    if (file1) {
      const url = URL.createObjectURL(file1);
      setImg1Url(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImg1Url(null);
    }
  }, [file1]);

  useEffect(() => {
    if (file2) {
      const url = URL.createObjectURL(file2);
      setImg2Url(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImg2Url(null);
    }
  }, [file2]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to map zone string to coordinates (Percentage)
  const getCoordinates = (zone: string) => {
    const map: Record<string, { x: number, y: number }> = {
      'top-left': { x: 20, y: 20 },
      'top-center': { x: 50, y: 20 },
      'top-right': { x: 80, y: 20 },
      'middle-left': { x: 20, y: 50 },
      'center': { x: 50, y: 50 },
      'middle-right': { x: 80, y: 50 },
      'bottom-left': { x: 20, y: 80 },
      'bottom-center': { x: 50, y: 80 },
      'bottom-right': { x: 80, y: 80 },
    };
    return map[zone] || { x: 50, y: 50 };
  };

  return (
    <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl mt-6 relative print:bg-white print:border-slate-300" ref={containerRef}>
      
      {/* Header */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700 print:bg-slate-100 print:border-slate-300 print:text-black">
        <h4 className="text-white text-sm font-bold flex items-center gap-2 print:text-black">
          <Scan className="w-4 h-4 text-cyan-400 print:text-black" />
          Agent Iota: المطابقة التشريحية البصرية (Visual Mapping)
        </h4>
        <span className="text-xs text-cyan-400 font-mono animate-pulse print:hidden">LIVE LINK ACTIVE</span>
      </div>

      <div className="relative p-6 flex flex-col md:flex-row justify-between items-center gap-8 min-h-[350px]">
        
        {/* SVG Overlay Layer (Hidden on small screens if stacked, visible on md+) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {data.points.map((point, index) => {
            const start = getCoordinates(point.zone1);
            const end = getCoordinates(point.zone2);
            
            // Adjust coordinates based on container layout (Left Image vs Right Image)
            // Left Image Center is approx 25% of width, Right Image Center is approx 75% of width in the flex container
            // Note: This is an approximation. For perfect alignment, we'd need element refs. 
            // Assuming 50% split with gap.
            
            const x1 = `${start.x / 2}%`; // Squeeze into left half (0-50%)
            const y1 = `${start.y}%`;
            
            const x2 = `${50 + (end.x / 2)}%`; // Squeeze into right half (50-100%)
            const y2 = `${end.y}%`;

            return (
              <g key={index} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                {/* Connecting Line */}
                <path 
                  d={`M ${x1} ${y1} C 50% ${y1}, 50% ${y2}, ${x2} ${y2}`}
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="2" 
                  strokeDasharray="5,5"
                  className="opacity-60 print:stroke-black print:opacity-100"
                  filter="url(#glow)"
                >
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                </path>
              </g>
            );
          })}
        </svg>

        {/* Image 1 Container */}
        <div className="relative flex-1 w-full aspect-square bg-black rounded-lg border border-slate-600 flex items-center justify-center overflow-hidden group print:border-slate-300 print:bg-white">
          <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono z-30 bg-black/50 px-1 rounded print:bg-slate-100 print:text-black">SOURCE</div>
          {/* Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Actual Image */}
          {img1Url ? (
            <img 
              src={img1Url} 
              alt="Source Fingerprint" 
              className="absolute inset-0 w-full h-full object-contain p-4 opacity-90 transition-all duration-300 group-hover:opacity-100 mix-blend-screen print:mix-blend-normal print:opacity-100" 
            />
          ) : (
            <div className="opacity-20">
               <Fingerprint className="w-32 h-32 text-slate-500" />
            </div>
          )}
          
          {/* Map Points Overlay */}
          {data.points.map((point, idx) => {
             const coords = getCoordinates(point.zone1);
             return (
               <div 
                 key={idx}
                 className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center z-30 group-hover:scale-110 transition-transform cursor-crosshair"
                 style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
               >
                 <div className="w-full h-full bg-cyan-500/20 rounded-full animate-ping absolute print:hidden"></div>
                 <div className="w-5 h-5 bg-cyan-600 rounded-full relative border border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white print:bg-black print:text-white">
                    {idx + 1}
                 </div>
               </div>
             );
          })}
        </div>

        {/* Image 2 Container */}
        <div className="relative flex-1 w-full aspect-square bg-black rounded-lg border border-slate-600 flex items-center justify-center overflow-hidden group print:border-slate-300 print:bg-white">
          <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono z-30 bg-black/50 px-1 rounded print:bg-slate-100 print:text-black">TARGET</div>
          {/* Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Actual Image */}
          {img2Url ? (
            <img 
              src={img2Url} 
              alt="Target Fingerprint" 
              className="absolute inset-0 w-full h-full object-contain p-4 opacity-90 transition-all duration-300 group-hover:opacity-100 mix-blend-screen print:mix-blend-normal print:opacity-100" 
            />
          ) : (
            <div className="opacity-20">
               <Fingerprint className="w-32 h-32 text-slate-500" />
            </div>
          )}
          
           {/* Map Points Overlay */}
           {data.points.map((point, idx) => {
             const coords = getCoordinates(point.zone2);
             return (
               <div 
                 key={idx}
                 className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center z-30 group-hover:scale-110 transition-transform cursor-crosshair"
                 style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
               >
                 <div className="w-full h-full bg-purple-500/20 rounded-full animate-ping absolute print:hidden"></div>
                 <div className="w-5 h-5 bg-purple-600 rounded-full relative border border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white print:bg-black print:text-white">
                    {idx + 1}
                 </div>
               </div>
             );
          })}
        </div>

      </div>

      {/* Detailed Legend */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-4 print:bg-white print:border-slate-300 print:text-black">
        <h5 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider print:text-black">
            <List className="w-3 h-3" />
            دليل العلامات التشريحية (Anatomical Landmarks Legend)
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800 p-2 rounded border border-slate-700/50 hover:border-slate-600 transition-colors print:bg-white print:border-slate-300">
                    <div className="flex-shrink-0 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white border border-slate-500 print:bg-black print:text-white">
                        {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-cyan-100 truncate print:text-black">{point.label}</div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 print:text-slate-600">
                            <span>Zone: {point.zone1} → {point.zone2}</span>
                            <span className="text-green-400 font-mono print:text-green-700 font-bold">{point.confidence}% Match</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-900 print:bg-white print:border-t print:border-slate-300">
        <div className="text-xs text-slate-400 font-mono flex justify-between items-center print:text-black">
          <span>Mapping Score: <span className="text-cyan-400 font-bold text-sm print:text-black">{data.mappingScore}/100</span></span>
          <span className="italic opacity-70">{data.visualConclusion}</span>
        </div>
      </div>
    </div>
  );
};

export default VisualMatcher;
