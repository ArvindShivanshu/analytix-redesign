import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Scan,
  Cpu,
  Layers,
  Activity,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Flame,
  BarChart3,
  Sliders,
  Filter
} from 'lucide-react';
import SpotlightCard from '../reactbits/SpotlightCard';
import CountUp from '../reactbits/CountUp';
import DecryptedText from '../reactbits/DecryptedText';

// 4 Distinct Brand Logos and 3 Background Colors as specified in the SRM Robocon challenge
const BRANDS = [
  { id: 'brand_a', name: 'Brand Alpha (Apex)', symbol: '▲', color: '#00f2fe' },
  { id: 'brand_b', name: 'Brand Beta (Nova)', symbol: '◆', color: '#a855f7' },
  { id: 'brand_c', name: 'Brand Gamma (Vortex)', symbol: '●', color: '#10b981' },
  { id: 'brand_d', name: 'Brand Delta (Titan)', symbol: '■', color: '#f59e0b' },
];

const COLORS = [
  { id: 'red', name: 'Crimson Red', hex: '#ef4444', text: '#fee2e2' },
  { id: 'yellow', name: 'Cyber Amber', hex: '#eab308', text: '#fef9c3' },
  { id: 'blue', name: 'Cobalt Blue', hex: '#3b82f6', text: '#dbeafe' },
];

export default function SortingSimulator() {
  const [keyCompetitor, setKeyCompetitor] = useState('brand_a'); // Designated competitor
  const [activeItem, setActiveItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoStream, setAutoStream] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState(1400); // ms per item
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'matrix'

  // Telemetry & stats
  const [stats, setStats] = useState({
    totalProcessed: 28,
    isolatedCompetitor: 9,
    standardArchived: 19,
    avgConfidence: 98.7,
    lastLatencyMs: 31,
  });

  // Matrix counts for (4 brands x 3 colors)
  const [matrixData, setMatrixData] = useState(() => {
    const initial = {};
    BRANDS.forEach((b) => {
      initial[b.id] = { red: 2, yellow: 3, blue: 2 };
    });
    // add some initial distribution
    initial['brand_a'] = { red: 3, yellow: 4, blue: 2 };
    return initial;
  });

  // Computer Vision inspection log
  const [cvLogs, setCvLogs] = useState([
    { id: 1, text: 'UART connected at 115200 baud to Arduino Uno shield', type: 'info' },
    { id: 2, text: 'SIFT keypoints loaded: 256 feature descriptors in cache', type: 'info' },
    { id: 3, text: 'ORB detector calibrated to 120 FPS optical intake', type: 'success' },
    { id: 4, text: 'FLANN matcher initial index build complete (K=4, Trees=5)', type: 'success' },
  ]);

  const streamTimerRef = useRef(null);

  // Process a single item
  const processNewTile = (overrideBrand = null, overrideColor = null) => {
    if (isProcessing && !autoStream) return;

    const brand = overrideBrand || BRANDS[Math.floor(Math.random() * BRANDS.length)].id;
    const color = overrideColor || COLORS[Math.floor(Math.random() * COLORS.length)].id;
    const isTarget = brand === keyCompetitor;
    const latency = Math.floor(Math.random() * 8) + 28; // 28-35 ms
    const confidence = (96.5 + Math.random() * 3.3).toFixed(1);

    const newItem = {
      id: Date.now(),
      brand,
      color,
      isTarget,
      latency,
      confidence,
      siftPoints: Math.floor(Math.random() * 45) + 180,
      timestamp: new Date().toLocaleTimeString(),
    };

    setActiveItem(newItem);
    setIsProcessing(true);

    // Update Logs
    setCvLogs((prev) => [
      {
        id: Date.now(),
        text: `Item Scanned: ${BRANDS.find((b) => b.id === brand)?.name} on ${COLORS.find((c) => c.id === color)?.name} • Match: ${confidence}% • Latency: ${latency}ms`,
        type: isTarget ? 'danger' : 'neutral',
      },
      ...prev.slice(0, 15),
    ]);

    // Update Matrix & Totals
    setTimeout(() => {
      setMatrixData((prev) => ({
        ...prev,
        [brand]: {
          ...prev[brand],
          [color]: (prev[brand]?.[color] || 0) + 1,
        },
      }));

      setStats((prev) => ({
        totalProcessed: prev.totalProcessed + 1,
        isolatedCompetitor: isTarget ? prev.isolatedCompetitor + 1 : prev.isolatedCompetitor,
        standardArchived: !isTarget ? prev.standardArchived + 1 : prev.standardArchived,
        avgConfidence: Number(((prev.avgConfidence * 0.95) + (Number(confidence) * 0.05)).toFixed(1)),
        lastLatencyMs: latency,
      }));

      setIsProcessing(false);
    }, 600);
  };

  // Auto Streaming Effect
  useEffect(() => {
    if (autoStream) {
      streamTimerRef.current = setInterval(() => {
        processNewTile();
      }, streamSpeed);
    } else {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    }
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [autoStream, streamSpeed, keyCompetitor]);

  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#10b981', '#f59e0b'],
    });
  };

  const getBrandObj = (id) => BRANDS.find((b) => b.id === id) || BRANDS[0];
  const getColorObj = (id) => COLORS.find((c) => c.id === id) || COLORS[0];

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-2xl lg:p-6">
      {/* Top Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Scan className="h-4 w-4" />
            </span>
            <h3 className="font-display text-xl font-bold tracking-tight text-white">
              <DecryptedText text="LIVE COMPUTER VISION & SORTING ENGINE" speed={25} animateOn="view" />
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Interactive Testbed for SIFT / ORB Logo Detection, Color Segmentation & Flap Actuation
          </p>
        </div>

        {/* Competitor Picker */}
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 backdrop-blur-md">
          <Filter className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-mono text-amber-300 font-semibold">TARGET COMPETITOR:</span>
          <select
            value={keyCompetitor}
            onChange={(e) => setKeyCompetitor(e.target.value)}
            className="rounded-lg border border-amber-500/40 bg-slate-900 px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            {BRANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Live Vision Pipeline & Physical Trapdoor Stage (7 Columns) */}
        <div className="col-span-1 space-y-4 lg:col-span-7">
          {/* Virtual Optical Inspection Rig */}
          <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            {/* Background Grid & Scan Beam */}
            <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span>SIESED CV CAMERA SENSOR #01</span>
              </div>
              <div className="text-slate-400">FOCAL PLANE: 180mm • EXPOSURE: 1/1000s</div>
            </div>

            {/* Inspection Stage Area */}
            <div className="relative mt-4 flex h-44 items-center justify-around rounded-xl border border-dashed border-cyan-500/30 bg-black/40 p-4">
              {/* Camera Optical Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-32 w-32 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
                  <div className="h-24 w-24 rounded-full border border-dashed border-cyan-500/40 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Package Being Scanned */}
              {activeItem ? (
                <div
                  className="relative z-10 flex flex-col items-center justify-center rounded-2xl p-4 shadow-2xl transition-all duration-300"
                  style={{
                    backgroundColor: getColorObj(activeItem.color).hex,
                    color: getColorObj(activeItem.color).text,
                    width: '130px',
                    height: '130px',
                    boxShadow: `0 0 35px ${getColorObj(activeItem.color).hex}55`,
                  }}
                >
                  {/* Bounding box corners */}
                  <span className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-white" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-white" />
                  <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-white" />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-white" />

                  <div className="text-3xl font-extrabold drop-shadow">
                    {getBrandObj(activeItem.brand).symbol}
                  </div>
                  <div className="mt-1 text-center font-display text-xs font-black uppercase tracking-wider drop-shadow">
                    {getBrandObj(activeItem.brand).name.split(' ')[0]}
                  </div>

                  {/* SIFT Keypoint Points Overlaid */}
                  <div className="absolute inset-0 flex flex-wrap items-center justify-around opacity-70 p-2 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white animate-ping"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                  <Scan className="h-8 w-8 mb-2 opacity-40 text-cyan-400" />
                  <span>AWAITING PACKAGE INTAKE</span>
                  <span className="text-[10px] text-slate-600 mt-1">Press "Drop Test Tile" below</span>
                </div>
              )}

              {/* Physical Route Destination Indicator */}
              {activeItem && (
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-lg ${
                      activeItem.isTarget
                        ? 'border border-rose-500/50 bg-rose-950/80 text-rose-300'
                        : 'border border-emerald-500/50 bg-emerald-950/80 text-emerald-300'
                    }`}
                  >
                    {activeItem.isTarget ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-rose-400 animate-bounce" />
                        <span>ISOLATE: FLAP 90° OPEN</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>PASS: FLAP CLOSED (0°)</span>
                      </>
                    )}
                  </div>
                  <div className="text-center font-mono text-[11px] text-slate-400">
                    MATCH CONFIDENCE: <span className="text-cyan-300 font-bold">{activeItem.confidence}%</span>
                    <br />
                    UART LATENCY: <span className="text-slate-200">{activeItem.latency}ms</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Control Deck */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => processNewTile()}
                disabled={isProcessing}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-display text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>DROP RANDOM TILE</span>
              </button>

              <button
                onClick={() => setAutoStream(!autoStream)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-display text-xs font-semibold transition-all ${
                  autoStream
                    ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                    : 'border-white/10 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {autoStream ? <Pause className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
                <span>{autoStream ? 'STOP STREAM' : 'AUTO STREAM (120/MIN)'}</span>
              </button>

              <button
                onClick={handleConfetti}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-xs text-amber-300 hover:bg-slate-800"
                title="Celebrate audit milestone"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AUDIT PASS</span>
              </button>
            </div>

            {/* Quick manual drop options */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-mono text-[11px] text-slate-400">FORCE:</span>
              <button
                onClick={() => processNewTile(keyCompetitor, 'red')}
                className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 font-mono text-[10px] text-rose-300 hover:bg-rose-500/20"
              >
                TARGET COMP.
              </button>
              <button
                onClick={() => processNewTile('brand_c', 'blue')}
                className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 font-mono text-[10px] text-blue-300 hover:bg-blue-500/20"
              >
                STANDARD TILE
              </button>
            </div>
          </div>

          {/* Real-time Hardware Telemetry Strip */}
          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400">TOTAL SCANNED</div>
              <div className="mt-1 font-display text-lg font-bold text-white">
                {stats.totalProcessed}
              </div>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2.5">
              <div className="text-[10px] text-rose-300">ISOLATED TARGETS</div>
              <div className="mt-1 font-display text-lg font-bold text-rose-400">
                {stats.isolatedCompetitor}
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5">
              <div className="text-[10px] text-emerald-300">STANDARD EGRESS</div>
              <div className="mt-1 font-display text-lg font-bold text-emerald-400">
                {stats.standardArchived}
              </div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-2.5">
              <div className="text-[10px] text-cyan-300">SERVO RESPONSE</div>
              <div className="mt-1 font-display text-lg font-bold text-cyan-400">
                {stats.lastLatencyMs}ms
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full Matrix Scan & Market Intelligence Report (5 Columns) */}
        <div className="col-span-1 flex flex-col justify-between space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Market Scan Matrix
                </h4>
              </div>
              <span className="font-mono text-[11px] text-cyan-400">
                {((stats.isolatedCompetitor / (stats.totalProcessed || 1)) * 100).toFixed(1)}% TARGET SHARE
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Mandate #2: Real-time telemetry breakdown of every logo and background color combination scanned.
            </p>

            {/* Matrix Table (4 Brands × 3 Colors) */}
            <div className="mt-3 overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60 p-2">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400">
                    <th className="p-1.5">COMPANY LOGO</th>
                    <th className="p-1.5 text-center text-red-400">RED</th>
                    <th className="p-1.5 text-center text-amber-400">YELLOW</th>
                    <th className="p-1.5 text-center text-blue-400">BLUE</th>
                    <th className="p-1.5 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {BRANDS.map((b) => {
                    const isCompetitor = b.id === keyCompetitor;
                    const counts = matrixData[b.id] || { red: 0, yellow: 0, blue: 0 };
                    const sum = counts.red + counts.yellow + counts.blue;

                    return (
                      <tr
                        key={b.id}
                        className={`border-b border-white/5 transition-colors ${
                          isCompetitor ? 'bg-amber-500/10 font-bold text-amber-200' : 'text-slate-300'
                        }`}
                      >
                        <td className="p-1.5 flex items-center gap-1.5">
                          <span style={{ color: b.color }}>{b.symbol}</span>
                          <span className="truncate max-w-[80px]">{b.name.split(' ')[0]}</span>
                          {isCompetitor && (
                            <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[8px] text-rose-300">
                              KEY
                            </span>
                          )}
                        </td>
                        <td className="p-1.5 text-center text-slate-300">{counts.red}</td>
                        <td className="p-1.5 text-center text-slate-300">{counts.yellow}</td>
                        <td className="p-1.5 text-center text-slate-300">{counts.blue}</td>
                        <td className="p-1.5 text-right font-semibold text-white">{sum}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Live CV Execution Log Terminal */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>CV / SIESED KERNEL TERMINAL:</span>
                <span className="text-emerald-400">UART RX/TX LIVE</span>
              </div>
              <div className="h-32 overflow-y-auto rounded-xl border border-white/5 bg-black/60 p-2.5 font-mono text-[10px] space-y-1.5">
                {cvLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-1.5 ${
                      log.type === 'danger'
                        ? 'text-rose-400'
                        : log.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="text-slate-600">›</span>
                    <span className="break-all">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-2.5 text-[11px] font-mono text-cyan-300">
            <span className="font-bold">SYSTEM MANDATE STATUS: </span>
            Autonomous Isolation & Market Scan Active (Zero operator intervention required).
          </div>
        </div>
      </div>
    </div>
  );
}
