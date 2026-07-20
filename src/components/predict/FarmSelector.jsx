import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function FarmSelector({ farms, selectedFarmId, onSelect }) {
  if (farms.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-8 text-center border-dashed border-2 border-slate-700 bg-slate-900/80 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white mb-1">No Registered Farms Found</h3>
          <p className="text-xs text-slate-400 mb-4">Add your farm telemetry parameters first to run AI crop predictions</p>
          <Link to="/MyFarm">
            <Button className="btn-luxury gap-2 font-bold">
              <Plus className="w-4 h-4" />
              Add Your Farm
            </Button>
          </Link>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-emerald-400" />
        Select Target Farm
      </Label>
      <Select value={selectedFarmId} onValueChange={onSelect}>
        <SelectTrigger className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 focus:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl transition-all">
          <SelectValue placeholder="Choose a registered farm..." />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-2xl p-1 shadow-2xl">
          {farms.map((farm) => (
            <SelectItem key={farm.id} value={String(farm.id)} className="rounded-xl py-2.5 font-bold text-slate-100 focus:bg-emerald-500/20 focus:text-emerald-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{farm.farm_name}</span>
                <span className="text-xs text-slate-400">({farm.soil_type?.replace(/_/g, ' ')})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
