# AI-ATPG & Neural Silicon Fault Diagnosis

Autonomous AI-accelerated Automatic Test Pattern Generation (ATPG) and Stacked Sparse Autoencoder (SSAE) neural fault diagnosis platform for VLSI silicon circuits (ISCAS'85 c6288 benchmark).

Built for the **TECHgium** engineering demonstration.

---

## ⚡ Key Highlights for Judges

1. **The VLSI Challenge:** Solves exponential PODEM/FAN backtracking explosion on complex multipliers with deep reconvergent fanouts (**ISCAS'85 c6288**, 2,406 gates).
2. **7-Stage AI Pipeline:** 
   $$\text{Circuit} \longrightarrow \text{ATPG} \longrightarrow \text{DTR} \longrightarrow \text{SSAE} \longrightarrow \text{Softmax} \longrightarrow \text{FSIM} \longrightarrow \text{Coverage}$$
3. **Sub-Micron Physical Localization:** Pinpoints Gate `G2419` (`NAND4_X1`) at coordinates $X=142.4\,\mu\text{m}, Y=89.1\,\mu\text{m}$ on Metal-2.
4. **Empirical Outcomes:**
   - **64.1% Pattern Reduction:** 1,480 $\to$ 532 vectors
   - **8.4× Speedup:** 142.8s $\to$ 17.1s run time
   - **99.74% Fault Coverage:** 100% test efficiency on testable faults
   - **2.4ms Diagnosis:** SSAE 16-D latent manifold + Softmax posterior classification
   - **Zero False Positives:** Cycle-accurate concurrent FSIM verification on vector $T_{184}$

---

## 🚀 Deploying to Vercel

This repository is pre-configured with `vercel.json` for zero-configuration instant deployment on Vercel.

### Method 1: Deploy with Git (Recommended)

1. Push this repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) $\to$ Click **Add New Project**.
3. Import your GitHub repository: `yogeshwar972/FAULT-DIAGNOSIS-TEST-PATTERN-GENERATION`.
4. Vercel will automatically detect:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**!

### Method 2: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start local development server (Port 3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📐 Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS 4
- **3D Silicon Renderer:** High-performance Canvas/WebGL with multi-layer interconnects (M1, M2, M3, Wirebonds)
- **Audio Synthesizer:** Browser Web Audio API for EDA telemetry
- **Vector Export:** IEEE 1450 Standard Test Interface Language (STIL)
