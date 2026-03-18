import { motion } from 'framer-motion';
import { MapPin, Sprout, TrendingUp, Droplets } from 'lucide-react';
import { Card } from '@/components/ui/card';

const stats = [
  { icon: MapPin, label: 'My Farms', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Sprout, label: 'Predictions', color: 'text-secondary', bg: 'bg-secondary/10' },
  { icon: TrendingUp, label: 'Top Crop', color: 'text-chart-1', bg: 'bg-chart-1/10' },
  { icon: Droplets, label: 'Season', color: 'text-chart-2', bg: 'bg-chart-2/10' },
];

export default function QuickStats({ farmCount, predictionCount, topCrop, currentSeason }) {
  const values = [farmCount, predictionCount, topCrop || 'N/A', currentSeason || 'Analyze'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.4 }}
        >
          <Card className="p-5 hover:shadow-md transition-shadow duration-300 border-border/50">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{values[i]}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}