import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Droplets, TrendingUp, DollarSign, Lightbulb } from 'lucide-react';

export default function CropResultCard({ crop, index }) {
  const probability = Math.round(crop.success_probability || 0);
  
  const getProbColor = (p) => {
    if (p >= 75) return 'text-primary';
    if (p >= 50) return 'text-secondary';
    return 'text-destructive';
  };

  const getProbBg = (p) => {
    if (p >= 75) return 'bg-primary';
    if (p >= 50) return 'bg-secondary';
    return 'bg-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -4 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden relative">
        {index === 0 && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            🏆 Best Match
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">{crop.crop_name}</h3>
            <Badge variant="outline" className="mt-1 text-xs">
              {crop.market_demand || 'Moderate'} Demand
            </Badge>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${getProbColor(probability)}`}>{probability}%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
        </div>

        <Progress value={probability} className={`h-2 mb-4 ${getProbBg(probability)}`} />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-chart-2" />
            <span>{crop.growth_duration_days || '90-120'} days</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Droplets className="w-4 h-4 text-chart-2" />
            <span>{crop.water_requirement || 'Moderate'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>{crop.expected_yield || 'Good'} yield</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 text-secondary" />
            <span>{crop.investment_level || 'Medium'} investment</span>
          </div>
        </div>

        {crop.tips && (
          <div className="bg-accent/50 rounded-lg p-3 flex gap-2">
            <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">{crop.tips}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}