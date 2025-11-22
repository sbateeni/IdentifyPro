
import React from 'react';
import { ComparisonResult } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Activity, Search, GitCompare, FileText, ShieldAlert } from 'lucide-react';

interface ResultsProps {
  result: ComparisonResult;
}

const Results: React.FC<ResultsProps> = ({ result }) => {
  const { agent1Analysis, agent2Analysis, comparisonAgent, finalResult } = result;

  // Color logic
  let colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";
  let icon = <AlertTriangle className="w-12 h-12 mb-2" />;
  
  if (finalResult.matchScore > 80) {
    colorClass = "text-green-600 bg-green-50 border-green-200";
    icon = <CheckCircle className="w-12 h-12 mb-2" />;
  } else if (finalResult.matchScore < 40) {
    colorClass = "text-red-600 bg-red-50 border-red-200";
    icon = <XCircle className="w-12 h-12 mb-2" />;
  }

  const AgentCard = ({ title, data, color }: { title: string, data: any, color: string }) => (
    <div className={`p-5 rounded-xl border ${color} h-full`}>
      <div className="flex items-center gap-2 mb-3 border-b pb-2 border-dashed border-slate-300">
        <Search className="w-4 h-4 opacity-70" />
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">النمط العام:</span>
          <span className="font-medium">{data.patternType}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">جودة الحواف:</span>
          <span className="font-medium">{data.ridgeQuality}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">تقدير النقاط:</span>
          <span className="font-medium">{data.estimatedMinutiaeCount}</span>
        </div>
        <div>
          <span className="opacity-70 block mb-1">الميزات:</span>
          <div className="flex flex-wrap gap-1">
            {data.distinctiveFeatures.map((f: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-white rounded border text-xs">{f}</span>
            ))}
          </div>
        </div>
        {data.imperfections.length > 0 && (
           <div>
            <span className="opacity-70 block mb-1 text-red-500">العيوب/الضوضاء:</span>
            <ul className="list-disc list-inside text-xs text-slate-600">
              {data.imperfections.map((imp: string, i: number) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-in mt-8 space-y-6">
      
      {/* Main Verdict */}
      <div className={`relative p-8 rounded-2xl border-2 flex flex-col items-center text-center ${colorClass}`}>
        {icon}
        <h2 className="text-4xl font-bold mb-1 tracking-tight">
          {finalResult.matchScore}%
        </h2>
        <span className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">
          نسبة التطابق النهائية
        </span>
        
        <div className="text-2xl font-bold mb-2">
          {finalResult.isMatch ? "البصمات متطابقة" : "البصمات غير متطابقة"}
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-sm font-medium mt-2">
          <ShieldAlert className="w-4 h-4" />
          مستوى الثقة: {finalResult.confidenceLevel}
        </div>

        <p className="text-base opacity-90 max-w-3xl leading-relaxed mt-4 font-medium">
          {finalResult.forensicConclusion}
        </p>
      </div>

      {/* Agents Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AgentCard 
          title="تقرير الوكيل الأول (البصمة الأصلية)" 
          data={agent1Analysis} 
          color="bg-indigo-50 border-indigo-200 text-indigo-900"
        />
        <AgentCard 
          title="تقرير الوكيل الثاني (بصمة المقارنة)" 
          data={agent2Analysis} 
          color="bg-purple-50 border-purple-200 text-purple-900"
        />
      </div>

      {/* Detailed Comparison Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-800 font-bold flex items-center gap-2 mb-6 border-b pb-3">
          <GitCompare className="w-5 h-5 text-blue-600" />
          تحليل المقارنة التفصيلي (الوكيل الثالث)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              نقاط التشابه المكتشفة
            </h4>
            <ul className="space-y-2">
              <li className="text-sm bg-green-50 p-2 rounded text-green-800 border border-green-100 flex justify-between">
                 <span>تطابق النمط العام</span>
                 <span className="font-bold">{comparisonAgent.patternMatch.score}%</span>
              </li>
              {comparisonAgent.minutiaeMatch.commonPointsFound.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {point}
                </li>
              ))}
              {comparisonAgent.minutiaeMatch.commonPointsFound.length === 0 && (
                <li className="text-sm text-slate-400 italic">لا توجد نقاط تشابه قوية.</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              الاختلافات الجوهرية
            </h4>
            <ul className="space-y-2">
              {comparisonAgent.minutiaeMatch.differencesFound.map((diff, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {diff}
                </li>
              ))}
              {comparisonAgent.minutiaeMatch.differencesFound.length === 0 && (
                <li className="text-sm text-slate-400 italic">لا توجد اختلافات جوهرية ملحوظة.</li>
              )}
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100 text-xs text-blue-800 leading-relaxed">
              <strong>توضيح المطابقة:</strong> {comparisonAgent.patternMatch.explanation}
            </div>
          </div>
        </div>
      </div>
        
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
        <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
          <FileText className="w-3 h-3" />
          تم إنشاء هذا التقرير تلقائياً بواسطة فريق وكلاء الذكاء الاصطناعي (Gemini 2.5). النتائج للأغراض الاسترشادية فقط.
        </p>
      </div>
    </div>
  );
};

export default Results;
