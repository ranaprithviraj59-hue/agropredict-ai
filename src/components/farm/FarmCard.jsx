import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Pencil, Trash2, Sparkles, Activity } from 'lucide-react';

export default function FarmCard({ farm, index, onEdit, onDelete }) {
  const phVal = farm.ph ?? farm.soil_ph ?? 6.5;
  const nVal = farm.n_level ?? 90;
  const pVal = farm.p_level ?? 42;
  const kVal = farm.k_level ?? 43;
  const tempVal = farm.temperature ?? 25.5;
  const humidityVal = farm.humidity ?? 71.5;
  const rainfallVal = farm.rainfall ?? 202.9;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className="bg-slate-900/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl relative group hover:border-emerald-500/40 transition-all space-y-4"
    >
      {/* Top Title & Badges Row (Compact 1-Liner) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
              {farm.farm_name}
            </h3>
            {farm.location && (
              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{farm.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons & Badges */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-0.5 font-semibold rounded-lg">
              {farm.soil_type?.replace(/_/g, ' ').toUpperCase()}
            </Badge>
            <Badge className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-0.5 font-semibold rounded-lg">
              {farm.water_availability?.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => onEdit(farm)} className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 rounded-lg text-rose-400 hover:bg-rose-500/10">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ULTRA-COMPACT 7-INDICATOR TELEMETRY STRIP (Single Sleek Row) */}
      <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3" /> ML Telemetry Matrix
          </span>
          <span className="font-mono text-[10px] text-slate-400">7 Metrics</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">N</span>
            <span className="text-white font-mono font-extrabold text-xs">{nVal}</span>
          </div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">P</span>
            <span className="text-white font-mono font-extrabold text-xs">{pVal}</span>
          </div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">K</span>
            <span className="text-white font-mono font-extrabold text-xs">{kVal}</span>
          </div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">pH</span>
            <span className="text-emerald-400 font-mono font-extrabold text-xs">{phVal}</span>
          </div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Temp</span>
            <span className="text-white font-mono font-extrabold text-xs">{tempVal}°C</span>
          </div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Humid</span>
            <span className="text-white font-mono font-extrabold text-xs">{humidityVal}%</span>
          </div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Rain</span>
            <span className="text-white font-mono font-extrabold text-xs">{rainfallVal}mm</span>
          </div>
        </div>
      </div>

      {/* Minimal 1-Line Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-0.5">
        <span>Water: <strong className="text-slate-200 capitalize">{farm.water_source?.replace(/_/g, ' ')}</strong></span>
        {farm.climate_zone && (
          <span>Climate: <strong className="text-slate-200 capitalize">{farm.climate_zone?.replace(/_/g, ' ')}</strong></span>
        )}
      </div>
    </motion.div>
  );
}
