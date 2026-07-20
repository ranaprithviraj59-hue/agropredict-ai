import { useState } from 'react';
import { agroApi } from '@/api/agroApi';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Sparkles, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

const CROPS = [
  'Rice', 'Wheat', 'Corn/Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Tomato',
  'Onion', 'Potato', 'Chickpea', 'Lentil', 'Mustard', 'Groundnut',
  'Sunflower', 'Turmeric', 'Chilli', 'Mango', 'Banana', 'Garlic', 'Ginger',
];

const MARKETS = ['Local Mandi', 'State Market', 'National Market', 'Export'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Year Round'];

function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp className="w-5 h-5 text-emerald-400" />;
  if (trend === 'down') return <TrendingDown className="w-5 h-5 text-rose-400" />;
  return <Minus className="w-5 h-5 text-slate-400" />;
}

function PriceCard({ label, value, unit, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -4 }}
    >
      <Card className="p-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700 hover:border-emerald-400/50 shadow-xl transition-all">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-extrabold font-heading text-white">{value}</p>
        <p className="text-xs text-amber-300 font-semibold mt-1">{unit}</p>
      </Card>
    </motion.div>
  );
}

export default function PricePredictor() {
  const [crop, setCrop] = useState('');
  const [market, setMarket] = useState('');
  const [season, setSeason] = useState('');
  const [quantity, setQuantity] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!crop || !market || !season) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await agroApi.pricePredictions.create({ crop, market, season, quantity, state, district });
      setResult(res);
      toast.success('Market price intelligence calculated!');
    } catch {
      toast.error('Failed to fetch market data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const trendColor = result?.trend === 'up' ? 'text-emerald-400' : result?.trend === 'down' ? 'text-rose-400' : 'text-slate-400';

  return (
    <PageTransition>
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Real-Time Mandi Analytics
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Market Price Predictor
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1.5 font-medium">
            AI-powered crop price forecasting & revenue optimization using live market telemetry.
          </p>
        </div>

        {/* Input Form Panel */}
        <div className="bg-slate-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Crop Name *</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl">
                  <SelectValue placeholder="Select crop..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-2xl p-1 shadow-2xl">
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-xl py-2 font-bold focus:bg-emerald-500/20 focus:text-emerald-300">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Market Type *</Label>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl">
                  <SelectValue placeholder="Select market type..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-2xl p-1 shadow-2xl">
                  {MARKETS.map((m) => (
                    <SelectItem key={m} value={m} className="rounded-xl py-2 font-bold focus:bg-emerald-500/20 focus:text-emerald-300">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Season *</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl">
                  <SelectValue placeholder="Select season..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-700 text-white rounded-2xl p-1 shadow-2xl">
                  {SEASONS.map((s) => (
                    <SelectItem key={s} value={s} className="rounded-xl py-2 font-bold focus:bg-emerald-500/20 focus:text-emerald-300">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Quantity (Quintals, optional)</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">State for Live Mandi</Label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Gujarat"
                className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">District for Live Mandi</Label>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Surat"
                className="h-14 bg-slate-900/90 border-slate-700 hover:border-emerald-400 text-white placeholder:text-slate-400 rounded-2xl font-bold text-sm shadow-xl"
              />
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={isLoading || !crop || !market || !season}
            className="mt-6 w-full h-14 btn-luxury font-extrabold text-base shadow-2xl gap-3"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin text-amber-300" />Fetching Mandi Analytics...</>
            ) : (
              <><Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />Predict Price & Revenue Trends</>
            )}
          </Button>
        </div>

        {/* Results Showcase */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 bg-slate-950/80 rounded-3xl border border-slate-800"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 mb-4"
              />
              <p className="text-slate-300 font-bold text-sm">Analyzing live commodity market vectors...</p>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary Header */}
              <div className="bg-slate-900/90 rounded-3xl p-6 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-2xl font-extrabold text-white">{result.crop} Price Forecast</h2>
                    <Badge className={`px-3 py-1 font-bold rounded-xl flex items-center gap-1 bg-slate-950 border border-slate-700 ${trendColor}`}>
                      <TrendIcon trend={result.trend} />
                      <span className="uppercase">{result.trend || 'Stable'} Market</span>
                    </Badge>
                    <Badge className={`px-3 py-1 font-bold rounded-xl bg-slate-950 border ${
                      result.is_live ? 'border-emerald-500/40 text-emerald-300' : 'border-amber-500/40 text-amber-300'
                    }`}>
                      {result.is_live ? 'Live Mandi Data' : 'Fallback Estimate'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">Market: {result.market} • Season: {result.season}</p>
                  {result.data_source && (
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {result.data_source.label}
                      {result.is_live && result.data_source.market ? ` • ${result.data_source.market}` : ''}
                    </p>
                  )}
                </div>

                <div className="text-right bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-500/30">
                  <p className="text-xs text-slate-400 uppercase font-bold">Predicted Price</p>
                  <p className="text-3xl font-extrabold font-heading text-emerald-400">
                    ₹{result.predicted_price_per_quintal} <span className="text-xs font-normal text-slate-300">/ quintal</span>
                  </p>
                </div>
              </div>

              {/* Price Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <PriceCard label="Min Price Range" value={`₹${result.min_price}`} unit="per quintal" delay={0.1} />
                <PriceCard label="Predicted Price" value={`₹${result.predicted_price_per_quintal}`} unit="per quintal" delay={0.2} />
                <PriceCard label="Max Price Range" value={`₹${result.max_price}`} unit="per quintal" delay={0.3} />
              </div>

              {/* Total Estimated Revenue Card */}
              {result.total_estimated_revenue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 rounded-3xl border border-emerald-500/40 flex items-center justify-between gap-4 shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white">Estimated Total Farm Revenue</h3>
                      <p className="text-xs text-slate-300">Based on {result.quantity_quintals} quintals yield projection</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold font-heading text-amber-300">
                      ₹{Number(result.total_estimated_revenue).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 6-Month Price Trend Chart */}
              {result.monthly_trend && (
                <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-heading text-xl font-bold text-white">6-Month Price Trajectory Forecast</h3>
                  </div>

                  <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.monthly_trend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#ffffff',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#f59e0b', r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
