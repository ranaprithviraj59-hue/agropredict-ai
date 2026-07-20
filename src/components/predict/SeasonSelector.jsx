import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun } from 'lucide-react';

const seasons = [
  { value: 'kharif', label: 'Kharif (Monsoon Cycle)' },
  { value: 'rabi', label: 'Rabi (Winter Cycle)' },
  { value: 'zaid', label: 'Zaid (Summer Cycle)' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
  { value: 'year_round', label: 'Year Round (365 Days)' },
];

export default function SeasonSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
        <Sun className="w-4 h-4 text-amber-400" />
        Growing Season Cycle
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 focus:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl transition-all">
          <SelectValue placeholder="Select active growing season..." />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-2xl p-1 shadow-2xl">
          {seasons.map((s) => (
            <SelectItem key={s.value} value={s.value} className="rounded-xl py-2.5 font-bold text-slate-100 focus:bg-emerald-500/20 focus:text-emerald-300">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{s.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}