
import React from 'react';
import { LucideIcon, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;
  data: Record<string, any>;
  delay?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, role, icon: Icon, color, data, delay = "" }) => {
  // Extract special fields
  const confidence = typeof data.confidence === 'number' ? data.confidence : 0;
  const directives = Array.isArray(data.directives) ? data.directives : [];
  
  // Filter out the special fields from the detail view
  const displayData = Object.entries(data).filter(([key]) => key !== 'confidence' && key !== 'directives');

  const hasWarnings = directives.some((d: string) => d.includes("STOP") || d.includes("ABORT") || d.includes("ALERT"));

  return (
    <div className={`bg-white p-4 rounded-xl border ${hasWarnings ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'} shadow-sm hover:shadow-md transition-all animate-fade-up ${delay} flex flex-col h-full`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 border-b border-slate-100 pb-2">
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
             <h4 className={`font-bold text-sm ${color} truncate`}>{name}</h4>
             {confidence > 0 && (
               <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600" title={`Confidence: ${(confidence * 100).toFixed(0)}%`}>
                  {confidence > 0.8 ? <ShieldCheck className="w-3 h-3 text-green-500" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
                  <span>{(confidence * 100).toFixed(0)}%</span>
               </div>
             )}
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">{role}</p>
        </div>
      </div>

      {/* Directives / Alerts */}
      {directives.length > 0 && (
        <div className="mb-3 space-y-1">
          {directives.map((dir: string, idx: number) => {
             const isAlert = dir.includes("STOP") || dir.includes("ABORT");
             return (
               <div key={idx} className={`text-[10px] px-2 py-1 rounded border font-mono break-words ${isAlert ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                 {isAlert && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                 {dir}
               </div>
             )
          })}
        </div>
      )}

      {/* Data Body */}
      <div className="space-y-2 mt-auto">
        {displayData.map(([key, value], idx) => (
          <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 last:border-0 pb-1 last:pb-0">
            <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="font-bold text-slate-700 font-mono text-right max-w-[60%] break-words">
              {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentCard;
