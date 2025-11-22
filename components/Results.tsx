
import React from 'react';
import { ComparisonResult } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Activity, GitCompare, FileText, ShieldAlert, Printer, Microscope, Eye, Fingerprint, Link as LinkIcon, Ruler, GitMerge, Minus, CircleDot, BadgeCheck, Scale, Gavel, Dna, FileWarning, Layers, Download, Move, Scan, Search, Maximize2, Minimize2, BoxSelect } from 'lucide-react';
import VisualMatcher from './VisualMatcher';

interface ResultsProps {
  result: ComparisonResult;
  file1: File | null;
  file2: File | null;
}

const Results: React.FC<ResultsProps> = ({ result, file1, file2 }) => {
  const { qualityAgent, forgeryAgent, agentZeta, agentSigma, agentTheta, agentIota, agentKappa, agentOmega, agent1Analysis, agent2Analysis, comparisonAgent, finalResult, chainOfCustody } = result;

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

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `RidgeAI_Report_${chainOfCustody.timestamp}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const StatBox = ({ label, value1, value2, icon: Icon, color }: { label: string, value1: number | string, value2: number | string, icon: any, color: string }) => (
    <div className="flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
      <div className={`mb-1 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] text-slate-500 mb-1">{label}</span>
      <div className="flex items-center gap-2 text-sm font-bold font-mono">
        <span className="text-indigo-600">{value1}</span>
        <span className="text-slate-300">|</span>
        <span className="text-purple-600">{value2}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full mt-8 space-y-6 relative">
      
      {/* Header for Print Only */}
      <div className="print-header">
        <div className="text-2xl font-bold">RidgeAI Forensic Report</div>
        <div className="text-sm text-slate-500">Case ID: {chainOfCustody?.timestamp || Date.now()}</div>
      </div>

      {/* Print Action Bar */}
      <div className="flex justify-end gap-2 mb-4 no-print animate-fade-up">
        <button 
          onClick={handleExportJSON}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-all border border-indigo-200"
        >
          <Download className="w-4 h-4" />
          تصدير JSON
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all shadow-lg hover:-translate-y-0.5"
        >
          <Printer className="w-4 h-4" />
          طباعة التقرير الرسمي
        </button>
      </div>
      
      {/* Chain of Custody (Digital Hash) */}
      {chainOfCustody && (
        <div className="bg-slate-800 text-slate-300 p-4 rounded-xl text-xs font-mono shadow-inner animate-fade-up border border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-slate-100 font-bold border-b border-slate-600 pb-2">
            <LinkIcon className="w-4 h-4" />
            DIGITAL CHAIN OF CUSTODY (سلسلة العهدة الرقمية)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="break-all">
              <span className="text-slate-500 block">Source File SHA-256:</span>
              {chainOfCustody.file1Hash}
            </div>
            <div className="break-all">
              <span className="text-slate-500 block">Target File SHA-256:</span>
              {chainOfCustody.file2Hash}
            </div>
          </div>
          <div className="mt-2 text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Integrity Verified • {new Date(chainOfCustody.timestamp).toISOString()}
          </div>
        </div>
      )}

      {/* Main Verdict */}
      <div className={`relative p-8 rounded-2xl border-2 flex flex-col items-center text-center ${colorClass} animate-scale-in`}>
        {icon}
        <h2 className="text-5xl font-bold mb-2 tracking-tight">
          {finalResult.matchScore}%
        </h2>
        <span className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">
          نسبة التطابق النهائية
        </span>
        
        <div className="text-2xl font-bold mb-2">
          {finalResult.isMatch ? "البصمات متطابقة" : "البصمات غير متطابقة"}
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-sm font-bold mt-2 shadow-sm">
          <ShieldAlert className="w-4 h-4" />
          مستوى الثقة: {finalResult.confidenceLevel}
        </div>

        <p className="text-base opacity-90 max-w-3xl leading-relaxed mt-6 font-medium bg-white/40 p-4 rounded-xl">
          {finalResult.forensicConclusion}
        </p>
      </div>

      {/* AGENT IOTA: Visual Matcher */}
      {agentIota && (
        <div className="animate-fade-up delay-100">
           <VisualMatcher data={agentIota} file1={file1} file2={file2} />
        </div>
      )}

      {/* AGENT KAPPA: Scale & Subset Analyzer (New) */}
      {agentKappa && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-xl border border-slate-700 shadow-lg animate-fade-up delay-150 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
             <h4 className="font-bold text-sm flex items-center gap-2">
               <BoxSelect className="w-5 h-5 text-teal-400" />
               Agent Kappa: محلل القياس والاحتواء (Scale & Subset)
             </h4>
             <span className={`text-xs font-bold px-2 py-1 rounded ${agentKappa.isSubset ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-700 text-slate-400'}`}>
               {agentKappa.relationship === 'subset_master' ? 'DETECTED: SUBSET RELATIONSHIP' : agentKappa.relationship.toUpperCase().replace('_', ' ')}
             </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 col-span-2">
                 <p className="text-sm text-slate-300 leading-relaxed">
                   "{agentKappa.explanation}"
                 </p>
                 <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-4">
                    <div className="text-center">
                       <span className="block text-xs text-slate-400 mb-1">Scale Ratio</span>
                       <div className="flex items-center gap-1 text-teal-400 font-mono font-bold text-lg">
                          {agentKappa.scaleRatio > 1 ? <Maximize2 className="w-4 h-4" /> : agentKappa.scaleRatio < 1 ? <Minimize2 className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                          {agentKappa.scaleRatio}x
                       </div>
                    </div>
                    <div className="h-8 w-px bg-slate-700 mx-2"></div>
                    <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                           <span>Overlap Percentage</span>
                           <span>{agentKappa.overlapPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                           <div 
                             className="bg-teal-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                             style={{ width: `${agentKappa.overlapPercentage}%` }}
                           ></div>
                        </div>
                    </div>
                 </div>
              </div>
              <div className="flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700 p-4">
                 {agentKappa.isSubset ? (
                    <div className="text-center">
                       <Layers className="w-10 h-10 text-teal-400 mx-auto mb-2 opacity-80" />
                       <span className="text-xs text-teal-200 font-bold block">تطابق جزئي (Partial Print)</span>
                       <span className="text-[10px] text-slate-500">البصمة هي جزء مكبر/مصغر من الأصل</span>
                    </div>
                 ) : (
                    <div className="text-center">
                       <BoxSelect className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
                       <span className="text-xs text-slate-400 font-bold block">نطاق كامل</span>
                       <span className="text-[10px] text-slate-600">البصمتان بنفس الأبعاد تقريباً</span>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* AGENTS ALPHA, BETA & GAMMA (Core Analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up delay-150">
         {/* Agent Alpha */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
            <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-600" />
              Agent Alpha: المصدر
            </h4>
            <div className="space-y-2 text-sm">
               <div className="flex justify-between"><span className="text-slate-500">النمط:</span> <span className="font-bold">{agent1Analysis.patternType}</span></div>
               <div className="flex justify-between"><span className="text-slate-500">هنري:</span> <span className="font-bold font-mono bg-slate-100 px-1 rounded">{agent1Analysis.henryClassification}</span></div>
               <div className="flex justify-between"><span className="text-slate-500">الجودة:</span> <span className="font-bold text-green-600">{agent1Analysis.ridgeQuality}</span></div>
               <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">الميزات الفريدة:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent1Analysis.distinctiveFeatures.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Agent Gamma (Comparison) */}
         <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner flex flex-col justify-center">
            <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2 justify-center">
              <GitCompare className="w-4 h-4 text-slate-600" />
              Agent Gamma: المقارنة
            </h4>
            <div className="text-center space-y-3">
               <div>
                 <span className="text-xs text-slate-400 uppercase">نقاط مشتركة</span>
                 <div className="text-2xl font-bold text-slate-700">{comparisonAgent.minutiaeMatch.commonPointsFound.length}</div>
               </div>
               <div>
                  <span className="text-xs text-slate-400 uppercase">تطابق الأنماط</span>
                  <div className="text-lg font-bold text-indigo-600">{comparisonAgent.patternMatch.score}%</div>
               </div>
               <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-2 mt-1">
                 "{comparisonAgent.patternMatch.explanation.substring(0, 60)}..."
               </p>
            </div>
         </div>

         {/* Agent Beta */}
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
            <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-600" />
              Agent Beta: الهدف
            </h4>
            <div className="space-y-2 text-sm">
               <div className="flex justify-between"><span className="text-slate-500">النمط:</span> <span className="font-bold">{agent2Analysis.patternType}</span></div>
               <div className="flex justify-between"><span className="text-slate-500">هنري:</span> <span className="font-bold font-mono bg-slate-100 px-1 rounded">{agent2Analysis.henryClassification}</span></div>
               <div className="flex justify-between"><span className="text-slate-500">الجودة:</span> <span className="font-bold text-green-600">{agent2Analysis.ridgeQuality}</span></div>
               <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">الميزات الفريدة:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent2Analysis.distinctiveFeatures.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Agents Grid 1: Quality & Forgery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up delay-200">
        
        {/* Quality Agent Delta */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
            <Microscope className="w-4 h-4 text-blue-600" />
            Agent Delta: فحص جودة الصور
          </h4>
          <div className="space-y-4">
             <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">البصمة المرجعية:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${qualityAgent.file1.qualityScore > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {qualityAgent.file1.qualityScore}/100
                </span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">بصمة المشتبه:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${qualityAgent.file2.qualityScore > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {qualityAgent.file2.qualityScore}/100
                </span>
             </div>
             {(qualityAgent.file1.issues.length > 0 || qualityAgent.file2.issues.length > 0) && (
               <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                 <strong>ملاحظات الجودة:</strong> {qualityAgent.file1.recommendation}
               </div>
             )}
          </div>
        </div>

        {/* Forgery Agent Epsilon */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            Agent Epsilon: كشف التزييف
          </h4>
          <div className="space-y-4">
             <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">موثوقية المصدر:</span>
                <div className="flex items-center gap-2">
                  {forgeryAgent.file1.isAuthentic && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                  <span className="font-bold">{forgeryAgent.file1.authenticityScore}%</span>
                </div>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">موثوقية الهدف:</span>
                <div className="flex items-center gap-2">
                   {forgeryAgent.file2.isAuthentic && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                   <span className="font-bold">{forgeryAgent.file2.authenticityScore}%</span>
                </div>
             </div>
             {forgeryAgent.file1.riskFactors.length > 0 && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  <strong>مخاطر:</strong> {forgeryAgent.file1.riskFactors.join(', ')}
                </div>
             )}
          </div>
        </div>

      </div>

      {/* Agents Grid 2: Zeta & Sigma (Statistics & Biology) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up delay-200">
        
        {/* Agent Zeta (Galton) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-orange-600" />
                Agent Zeta: تفاصيل غالتون (إحصائي)
              </div>
              <div className="flex text-[10px] gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              </div>
            </h4>
            
            {agentZeta ? (
               <div className="grid grid-cols-2 gap-3">
                 <StatBox label="تفرعات" value1={agentZeta.file1.bifurcations} value2={agentZeta.file2.bifurcations} icon={GitMerge} color="text-blue-500" />
                 <StatBox label="نهايات" value1={agentZeta.file1.ridgeEndings} value2={agentZeta.file2.ridgeEndings} icon={Minus} color="text-red-500" />
                 <StatBox label="نقاط/جزر" value1={agentZeta.file1.dots} value2={agentZeta.file2.dots} icon={CircleDot} color="text-green-500" />
                 <div className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 mb-1">التعقيد</span>
                    <span className="text-xs font-bold">{agentZeta.file1.overallComplexity}</span>
                 </div>
               </div>
            ) : null}
        </div>

        {/* Agent Sigma (Biological) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-pink-600" />
                Agent Sigma: المحلل البيولوجي (Level 3)
              </div>
            </h4>
            
            {agentSigma ? (
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-500">حواف الخطوط (Edgeoscopy):</span>
                    <span className="font-medium bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-xs">{agentSigma.file1.edgeShape}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-500">المسام (Poroscopy):</span>
                    <span className="font-medium flex items-center gap-1">
                      {agentSigma.file1.poresVisible ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-slate-300" />}
                      <span className="text-xs">{agentSigma.file1.poreCountEstimate} مسام مقدرة</span>
                    </span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                       <span className="block text-slate-400 mb-1">ندوب دائمة:</span>
                       {agentSigma.file1.scars.length > 0 ? agentSigma.file1.scars.join(', ') : 'لا يوجد'}
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                       <span className="block text-slate-400 mb-1">تجاعيد مؤقتة:</span>
                       {agentSigma.file1.creases.length > 0 ? agentSigma.file1.creases.join(', ') : 'لا يوجد'}
                    </div>
                 </div>
               </div>
            ) : null}
        </div>

      </div>

      {/* Agents Grid 3: Theta (Distortion) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up delay-200">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
            <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
              <Move className="w-4 h-4 text-cyan-600" />
              Agent Theta: محلل التشويه الميكانيكي (Distortion Analysis)
            </h4>
            
            {agentTheta && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* File 1 Analysis */}
                <div className="space-y-2 border-l border-slate-100 pl-4 md:border-l-0 md:border-r md:pr-4 md:pl-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">المصدر (File 1)</span>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">مستوى الضغط:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${agentTheta.file1.pressureLevel === 'شديد' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {agentTheta.file1.pressureLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">الالتواء (Torsion):</span>
                    <span>{agentTheta.file1.torsionDetected ? 'موجود ⚠️' : 'غير موجود'}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>المناطق المتأثرة:</strong> {agentTheta.file1.affectedZones.length > 0 ? agentTheta.file1.affectedZones.join(', ') : 'لا يوجد'}
                  </div>
                </div>

                {/* File 2 Analysis */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">الهدف (File 2)</span>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">مستوى الضغط:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${agentTheta.file2.pressureLevel === 'شديد' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {agentTheta.file2.pressureLevel}
                    </span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">الالتواء (Torsion):</span>
                    <span>{agentTheta.file2.torsionDetected ? 'موجود ⚠️' : 'غير موجود'}</span>
                  </div>
                   <div className="text-xs text-slate-500">
                    <strong>المناطق المتأثرة:</strong> {agentTheta.file2.affectedZones.length > 0 ? agentTheta.file2.affectedZones.join(', ') : 'لا يوجد'}
                  </div>
                </div>

              </div>
            )}
         </div>
      </div>

      {/* Agents Grid 4: Omega (Legal) */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700 animate-fade-up delay-300">
        <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-indigo-300">
          <Gavel className="w-5 h-5" />
          Agent Omega: المقيم القانوني (Expert Witness)
        </h4>

        {agentOmega && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 uppercase tracking-widest block mb-2">بيان الخبير الرسمي</span>
                <p className="text-sm leading-relaxed font-medium text-slate-200">
                  "{agentOmega.finalExpertStatement}"
                </p>
              </div>
              <div className="text-xs text-red-300">
                <strong>ملاحظات للدفاع (Risk):</strong> {agentOmega.defenseNotes}
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center">
              <div className="text-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 mb-1">حالة القبول القانوني</span>
                <span className={`font-bold text-sm ${agentOmega.admissibilityStatus === 'غير صالح قانونياً' ? 'text-red-400' : 'text-green-400'}`}>
                  {agentOmega.admissibilityStatus}
                </span>
              </div>
              <div className="text-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                 <span className="block text-xs text-slate-400 mb-1">درجة الثقة القانونية</span>
                 <div className="flex items-center justify-center gap-2">
                   <Scale className="w-4 h-4 text-indigo-400" />
                   <span className="font-mono font-bold text-lg">{agentOmega.legalConfidenceScore}%</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Results;
