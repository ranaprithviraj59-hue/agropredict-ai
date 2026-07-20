import { useState } from 'react';
import { agroApi } from '@/api/agroApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import FarmForm from '@/components/farm/FarmForm';
import FarmCard from '@/components/farm/FarmCard';
import { Button } from '@/components/ui/button';
import { Plus, Sprout, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function MyFarm() {
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const queryClient = useQueryClient();

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => agroApi.farms.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => agroApi.farms.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setShowForm(false);
      toast.success('New farm telemetry registered successfully!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => agroApi.farms.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setShowForm(false);
      setEditingFarm(null);
      toast.success('Farm details updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => agroApi.farms.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Farm removed.');
    },
  });

  const handleSubmit = (data) => {
    if (editingFarm) {
      updateMutation.mutate({ id: editingFarm.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
              <MapPin className="w-3.5 h-3.5" /> Farm Asset Management
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              My Farm Telemetry
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5 font-medium">
              Manage soil properties, water sources, and acreage for accurate AI models.
            </p>
          </div>

          <Button
            onClick={() => { setEditingFarm(null); setShowForm(!showForm); }}
            className="btn-luxury h-13 px-6 text-sm font-extrabold gap-2 shadow-xl"
          >
            <Plus className="w-5 h-5 text-white" />
            {showForm ? 'Close Form' : 'Register New Farm'}
          </Button>
        </div>

        {/* Form Overlay Container */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-slate-950/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl"
            >
              <FarmForm
                farm={editingFarm}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingFarm(null); }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {farms.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 text-emerald-400">
              <Sprout className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">
              No Farms Configured Yet
            </h3>
            <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto">
              Add your soil pH, N-P-K readings, and location to activate precision predictions.
            </p>
            <Button onClick={() => setShowForm(true)} className="btn-luxury gap-2 font-bold px-6 py-3">
              <Plus className="w-4 h-4" />
              Add Your First Farm
            </Button>
          </motion.div>
        )}

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {farms.map((farm, i) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                index={i}
                onEdit={handleEdit}
                onDelete={() => deleteMutation.mutate(farm.id)}
              />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </PageTransition>
  );
}
