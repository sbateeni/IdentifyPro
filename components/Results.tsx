
import React from 'react';
import { ComparisonResult } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Activity, GitCompare, FileText, ShieldAlert, Printer, Microscope, Eye, Fingerprint, Link, Ruler, GitMerge, Minus, CircleDot, BadgeCheck, Scale, Gavel, Dna, FileWarning, Layers, Download, Move } from 'lucide-react';

interface ResultsProps {
  result: ComparisonResult;
}

const Results: React.FC<ResultsProps> = ({ result }) => {
  const { qualityAgent, forgeryAgent, agentZeta, agentSigma, agentTheta, agentOmega, agent1Analysis, agent2Analysis, comparisonAgent, finalResult, chainOfCustody } = result;

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
            <Link className="w-4 h-4" />
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

      {/* Agents Grid 1: Quality & Forgery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up delay-100">
        
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

      {/* Agents Grid 3: Theta (Distortion) - NEW */}
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

      {/* Agents Grid 4: Omega (Legal) - NEW */}
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
