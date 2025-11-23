
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  icon: LucideIcon;
  color: string; // Tailwind color class e.g. "text-blue-500"
  data: Record<string, any>;
  delay?: string; // Animation delay class
}

const AgentCard: React.FC<AgentCardProps> = ({ name, role, icon: Icon, color, data, delay = "" }) => {
  return (
    <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all animate-fade-up ${delay}`}>
      <div className="flex items-center gap-3 mb-3 border-b border-slate-100 pb-2">
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h4 className={`font-bold text-sm ${color}`}>{name}</h4>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{role}</p>
        </div>
      </div>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value], idx) => (
          <div key={idx} className="flex justify-between items-center text-xs">
            <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="font-bold text-slate-700 font-mono">
              {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentCard;
