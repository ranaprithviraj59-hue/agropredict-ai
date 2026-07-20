import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Droplets, Mountain, Pencil, Trash2, Ruler } from 'lucide-react';

export default function FarmCard({ farm, index, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">{farm.farm_name}</h3>
            {farm.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                {farm.location}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(farm)} className="h-8 w-8">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Mountain className="w-3 h-3" />
            {farm.soil_type?.replace(/_/g, ' ')}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {farm.water_availability}
          </Badge>
          {farm.farm_size_acres && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {farm.farm_size_acres} acres
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Water: {farm.water_source?.replace(/_/g, ' ')}</div>
          {farm.climate_zone && <div>Climate: {farm.climate_zone?.replace(/_/g, ' ')}</div>}
          {farm.region && <div>Region: {farm.region?.replace(/_/g, ' ')}</div>}
          {farm.irrigation_type && <div>Irrigation: {farm.irrigation_type?.replace(/_/g, ' ')}</div>}
          {farm.soil_ph && <div>pH: {farm.soil_ph}</div>}
        </div>
      </Card>
    </motion.div>
  );
}
