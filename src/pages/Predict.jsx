import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    queryFn: () => base44.entities.Farm.list(),
  });

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  const handlePredict = async () => {
    if (!selectedFarm || !season) {
      toast.error('Please select a farm and season');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    const prompt = `You are an expert agricultural AI advisor. Based on the following farm details, predict the best crops that can grow successfully.

Farm Details:
- Farm Name: ${selectedFarm.farm_name}
- Location: ${selectedFarm.location || 'Not specified'}
- Latitude: ${selectedFarm.latitude || 'Unknown'}
- Longitude: ${selectedFarm.longitude || 'Unknown'}
- Farm Size: ${selectedFarm.farm_size_acres || 'Unknown'} acres
- Soil Type: ${selectedFarm.soil_type}
- Water Source: ${selectedFarm.water_source}
- Water Availability: ${selectedFarm.water_availability}
- Climate Zone: ${selectedFarm.climate_zone || 'Not specified'}
- Irrigation Type: ${selectedFarm.irrigation_type || 'Not specified'}
- Soil pH: ${selectedFarm.soil_ph || 'Unknown'}
- Organic Matter: ${selectedFarm.organic_matter_percent || 'Unknown'}%
- Previous Crop: ${selectedFarm.previous_crop || 'None'}
- Growing Season: ${season}

Predict 6-8 crops that can grow on this farm. For each crop provide realistic success probability (percentage), expected yield quality, growth duration in days, water requirement level, investment level, market demand level, and practical tips. Order by success probability descending.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          predictions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                crop_name: { type: 'string' },
                success_probability: { type: 'number' },
                expected_yield: { type: 'string' },
                growth_duration_days: { type: 'number' },
                water_requirement: { type: 'string' },
                investment_level: { type: 'string' },
                market_demand: { type: 'string' },
                tips: { type: 'string' },
              },
            },
          },
          recommendation_notes: { type: 'string' },
        },
      },
    });

    setResults(response);
    setIsAnalyzing(false);
  };

  const savePrediction = async () => {
    if (!results) return;
    await base44.entities.CropPrediction.create({
      farm_id: selectedFarmId,
      season,
      predictions: results.predictions,
      recommendation_notes: results.recommendation_notes,
    });
    queryClient.invalidateQueries({ queryKey: ['predictions'] });
    toast.success('Prediction saved successfully!');
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