import React from 'react';
import { CircuitInfo, CircuitId } from '../types/vlsi';
import { CIRCUITS_DATA, JUDGE_QUESTIONS_MAP } from '../data/circuitsData';
import { 
  Play, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Layers, 
  BarChart3, 
  ArrowRight,
  Compass,
  CheckCircle2,
  FileCode2
} from 'lucide-react';

interface LandingHeroProps {
  selectedCircuit: CircuitInfo;
  onSelectCircuit: (circuit: CircuitInfo) => void;
  onStartDemo: () => void;
  onOpenQuestion: (questionIndex: number) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  selectedCircuit,
  onSelectCircuit,
  onStartDemo,
  onOpenQuestion,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0c1222] via-[#080d19] to-[#04060c] border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          {/* Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              TECHgium Innovation Entry
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
              VLSI Silicon Test Engineering
            </span>
            <span className="text-slate-400 font-mono text-xs">
              Autonomous Test Pattern Generation & Neural Diagnosis
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            AI-ATPG & Neural Silicon Fault Diagnosis
          </h1>

          {/* Subtitle / Executive Summary */}
          <p className="text-slate-300 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
            Eliminating the exponential backtracking ceiling in complex VLSI multipliers (ISCAS'85 c6288). 
            Combining neural-guided path sensitization with Stacked Sparse Autoencoders (SSAE) and closed-loop FSIM verification.
          </p>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 font-mono">
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Pattern Compaction</span>
              <span className="text-2xl font-bold text-cyan-400">-64.1%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">1,480 → 532 vectors</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">ATPG Acceleration</span>
              <span className="text-2xl font-bold text-amber-400">8.4× Faster</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">142.8s → 17.1s execution</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Verified Fault Coverage</span>
              <span className="text-2xl font-bold text-emerald-400">99.74%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">100% test efficiency (FSIM)</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartDemo}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-sm rounded-lg shadow-xl shadow-cyan-950/50 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>LAUNCH 120s CINEMATIC JUDGE SHOWCASE</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              Or explore circuits & pipeline below ↓
            </span>
          </div>
        </div>
      </div>

      {/* Benchmark Selection Bar (Default: c6288) */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono tracking-wider uppercase font-semibold text-slate-200">
              Select ISCAS'85 VLSI Benchmark Netlist
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Primary Target: <strong className="text-cyan-300">c6288 (16x16 Multiplier)</strong>
          </span>
        </div>

        {/* Circuit Card Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {Object.values(CIRCUITS_DATA).map((circ) => {
            const isSelected = circ.id === selectedCircuit.id;
            return (
              <button
                key={circ.id}
                onClick={() => onSelectCircuit(circ)}
                className={`p-3 rounded-lg border text-left transition font-mono flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/40 text-slate-100 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-sm ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {circ.name}
                    </span>
                    {circ.id === 'c6288' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-700 text-amber-300 uppercase font-bold">
                        Challenge
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{circ.category}</span>
                  <div className="mt-2 text-[10px] space-y-1 text-slate-500">
                    <div className="flex justify-between">
                      <span>Gate Count:</span>
                      <span className="text-slate-300 font-semibold">{circ.gateCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Single Stuck-At:</span>
                      <span className="text-slate-300 font-semibold">{circ.totalFaults.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reconvergence:</span>
                      <span className={circ.reconvergentFanoutComplexity === 'Extreme' ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                        {circ.reconvergentFanoutComplexity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">AI ATPG Time:</span>
                  <span className="text-emerald-400 font-bold">{circ.aiAtpgTimeSec}s</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* The 7 Core Judge Evaluation Points */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider uppercase font-semibold text-slate-200">
              The 7 Core Questions for TECHgium Judges (120-Second Navigation)
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Click any question to inspect
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {JUDGE_QUESTIONS_MAP.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onOpenQuestion(idx)}
              className="bg-slate-950/60 border border-slate-800/80 hover:border-cyan-700/60 p-3 rounded transition cursor-pointer flex flex-col justify-between font-mono group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300 group-hover:text-cyan-300 transition">
                    {item.q}
                  </span>
                  <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {item.highlightTag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300">
                  {item.a}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Evaluate in Demo Flow</span>
                <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
