import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { agroApi } from '@/api/agroApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Navigation, Thermometer, Droplets, CloudRain, FlaskConical } from 'lucide-react';
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
    state: '',
    district: '',
    city: '',
    region: '',
    latitude: null,
    longitude: null,
    farm_size_acres: '',
    soil_type: '',
    water_source: '',
    water_availability: '',
    climate_zone: '',
    irrigation_type: '',
    n_level: '90',
    p_level: '42',
    k_level: '43',
    temperature: '25.5',
    humidity: '71.5',
    ph: '6.5',
    soil_ph: 6.5,
    rainfall: '202.9',
    organic_matter_percent: '',
    previous_crop: '',
    farming_experience_years: '',
  });

  useEffect(() => {
    if (farm) {
      setForm({
        farm_name: farm.farm_name || '',
        location: farm.location || '',
        state: farm.state || '',
        district: farm.district || '',
        city: farm.city || '',
        region: farm.region || '',
        latitude: farm.latitude || null,
        longitude: farm.longitude || null,
        farm_size_acres: farm.farm_size_acres || '',
        soil_type: farm.soil_type || '',
        water_source: farm.water_source || '',
        water_availability: farm.water_availability || '',
        climate_zone: farm.climate_zone || '',
        irrigation_type: farm.irrigation_type || '',
        n_level: farm.n_level !== null && farm.n_level !== undefined ? String(farm.n_level) : '90',
        p_level: farm.p_level !== null && farm.p_level !== undefined ? String(farm.p_level) : '42',
        k_level: farm.k_level !== null && farm.k_level !== undefined ? String(farm.k_level) : '43',
        temperature: farm.temperature !== null && farm.temperature !== undefined ? String(farm.temperature) : '25.5',
        humidity: farm.humidity !== null && farm.humidity !== undefined ? String(farm.humidity) : '71.5',
        ph: farm.ph !== null && farm.ph !== undefined ? String(farm.ph) : String(farm.soil_ph || 6.5),
        soil_ph: farm.soil_ph || farm.ph || 6.5,
        rainfall: farm.rainfall !== null && farm.rainfall !== undefined ? String(farm.rainfall) : '202.9',
        organic_matter_percent: farm.organic_matter_percent || '',
        previous_crop: farm.previous_crop || '',
        farming_experience_years: farm.farming_experience_years || '',
      });
    }
  }, [farm]);

  const { data: locationKnowledge } = useQuery({
    queryKey: ['location-knowledge'],
    queryFn: () => agroApi.locationKnowledge(),
  });

  const stateProfile = form.state ? locationKnowledge?.stateProfiles?.[form.state] : null;
  const districtProfile = form.state && form.district
    ? locationKnowledge?.districtProfiles?.[form.state]?.[form.district]
    : null;
  const activeProfile = districtProfile || stateProfile;
  const districts = stateProfile?.districts || [];
  const cities = districtProfile?.cities || [];

  const applyLocationSuggestion = (profile, next = {}) => {
    if (!profile) return;
    setForm((f) => {
      const city = next.city ?? f.city;
      const district = next.district ?? f.district;
      const state = next.state ?? f.state;
      return {
        ...f,
        ...next,
        region: profile.region || f.region,
        climate_zone: profile.climate_zone || f.climate_zone,
        soil_type: f.soil_type || profile.soil_types?.[0] || '',
        water_availability: f.water_availability || profile.water_availability || '',
        city,
        district,
        state,
      };
    });
  };

  const handleStateChange = (state) => {
    const nextStateProfile = locationKnowledge?.stateProfiles?.[state];
    applyLocationSuggestion(nextStateProfile, { state, district: '', city: '' });
  };

  const handleDistrictChange = (district) => {
    const nextDistrictProfile = locationKnowledge?.districtProfiles?.[form.state]?.[district];
    applyLocationSuggestion(nextDistrictProfile || stateProfile, { district, city: '' });
  };

  const handleCityChange = (city) => {
    setForm((f) => ({ ...f, city }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({ ...f, latitude, longitude, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        toast.success('Location coordinates captured!');
      },
      () => toast.error('Unable to fetch location')
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.farm_name || !form.soil_type || !form.water_source || !form.water_availability) {
      toast.error('Please fill required fields (Farm Name, Soil Type, Water Source, Water Availability)');
      return;
    }
    onSubmit({
      ...form,
      soil_ph: Number(form.ph || form.soil_ph || 7),
      ph: Number(form.ph || form.soil_ph || 7),
      n_level: form.n_level !== '' ? Number(form.n_level) : null,
      p_level: form.p_level !== '' ? Number(form.p_level) : null,
      k_level: form.k_level !== '' ? Number(form.k_level) : null,
      temperature: form.temperature !== '' ? Number(form.temperature) : null,
      humidity: form.humidity !== '' ? Number(form.humidity) : null,
      rainfall: form.rainfall !== '' ? Number(form.rainfall) : null,
    });
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-700/80 shadow-2xl text-slate-100 rounded-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-heading text-2xl font-extrabold text-white">{farm ? 'Edit Farm Telemetry' : 'Add New Farm Telemetry'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">Farm Name *</Label>
            <Input value={form.farm_name} onChange={(e) => update('farm_name', e.target.value)} placeholder="e.g. Green Valley Farm" className="bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">Location</Label>
            <div className="flex gap-2">
              <Input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City, State" className="flex-1 bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl" />
              <Button type="button" variant="outline" onClick={detectLocation} className="flex-shrink-0 bg-slate-800 border-slate-700 text-slate-200 hover:text-white h-12 rounded-xl">
                <Navigation className="w-4 h-4 text-emerald-400" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">State / Union Territory</Label>
            <Select value={form.state} onValueChange={handleStateChange}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl"><SelectValue placeholder="Select state..." /></SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-xl">
                {locationKnowledge?.states?.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">District</Label>
            <Select value={form.district} onValueChange={handleDistrictChange} disabled={!form.state || districts.length === 0}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl"><SelectValue placeholder={districts.length ? 'Select district...' : 'Use custom location'} /></SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-xl">
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CORE ML CROP MODEL PARAMETERS SECTION (N, P, K, Temperature, Humidity, pH, Rainfall) */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <h4 className="font-heading text-base font-extrabold uppercase tracking-wide text-white">
              ML Crop Model Parameters (N, P, K, Temperature, Humidity, pH, Rainfall)
            </h4>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            These 7 telemetry values power high-accuracy Machine Learning crop suitability predictions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {/* N */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">N (Nitrogen)</Label>
              <Input
                type="number"
                value={form.n_level}
                onChange={(e) => update('n_level', e.target.value)}
                placeholder="90"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">mg/kg</span>
            </div>

            {/* P */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">P (Phosphorus)</Label>
              <Input
                type="number"
                value={form.p_level}
                onChange={(e) => update('p_level', e.target.value)}
                placeholder="42"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">mg/kg</span>
            </div>

            {/* K */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">K (Potassium)</Label>
              <Input
                type="number"
                value={form.k_level}
                onChange={(e) => update('k_level', e.target.value)}
                placeholder="43"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">mg/kg</span>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-slate-400" /> Temp
              </Label>
              <Input
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={(e) => update('temperature', e.target.value)}
                placeholder="25.5"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">°C</span>
            </div>

            {/* Humidity */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-slate-400" /> Humidity
              </Label>
              <Input
                type="number"
                step="0.1"
                value={form.humidity}
                onChange={(e) => update('humidity', e.target.value)}
                placeholder="71.5"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">%</span>
            </div>

            {/* pH */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">pH</Label>
              <Input
                type="number"
                step="0.1"
                value={form.ph}
                onChange={(e) => {
                  update('ph', e.target.value);
                  update('soil_ph', Number(e.target.value) || 6.5);
                }}
                placeholder="6.5"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">0 - 14</span>
            </div>

            {/* Rainfall */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-slate-400" /> Rainfall
              </Label>
              <Input
                type="number"
                step="0.1"
                value={form.rainfall}
                onChange={(e) => update('rainfall', e.target.value)}
                placeholder="202.9"
                className="bg-slate-900 border-slate-700 text-white font-mono font-bold h-11 rounded-xl focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">mm</span>
            </div>
          </div>
        </div>

        {/* Additional Soil & Farm Properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">Soil Type *</Label>
            <Select value={form.soil_type} onValueChange={(v) => update('soil_type', v)}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-xl">
                {SOIL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">Water Source *</Label>
            <Select value={form.water_source} onValueChange={(v) => update('water_source', v)}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-xl">
                {WATER_SOURCES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-200">Water Availability *</Label>
            <Select value={form.water_availability} onValueChange={(v) => update('water_availability', v)}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-white font-bold h-12 rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-xl">
                {WATER_AVAILABILITY.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white rounded-xl h-12 px-6">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="btn-luxury rounded-xl h-12 px-8 font-extrabold text-base">
            <Save className="w-4 h-4 mr-2" />
            {farm ? 'Update Farm Telemetry' : 'Save Farm Telemetry'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
