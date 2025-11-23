
import React from 'react';
import { ComparisonResult } from '../types';
import { 
  CheckCircle, XCircle, ShieldAlert, Printer, Download, Link as LinkIcon,
  Fingerprint, Microscope, Activity, Layers, Network, Lock,
  Scan, BoxSelect, Ruler, Eye, Zap, Database, Thermometer,
  Wand2, Gavel, Scale, FileSearch, Cpu, ZapOff, Sun, Move
} from 'lucide-react';
import VisualMatcher from './VisualMatcher';
import AgentCard from './AgentCard';

interface ResultsProps {
  result: ComparisonResult;
  file1: File | null;
  file2: File | null;
}

const Results: React.FC<ResultsProps> = ({ result, file1, file2 }) => {
  const { phase1, phase2, phase3, phase4, phase5, visualMapping, finalResult, chainOfCustody } = result;

  const handlePrint = () => window.print();
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const node = document.createElement('a');
    node.href = dataStr;
    node.download = `RidgeAI_QuantumReport_${chainOfCustody.timestamp}.json`;
    document.body.appendChild(node);
    node.click();
    node.remove();
  };

  // Verdict Styling
  let colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";
  let icon = <ShieldAlert className="w-16 h-16 mb-4" />;
  if (finalResult.matchScore > 85) {
    colorClass = "text-green-600 bg-green-50 border-green-200";
    icon = <CheckCircle className="w-16 h-16 mb-4" />;
  } else if (finalResult.matchScore < 40) {
    colorClass = "text-red-600 bg-red-50 border-red-200";
    icon = <XCircle className="w-16 h-16 mb-4" />;
  }

  return (
    <div className="w-full mt-8 space-y-10 relative">
      
      {/* --- HEADER ACTIONS --- */}
      <div className="flex justify-between items-center no-print animate-fade-up">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Report: Quantum Orchestrator</h2>
          <p className="text-xs text-slate-500">30 Agents Active • 5-Phase Pipeline</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportJSON} className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-50">
            <Download className="w-4 h-4" /> JSON
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* --- MAIN VERDICT CARD --- */}
      <div className={`relative p-10 rounded-3xl border-2 flex flex-col items-center text-center ${colorClass} animate-scale-in shadow-xl`}>
        {icon}
        <h1 className="text-6xl font-black mb-2 tracking-tighter">{finalResult.matchScore}%</h1>
        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-6">Probability of Identity</span>
        <div className="bg-white/60 backdrop-blur px-6 py-2 rounded-full text-sm font-bold mb-6 flex items-center gap-2">
           <Lock className="w-4 h-4" />
           Confidence: {finalResult.confidenceLevel}
        </div>
        <p className="text-lg font-medium max-w-2xl leading-relaxed opacity-90">
          {finalResult.forensicConclusion}
        </p>
      </div>

      {/* --- CHAIN OF CUSTODY --- */}
      <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-[10px] font-mono border border-slate-700 animate-fade-up">
        <div className="flex items-center gap-2 mb-2 text-white font-bold uppercase tracking-wider">
          <LinkIcon className="w-3 h-3" /> Digital Chain of Custody
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><span className="block text-slate-600">SOURCE HASH:</span> {chainOfCustody.file1Hash}</div>
          <div><span className="block text-slate-600">TARGET HASH:</span> {chainOfCustody.file2Hash}</div>
        </div>
      </div>

      {/* ================= PHASE 1: STRUCTURAL ================= */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
          Structural Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AgentCard name="Alpha" role="Pattern Classifier" icon={Fingerprint} color="text-blue-600" data={phase1.agentAlpha} delay="delay-100" />
          <AgentCard name="Beta" role="Quality Control" icon={Activity} color="text-blue-500" data={phase1.agentBeta} delay="delay-100" />
          <AgentCard name="Gamma" role="Ridge Flow" icon={Move} color="text-cyan-600" data={phase1.agentGamma} delay="delay-100" />
          <AgentCard name="Delta" role="Math Complexity" icon={Cpu} color="text-indigo-600" data={phase1.agentDelta} delay="delay-100" />
          <AgentCard name="Epsilon" role="Reconstruction Check" icon={Layers} color="text-purple-600" data={phase1.agentEpsilon} delay="delay-200" />
          <AgentCard name="Rho" role="Substrate" icon={BoxSelect} color="text-orange-600" data={phase1.agentRho} delay="delay-200" />
          <AgentCard name="Lyra" role="Geometry" icon={Ruler} color="text-pink-600" data={phase1.agentLyra} delay="delay-200" />
          <AgentCard name="Helios" role="Lighting" icon={Sun} color="text-yellow-600" data={phase1.agentHelios} delay="delay-200" />
        </div>
      </section>

      {/* ================= PHASE 2: MINUTIAE ================= */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-teal-100 text-teal-600 flex items-center justify-center text-xs">2</span>
          Micro & Minutiae Analysis
        </h3>
        {visualMapping && <div className="mb-6"><VisualMatcher data={visualMapping} file1={file1} file2={file2} /></div>}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <AgentCard name="Zeta" role="Minutiae Pairs" icon={Scan} color="text-teal-600" data={phase2.agentZeta} />
           <AgentCard name="Sigma" role="Pores & Edges" icon={Microscope} color="text-emerald-600" data={phase2.agentSigma} />
           <AgentCard name="Theta" role="Distortion" icon={ZapOff} color="text-red-500" data={phase2.agentTheta} />
           <AgentCard name="Kappa" role="Scale & Zoom" icon={BoxSelect} color="text-cyan-500" data={phase2.agentKappa} />
           <AgentCard name="Iota" role="Anatomy Path" icon={Eye} color="text-blue-400" data={phase2.agentIota} />
           <AgentCard name="Quanta" role="Nano Details" icon={Cpu} color="text-violet-500" data={phase2.agentQuanta} />
        </div>
      </section>

      {/* ================= PHASE 3: STATISTICAL ================= */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
          Statistical & Cross-Linking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-full md:col-span-1">
             <AgentCard name="Phi" role="Bayesian Stats" icon={Scale} color="text-indigo-700" data={phase3.agentPhi} />
          </div>
          <div className="col-span-full md:col-span-1">
             <AgentCard name="Psi" role="Identity Linker" icon={Network} color="text-pink-600" data={phase3.agentPsi} />
          </div>
          <AgentCard name="Atlas" role="Global DB" icon={Database} color="text-slate-600" data={phase3.agentAtlas} />
          <AgentCard name="Chronos" role="Time Decay" icon={Activity} color="text-amber-600" data={phase3.agentChronos} />
          <AgentCard name="Tactus" role="Pressure Map" icon={Move} color="text-orange-500" data={phase3.agentTactus} />
          <AgentCard name="Spectra" role="Chemical Sim" icon={Thermometer} color="text-lime-600" data={phase3.agentSpectra} />
        </div>
      </section>

      {/* ================= PHASE 4: RECONSTRUCTION ================= */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-xs">4</span>
          AI Reconstruction & Simulation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
           <AgentCard name="Morphix" role="Restoration" icon={Wand2} color="text-purple-500" data={phase4.agentMorphix} />
           <AgentCard name="Orion" role="Extrapolation" icon={Scan} color="text-fuchsia-500" data={phase4.agentOrion} />
           <AgentCard name="Vulcan" role="Heat Sim" icon={Thermometer} color="text-red-600" data={phase4.agentVulcan} />
           <AgentCard name="Hermes" role="Motion Deblur" icon={Zap} color="text-yellow-500" data={phase4.agentHermes} />
           <AgentCard name="Nemesis" role="Anti-Spoof" icon={ShieldAlert} color="text-red-800" data={phase4.agentNemesis} />
           <AgentCard name="Fornax" role="Noise Filter" icon={Layers} color="text-slate-500" data={phase4.agentFornax} />
        </div>
      </section>

      {/* ================= PHASE 5: CONSOLIDATION ================= */}
      <section className="bg-slate-900 p-6 rounded-2xl text-white shadow-2xl">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-white text-black flex items-center justify-center text-xs">5</span>
          Final Consolidation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3 text-indigo-400">
                 <Gavel className="w-5 h-5" />
                 <h4 className="font-bold">Agent Omega: Expert Witness Statement</h4>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                "{phase5.agentOmega.finalExpertStatement}"
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                 <div className="flex items-center gap-1">
                   <Scale className="w-4 h-4 text-green-400" />
                   Admissibility: <span className="text-white font-bold">{phase5.agentOmega.admissibility}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <FileSearch className="w-4 h-4 text-blue-400" />
                   Rebuttal Check: <span className="text-white">{phase5.agentAegis.defenseRebuttal}</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center">
              <span className="text-xs text-slate-500 uppercase mb-2">Legal Confidence</span>
              <div className="text-4xl font-black text-white mb-1">{phase5.agentOmega.legalConfidence}%</div>
              <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden mt-2">
                 <div className="bg-indigo-500 h-full" style={{width: `${phase5.agentOmega.legalConfidence}%`}}></div>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Results;
