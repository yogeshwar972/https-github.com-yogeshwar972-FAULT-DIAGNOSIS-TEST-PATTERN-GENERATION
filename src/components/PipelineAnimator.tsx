import React from 'react';
import { PIPELINE_STAGES } from '../data/circuitsData';
import { PipelineStageId, PipelineStageInfo, CircuitInfo } from '../types/vlsi';
import { 
  Network, 
  Cpu, 
  Minimize2, 
  GitCommit, 
  BarChart, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';

interface PipelineAnimatorProps {
  currentStageId: PipelineStageId;
  onSelectStage: (stageId: PipelineStageId) => void;
  circuit: CircuitInfo;
  isRunningAnalysis: boolean;
}

const STAGE_ICONS: Record<PipelineStageId, React.ComponentType<{ className?: string }>> = {
  circuit: Network,
  atpg: Cpu,
  dtr: Minimize2,
  ssae: Layers,
  softmax: BarChart,
  fsim: GitCommit,
  coverage: CheckCircle2,
};

export const PipelineAnimator: React.FC<PipelineAnimatorProps> = ({
  currentStageId,
  onSelectStage,
  circuit,
  isRunningAnalysis,
}) => {
  const currentStageIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStageId);
  const selectedStage = PIPELINE_STAGES.find(s => s.id === currentStageId) || PIPELINE_STAGES[0];

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-wider uppercase font-semibold text-slate-200">
            7-Stage Autonomous AI-ATPG Pipeline
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            [Target: {circuit.id} · {circuit.gateCount} Gates]
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunningAnalysis ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            {isRunningAnalysis ? 'PIPELINE ACTIVE' : 'STEADY STATE'}
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Pipeline Stepper */}
      <div className="relative">
        {/* Background Connecting Bus Line */}
        <div className="absolute top-1/2 left-6 right-6 h-[2px] -translate-y-1/2 bg-slate-800 -z-0" />
        {/* Active progress line */}
        <div 
          className="absolute top-1/2 left-6 h-[2px] -translate-y-1/2 bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-500 -z-0 transition-all duration-500"
          style={{ width: `${(currentStageIndex / (PIPELINE_STAGES.length - 1)) * 92}%` }}
        />

        <div className="grid grid-cols-7 gap-1 relative z-10">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = STAGE_ICONS[stage.id];
            const isCurrent = stage.id === currentStageId;
            const isCompleted = idx <= currentStageIndex;

            return (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className={`group flex flex-col items-center text-center p-2 rounded transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-slate-900 border border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                    : isCompleted
                    ? 'bg-slate-950/60 border border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border border-slate-900 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Stage Node Icon */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400 shadow-md shadow-cyan-500/20'
                      : isCompleted
                      ? 'bg-slate-800 text-emerald-400'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Stage Title */}
                <span
                  className={`text-[11px] font-mono font-bold tracking-tight uppercase leading-tight ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {stage.label.split('. ')[1]}
                </span>

                {/* Subtitle / Metric */}
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-full">
                  {stage.metric.value}
                </span>

                {/* Live Activity Indicator */}
                {isCurrent && isRunningAnalysis && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Panel (Engineering & Formal Specifications) */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded p-3 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold text-sm">
                STAGE {currentStageIndex + 1}: {selectedStage.label.toUpperCase()}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                · {selectedStage.shortDesc}
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
              {selectedStage.fullDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-mono text-xs rounded">
              {selectedStage.metric.label}: <strong className="text-white">{selectedStage.metric.value}</strong>
            </span>
          </div>
        </div>

        {/* Engineering breakdown & equation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2.5 text-[11px] font-mono">
          <div className="md:col-span-2">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Key Mechanism & Algorithmic Guarantee
            </span>
            <ul className="space-y-1 text-slate-300">
              {selectedStage.techDetails.map((td, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 mt-0.5">▸</span>
                  <span>{td}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded p-2 flex flex-col justify-between">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Formal Artifact / Output
              </span>
              <span className="text-slate-300 text-[10px] font-mono break-all">
                {selectedStage.outputArtifact}
              </span>
            </div>
            {selectedStage.equation && (
              <div className="mt-2 pt-1.5 border-t border-slate-800/70">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block">
                  Governing Formulation
                </span>
                <span className="text-amber-400/90 text-[10px] font-mono">
                  {selectedStage.equation}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
