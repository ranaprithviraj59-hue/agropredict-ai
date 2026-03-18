import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, Save, X, Navigation } from 'lucide-react';
import { toast } from 'sonner';

const SOIL_TYPES = ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'laterite', 'black_cotton', 'red_soil', 'alluvial'];
const WATER_SOURCES = ['well', 'canal', 'river', 'rainwater', 'borewell', 'pond', 'drip_irrigation', 'sprinkler'];
const WATER_AVAILABILITY = ['abundant', 'moderate', 'scarce', 'seasonal'];
const CLIMATE_ZONES = ['tropical', 'subtropical', 'arid', 'semi_arid', 'temperate', 'continental', 'mediterranean'];
const IRRIGATION_TYPES = ['flood', 'drip', 'sprinkler', 'furrow', 'rainfed', 'center_pivot'];

export default function FarmForm({ farm, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    farm_name: '',
    location: '',
    latitude: null,
    longitude: null,
    farm_size_acres: '',
    soil_type: '',
    water_source: '',
    water_availability: '',
    climate_zone: '',
    irrigation_type: '',
    soil_ph: 7,
    organic_matter_percent: '',
    previous_crop: '',
    farming_experience_years: '',
  });

  useEffect(() => {
    if (farm) {
      setForm({
        farm_name: farm.farm_name || '',
        location: farm.location || '',
        latitude: farm.latitude || null,
        longitude: farm.longitude || null,
        farm_size_acres: farm.farm_size_acres || '',
        soil_type: farm.soil_type || '',
        water_source: farm.water_source || '',
        water_availability: farm.water_availability || '',
        climate_zone: farm.climate_zone || '',
        irrigation_type: farm.irrigation_type || '',
        soil_ph: farm.soil_ph || 7,
        organic_matter_percent: farm.organic_matter_percent || '',
        previous_crop: farm.previous_crop || '',
        farming_experience_years: farm.farming_experience_years || '',
      });
    }
  }, [farm]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
        toast.success('Location detected!');
      },
      () => toast.error('Unable to detect location')
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.farm_name || !form.soil_type || !form.water_source || !form.water_availability) {
      toast.error('Please fill all required fields');
      return;
    }
    const data = { ...form };
    if (data.farm_size_acres) data.farm_size_acres = Number(data.farm_size_acres);
    if (data.organic_matter_percent) data.organic_matter_percent = Number(data.organic_matter_percent);
    if (data.farming_experience_years) data.farming_experience_years = Number(data.farming_experience_years);
    onSubmit(data);
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Card className="p-6 border-primary/20 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-heading text-xl font-bold">{farm ? 'Edit Farm' : 'Add New Farm'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Farm Name *</Label>
            <Input value={form.farm_name} onChange={(e) => update('farm_name', e.target.value)} placeholder="My Farm" />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City, State" className="flex-1" />
              <Button type="button" variant="outline" onClick={detectLocation} className="flex-shrink-0">
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Farm Size (acres)</Label>
            <Input type="number" value={form.farm_size_acres} onChange={(e) => update('farm_size_acres', e.target.value)} placeholder="10" />
          </div>

          <div className="space-y-2">
            <Label>Soil Type *</Label>
            <Select value={form.soil_type} onValueChange={(v) => update('soil_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {SOIL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Water Source *</Label>
            <Select value={form.water_source} onValueChange={(v) => update('water_source', v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {WATER_SOURCES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Water Availability *</Label>
            <Select value={form.water_availability} onValueChange={(v) => update('water_availability', v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {WATER_AVAILABILITY.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Climate Zone</Label>
            <Select value={form.climate_zone} onValueChange={(v) => update('climate_zone', v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {CLIMATE_ZONES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Irrigation Type</Label>
            <Select value={form.irrigation_type} onValueChange={(v) => update('irrigation_type', v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {IRRIGATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Soil pH: {form.soil_ph}</Label>
            <Slider
              value={[form.soil_ph]}
              onValueChange={([v]) => update('soil_ph', v)}
              min={0}
              max={14}
              step={0.5}
              className="mt-3"
            />
          </div>

          <div className="space-y-2">
            <Label>Organic Matter (%)</Label>
            <Input type="number" value={form.organic_matter_percent} onChange={(e) => update('organic_matter_percent', e.target.value)} placeholder="2.5" />
          </div>

          <div className="space-y-2">
            <Label>Previous Crop</Label>
            <Input value={form.previous_crop} onChange={(e) => update('previous_crop', e.target.value)} placeholder="Rice, Wheat..." />
          </div>

          <div className="space-y-2">
            <Label>Farming Experience (years)</Label>
            <Input type="number" value={form.farming_experience_years} onChange={(e) => update('farming_experience_years', e.target.value)} placeholder="5" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-primary">
            <Save className="w-4 h-4 mr-2" />
            {farm ? 'Update Farm' : 'Save Farm'}
          </Button>
        </div>
      </form>
    </Card>
  );
}