
import React, { useEffect, useState } from 'react';
import { Zap, Info } from 'lucide-react';
import { getTokenUsage } from '../services/db';

const TokenTracker: React.FC = () => {
  const [tokens, setTokens] = useState(0);
  const DAILY_LIMIT = 1500000; // Gemini Free Tier (Approx 1.5M/day)

  const updateTokens = async () => {
    const count = await getTokenUsage();
    setTokens(count);
  };

  useEffect(() => {
    updateTokens();

    // Listen for updates from db service
    const handleUpdate = (e: CustomEvent) => {
        if (e.detail) setTokens(e.detail);
        else updateTokens();
    };

    window.addEventListener('tokensUpdated', handleUpdate as EventListener);
    return () => {
        window.removeEventListener('tokensUpdated', handleUpdate as EventListener);
    };
  }, []);

  const percentage = Math.min(100, (tokens / DAILY_LIMIT) * 100);
  
  // Color logic
  let colorClass = "bg-green-500";
  if (percentage > 50) colorClass = "bg-yellow-500";
  if (percentage > 90) colorClass = "bg-red-500";

  return (
    <div className="hidden md:flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200" title={`تم استخدام ${tokens.toLocaleString()} من أصل 1.5 مليون توكن يومياً`}>
      <div className="flex flex-col items-end">
        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
           <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
           <span>عداد التوكنز اليومي</span>
        </div>
        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
          <div 
             className={`h-full rounded-full transition-all duration-500 ${colorClass}`} 
             style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-[10px] font-mono text-slate-400">
         {(percentage).toFixed(1)}%
      </div>
    </div>
  );
};

export default TokenTracker;
