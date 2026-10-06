/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CircuitInfo, PipelineStageId, DemoStep } from './types/vlsi';
import { CIRCUITS_DATA, PIPELINE_STAGES, DEMO_STEPS, JUDGE_QUESTIONS_MAP } from './data/circuitsData';
import { Chip3DCanvas } from './components/Chip3DCanvas';
import { PipelineAnimator } from './components/PipelineAnimator';
import { FaultDiagnosisPanel } from './components/FaultDiagnosisPanel';
import { ComparisonView } from './components/ComparisonView';
import { VerdictBadge } from './components/VerdictBadge';
import { JudgeHUD } from './components/JudgeHUD';
import { LandingHero } from './components/LandingHero';
import { soundEffects } from './utils/audio';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Maximize2,
  Compass,
  FileCode2,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Current selected benchmark circuit (Default: c6288)
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitInfo>(CIRCUITS_DATA.c6288);

  // 120-Second Demo State
  const [timeSec, setTimeSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);

  // Active pipeline stage
  const [activePipelineStage, setActivePipelineStage] = useState<PipelineStageId>('circuit');
  const [isFaultDetected, setIsFaultDetected] = useState<boolean>(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState<boolean>(false);

  // Determine current demo step based on timeSec
  const currentStepIndex = DEMO_STEPS.findIndex((step, idx) => {
    const nextStep = DEMO_STEPS[idx + 1];
    if (!nextStep) return true;
    return timeSec >= step.startTimeSec && timeSec < nextStep.startTimeSec;
  });

  const currentStep = DEMO_STEPS[currentStepIndex !== -1 ? currentStepIndex : 0];

  // Camera mode derived from demo step or interactive mode
  const cameraMode = isInteractiveMode 
    ? (isFaultDetected ? 'zoom_fault' : 'die_perspective')
    : currentStep.cameraMode;

  // Sound handler
  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    soundEffects.setMuted(!next);
    if (next) soundEffects.playClick();
  };

  // Timer loop for 120s Demo
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100; // 10 updates per second
    const timer = setInterval(() => {
      setTimeSec((prev) => {
        const next = prev + (0.1 * playbackSpeed);
        if (next >= 120) {
          setIsPlaying(false);
          soundEffects.playPassChime();
          return 120;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Sync pipeline stages and state based on current timeSec
  useEffect(() => {
    if (isInteractiveMode) return;

    // Step 1: 0 - 15s (Landing / The Challenge)
    if (timeSec < 15) {
      setIsFaultDetected(false);
      setIsRunningAnalysis(false);
    }
    // Step 2: 15 - 30s (3D Chip architecture)
    else if (timeSec >= 15 && timeSec < 30) {
      setIsFaultDetected(false);
      setIsRunningAnalysis(false);
    }
    // Step 3: 30 - 42s (Select c6288)
    else if (timeSec >= 30 && timeSec < 42) {
      if (selectedCircuit.id !== 'c6288') {
        setSelectedCircuit(CIRCUITS_DATA.c6288);
      }
      setIsFaultDetected(false);
      setIsRunningAnalysis(false);
    }
    // Step 4: 42 - 68s (RUN ANALYSIS: Circuit -> ATPG -> DTR -> SSAE -> Softmax -> FSIM -> Coverage)
    else if (timeSec >= 42 && timeSec < 68) {
      setIsRunningAnalysis(true);
      const stageElapsed = timeSec - 42;
      const totalStageDuration = 26;
      const stageIndex = Math.min(
        PIPELINE_STAGES.length - 1,
        Math.floor((stageElapsed / totalStageDuration) * PIPELINE_STAGES.length)
      );
      const newStage = PIPELINE_STAGES[stageIndex].id;
      if (newStage !== activePipelineStage) {
        setActivePipelineStage(newStage);
        soundEffects.playStageShift();
      }
      setIsFaultDetected(stageIndex >= 4); // Detected by Softmax stage
    }
    // Step 5: 68 - 86s (Zoom to detected fault on Metal-2)
    else if (timeSec >= 68 && timeSec < 86) {
      setIsRunningAnalysis(false);
      setIsFaultDetected(true);
      setActivePipelineStage('fsim');
    }
    // Step 6: 86 - 102s (Fault diagnosis SSAE & cycle-accurate verification)
    else if (timeSec >= 86 && timeSec < 102) {
      setIsFaultDetected(true);
      setActivePipelineStage('coverage');
    }
    // Step 7: 102 - 114s (Traditional vs AI comparison)
    else if (timeSec >= 102 && timeSec < 114) {
      setIsFaultDetected(true);
      setActivePipelineStage('coverage');
    }
    // Step 8: 114 - 120s (Finale Verdict)
    else {
      setIsFaultDetected(true);
      setActivePipelineStage('coverage');
    }
  }, [timeSec, isInteractiveMode, selectedCircuit.id, activePipelineStage]);

  // Jump to specific step
  const handleSetStep = (index: number) => {
    const targetStep = DEMO_STEPS[index];
    if (targetStep) {
      setTimeSec(targetStep.startTimeSec);
      soundEffects.playClick();
    }
  };

  // Launch analysis manually or start demo
  const handleLaunchAnalysis = () => {
    setTimeSec(42); // Jump right to RUN ANALYSIS step
    setIsPlaying(true);
    setIsInteractiveMode(false);
    soundEffects.playStageShift();
  };

  const handleStartDemo = () => {
    setTimeSec(0);
    setIsPlaying(true);
    setIsInteractiveMode(false);
    soundEffects.playClick();
  };

  const handleOpenQuestion = (questionIdx: number) => {
    // Map judge question to timeline step
    const stepMap = [0, 1, 3, 4, 5, 5, 6];
    const targetStep = stepMap[questionIdx] ?? 0;
    handleSetStep(targetStep);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Controller HUD */}
      <JudgeHUD
        currentStepIndex={currentStepIndex !== -1 ? currentStepIndex : 0}
        timeSec={timeSec}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        isAudioEnabled={isAudioEnabled}
        isInteractiveMode={isInteractiveMode}
        onTogglePlay={() => {
          setIsPlaying(!isPlaying);
          soundEffects.playClick();
        }}
        onSetStep={handleSetStep}
        onSetSpeed={(s) => setPlaybackSpeed(s)}
        onToggleAudio={toggleAudio}
        onToggleInteractiveMode={() => {
          setIsInteractiveMode(!isInteractiveMode);
          setIsPlaying(false);
          soundEffects.playClick();
        }}
        onReset={() => {
          setTimeSec(0);
          setIsPlaying(false);
          setIsFaultDetected(false);
          soundEffects.playClick();
        }}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* VIEW A: Landing Screen when at Step 1 (0 to 15s) and not in interactive mode */}
        {timeSec < 15 && !isInteractiveMode ? (
          <LandingHero
            selectedCircuit={selectedCircuit}
            onSelectCircuit={(c) => {
              setSelectedCircuit(c);
              soundEffects.playClick();
            }}
            onStartDemo={handleStartDemo}
            onOpenQuestion={handleOpenQuestion}
          />
        ) : (
          /* VIEW B: Active Demonstration / EDA Studio */
          <div className="flex flex-col gap-6">
            {/* Top Operational Status Bar */}
            <div className="bg-[#090e1c] border border-slate-800 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  {selectedCircuit.name} ({selectedCircuit.category})
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">
                  {selectedCircuit.gateCount.toLocaleString()} Gates · {selectedCircuit.totalFaults.toLocaleString()} Stuck-At Faults
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400">
                  Target Fault: {selectedCircuit.faultyGate} ({selectedCircuit.faultType})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isRunningAnalysis && timeSec < 68 && (
                  <button
                    onClick={handleLaunchAnalysis}
                    className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded text-xs transition cursor-pointer shadow-lg shadow-cyan-900/40"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>RUN ANALYSIS</span>
                  </button>
                )}
                {isInteractiveMode && (
                  <select
                    value={selectedCircuit.id}
                    onChange={(e) => {
                      const c = CIRCUITS_DATA[e.target.value];
                      if (c) setSelectedCircuit(c);
                    }}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 font-mono"
                  >
                    {Object.values(CIRCUITS_DATA).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.gateCount} gates)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Split View: 3D Silicon Die (Left) + Pipeline / Diagnosis (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 3D Silicon Die Renderer */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>3D Silicon Die & Microscopic Fault Visualization</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    TSMC 28nm · Physical Coordinates (µm)
                  </span>
                </div>

                <div className="h-[440px] w-full">
                  <Chip3DCanvas
                    circuit={selectedCircuit}
                    cameraMode={cameraMode}
                    isFaultDetected={isFaultDetected}
                    onSelectFaultGate={() => {
                      soundEffects.playFaultAlert();
                      setIsFaultDetected(true);
                    }}
                  />
                </div>

                {/* Microscopic Fault Site Spec Box */}
                {isFaultDetected && (
                  <div className="bg-rose-950/20 border border-rose-800/60 rounded p-3 text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <span className="text-rose-300 font-bold">
                          PINPOINT FAULT: Gate {selectedCircuit.faultyGate}
                        </span>
                        <span className="text-slate-400 text-[11px] block">
                          Net: {selectedCircuit.faultNet} · {selectedCircuit.faultType} · Layer: {selectedCircuit.faultCoord.layer}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-400 font-bold block">
                        X: {selectedCircuit.faultCoord.x}µm, Y: {selectedCircuit.faultCoord.y}µm
                      </span>
                      <span className="text-[10px] text-emerald-400">FSIM: PO[27] Sensitized</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: 7-Stage Pipeline or Live Diagnosis */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                {/* 7-Stage Pipeline Animator */}
                <PipelineAnimator
                  currentStageId={activePipelineStage}
                  onSelectStage={(stageId) => {
                    setActivePipelineStage(stageId);
                    soundEffects.playStageShift();
                  }}
                  circuit={selectedCircuit}
                  isRunningAnalysis={isRunningAnalysis}
                />

                {/* Fault Diagnosis & Verification Panel */}
                <FaultDiagnosisPanel
                  circuit={selectedCircuit}
                  isVerified={isFaultDetected}
                />
              </div>
            </div>

            {/* Traditional vs AI Comparison (Steps 7 & 8 or Interactive Mode) */}
            {(timeSec >= 102 || isInteractiveMode) && (
              <ComparisonView circuit={selectedCircuit} />
            )}

            {/* Finale Verdict Badge (Step 8: 114s - 120s or on completion) */}
            {(timeSec >= 114 || timeSec === 120) && (
              <VerdictBadge
                circuit={selectedCircuit}
                onRestartDemo={handleStartDemo}
                onSwitchToInteractive={() => {
                  setIsInteractiveMode(true);
                  setIsPlaying(false);
                }}
              />
            )}
          </div>
        )}

        {/* Bottom Technical Verification Reference for TECHgium Judges */}
        <footer className="mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Autonomous AI-ATPG Engine · Formal Verification Sign-Off</span>
          </div>
          <div className="flex items-center gap-4">
            <span>IEEE 1450 STIL Compliant</span>
            <span>·</span>
            <span>ISCAS'85 Reference Suite</span>
            <span>·</span>
            <span className="text-slate-400">TECHgium 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
