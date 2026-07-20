import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer, Droplets, Activity, Layers, Sun,
  CheckCircle2, Sparkles, MoveHorizontal, ShieldCheck, Gauge, Zap
} from 'lucide-react';

export default function InteractiveFarmerCard() {
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full rounded-3xl overflow-hidden glass-panel border border-emerald-500/30 shadow-2xl"
    >
      {/* Top Interactive Header */}
      <div className="px-6 py-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-lg text-white tracking-tight">
                Kisan AI Subterranean Telemetry
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> SATELLITE LIVE
              </span>
            </div>
            <p className="text-xs text-emerald-200/70 mt-0.5">
              Drag or tap slider to inspect real-time soil chemistry & environmental sensors
            </p>
          </div>
        </div>

        {/* Quick View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSliderPos(15)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              sliderPos < 30
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/40'
            }`}
          >
            Show Telemetry Data
          </button>
          <button
            onClick={() => setSliderPos(50)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              sliderPos >= 40 && sliderPos <= 60
                ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/40'
            }`}
          >
            Split 50%
          </button>
          <button
            onClick={() => setSliderPos(85)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              sliderPos > 70
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/40'
            }`}
          >
            Show Farmer Photo
          </button>
        </div>
      </div>

      {/* Main Interactive Slider Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-[420px] sm:h-[460px] w-full select-none cursor-ew-resize overflow-hidden bg-emerald-950"
      >
        {/* UNDERNEATH LAYER: Rich Telemetry Dashboard */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900/90 to-teal-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> SENSOR ID #AGRO-9482
              </span>
              <h4 className="text-2xl font-extrabold font-heading mt-2 text-white">
                Live Soil & Microclimate Telemetry
              </h4>
            </div>

            <div className="text-right bg-emerald-900/60 px-4 py-2 rounded-2xl border border-emerald-500/30 shadow-lg">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">AI Soil Index</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">94.8% Optimal</div>
            </div>
          </div>

          {/* 4 Telemetry Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
            
            <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 shadow-lg hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-emerald-400" /> Soil N-P-K</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Optimal</span>
              </div>
              <div className="text-xl font-extrabold text-white font-mono">84 : 48 : 120</div>
              <div className="w-full bg-emerald-950 rounded-full h-2 mt-2 overflow-hidden border border-emerald-500/20">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[88%]" />
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-1.5 font-medium">Nitrogen Rich Soil</p>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 shadow-lg hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between text-blue-300 text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-blue-400" /> Moisture</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">68.4%</span>
              </div>
              <div className="text-xl font-extrabold text-white font-mono">Sub-Surface 68%</div>
              <div className="w-full bg-emerald-950 rounded-full h-2 mt-2 overflow-hidden border border-blue-500/20">
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-full w-[68%]" />
              </div>
              <p className="text-[11px] text-blue-300/80 mt-1.5 font-medium">Ideal Root Hydration</p>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 shadow-lg hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between text-amber-300 text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-amber-400" /> Soil Temp & pH</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">7.2 pH</span>
              </div>
              <div className="text-xl font-extrabold text-white font-mono">27.2°C • Neutral</div>
              <div className="w-full bg-emerald-950 rounded-full h-2 mt-2 overflow-hidden border border-amber-500/20">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full w-[75%]" />
              </div>
              <p className="text-[11px] text-amber-300/80 mt-1.5 font-medium">Balanced Acidity</p>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 shadow-lg hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between text-teal-300 text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-300" /> Weather Vector</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">Sunny</span>
              </div>
              <div className="text-xl font-extrabold text-white font-mono">29°C (Wind 12km)</div>
              <div className="w-full bg-emerald-950 rounded-full h-2 mt-2 overflow-hidden border border-teal-500/20">
                <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full w-[90%]" />
              </div>
              <p className="text-[11px] text-teal-300/80 mt-1.5 font-medium">Low Frost Risk</p>
            </div>

          </div>

          {/* AI Agronomy Recommendation */}
          <div className="bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-amber-500/15 rounded-2xl p-4 border border-emerald-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white flex items-center gap-2">
                  AI Seasonal Agronomy Verdict
                  <span className="text-amber-400 font-normal text-xs">• High Yield Forecast</span>
                </h5>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Soil parameters are ideal for <strong className="text-amber-300">Chickpea, Wheat & Mustard</strong> sowing with 94%+ yield probability.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-md">
              <ShieldCheck className="w-4 h-4" /> VERIFIED BY AI
            </div>
          </div>

        </div>

        {/* OVERLAY TOP LAYER: Photorealistic Farmer Image clipped precisely */}
        <div
          className="absolute top-0 bottom-0 left-0 overflow-hidden shadow-2xl transition-all duration-75"
          style={{
            width: '100%',
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/farmer_hero.jpg')`,
            }}
          >
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
            
            {/* Floating Info Pill on Image */}
            <div className="absolute bottom-6 left-6 max-w-sm bg-black/70 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Precision Farming Innovation
              </div>
              <h4 className="font-heading text-xl font-bold">Empowering Farmers with AI</h4>
              <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed">
                Drag the divider handle horizontally to inspect sub-surface soil telemetry & AI climate vectors.
              </p>
            </div>
          </div>
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-emerald-400 to-teal-400 cursor-ew-resize z-30 shadow-[0_0_20px_rgba(16,185,129,0.9)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-emerald-950 border-2 border-emerald-400 shadow-2xl flex items-center justify-center text-emerald-300 hover:scale-110 transition-transform">
            <MoveHorizontal className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
