import React, { useEffect } from 'react';
import { DemoStep } from '../types/vlsi';
import { DEMO_STEPS, JUDGE_QUESTIONS_MAP } from '../data/circuitsData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Compass, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

interface JudgeHUDProps {
  currentStepIndex: number;
  timeSec: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isAudioEnabled: boolean;
  isInteractiveMode: boolean;
  onTogglePlay: () => void;
  onSetStep: (index: number) => void;
  onSetSpeed: (speed: number) => void;
  onToggleAudio: () => void;
  onToggleInteractiveMode: () => void;
  onReset: () => void;
}

export const JudgeHUD: React.FC<JudgeHUDProps> = ({
  currentStepIndex,
  timeSec,
  isPlaying,
  playbackSpeed,
  isAudioEnabled,
  isInteractiveMode,
  onTogglePlay,
  onSetStep,
  onSetSpeed,
  onToggleAudio,
  onToggleInteractiveMode,
  onReset,
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const maxTimeSec = 120;

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-[#070b14] border-b border-slate-800 text-slate-200 font-mono text-xs select-none sticky top-0 z-50 shadow-xl backdrop-blur-md">
      {/* Top Bar: Title & Mode Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-sm tracking-wider text-white">
            AI-ATPG
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-semibold text-xs tracking-wide">
            TECHgium 120s EXECUTIVE DEMO
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-[10px] font-bold">
            ISCAS'85 BENCHMARK
          </span>
        </div>

        {/* Mode Switch & Sound Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioEnabled ? 'Mute EDA Telemetry Audio' : 'Enable EDA Telemetry Audio'}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Mode toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
            <button
              onClick={() => {
                if (isInteractiveMode) onToggleInteractiveMode();
              }}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer ${
                !isInteractiveMode
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>120s Cinematic Autopilot</span>
            </button>
            <button
              onClick={() => {
                if (!isInteractiveMode) onToggleInteractiveMode();
              }}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer ${
                isInteractiveMode
                  ? 'bg-amber-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Interactive EDA Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary HUD Row: Timer, Question & Play Controls */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Playback transport & Timer */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset Timeline to 0:00"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle (1x, 1.5x, 2x) */}
          <button
            onClick={() => {
              const speeds = [1.0, 1.5, 2.0];
              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              onSetSpeed(speeds[nextIdx]);
            }}
            className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[11px] text-cyan-300 font-bold transition cursor-pointer"
          >
            {playbackSpeed}x
          </button>

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-bold text-sm">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white">{formatTime(timeSec)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">2:00</span>
          </div>

          {/* Step Prev / Next */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSetStep(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetStep(Math.min(DEMO_STEPS.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center / Right: Current Judge Question Highlight */}
        <div className="flex-1 max-w-2xl bg-slate-950/80 border border-slate-800/90 rounded px-3 py-1.5 flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
                JUDGE EVALUATION
              </span>
              <span className="font-bold text-xs text-amber-300 truncate">
                {currentStep.judgeQuestion}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 truncate mt-0.5">
              {currentStep.title} — <span className="text-slate-400">{currentStep.subtitle}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 block">STEP</span>
            <span className="text-xs font-bold text-white">
              {currentStepIndex + 1} / {DEMO_STEPS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Scrubbable Timeline Track */}
      <div className="max-w-7xl mx-auto px-4 pb-2">
        <div className="relative w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-400 transition-all duration-200"
            style={{ width: `${Math.min(100, (timeSec / maxTimeSec) * 100)}%` }}
          />
        </div>

        {/* Step Marker Pills */}
        <div className="grid grid-cols-8 gap-1 mt-1 text-[9px] text-slate-500">
          {DEMO_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => onSetStep(idx)}
              className={`truncate text-left pt-0.5 transition hover:text-slate-300 cursor-pointer ${
                idx === currentStepIndex ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              {idx + 1}. {step.judgeQuestion.replace(/^\d+\.\s*/, '').split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
