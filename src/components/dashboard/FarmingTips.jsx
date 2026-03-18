import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Lightbulb, Sun, Droplets, Bug } from 'lucide-react';

const tips = [
  {
    icon: Sun,
    title: 'Optimal Planting',
    desc: 'Check weather forecasts 2 weeks ahead before planting to avoid unexpected frosts.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Droplets,
    title: 'Water Management',
    desc: 'Drip irrigation can save up to 60% water compared to traditional flood irrigation.',
    color: 'text-chart-2',
    bg: 'bg-chart-2/10',
  },
  {
    icon: Bug,
    title: 'Pest Control',
    desc: 'Use neem oil as a natural pesticide to protect crops without harmful chemicals.',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    icon: Lightbulb,
    title: 'Soil Health',
    desc: 'Rotate crops every season to maintain soil nutrients and prevent disease buildup.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export default function FarmingTips() {
  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-4 text-foreground">Farming Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-5 flex gap-4 items-start hover:shadow-md transition-all duration-300 border-border/50">
              <div className={`w-10 h-10 rounded-xl ${tip.bg} flex items-center justify-center flex-shrink-0`}>
                <tip.icon className={`w-5 h-5 ${tip.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{tip.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}