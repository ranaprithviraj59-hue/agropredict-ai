import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

export default function PredictionLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        <Sprout className="w-10 h-10 text-primary" />
      </motion.div>
      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
        Analyzing Your Farm...
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Our AI is evaluating soil conditions, water availability, climate data, and market trends to find the best crops for you.
      </p>
      <div className="flex gap-1 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
}