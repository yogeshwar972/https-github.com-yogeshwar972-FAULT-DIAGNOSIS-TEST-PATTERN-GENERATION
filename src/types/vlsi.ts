export type CircuitId = 'c6288' | 'c7552' | 'c5315' | 'c1908';

export interface CircuitInfo {
  id: CircuitId;
  name: string;
  category: string;
  description: string;
  gateCount: number;
  inputCount: number;
  outputCount: number;
  totalFaults: number;
  criticalPathDelayNs: number;
  reconvergentFanoutComplexity: 'Extreme' | 'High' | 'Moderate';
  traditionalAtpgTimeSec: number;
  aiAtpgTimeSec: number;
  traditionalPatterns: number;
  aiPatterns: number;
  traditionalCoverage: number;
  aiCoverage: number;
  faultyGate: string;
  faultNet: string;
  faultType: 'Stuck-at-0 (SA0)' | 'Stuck-at-1 (SA1)' | 'Bridging' | 'Transition Delay';
  faultCoord: { x: number; y: number; layer: string };
  reasonForChallenge: string;
}

export type PipelineStageId = 
  | 'circuit'
  | 'atpg'
  | 'dtr'
  | 'ssae'
  | 'softmax'
  | 'fsim'
  | 'coverage';

export interface PipelineStageInfo {
  id: PipelineStageId;
  label: string;
  shortDesc: string;
  fullDesc: string;
  techDetails: string[];
  equation?: string;
  outputArtifact: string;
  metric: { label: string; value: string };
}

export interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  judgeQuestion: string; // The 7 key judge questions
  startTimeSec: number;
  durationSec: number;
  stageHighlight?: PipelineStageId;
  cameraMode: 'overview' | 'die_perspective' | 'zoom_fault' | 'gate_schematic' | 'comparison' | 'finale';
}

export interface FaultCandidate {
  rank: number;
  gateId: string;
  netName: string;
  type: string;
  probability: number;
  isTrueFault: boolean;
  pinSensitized: string;
  cellType: string;
}
