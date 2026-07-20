import { motion } from 'framer-motion';
import { MapPin, Sprout, TrendingUp, Calendar } from 'lucide-react';

const stats = [
  { icon: MapPin, label: 'My Registered Farms', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' },
  { icon: Sprout, label: 'Total Predictions', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40' },
  { icon: TrendingUp, label: 'Top Optimal Crop', color: 'text-sky-400', bg: 'bg-sky-500/20 border-sky-500/40' },
  { icon: Calendar, label: 'Active Season', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/40' },
];

export default function QuickStats({ farmCount, predictionCount, topCrop, currentSeason }) {
  const values = [farmCount, predictionCount, topCrop || 'Chickpea', currentSeason || 'Rabi'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i, duration: 0.4 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group rounded-3xl bg-slate-950/75 backdrop-blur-xl p-6 border border-white/15 shadow-2xl hover:border-emerald-400/50 transition-all"
        >
          <div className={`w-12 h-12 rounded-2xl ${stat.bg} border flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          
          <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight drop-shadow-md">
            {values[i]}
          </p>
          <p className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}