import { useState } from 'react';
import { agroApi } from '@/api/agroApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import FarmSelector from '@/components/predict/FarmSelector';
import SeasonSelector from '@/components/predict/SeasonSelector';
import CropResultCard from '@/components/predict/CropResultCard';
import PredictionLoader from '@/components/predict/PredictionLoader';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Predict() {
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [season, setSeason] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => agroApi.farms.list(),
  });

  const selectedFarm = farms.find((f) => String(f.id) === String(selectedFarmId));

  const handlePredict = async () => {
    if (!selectedFarm || !season) {
      toast.error('Please select a farm and season');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const response = await agroApi.cropPredictions.create({
        farm_id: selectedFarm.id,
        season,
      });

      setResults(response);
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('AI Crop Prediction generated and saved!');
    } catch {
      toast.error('Failed to generate crop prediction. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const savePrediction = async () => {
    if (!results) return;
    queryClient.invalidateQueries({ queryKey: ['predictions'] });
    toast.success('Prediction results stored in history');
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Recommendation Engine
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Predict Optimal Crops
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1.5 font-medium">
            Deep AI analysis of soil chemistry, historical weather models, and crop yields.
          </p>
        </div>

        {/* Prediction Form Panel */}
        <div className="bg-slate-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FarmSelector farms={farms} selectedFarmId={selectedFarmId} onSelect={setSelectedFarmId} />
            <SeasonSelector value={season} onChange={setSeason} />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              onClick={handlePredict}
              disabled={isAnalyzing || !selectedFarmId || !season}
              className="btn-luxury flex-1 h-14 text-base font-extrabold gap-3 shadow-2xl"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              {isAnalyzing ? 'Analyzing Farm Models...' : 'Predict Best Crops Now'}
            </Button>

            {results && (
              <Button
                variant="outline"
                onClick={() => { setResults(null); }}
                className="btn-luxury-outline h-14 px-5 text-slate-200 hover:text-white"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Loading & Results View */}
        <AnimatePresence mode="wait">
          {isAnalyzing && <PredictionLoader />}

          {results && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    Recommended Crop Yields
                  </h2>
                  <p className="text-xs text-slate-300">Ranked by success probability & net profit potential</p>
                </div>

                <Button onClick={savePrediction} variant="outline" className="btn-luxury-outline gap-2 text-xs font-bold px-4 py-2.5">
                  <Save className="w-4 h-4 text-emerald-400" />
                  Save Results
                </Button>
              </div>

              {results.recommendation_notes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-500/30 flex items-start gap-3.5 shadow-xl"
                >
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    {results.recommendation_notes}
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.predictions?.map((crop, i) => (
                  <CropResultCard key={crop.crop_name || i} crop={crop} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
