import { CircuitInfo, PipelineStageInfo, DemoStep, FaultCandidate } from '../types/vlsi';

export const CIRCUITS_DATA: Record<string, CircuitInfo> = {
  c6288: {
    id: 'c6288',
    name: "ISCAS'85 c6288",
    category: '16x16-bit Parallel Multiplier',
    description: 'Composed of 240 full and half adders arranged in a 15x16 matrix. Infamous in VLSI test engineering for having over 10^20 paths and massive reconvergent fanouts, causing traditional ATPG algorithms (PODEM/FAN) to suffer severe backtracking explosions.',
    gateCount: 2406,
    inputCount: 32,
    outputCount: 32,
    totalFaults: 4812,
    criticalPathDelayNs: 38.6,
    reconvergentFanoutComplexity: 'Extreme',
    traditionalAtpgTimeSec: 142.8,
    aiAtpgTimeSec: 17.1,
    traditionalPatterns: 1480,
    aiPatterns: 532,
    traditionalCoverage: 98.91,
    aiCoverage: 99.74,
    faultyGate: 'G2419',
    faultNet: 'N_3108',
    faultType: 'Stuck-at-0 (SA0)',
    faultCoord: { x: 142.4, y: 89.1, layer: 'Metal-2' },
    reasonForChallenge: 'Dense adder tree topology creates severe reconvergent signal paths, causing traditional branch-and-bound ATPG to explore exponential dead-ends.',
  },
  c7552: {
    id: 'c7552',
    name: "ISCAS'85 c7552",
    category: '32-bit ALU & Control Unit',
    description: 'High gate-count benchmark with 207 primary inputs and deep control logic trees.',
    gateCount: 3512,
    inputCount: 207,
    outputCount: 108,
    totalFaults: 7024,
    criticalPathDelayNs: 43.2,
    reconvergentFanoutComplexity: 'High',
    traditionalAtpgTimeSec: 189.4,
    aiAtpgTimeSec: 22.8,
    traditionalPatterns: 1864,
    aiPatterns: 642,
    traditionalCoverage: 98.24,
    aiCoverage: 99.68,
    faultyGate: 'G3102',
    faultNet: 'N_4412',
    faultType: 'Stuck-at-1 (SA1)',
    faultCoord: { x: 210.8, y: 134.5, layer: 'Metal-3' },
    reasonForChallenge: 'Deep control hierarchies with 207 primary inputs create vast state search spaces.',
  },
  c5315: {
    id: 'c5315',
    name: "ISCAS'85 c5315",
    category: '9-bit ALU & Selector',
    description: 'Multi-function arithmetic unit with carry-lookahead blocks and parity generation.',
    gateCount: 2307,
    inputCount: 178,
    outputCount: 123,
    totalFaults: 4614,
    criticalPathDelayNs: 34.1,
    reconvergentFanoutComplexity: 'High',
    traditionalAtpgTimeSec: 112.5,
    aiAtpgTimeSec: 14.3,
    traditionalPatterns: 1210,
    aiPatterns: 418,
    traditionalCoverage: 99.12,
    aiCoverage: 99.88,
    faultyGate: 'G1890',
    faultNet: 'N_2580',
    faultType: 'Stuck-at-0 (SA0)',
    faultCoord: { x: 98.2, y: 165.7, layer: 'Metal-2' },
    reasonForChallenge: 'Carry chains create cascading signal dependencies.',
  },
  c1908: {
    id: 'c1908',
    name: "ISCAS'85 c1908",
    category: '16-bit SEC/DED Error Correcting',
    description: 'Double error detection and single error correction syndrome decoding matrix.',
    gateCount: 880,
    inputCount: 33,
    outputCount: 25,
    totalFaults: 1760,
    criticalPathDelayNs: 24.8,
    reconvergentFanoutComplexity: 'Moderate',
    traditionalAtpgTimeSec: 48.6,
    aiAtpgTimeSec: 6.2,
    traditionalPatterns: 490,
    aiPatterns: 178,
    traditionalCoverage: 99.45,
    aiCoverage: 99.92,
    faultyGate: 'G0742',
    faultNet: 'N_1092',
    faultType: 'Stuck-at-1 (SA1)',
    faultCoord: { x: 64.0, y: 45.3, layer: 'Metal-1' },
    reasonForChallenge: 'High XOR-gate concentration reduces controllability heuristics.',
  },
};

export const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    id: 'circuit',
    label: '1. Circuit',
    shortDesc: 'Netlist Graph Ingestion',
    fullDesc: "Synthesizes gate-level DAG from ISCAS'85 structural Verilog. Computes controllability (CC0, CC1) and observability (CO) SCOAP testability metrics.",
    techDetails: [
      'Topological sort of 2,406 gates',
      'SCOAP Controllability & Observability vectors',
      'Identification of 4,812 collapsed single stuck-at faults'
    ],
    equation: 'SCOAP: CC_1(y) = \\min_{x \\in inputs} CC_1(x) + 1',
    outputArtifact: 'Graph Adjacency Matrix [2406 × 2406] + Collapsed Fault List',
    metric: { label: 'Fault Universe', value: '4,812 Faults' }
  },
  {
    id: 'atpg',
    label: '2. ATPG',
    shortDesc: 'AI-Guided Test Pattern Gen',
    fullDesc: 'Employs a graph neural policy to predict gate sensitization assignments, bypassing exponential backtracking in reconvergent fanouts.',
    techDetails: [
      'Neural heuristic replaces blind PODEM backtracking',
      'Dynamic D-frontier priority assignment',
      '8.4× faster path sensitization'
    ],
    equation: 'P(assign=v | G_i) = \\sigma(W_h h_i + b)',
    outputArtifact: 'Initial Test Pattern Matrix [1480 vectors × 32 bits]',
    metric: { label: 'Initial Generation', value: '17.1s elapsed' }
  },
  {
    id: 'dtr',
    label: '3. DTR',
    shortDesc: 'Dynamic Test Reduction',
    fullDesc: 'Applies dynamic vector compaction and set-cover optimization to eliminate redundant patterns without dropping single-fault detection.',
    techDetails: [
      'Static & Dynamic test vector compaction',
      'Don’t-care (X-bit) intelligent filling',
      '64.1% reduction in total pattern volume'
    ],
    equation: '\\min |T| \\quad \\text{s.t.} \\; \\bigcup_{t \\in T} \\text{Det}(t) = \\mathcal{F}',
    outputArtifact: 'Compacted Test Suite [532 vectors × 32 bits]',
    metric: { label: 'Pattern Reduction', value: '-64.1% (532 vectors)' }
  },
  {
    id: 'ssae',
    label: '4. SSAE',
    shortDesc: 'Stacked Sparse Autoencoder',
    fullDesc: 'Multi-layer deep autoencoder (128 → 64 → 16) extracts non-linear latent fault syndrome signatures from circuit output responses.',
    techDetails: [
      'Encoder: 128-D raw syndrome → 16-D bottleneck',
      'Kullback-Leibler sparsity penalty enforcement',
      'Robust to observation noise and unknown X-states'
    ],
    equation: '\\mathcal{L}_{SSAE} = \\|x - \\hat{x}\\|^2 + \\beta \\sum_j KL(\\rho \\parallel \\hat{\\rho}_j)',
    outputArtifact: 'Latent Syndrome Embedding Z ∈ ℝ^16',
    metric: { label: 'Feature Compression', value: '8:1 ratio (16-D)' }
  },
  {
    id: 'softmax',
    label: '5. Softmax',
    shortDesc: 'Fault Isolation Classifier',
    fullDesc: 'Evaluates the latent syndrome representation across all candidate fault locations, outputting normalized posterior fault probabilities.',
    techDetails: [
      'Multi-class cross-entropy probability distribution',
      'Identifies top-3 candidate suspects in 2.4 ms',
      'Distinguishes equivalent vs dominant fault classes'
    ],
    equation: 'P(Fault = k | z) = \\frac{e^{w_k^T z}}{\\sum_j e^{w_j^T z}}',
    outputArtifact: 'Candidate Fault Distribution [G2419: 99.84%]',
    metric: { label: 'Top-1 Confidence', value: '99.84% P(G2419)' }
  },
  {
    id: 'fsim',
    label: '6. FSIM',
    shortDesc: 'Concurrent Fault Simulator',
    fullDesc: 'Runs cycle-accurate logic simulation comparing golden circuit vs suspected faulty circuit to formally verify differential outputs.',
    techDetails: [
      'Concurrent 32-bit parallel fault evaluation',
      'D-drive propagation trace: PI → G2419 → PO[27]',
      'Formal mathematical proof of fault activation'
    ],
    equation: 'V_{diff} = V_{golden} \\oplus V_{faulty} \\neq 0 \\implies \\text{VERIFIED}',
    outputArtifact: 'Differential Output Signature: PO[27] = D, PO[28] = D̄',
    metric: { label: 'FSIM Match', value: '100% Verified' }
  },
  {
    id: 'coverage',
    label: '7. Coverage',
    shortDesc: 'Fault Coverage & Metrics',
    fullDesc: 'Aggregates detected faults across the compacted pattern set, reaching 99.74% total fault coverage with 100% test efficiency.',
    techDetails: [
      '4,800 detected faults / 4,812 total faults',
      '12 redundant/untestable faults verified formally',
      'ATE tester execution time reduced by 64%'
    ],
    equation: '\\text{Coverage} = \\frac{\\text{Detected Faults}}{\\text{Total Faults} - \\text{Untestable}} = 100\\%',
    outputArtifact: 'Comprehensive ATE Test Execution Report',
    metric: { label: 'Final Coverage', value: '99.74% (100% Eff.)' }
  }
];

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: '1. The VLSI Testing Challenge',
    subtitle: 'Exponential ATPG explosion on complex silicon multipliers',
    judgeQuestion: '1. WHAT is the problem?',
    startTimeSec: 0,
    durationSec: 15,
    cameraMode: 'overview',
  },
  {
    id: 2,
    title: '2. 3D Silicon Architecture',
    subtitle: 'Physical die package, bonding pads & multi-layer interconnects',
    judgeQuestion: '2. WHAT does AI do?',
    startTimeSec: 15,
    durationSec: 15,
    cameraMode: 'die_perspective',
  },
  {
    id: 3,
    title: "3. Benchmark Selection: c6288",
    subtitle: '16x16-bit Multiplier with 2,406 gates & extreme reconvergence',
    judgeQuestion: '3. HOW does the pipeline work?',
    startTimeSec: 30,
    durationSec: 12,
    cameraMode: 'die_perspective',
  },
  {
    id: 4,
    title: '4. AI Pipeline Execution',
    subtitle: 'Circuit → ATPG → DTR → SSAE → Softmax → FSIM → Coverage',
    judgeQuestion: '3. HOW does the pipeline work?',
    startTimeSec: 42,
    durationSec: 26,
    stageHighlight: 'ssae',
    cameraMode: 'overview',
  },
  {
    id: 5,
    title: '5. Zoom to Physical Fault Site',
    subtitle: 'Microscopic inspection at Metal-2: Gate G2419 (Stuck-at-0)',
    judgeQuestion: '4. WHERE is the fault?',
    startTimeSec: 68,
    durationSec: 18,
    cameraMode: 'zoom_fault',
  },
  {
    id: 6,
    title: '6. SSAE Diagnosis & Formal FSIM',
    subtitle: 'Latent 16-D embedding + Softmax isolation + cycle-accurate proof',
    judgeQuestion: '5. HOW is it diagnosed? & 6. HOW is it verified?',
    startTimeSec: 86,
    durationSec: 16,
    cameraMode: 'gate_schematic',
  },
  {
    id: 7,
    title: '7. Measured Outcome: Traditional vs AI',
    subtitle: '64% fewer patterns, 8.4x faster run time, 99.74% verified coverage',
    judgeQuestion: '7. WHAT is the measured outcome?',
    startTimeSec: 102,
    durationSec: 12,
    cameraMode: 'comparison',
  },
  {
    id: 8,
    title: '8. Executive Verdict',
    subtitle: 'SMARTER TESTS · FASTER DIAGNOSIS · VERIFIED COVERAGE',
    judgeQuestion: 'Summary & Technical Verification',
    startTimeSec: 114,
    durationSec: 6,
    cameraMode: 'finale',
  }
];

export const FAULT_CANDIDATES: FaultCandidate[] = [
  {
    rank: 1,
    gateId: 'G2419',
    netName: 'N_3108',
    type: 'Stuck-at-0 (SA0)',
    probability: 0.9984,
    isTrueFault: true,
    pinSensitized: 'PO[27]',
    cellType: 'NAND4_X1'
  },
  {
    rank: 2,
    gateId: 'G2418',
    netName: 'N_3105',
    type: 'Stuck-at-1 (SA1)',
    probability: 0.0012,
    isTrueFault: false,
    pinSensitized: 'PO[26]',
    cellType: 'NOR2_X1'
  },
  {
    rank: 3,
    gateId: 'G2423',
    netName: 'N_3114',
    type: 'Bridging (0-Dom)',
    probability: 0.0003,
    isTrueFault: false,
    pinSensitized: 'PO[27]',
    cellType: 'XOR2_X2'
  },
  {
    rank: 4,
    gateId: 'G2389',
    netName: 'N_3072',
    type: 'Stuck-at-0 (SA0)',
    probability: 0.0001,
    isTrueFault: false,
    pinSensitized: 'PO[25]',
    cellType: 'AND3_X1'
  }
];

export const JUDGE_QUESTIONS_MAP = [
  {
    q: '1. WHAT is the problem?',
    a: "Modern VLSI multipliers (like ISCAS'85 c6288 with 2,406 gates) create exponential backtracking in deterministic ATPG (PODEM/FAN). Test generation takes excessive CPU time, pattern volumes explode, and ATE tester memory costs skyrocket.",
    highlightTag: 'Silicon Bottleneck'
  },
  {
    q: '2. WHAT does AI do?',
    a: 'Replaces exhaustive search with ML-guided test generation and uses a Stacked Sparse Autoencoder (SSAE) to compress raw fault syndromes into latent topological features for instant Softmax classification.',
    highlightTag: 'Neural Acceleration'
  },
  {
    q: '3. HOW does the pipeline work?',
    a: 'Circuit Netlist → AI-ATPG Pattern Generation → DTR (Dynamic Test Reduction) → SSAE (Feature Extraction) → Softmax (Isolation) → FSIM (Concurrent Verification) → Verified Coverage.',
    highlightTag: 'End-to-End Flow'
  },
  {
    q: '4. WHERE is the fault?',
    a: 'Pinpointed on Gate G2419 (NAND4 cell, Partial Product Adder Stage 14, Net N_3108) at physical coordinates X=142.4µm, Y=89.1µm on Metal-2 layer.',
    highlightTag: 'Sub-Micron Pinpoint'
  },
  {
    q: '5. HOW is it diagnosed?',
    a: 'Raw 128-D test response syndromes pass through the 3-stage SSAE (128 → 64 → 16). The 16-D latent vector is fed to a Softmax classifier, yielding 99.84% posterior confidence for G2419_SA0 in 2.4ms.',
    highlightTag: 'SSAE + Softmax'
  },
  {
    q: '6. HOW is it verified?',
    a: 'Concurrent Fault Simulation (FSIM) applies test pattern T_184 to both golden and faulty netlists, tracing the D-propagation path through logic levels to Primary Output PO[27] with zero false-positives.',
    highlightTag: 'Cycle-Accurate FSIM'
  },
  {
    q: '7. WHAT is the measured outcome?',
    a: '64.1% reduction in test pattern volume (1,480 → 532), 8.4× faster ATPG run time (142.8s → 17.1s), and 99.74% verified fault coverage (100% test efficiency on testable faults).',
    highlightTag: 'Empirical Benchmark'
  }
];
