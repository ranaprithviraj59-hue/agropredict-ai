import { motion } from 'framer-motion';
import { Lightbulb, Sun, Droplets, ShieldAlert } from 'lucide-react';

const tips = [
  {
    icon: Sun,
    title: 'Optimal Planting Window',
    desc: 'Check weather forecasts 2 weeks ahead before planting to avoid unexpected frosts or heavy downpours.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20 border-amber-500/40',
  },
  {
    icon: Droplets,
    title: 'Precision Water Management',
    desc: 'Drip irrigation can save up to 60% water compared to traditional flood irrigation methods.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/20 border-sky-500/40',
  },
  {
    icon: ShieldAlert,
    title: 'Natural Pest Control',
    desc: 'Use neem oil extract as a natural pesticide to protect crops without harmful chemical runoff.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/20 border-rose-500/40',
  },
  {
    icon: Lightbulb,
    title: 'Soil Health & Crop Rotation',
    desc: 'Rotate crops every season to maintain soil nutrient levels and prevent disease buildup.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/40',
  },
];

export default function FarmingTips() {
  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
        Farming & Agronomy Tips
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className="bg-slate-950/75 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-2xl flex gap-5 items-start group hover:border-emerald-400/50 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${tip.bg} border flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
              <tip.icon className={`w-6 h-6 ${tip.color}`} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {tip.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-normal">
                {tip.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}