import { useState } from 'react';
import { agroApi } from '@/api/agroApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import FarmForm from '@/components/farm/FarmForm';
import FarmCard from '@/components/farm/FarmCard';
import { Button } from '@/components/ui/button';
import { Plus, Sprout } from 'lucide-react';

export default function MyFarm() {
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const queryClient = useQueryClient();

  const { data: farms = [], isLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => agroApi.farms.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => agroApi.farms.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => agroApi.farms.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setShowForm(false);
      setEditingFarm(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => agroApi.farms.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms'] }),
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">My Farms</h1>
            <p className="text-muted-foreground mt-1">Manage your farm details for accurate predictions</p>
          </div>
          <Button
            onClick={() => { setEditingFarm(null); setShowForm(!showForm); }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Farm
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
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

        {farms.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sprout className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No farms added yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Add your farm details to get AI-powered crop predictions
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Farm
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
