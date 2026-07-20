import { agroApi } from '@/api/agroApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Sprout, Calendar, ChevronDown, ChevronUp, Trash2, Sparkles, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

function PredictionItem({ prediction, farms, index }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const farm = farms.find((f) => f.id === prediction.farm_id);

  const deleteMutation = useMutation({
    mutationFn: () => agroApi.cropPredictions.delete(prediction.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Prediction record deleted');
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden hover:border-emerald-400/50 transition-all">
        <div
          className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl font-bold text-white">
                  {farm?.farm_name || 'Registered Farm'}
                </h3>
                {farm?.location && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300">
                    <MapPin className="w-3 h-3 text-emerald-400" /> {farm.location}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {prediction.created_date ? format(new Date(prediction.created_date), 'MMM d, yyyy') : 'N/A'}</span>
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] px-2.5 py-0.5 uppercase font-bold rounded-lg">
                  {prediction.season?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 font-bold rounded-xl">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
              {prediction.predictions?.length || 0} Crops Ranked
            </Badge>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4 border-t border-slate-800 pt-4 bg-slate-950/60">
                {prediction.recommendation_notes && (
                  <div className="bg-emerald-500/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 border border-emerald-500/20 font-medium">
                    💡 {prediction.recommendation_notes}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prediction.predictions?.map((crop) => (
                    <div
                      key={crop.crop_name}
                      className="flex items-center justify-between bg-slate-900 rounded-2xl p-3.5 border border-slate-800"
                    >
                      <span className="font-bold text-sm text-white">{crop.crop_name}</span>
                      <span className="text-sm font-extrabold font-mono text-emerald-400">
                        {Math.round(crop.success_probability)}% Match
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(); }}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-bold gap-1 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete History Record
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PredictionHistory() {
  const { data: predictions = [], isLoading: loadingPreds } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => agroApi.cropPredictions.list(),
  });

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => agroApi.farms.list(),
  });

  return (
    <PageTransition>
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            <History className="w-3.5 h-3.5 text-amber-400" /> Historical Analysis Log
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Prediction History
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1.5 font-medium">
            View and review all past AI crop recommendation records for your registered farms.
          </p>
        </div>

        {/* Loading State */}
        {loadingPreds && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300 text-sm font-bold">Loading historical records...</p>
          </div>
        )}

        {/* Empty State */}
        {!loadingPreds && predictions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 text-amber-400">
              <History className="w-10 h-10" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">
              No History Found
            </h3>
            <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto">
              Run your first AI crop prediction to store detailed recommendation logs here.
            </p>
          </motion.div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {predictions.map((prediction, i) => (
            <PredictionItem
              key={prediction.id}
              prediction={prediction}
              farms={farms}
              index={i}
            />
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
