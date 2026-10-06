import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CircuitInfo } from '../types/vlsi';
import { Layers, RotateCcw, ZoomIn, ZoomOut, Maximize2, ShieldAlert, Cpu } from 'lucide-react';

interface Chip3DCanvasProps {
  circuit: CircuitInfo;
  cameraMode: 'overview' | 'die_perspective' | 'zoom_fault' | 'gate_schematic' | 'comparison' | 'finale';
  isFaultDetected: boolean;
  onSelectFaultGate?: () => void;
  activeLayer?: string;
}

export const Chip3DCanvas: React.FC<Chip3DCanvasProps> = ({
  circuit,
  cameraMode,
  isFaultDetected,
  onSelectFaultGate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Layer filters
  const [layers, setLayers] = useState({
    wirebonds: true,
    metal3: true,
    metal2: true,
    metal1: true,
    cells: true,
    fault: true,
  });

  // Camera angles and zoom
  const [pitch, setPitch] = useState<number>(0.65);
  const [yaw, setYaw] = useState<number>(0.75);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; pitch: number; yaw: number }>({
    x: 0,
    y: 0,
    pitch: 0.65,
    yaw: 0.75,
  });

  // Target camera state for smooth interpolation
  const targetCamRef = useRef({
    pitch: 0.65,
    yaw: 0.75,
    zoom: 1.0,
    panX: 0,
    panY: 0,
  });
  const currentCamRef = useRef({
    pitch: 0.65,
    yaw: 0.75,
    zoom: 1.0,
    panX: 0,
    panY: 0,
  });

  // Respond to cameraMode changes smoothly
  useEffect(() => {
    if (cameraMode === 'zoom_fault' || cameraMode === 'gate_schematic') {
      // Zoom right into the fault location on Metal 2 (G2419)
      targetCamRef.current = {
        pitch: 0.35,
        yaw: 0.25,
        zoom: 3.8,
        panX: -45,
        panY: -25,
      };
    } else if (cameraMode === 'die_perspective') {
      targetCamRef.current = {
        pitch: 0.78,
        yaw: 0.95,
        zoom: 1.25,
        panX: 0,
        panY: 0,
      };
    } else if (cameraMode === 'comparison' || cameraMode === 'finale') {
      targetCamRef.current = {
        pitch: 0.55,
        yaw: 0.45,
        zoom: 1.1,
        panX: 0,
        panY: 0,
      };
    } else {
      // overview
      targetCamRef.current = {
        pitch: 0.62,
        yaw: 0.68,
        zoom: 1.0,
        panX: 0,
        panY: 0,
      };
    }
  }, [cameraMode]);

  // Handle user drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      pitch: currentCamRef.current.pitch,
      yaw: currentCamRef.current.yaw,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStartRef.current.x) * 0.006;
    const dy = (e.clientY - dragStartRef.current.y) * 0.006;
    const newPitch = Math.max(0.1, Math.min(1.4, dragStartRef.current.pitch + dy));
    const newYaw = dragStartRef.current.yaw + dx;
    targetCamRef.current.pitch = newPitch;
    targetCamRef.current.yaw = newYaw;
    setPitch(newPitch);
    setYaw(newYaw);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    const newZoom = Math.max(0.7, Math.min(5.0, targetCamRef.current.zoom + delta));
    targetCamRef.current.zoom = newZoom;
    setZoom(newZoom);
  };

  // Reset Camera
  const resetCamera = useCallback(() => {
    targetCamRef.current = {
      pitch: 0.65,
      yaw: 0.75,
      zoom: 1.0,
      panX: 0,
      panY: 0,
    };
    setZoom(1.0);
  }, []);

  // Main 3D Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;

      // Handle resize
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Smooth camera interpolation
      const cam = currentCamRef.current;
      const target = targetCamRef.current;
      cam.pitch += (target.pitch - cam.pitch) * 0.08;
      cam.yaw += (target.yaw - cam.yaw) * 0.08;
      cam.zoom += (target.zoom - cam.zoom) * 0.08;
      cam.panX += (target.panX - cam.panX) * 0.08;
      cam.panY += (target.panY - cam.panY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Deep silicon background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, '#0c101a');
      bgGrad.addColorStop(0.6, '#070a10');
      bgGrad.addColorStop(1, '#030508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle engineering grid in background
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3D projection math
      const centerX = width / 2 + cam.panX * cam.zoom;
      const centerY = height / 2 + cam.panY * cam.zoom;
      const scale = Math.min(width, height) * 0.28 * cam.zoom;

      const cosY = Math.cos(cam.yaw);
      const sinY = Math.sin(cam.yaw);
      const cosP = Math.cos(cam.pitch);
      const sinP = Math.sin(cam.pitch);

      // Project 3D (x, y, z) into 2D (screenX, screenY)
      const project = (x: number, y: number, z: number): [number, number, number] => {
        // Rotate around Y
        const rx = x * cosY - z * sinY;
        const rz = x * sinY + z * cosY;
        // Rotate around X (pitch)
        const ry = y * cosP - rz * sinP;
        const depth = y * sinP + rz * cosP;
        // Perspective factor
        const fov = 4.0;
        const pFactor = fov / (fov + depth * 0.45);
        const sx = centerX + rx * scale * pFactor;
        const sy = centerY + ry * scale * pFactor;
        return [sx, sy, depth];
      };

      // 1. Draw Package Substrate (FR4 / BGA carrier)
      const subHalf = 1.6;
      const subH = -0.25;
      const subCorners = [
        project(-subHalf, subH, -subHalf),
        project(subHalf, subH, -subHalf),
        project(subHalf, subH, subHalf),
        project(-subHalf, subH, subHalf),
      ];

      ctx.beginPath();
      ctx.moveTo(subCorners[0][0], subCorners[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(subCorners[i][0], subCorners[i][1]);
      ctx.closePath();
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Package trace lines (gold fingers)
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let step = -1.4; step <= 1.4; step += 0.25) {
        const p1 = project(step, subH, -1.55);
        const p2 = project(step * 0.7, subH, -1.15);
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);

        const p3 = project(step, subH, 1.55);
        const p4 = project(step * 0.7, subH, 1.15);
        ctx.moveTo(p3[0], p3[1]);
        ctx.lineTo(p4[0], p4[1]);
      }
      ctx.stroke();

      // 2. Draw Silicon Die (Mirror-polished monocrystalline Si)
      const dieHalf = 1.0;
      const dieH = 0.0;
      const dieCorners = [
        project(-dieHalf, dieH, -dieHalf),
        project(dieHalf, dieH, -dieHalf),
        project(dieHalf, dieH, dieHalf),
        project(-dieHalf, dieH, dieHalf),
      ];

      // Die thickness edge (side extrusion)
      const dieBase = [
        project(-dieHalf, subH + 0.02, -dieHalf),
        project(dieHalf, subH + 0.02, -dieHalf),
        project(dieHalf, subH + 0.02, dieHalf),
        project(-dieHalf, subH + 0.02, dieHalf),
      ];

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(dieCorners[2][0], dieCorners[2][1]);
      ctx.lineTo(dieCorners[3][0], dieCorners[3][1]);
      ctx.lineTo(dieBase[3][0], dieBase[3][1]);
      ctx.lineTo(dieBase[2][0], dieBase[2][1]);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Die surface top
      const dieGrad = ctx.createLinearGradient(
        dieCorners[0][0], dieCorners[0][1],
        dieCorners[2][0], dieCorners[2][1]
      );
      dieGrad.addColorStop(0, '#1e293b');
      dieGrad.addColorStop(0.5, '#0f172a');
      dieGrad.addColorStop(1, '#1e293b');

      ctx.beginPath();
      ctx.moveTo(dieCorners[0][0], dieCorners[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(dieCorners[i][0], dieCorners[i][1]);
      ctx.closePath();
      ctx.fillStyle = dieGrad;
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. I/O Seal Ring and Bond Pads (Gold / Aluminum)
      const padInset = 0.88;
      const pads = 14;
      for (let i = 0; i < pads; i++) {
        const u = -padInset + (i / (pads - 1)) * padInset * 2;
        // North & South pads
        const padN = project(u, dieH + 0.01, -padInset);
        const padS = project(u, dieH + 0.01, padInset);
        const padW = project(-padInset, dieH + 0.01, u);
        const padE = project(padInset, dieH + 0.01, u);

        const padSize = 4 * cam.zoom;
        ctx.fillStyle = '#fbbf24'; // Gold pad
        ctx.fillRect(padN[0] - padSize / 2, padN[1] - padSize / 2, padSize, padSize);
        ctx.fillRect(padS[0] - padSize / 2, padS[1] - padSize / 2, padSize, padSize);
        ctx.fillRect(padW[0] - padSize / 2, padW[1] - padSize / 2, padSize, padSize);
        ctx.fillRect(padE[0] - padSize / 2, padE[1] - padSize / 2, padSize, padSize);

        // 4. Gold Wire Bonds looping from pad to package
        if (layers.wirebonds) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
          ctx.lineWidth = 1.2;

          // Wire N
          const pkgN = project(u * 1.3, subH, -1.45);
          const apexN = project(u * 1.15, dieH + 0.28, -1.15);
          ctx.beginPath();
          ctx.moveTo(padN[0], padN[1]);
          ctx.quadraticCurveTo(apexN[0], apexN[1], pkgN[0], pkgN[1]);
          ctx.stroke();

          // Wire S
          const pkgS = project(u * 1.3, subH, 1.45);
          const apexS = project(u * 1.15, dieH + 0.28, 1.15);
          ctx.beginPath();
          ctx.moveTo(padS[0], padS[1]);
          ctx.quadraticCurveTo(apexS[0], apexS[1], pkgS[0], pkgS[1]);
          ctx.stroke();
        }
      }

      // 5. Silicon Standard Cell Rows & Core Floorplan (Multi-Layer VLSI)
      const activeArea = 0.75;
      const rows = 12;

      // Layer: Polysilicon and Diffusion Cells
      if (layers.cells) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
        for (let r = 0; r < rows; r++) {
          const z1 = -activeArea + (r / rows) * activeArea * 2;
          const z2 = z1 + (activeArea * 2 / rows) * 0.75;
          const c1 = project(-activeArea, dieH + 0.005, z1);
          const c2 = project(activeArea, dieH + 0.005, z1);
          const c3 = project(activeArea, dieH + 0.005, z2);
          const c4 = project(-activeArea, dieH + 0.005, z2);

          ctx.beginPath();
          ctx.moveTo(c1[0], c1[1]);
          ctx.lineTo(c2[0], c2[1]);
          ctx.lineTo(c3[0], c3[1]);
          ctx.lineTo(c4[0], c4[1]);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Layer: Metal 1 (Fine horizontal interconnections - Cyan)
      if (layers.metal1) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = -0.7; i <= 0.7; i += 0.08) {
          const m1 = project(-0.72, dieH + 0.015, i);
          const m2 = project(0.72, dieH + 0.015, i);
          ctx.moveTo(m1[0], m1[1]);
          ctx.lineTo(m2[0], m2[1]);
        }
        ctx.stroke();
      }

      // Layer: Metal 2 (Vertical routing buses - Amber)
      if (layers.metal2) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = -0.68; i <= 0.68; i += 0.12) {
          const v1 = project(i, dieH + 0.025, -0.7);
          const v2 = project(i, dieH + 0.025, 0.7);
          ctx.moveTo(v1[0], v1[1]);
          ctx.lineTo(v2[0], v2[1]);
        }
        ctx.stroke();
      }

      // Layer: Metal 3 (Power / Ground distribution mesh - Indigo/Purple)
      if (layers.metal3) {
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
        ctx.lineWidth = 2.5 * cam.zoom;
        ctx.beginPath();
        for (let i = -0.6; i <= 0.6; i += 0.4) {
          // VDD / VSS rails
          const p1 = project(-0.7, dieH + 0.035, i);
          const p2 = project(0.7, dieH + 0.035, i);
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
        }
        ctx.stroke();
      }

      // 6. Dynamic Circuit Pulse / Signal activity traveling across the multiplier tree
      const pulsePos = (Math.sin(t * 2) + 1) / 2;
      const pulseX = -0.6 + pulsePos * 1.2;
      const pPulse1 = project(pulseX, dieH + 0.028, -0.6);
      const pPulse2 = project(pulseX, dieH + 0.028, 0.6);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pPulse1[0], pPulse1[1]);
      ctx.lineTo(pPulse2[0], pPulse2[1]);
      ctx.stroke();

      // 7. FAULT LOCATION PINPOINT (Gate G2419, Net N_3108 at coordinates)
      // Map physical coords (X=142.4µm, Y=89.1µm) to die normalized space
      const faultX = 0.22;
      const faultZ = -0.15;
      const faultPt = project(faultX, dieH + 0.03, faultZ);

      if (layers.fault && isFaultDetected) {
        // Pulsing radar ripple
        const pulseR = (12 + Math.sin(t * 6) * 6) * (cam.zoom > 2 ? 1.5 : 1.0);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(faultPt[0], faultPt[1], pulseR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(faultPt[0], faultPt[1], pulseR * 1.8, 0, Math.PI * 2);
        ctx.stroke();

        // Pinpoint glowing core
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(faultPt[0], faultPt[1], 5 * Math.min(cam.zoom, 2.5), 0, Math.PI * 2);
        ctx.fill();

        // When zoomed in, draw cell schematic layout boundary & pin labels!
        if (cam.zoom > 2.0) {
          const cellSize = 55 * (cam.zoom / 2.5);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(faultPt[0] - cellSize / 2, faultPt[1] - cellSize / 2, cellSize, cellSize);

          // Transistor diffusion stripes inside cell
          ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
          ctx.fillRect(faultPt[0] - cellSize / 2 + 4, faultPt[1] - cellSize / 2 + 4, cellSize - 8, cellSize - 8);

          // Fault HUD annotation
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1;
          const hudW = 190;
          const hudH = 68;
          const hudX = faultPt[0] + 25;
          const hudY = faultPt[1] - 45;

          ctx.fillRect(hudX, hudY, hudW, hudH);
          ctx.strokeRect(hudX, hudY, hudW, hudH);

          // HUD connector line
          ctx.beginPath();
          ctx.moveTo(faultPt[0], faultPt[1]);
          ctx.lineTo(hudX, hudY + hudH / 2);
          ctx.strokeStyle = '#f43f5e';
          ctx.stroke();

          ctx.fillStyle = '#f87171';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`FAULT: ${circuit.faultyGate} [${circuit.faultType}]`, hudX + 8, hudY + 16);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText(`NET: ${circuit.faultNet} | ${circuit.faultCoord.layer}`, hudX + 8, hudY + 32);
          ctx.fillText(`LOC: X=${circuit.faultCoord.x}µm Y=${circuit.faultCoord.y}µm`, hudX + 8, hudY + 46);
          ctx.fillStyle = '#10b981';
          ctx.fillText(`DETECT: PO[27] sensitized`, hudX + 8, hudY + 60);
        }
      }

      // Top corner silicon badge in 3D viewport
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '9px monospace';
      ctx.fillText(`DIE: ${circuit.name} [${circuit.category}]`, 16, 24);
      ctx.fillText(`TECH: TSMC 28nm HPC+ | DIE SIZE: 1.42 × 1.42 mm`, 16, 38);
      ctx.fillText(`VIEW: ${Math.round(cam.pitch * 57.3)}° PITCH / ${Math.round(cam.yaw * 57.3)}° YAW | ZOOM ${cam.zoom.toFixed(1)}x`, 16, 52);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [circuit, cameraMode, isFaultDetected, layers]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] rounded-lg overflow-hidden border border-slate-800 bg-[#070a10]">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top right HUD: Layer Toggles */}
      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded px-2.5 py-2 text-xs flex flex-col gap-1.5 shadow-xl select-none">
        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[10px] uppercase font-semibold pb-1 border-b border-slate-800">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Silicon Layers</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
          <input
            type="checkbox"
            checked={layers.wirebonds}
            onChange={(e) => setLayers({ ...layers, wirebonds: e.target.checked })}
            className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3 h-3"
          />
          <span className="text-[11px] font-mono">Bond Wires (Au)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
          <input
            type="checkbox"
            checked={layers.metal3}
            onChange={(e) => setLayers({ ...layers, metal3: e.target.checked })}
            className="rounded border-slate-700 text-indigo-500 focus:ring-0 w-3 h-3"
          />
          <span className="text-[11px] font-mono">Metal 3 (Power)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
          <input
            type="checkbox"
            checked={layers.metal2}
            onChange={(e) => setLayers({ ...layers, metal2: e.target.checked })}
            className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3 h-3"
          />
          <span className="text-[11px] font-mono">Metal 2 (Signals)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
          <input
            type="checkbox"
            checked={layers.metal1}
            onChange={(e) => setLayers({ ...layers, metal1: e.target.checked })}
            className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-3 h-3"
          />
          <span className="text-[11px] font-mono">Metal 1 (Cells)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
          <input
            type="checkbox"
            checked={layers.cells}
            onChange={(e) => setLayers({ ...layers, cells: e.target.checked })}
            className="rounded border-slate-700 text-emerald-500 focus:ring-0 w-3 h-3"
          />
          <span className="text-[11px] font-mono">Poly / Logic</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-rose-400 hover:text-rose-300">
          <input
            type="checkbox"
            checked={layers.fault}
            onChange={(e) => setLayers({ ...layers, fault: e.target.checked })}
            className="rounded border-slate-700 text-rose-500 focus:ring-0 w-3 h-3"
          />
          <span className="text-[11px] font-mono font-medium">Fault Site ({circuit.faultyGate})</span>
        </label>
      </div>

      {/* Bottom bar: Camera Controls & Coordinates */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded pointer-events-auto text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-semibold">{circuit.id.toUpperCase()}</span>
          <span>·</span>
          <span>{circuit.gateCount.toLocaleString()} Gates</span>
          <span>·</span>
          <span className="text-amber-400">{circuit.faultyGate} ({circuit.faultCoord.layer})</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 p-1 rounded pointer-events-auto">
          <button
            onClick={() => {
              targetCamRef.current.zoom = Math.min(5.0, targetCamRef.current.zoom * 1.3);
            }}
            title="Zoom In"
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              targetCamRef.current.zoom = Math.max(0.7, targetCamRef.current.zoom / 1.3);
            }}
            title="Zoom Out"
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetCamera}
            title="Reset Camera Orientation"
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {isFaultDetected && (
            <button
              onClick={() => {
                targetCamRef.current = {
                  pitch: 0.35,
                  yaw: 0.25,
                  zoom: 3.8,
                  panX: -45,
                  panY: -25,
                };
                if (onSelectFaultGate) onSelectFaultGate();
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-rose-950/70 border border-rose-800 hover:bg-rose-900 text-rose-300 rounded text-[11px] font-mono transition"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Zoom to {circuit.faultyGate}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
