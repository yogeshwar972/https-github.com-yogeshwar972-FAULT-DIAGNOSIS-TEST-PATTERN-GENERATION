import React, { useState } from 'react';
import { CircuitInfo, FaultCandidate } from '../types/vlsi';
import { FAULT_CANDIDATES } from '../data/circuitsData';
import { 
  ShieldAlert, 
  CheckCircle2, 
  GitBranch, 
  Cpu, 
  Activity, 
  Zap, 
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

interface FaultDiagnosisPanelProps {
  circuit: CircuitInfo;
  isVerified: boolean;
  activeTab?: 'diagnosis' | 'schematic' | 'fsim' | 'coverage';
}

export const FaultDiagnosisPanel: React.FC<FaultDiagnosisPanelProps> = ({
  circuit,
  isVerified,
}) => {
  const [tab, setTab] = useState<'diagnosis' | 'schematic' | 'fsim' | 'coverage'>('diagnosis');
  const [selectedCandidate, setSelectedCandidate] = useState<FaultCandidate>(FAULT_CANDIDATES[0]);

  // Mock latent vector dimensions (16-D bottleneck)
  const latentVector = [
    0.82, -0.45, 0.91, 0.12, -0.73, 0.65, -0.33, 0.88,
    -0.19, 0.74, -0.61, 0.42, 0.95, -0.28, 0.53, -0.84
  ];

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono tracking-wider uppercase font-semibold text-slate-200">
            Silicon Fault Isolation & Verification Console
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800/80">
          <button
            onClick={() => setTab('diagnosis')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition ${
              tab === 'diagnosis' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SSAE & Softmax
          </button>
          <button
            onClick={() => setTab('schematic')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition ${
              tab === 'schematic' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gate D-Trace
          </button>
          <button
            onClick={() => setTab('fsim')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition ${
              tab === 'fsim' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FSIM Verification
          </button>
          <button
            onClick={() => setTab('coverage')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition ${
              tab === 'coverage' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Coverage Analysis
          </button>
        </div>
      </div>

      {/* TAB 1: SSAE + Softmax Diagnosis */}
      {tab === 'diagnosis' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Left Column: Suspect Candidate Ranking */}
          <div className="md:col-span-5 bg-slate-950/70 border border-slate-800/90 rounded p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  Softmax Posterior Suspect List
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  Latency: 2.4 ms
                </span>
              </div>

              <div className="mt-2 space-y-1.5">
                {FAULT_CANDIDATES.map((cand) => (
                  <button
                    key={cand.gateId}
                    onClick={() => setSelectedCandidate(cand)}
                    className={`w-full text-left p-2 rounded border transition flex items-center justify-between font-mono ${
                      selectedCandidate.gateId === cand.gateId
                        ? 'bg-rose-950/40 border-rose-600/70 text-rose-200'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <span className={cand.isTrueFault ? 'text-rose-400' : 'text-slate-300'}>
                          #{cand.rank} {cand.gateId}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({cand.cellType})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Net: {cand.netName} · {cand.type}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-cyan-300">
                        {(cand.probability * 100).toFixed(2)}%
                      </div>
                      <span className="text-[9px] text-slate-500">Confidence</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected fault metadata */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 font-mono text-[11px] space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Physical Coordinates:</span>
                <span className="text-amber-400">X={circuit.faultCoord.x}µm, Y={circuit.faultCoord.y}µm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Interconnect Layer:</span>
                <span className="text-cyan-400">{circuit.faultCoord.layer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Circuit Sub-block:</span>
                <span className="text-slate-300">Adder Tree Stage 14 (Wallace Array)</span>
              </div>
            </div>
          </div>

          {/* Right Column: SSAE Latent Representation & Neural Compression */}
          <div className="md:col-span-7 bg-slate-950/70 border border-slate-800/90 rounded p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  SSAE 16-D Bottleneck Latent Syndrome Z
                </span>
                <span className="font-mono text-[10px] text-cyan-400">
                  KL Sparsity Penalty: ρ = 0.05
                </span>
              </div>

              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                Raw 128-bit test response syndrome is projected into a non-linear 16-D manifold. 
                Sparsity constraints isolate unique gate activation topologies while suppressing observation noise.
              </p>

              {/* Latent Vector Visualization Bars */}
              <div className="mt-3">
                <div className="grid grid-cols-16 gap-1 h-14 items-end bg-slate-900/50 p-2 rounded border border-slate-800/50">
                  {latentVector.map((val, idx) => {
                    const heightPercent = Math.abs(val) * 100;
                    const isPositive = val >= 0;
                    return (
                      <div key={idx} className="h-full flex flex-col justify-end items-center group relative">
                        <div
                          className={`w-full rounded-t transition-all ${
                            isPositive ? 'bg-cyan-400' : 'bg-rose-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-slate-900 text-[9px] px-1 rounded border border-slate-700 pointer-events-none z-20 font-mono">
                          Z[{idx}]: {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>Dimension Z[0]</span>
                  <span>Feature Bottleneck Embedding (16-D)</span>
                  <span>Dimension Z[15]</span>
                </div>
              </div>
            </div>

            {/* Neural Architecture Breakdown */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
              <div className="p-1.5 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-500 block">Input Layer</span>
                <span className="text-cyan-300 font-bold">128 Neurons</span>
              </div>
              <div className="p-1.5 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-500 block">Sparse Hidden</span>
                <span className="text-amber-300 font-bold">64 Neurons</span>
              </div>
              <div className="p-1.5 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-500 block">Latent Embedding</span>
                <span className="text-emerald-300 font-bold">16 Neurons</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Gate-level Schematic & D-Algorithm Trace */}
      {tab === 'schematic' && (
        <div className="bg-slate-950/70 border border-slate-800/90 rounded p-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Roth’s 5-Valued D-Calculus Sensitization Path (0, 1, D, D̄, X)
            </span>
            <span className="font-mono text-[10px] text-rose-400">
              Active Fault Site: G2419 [NAND4_X1 / SA0]
            </span>
          </div>

          {/* Logic propagation visualizer */}
          <div className="mt-3 p-4 bg-slate-900/40 rounded border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            {/* Primary Inputs */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex flex-col gap-1 w-full md:w-44">
              <span className="text-[10px] text-slate-500 font-semibold">PRIMARY INPUTS</span>
              <div className="flex justify-between text-slate-300">
                <span>A[15] = <strong className="text-emerald-400">1</strong></span>
                <span>B[14] = <strong className="text-emerald-400">1</strong></span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>A[13] = <strong className="text-emerald-400">1</strong></span>
                <span>B[12] = <strong className="text-emerald-400">1</strong></span>
              </div>
              <span className="text-[9px] text-emerald-400/90 mt-1">✓ Non-controlling 1s satisfied</span>
            </div>

            <ChevronRight className="w-5 h-5 text-cyan-400 hidden md:block shrink-0" />

            {/* Fault Gate G2419 */}
            <div className="p-3 bg-rose-950/40 border border-rose-700/60 rounded flex flex-col gap-1.5 w-full md:w-56 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>FAULT SITE: G2419</span>
              </div>
              <span className="text-[10px] text-slate-400">NAND4 Logic: y = (A·B·C·D)'</span>
              <div className="p-1 bg-slate-950 rounded border border-rose-900/50 text-[11px] text-rose-200">
                <span>Golden = <strong>0</strong> | Fault = <strong>0 (SA0)</strong></span>
                <span className="block text-amber-300 font-bold">Discrepancy D Activated</span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-cyan-400 hidden md:block shrink-0" />

            {/* Intermediate Reconvergent Logic */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded flex flex-col gap-1 w-full md:w-48">
              <span className="text-[10px] text-slate-500 font-semibold">RECONVERGENT TREE</span>
              <span className="text-slate-300">Gate G2510 (NOR2): <strong className="text-amber-400">D̄</strong></span>
              <span className="text-slate-300">Gate G2604 (XOR2): <strong className="text-amber-400">D</strong></span>
              <span className="text-[9px] text-cyan-400 mt-1">D-frontier propagated without collision</span>
            </div>

            <ChevronRight className="w-5 h-5 text-cyan-400 hidden md:block shrink-0" />

            {/* Primary Output */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-700/60 rounded flex flex-col gap-1 w-full md:w-44 text-right">
              <span className="text-[10px] text-emerald-400 font-semibold">OBSERVATION PO</span>
              <span className="text-slate-200 font-bold text-sm">PO[27]</span>
              <span className="text-[10px] text-emerald-300 font-mono">D = 1/0 observed!</span>
              <span className="text-[9px] text-slate-400">Cycle 14 strobe verified</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FSIM Concurrent Fault Simulation Verification */}
      {tab === 'fsim' && (
        <div className="bg-slate-950/70 border border-slate-800/90 rounded p-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Cycle-Accurate Formal Fault Simulation Comparison
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>FORMALLY PROVEN DETECTABLE</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
            {/* Golden vs Faulty machine */}
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] block font-semibold">
                Test Vector T_184 Output Responses
              </span>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded">
                  <span className="text-slate-400">Golden Circuit PO[27..24]:</span>
                  <span className="text-emerald-400 font-bold">0101_2</span>
                </div>
                <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded">
                  <span className="text-rose-400">Faulty Circuit PO[27..24]:</span>
                  <span className="text-rose-300 font-bold">1101_2</span>
                </div>
                <div className="flex justify-between items-center p-1.5 bg-amber-950/40 border border-amber-800/50 rounded">
                  <span className="text-amber-300">Differential XOR (Syndrome):</span>
                  <span className="text-amber-400 font-bold">1000_2 (PO[27] bit flip)</span>
                </div>
              </div>
            </div>

            {/* Simulation statistics */}
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] block font-semibold">
                FSIM Engine Specifications
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Simulator Type:</span>
                  <span>Parallel 32-bit Concurrent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Evaluated Faults:</span>
                  <span>4,812 / 4,812</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">False-Positive Rate:</span>
                  <span className="text-emerald-400 font-bold">0.00% (Exact match)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Simulation Run Time:</span>
                  <span>3.2 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Coverage Analysis */}
      {tab === 'coverage' && (
        <div className="bg-slate-950/70 border border-slate-800/90 rounded p-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Fault Universe & Test Efficiency Breakdown
            </span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold">
              Final Coverage: {circuit.aiCoverage}% (100% Test Efficiency)
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Total Single Stuck-at</span>
              <span className="text-sm font-bold text-slate-200">{circuit.totalFaults}</span>
              <span className="text-[9px] text-slate-500">100.0%</span>
            </div>
            <div className="p-2.5 bg-emerald-950/30 rounded border border-emerald-800/60">
              <span className="text-[10px] text-emerald-400 block">Detected & Isolated</span>
              <span className="text-sm font-bold text-emerald-300">4,800</span>
              <span className="text-[9px] text-emerald-400/80">99.74%</span>
            </div>
            <div className="p-2.5 bg-amber-950/30 rounded border border-amber-800/60">
              <span className="text-[10px] text-amber-400 block">Formally Untestable</span>
              <span className="text-sm font-bold text-amber-300">12</span>
              <span className="text-[9px] text-amber-400/80">0.26% (Redundant)</span>
            </div>
            <div className="p-2.5 bg-rose-950/30 rounded border border-rose-800/60">
              <span className="text-[10px] text-rose-400 block">Undetected Testable</span>
              <span className="text-sm font-bold text-rose-300">0</span>
              <span className="text-[9px] text-rose-400/80">0.00% Defect Escape</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
