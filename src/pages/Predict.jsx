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
import { Card } from '@/components/ui/card';
import { Sparkles, RotateCcw, Save } from 'lucide-react';
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

    const response = await agroApi.cropPredictions.create({
      farm_id: selectedFarm.id,
      season,
    });

    setResults(response);
    setIsAnalyzing(false);
    queryClient.invalidateQueries({ queryKey: ['predictions'] });
    toast.success('Prediction created and saved to history');
  };

  const savePrediction = async () => {
    if (!results) return;
    queryClient.invalidateQueries({ queryKey: ['predictions'] });
    toast.success('Prediction is already saved in history');
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Predict Crops</h1>
          <p className="text-muted-foreground mt-1">AI-powered crop recommendations for your farm</p>
        </div>

        <Card className="p-6 space-y-6 border-border/50">
          <FarmSelector farms={farms} selectedFarmId={selectedFarmId} onSelect={setSelectedFarmId} />
          <SeasonSelector value={season} onChange={setSeason} />

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handlePredict}
              disabled={isAnalyzing || !selectedFarmId || !season}
              className="bg-primary hover:bg-primary/90 flex-1 h-12 text-base font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Predict Best Crops'}
            </Button>
            {results && (
              <Button variant="outline" onClick={() => { setResults(null); }} className="h-12">
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {isAnalyzing && <PredictionLoader />}

          {results && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Recommended Crops
                </h2>
                <Button onClick={savePrediction} variant="outline" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Results
                </Button>
              </div>

              {results.recommendation_notes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/60 rounded-xl p-5 border border-primary/20"
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    💡 {results.recommendation_notes}
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.predictions?.map((crop, i) => (
                  <CropResultCard key={crop.crop_name} crop={crop} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
