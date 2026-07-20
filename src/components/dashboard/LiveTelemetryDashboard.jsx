import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Droplets, Thermometer, Layers, Sun, Wind, CloudRain,
  CheckCircle2, Sparkles, ArrowRight, Compass, Cpu, Zap, BarChart2, Sprout
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SOIL_TYPES = [
  { id: 'alluvial', name: 'Alluvial Soil', npk: 'N: 85 | P: 45 | K: 120', ph: '7.2' },
  { id: 'black_cotton', name: 'Black Cotton', npk: 'N: 70 | P: 60 | K: 140', ph: '7.8' },
  { id: 'red_loamy', name: 'Red / Loamy', npk: 'N: 90 | P: 35 | K: 110', ph: '6.5' },
  { id: 'sandy', name: 'Sandy Soil', npk: 'N: 50 | P: 30 | K: 85', ph: '6.2' },
];

const SEASONS = [
  { id: 'rabi', name: 'Rabi (Winter)', crops: [
    { name: 'Chickpea (Chana)', match: 96, duration: '90-110 Days', yield: 'High (22 Q/ha)', profit: '₹45,000/acre' },
    { name: 'Wheat (Gehun)', match: 92, duration: '120-135 Days', yield: 'Very High (45 Q/ha)', profit: '₹38,000/acre' },
    { name: 'Mustard (Sarson)', match: 88, duration: '100-115 Days', yield: 'Moderate (18 Q/ha)', profit: '₹42,000/acre' },
  ]},
  { id: 'kharif', name: 'Kharif (Monsoon)', crops: [
    { name: 'Paddy Rice (Dhan)', match: 95, duration: '115-130 Days', yield: 'Very High (50 Q/ha)', profit: '₹40,000/acre' },
    { name: 'Cotton (Kapas)', match: 90, duration: '150-180 Days', yield: 'High (25 Q/ha)', profit: '₹55,000/acre' },
    { name: 'Soybean', match: 86, duration: '95-105 Days', yield: 'Moderate (20 Q/ha)', profit: '₹36,000/acre' },
  ]},
  { id: 'zaid', name: 'Zaid (Summer)', crops: [
    { name: 'Watermelon (Tarbooz)', match: 94, duration: '75-85 Days', yield: 'High (300 Q/ha)', profit: '₹60,000/acre' },
    { name: 'Cucumber (Kheera)', match: 89, duration: '60-70 Days', yield: 'Moderate (150 Q/ha)', profit: '₹48,000/acre' },
    { name: 'Moong Dal', match: 85, duration: '65-75 Days', yield: 'Moderate (12 Q/ha)', profit: '₹32,000/acre' },
  ]},
];

export default function LiveTelemetryDashboard() {
  const [activeSoil, setActiveSoil] = useState(SOIL_TYPES[0]);
  const [activeSeasonId, setActiveSeasonId] = useState('rabi');

  const selectedSeason = SEASONS.find(s => s.id === activeSeasonId) || SEASONS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> SATELLITE COMMAND CENTER
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Telemetry & AI Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time soil chemistry, climatic indices, and instant AI crop yield recommendations.
          </p>
        </div>

        <Link to="/Predict">
          <button className="btn-luxury px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Full AI Prediction Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* TOP GRID: 4 HIGH-VISIBILITY TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Soil Moisture */}
        <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" /> Soil Moisture
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              OPTIMAL
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">68.4%</span>
            <span className="text-xs text-blue-300 font-semibold">Sub-surface 15cm</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden border border-blue-500/20">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[68%] rounded-full" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Ideal root hydration level</p>
        </div>

        {/* Soil N-P-K Ratio */}
        <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Soil N-P-K Balance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              BALANCED
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-mono text-emerald-400">{activeSoil.npk}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden border border-emerald-500/20">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[85%] rounded-full" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">High Nitrogen availability</p>
        </div>

        {/* Soil Temp & pH */}
        <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" /> Soil Temp & pH
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              pH {activeSoil.ph}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">27.2°C</span>
            <span className="text-xs text-amber-300 font-semibold">Neutral pH</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden border border-amber-500/20">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full w-[72%] rounded-full" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Ideal thermal microbial activity</p>
        </div>

        {/* Satellite Climate */}
        <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-300" /> Climate Vector
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              SUNNY
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">29°C</span>
            <span className="text-xs text-teal-300 font-semibold">Wind 12km/h</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden border border-teal-500/20">
            <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full w-[90%] rounded-full" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">0% Frost Risk • 45% Humidity</p>
        </div>

      </div>

      {/* MAIN INTERACTIVE SIMULATOR CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl space-y-6">
        
        {/* Simulator Control Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" /> Live AI Yield Simulator
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
              Instant Crop Recommendation Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Toggle Soil Type & Growing Season below to calculate instant AI crop suitability.
            </p>
          </div>

          {/* Season Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-emerald-500/30">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeasonId(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeSeasonId === s.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Soil Selector Pills */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Select Active Soil Classification:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOIL_TYPES.map((soil) => (
              <button
                key={soil.id}
                onClick={() => setActiveSoil(soil)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeSoil.id === soil.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{soil.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">{soil.npk}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CROP RESULTS CARDS GRID */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>AI RECOMMENDED CROPS FOR {activeSoil.name.toUpperCase()} ({selectedSeason.name.toUpperCase()})</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Precision Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedSeason.crops.map((crop, idx) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/25 shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-400">#{idx + 1} Recommendation</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {crop.match}% Match
                    </span>
                  </div>

                  <h4 className="font-heading text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {crop.name}
                  </h4>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-300 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <strong className="text-white font-mono">{crop.duration}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Yield Potential:</span>
                      <strong className="text-emerald-400 font-mono">{crop.yield}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Net Profit:</span>
                      <strong className="text-amber-300 font-mono">{crop.profit}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1"><Sprout className="w-3.5 h-3.5 text-emerald-400" /> Optimal Sowing</span>
                  <Link to="/Predict" className="text-emerald-400 hover:text-white flex items-center gap-1 transition-colors">
                    Run Analysis <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
