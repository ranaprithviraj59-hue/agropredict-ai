import { motion } from 'framer-motion';
import { Sprout, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function WelcomeHero({ userName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full pt-4 sm:pt-8 pb-14 px-4 text-center max-w-4xl mx-auto space-y-6"
    >
      {/* Title & Subtitle sitting directly over the full-page farm wallpaper with generous spacing */}
      <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        Welcome back, <span className="text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]">CropAI</span>!
      </h1>
      
      <p className="text-slate-100 text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        Let AI analyze your farm conditions, soil telemetry, and climate data to predict the best crops for maximum yield and profitability.
      </p>

      {/* Redesigned Glowing Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-5 pt-6">
        <Link to="/Predict">
          <Button size="lg" className="btn-luxury h-14 px-9 text-base font-extrabold gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.5)]">
            <Sprout className="w-5 h-5 text-white" />
            <span>Start Crop Prediction</span>
            <ArrowRight className="w-4 h-4 ml-1 text-emerald-200" />
          </Button>
        </Link>

        <Link to="/PricePredictor">
          <Button size="lg" variant="outline" className="btn-luxury-outline h-14 px-8 text-sm font-extrabold gap-3 shadow-xl backdrop-blur-xl">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Market Price Trends</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}