import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function FarmSelector({ farms, selectedFarmId, onSelect }) {
  if (farms.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="p-8 text-center border-dashed border-2 border-border">
          <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">No Farms Added Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your farm details first to get crop predictions</p>
          <Link to="/MyFarm">
            <Button className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your Farm
            </Button>
          </Link>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Select Farm</Label>
      <Select value={selectedFarmId} onValueChange={onSelect}>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Choose a farm..." />
        </SelectTrigger>
        <SelectContent>
          {farms.map((farm) => (
            <SelectItem key={farm.id} value={String(farm.id)}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {farm.farm_name} — {farm.soil_type?.replace(/_/g, ' ')}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
