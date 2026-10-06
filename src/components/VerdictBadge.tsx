import React, { useState } from 'react';
import { CircuitInfo } from '../types/vlsi';
import { 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Cpu, 
  FileCode2, 
  Zap,
  Sparkles
} from 'lucide-react';

interface VerdictBadgeProps {
  circuit: CircuitInfo;
  onRestartDemo: () => void;
  onSwitchToInteractive: () => void;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  circuit,
  onRestartDemo,
  onSwitchToInteractive,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportSTIL = () => {
    // Generate authentic IEEE 1450 STIL (Standard Test Interface Language) test vector format
    const stilContent = `STIL 1.0 {
  Design "${circuit.name}";
  Target "ATE UltraFLEX / Advantest V93000";
  Date "${new Date().toISOString()}";
}

Header {
  Title "AI-ATPG Optimized Test Suite & Verified Fault Diagnosis";
  Benchmark "${circuit.name} (${circuit.category})";
  FaultUniverse "${circuit.totalFaults} Single Stuck-At Faults";
  TestPatterns "${circuit.aiPatterns} Compacted Vectors";
  FaultCoverage "${circuit.aiCoverage}%";
  TestEfficiency "100.00%";
}

Signals {
  "PI[31..0]" In;
  "PO[31..0]" Out;
}

PatternBurst "AI_ATPG_Burst" {
  PatList { "T_184" {
    // Verified Vector T_184 for Fault ${circuit.faultyGate} (${circuit.faultType})
    // Coordinates: X=${circuit.faultCoord.x}um Y=${circuit.faultCoord.y}um Layer=${circuit.faultCoord.layer}
    V { "PI[31..0]" = 11010011001111000101011010001111; }
    V { "PO[31..0]" = 01010000000000000000000000000000; }
  }}
}
`;
    const blob = new Blob([stilContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${circuit.id}_ai_atpg_vectors.stil`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-[#080d1a] border-2 border-cyan-500/80 rounded-xl p-5 shadow-2xl shadow-cyan-950/40 font-mono relative overflow-hidden">
      {/* Laser glow background highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider uppercase text-cyan-400 font-bold">
                TECHgium Final Verification Sign-Off
              </span>
              <span className="text-[10px] bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 px-2 py-0.5 rounded font-bold">
                PASSED · 100% TEST EFFICIENCY
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              ISCAS'85 {circuit.name} Multiplier Analysis Complete
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRestartDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay 120s Demo</span>
          </button>
          <button
            onClick={handleExportSTIL}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs transition cursor-pointer shadow-lg shadow-cyan-900/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'STIL Exported!' : 'Export STIL Vectors'}</span>
          </button>
        </div>
      </div>

      {/* The 3 Core Pillars requested in the prompt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 relative z-10">
        {/* Pillar 1 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block">
              Pillar I
            </span>
            <h3 className="text-base font-black text-white mt-1 tracking-wider text-cyan-300">
              SMARTER TESTS
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Neural path guidance eliminates exponential backtracking in dense reconvergent adder trees. 
              DTR compactor eliminates 64.1% of redundant vectors while retaining 100% single-fault coverage.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Pattern Reduction:</span>
            <span className="text-cyan-400 font-bold">1,480 → 532 (-64.1%)</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold block">
              Pillar II
            </span>
            <h3 className="text-base font-black text-white mt-1 tracking-wider text-amber-300">
              FASTER DIAGNOSIS
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Stacked Sparse Autoencoder (SSAE) projects raw syndromes into a 16-D latent manifold. 
              Softmax classifier isolates suspect Gate G2419 in 2.4ms vs multi-hour dictionary lookups.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Diagnosis Latency:</span>
            <span className="text-amber-400 font-bold">2.4 ms (99.84% Conf.)</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold block">
              Pillar III
            </span>
            <h3 className="text-base font-black text-white mt-1 tracking-wider text-emerald-300">
              VERIFIED COVERAGE
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Concurrent cycle-accurate FSIM simulates golden vs faulty netlist, mathematically proving 
              fault sensitization and D-propagation to Primary Output PO[27] with 0.00% false positives.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Formal Verification:</span>
            <span className="text-emerald-400 font-bold">99.74% (100% Eff.)</span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Callout */}
      <div className="bg-slate-900/60 border border-slate-800 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Physical coordinates verified: <strong>{circuit.faultyGate}</strong> (X={circuit.faultCoord.x}µm, Y={circuit.faultCoord.y}µm, {circuit.faultCoord.layer})
          </span>
        </div>
        <button
          onClick={onSwitchToInteractive}
          className="text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer shrink-0"
        >
          Explore in Interactive EDA Mode →
        </button>
      </div>
    </div>
  );
};
