import { agroApi } from '@/api/agroApi';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Sprout, Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function PredictionItem({ prediction, farms, index }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const farm = farms.find((f) => f.id === prediction.farm_id);

  const deleteMutation = useMutation({
    mutationFn: () => agroApi.cropPredictions.delete(prediction.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['predictions'] }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="overflow-hidden border-border/50 hover:shadow-md transition-all duration-300">
        <div
          className="p-5 cursor-pointer flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {farm?.farm_name || 'Unknown Farm'}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {prediction.created_date ? format(new Date(prediction.created_date), 'MMM d, yyyy') : 'N/A'}
                <Badge variant="outline" className="text-xs ml-1">
                  {prediction.season?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              {prediction.predictions?.length || 0} crops
            </Badge>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
              <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                {prediction.recommendation_notes && (
                  <div className="bg-accent/60 rounded-lg p-3 text-sm text-foreground">
                    💡 {prediction.recommendation_notes}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prediction.predictions?.map((crop) => (
                    <div
                      key={crop.crop_name}
                      className="flex items-center justify-between bg-muted/50 rounded-lg p-3"
                    >
                      <span className="font-medium text-sm text-foreground">{crop.crop_name}</span>
                      <span className="text-sm font-bold text-primary">
                        {Math.round(crop.success_probability)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(); }}
                    className="text-destructive hover:text-destructive text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function PredictionHistory() {
  const { data: predictions = [] } = useQuery({
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
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Prediction History</h1>
          <p className="text-muted-foreground mt-1">View all your past crop predictions</p>
        </div>

        {predictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No predictions yet
            </h3>
            <p className="text-muted-foreground">
              Your crop prediction results will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {predictions.map((p, i) => (
              <PredictionItem key={p.id} prediction={p} farms={farms} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
