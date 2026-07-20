import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { agroApi } from '@/api/agroApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Save, X, Navigation, Sparkles } from 'lucide-react';
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
        soil_ph: farm.soil_ph || 7,
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
        water_source: f.water_source || profile.water_sources?.[0] || '',
        water_availability: f.water_availability || profile.water_availability || '',
        location: [city, district, state].filter(Boolean).join(', '),
      };
    });
  };

  const handleStateChange = (state) => {
    const profile = locationKnowledge?.stateProfiles?.[state];
    applyLocationSuggestion(profile, { state, district: '', city: '' });
  };

  const handleDistrictChange = (district) => {
    const profile = locationKnowledge?.districtProfiles?.[form.state]?.[district] || stateProfile;
    applyLocationSuggestion(profile, { district, city: '' });
  };

  const handleCityChange = (city) => {
    applyLocationSuggestion(activeProfile, { city });
  };

  const inferFromCoordinates = (latitude, longitude) => {
    const nearest = locationKnowledge?.coordinateProfiles
      ?.map((profile) => ({
        ...profile,
        distance: (Number(latitude) - Number(profile.latitude)) ** 2 + (Number(longitude) - Number(profile.longitude)) ** 2,
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (!nearest) return null;

    const profile = locationKnowledge?.districtProfiles?.[nearest.state]?.[nearest.district]
      || locationKnowledge?.stateProfiles?.[nearest.state];
    return { nearest, profile };
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const inferred = inferFromCoordinates(latitude, longitude);

        if (inferred?.profile) {
          applyLocationSuggestion(inferred.profile, {
            state: inferred.nearest.state,
            district: inferred.nearest.district,
            city: inferred.nearest.district,
            latitude,
            longitude,
          });
          toast.success(`Location detected near ${inferred.nearest.district}, ${inferred.nearest.state}`);
          return;
        }

        setForm((f) => ({
          ...f,
          latitude,
          longitude,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
        toast.success('Coordinates detected. Select state/district for soil suggestions.');
      },
      (error) => {
        const message = error.code === 1
          ? 'Location permission denied. Allow location access in browser settings or enter state/district manually.'
          : 'Unable to detect location. Enter state/district manually.';
        toast.error(message);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
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
            <Label>State / Union Territory</Label>
            <Select value={form.state} onValueChange={handleStateChange}>
              <SelectTrigger><SelectValue placeholder="Select state..." /></SelectTrigger>
              <SelectContent>
                {locationKnowledge?.states?.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>District</Label>
            <Select value={form.district} onValueChange={handleDistrictChange} disabled={!form.state || districts.length === 0}>
              <SelectTrigger><SelectValue placeholder={districts.length ? 'Select district...' : 'Use custom location'} /></SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>City / Village</Label>
            <div className="flex gap-2">
              <Input
                value={form.city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder={cities.length ? `e.g. ${cities.slice(0, 2).join(', ')}` : 'Enter village or city'}
                list="city-suggestions"
                className="flex-1"
              />
              <datalist id="city-suggestions">
                {cities.map((city) => <option key={city} value={city} />)}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Agro Region</Label>
            <Input value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="Auto suggested region" />
          </div>

          <div className="space-y-2">
            <Label>Farm Size (acres)</Label>
            <Input type="number" value={form.farm_size_acres} onChange={(e) => update('farm_size_acres', e.target.value)} placeholder="10" />
          </div>

          {activeProfile && (
            <div className="md:col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Auto suggestion for this region</p>
                  <p className="text-xs text-muted-foreground">
                    Common soils: {activeProfile.soil_types?.map((s) => s.replace(/_/g, ' ')).join(', ')}.
                    {' '}Climate: {activeProfile.climate_zone?.replace(/_/g, ' ')}.
                    {' '}Water: {activeProfile.water_availability}.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => applyLocationSuggestion(activeProfile)}>
                    Apply Suggested Soil, Climate and Water
                  </Button>
                </div>
              </div>
            </div>
          )}

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
