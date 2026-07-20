import { motion } from 'framer-motion';
import { Sprout, Sparkles, Cpu } from 'lucide-react';

export default function PredictionLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 glass-panel rounded-3xl border border-emerald-500/30 shadow-2xl my-6"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/50 flex items-center justify-center"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-white"
        >
          <Sprout className="w-8 h-8 animate-pulse" />
        </motion.div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-4 h-4 text-emerald-500 animate-spin" />
        <h3 className="font-heading text-2xl font-bold text-foreground">
          Running Neural Agronomy AI...
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md leading-relaxed">
        Analyzing soil N-P-K ratios, satellite microclimate vectors, regional water table indexes, and market price liquidity to determine top crop recommendations.
      </p>

      <div className="flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Optimizing Yield & Profitability Matrix</span>
      </div>
    </motion.div>
  );
}