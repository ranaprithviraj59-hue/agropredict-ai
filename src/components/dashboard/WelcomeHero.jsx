import { motion } from 'framer-motion';
import { Sprout, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function WelcomeHero({ userName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-8 md:p-10 text-primary-foreground"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
        >
          <Sprout className="w-6 h-6" />
        </motion.div>
        
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
          Welcome back{userName ? `, ${userName}` : ''}! 🌾
        </h1>
        <p className="text-primary-foreground/80 text-lg mb-6 max-w-xl">
          Let AI analyze your farm conditions and predict the best crops for maximum yield and profitability.
        </p>
        
        <Link to="/Predict">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
          >
            <Sprout className="w-4 h-4 mr-2" />
            Start Prediction
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}