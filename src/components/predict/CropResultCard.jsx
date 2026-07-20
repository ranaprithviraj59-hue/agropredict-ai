import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Droplets, TrendingUp, DollarSign, Lightbulb, Trophy, Sparkles } from 'lucide-react';

export default function CropResultCard({ crop, index }) {
  const probability = Math.round(crop.success_probability || 0);
  
  const getProbColor = (p) => {
    if (p >= 75) return 'text-emerald-500 dark:text-emerald-400';
    if (p >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500';
  };

  const getProbBg = (p) => {
    if (p >= 75) return 'bg-emerald-500';
    if (p >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -4 }}
      className="relative rounded-2xl glass-card p-6 border border-emerald-500/25 shadow-xl overflow-hidden group"
    >
      {index === 0 && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-yellow-200" /> #1 Best Crop Match
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {crop.crop_name}
            </h3>
          </div>
          <Badge variant="outline" className="mt-1.5 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
            <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> {crop.market_demand || 'Moderate'} Market Demand
          </Badge>
        </div>
        
        <div className="text-right">
          <p className={`text-3xl sm:text-4xl font-extrabold font-heading ${getProbColor(probability)}`}>
            {probability}%
          </p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Confidence Score</p>
        </div>
      </div>

      <Progress value={probability} className={`h-2.5 rounded-full mb-5 ${getProbBg(probability)}`} />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground bg-accent/40 p-2.5 rounded-xl border border-emerald-500/10">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>{crop.growth_duration_days || '90-120'} growth days</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground bg-accent/40 p-2.5 rounded-xl border border-emerald-500/10">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span>{crop.water_requirement || 'Moderate'} water</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground bg-accent/40 p-2.5 rounded-xl border border-emerald-500/10">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>{crop.expected_yield || 'High'} yield level</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground bg-accent/40 p-2.5 rounded-xl border border-emerald-500/10">
          <DollarSign className="w-4 h-4 text-amber-500" />
          <span>{crop.investment_level || 'Medium'} investment</span>
        </div>
      </div>

      {crop.tips && (
        <div className="bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xl p-3.5 flex gap-3 border border-emerald-500/20">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/90 leading-relaxed font-normal">{crop.tips}</p>
        </div>
      )}
    </motion.div>
  );
}