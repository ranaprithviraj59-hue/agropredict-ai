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
import { TrendingUp, TrendingDown, Minus, Sparkles, DollarSign, BarChart3, Loader2, Info } from 'lucide-react';
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
  if (trend === 'up') return <TrendingUp className="w-5 h-5 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="w-5 h-5 text-destructive" />;
  return <Minus className="w-5 h-5 text-muted-foreground" />;
}

function PriceCard({ label, value, unit, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`p-5 border-2 ${color} hover:shadow-lg transition-all duration-300`}>
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{unit}</p>
      </Card>
    </motion.div>
  );
}

export default function PricePredictor() {
  const [crop, setCrop] = useState('');
  const [market, setMarket] = useState('');
  const [season, setSeason] = useState('');
  const [quantity, setQuantity] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!crop || !market || !season) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setResult(null);

    const res = await agroApi.pricePredictions.create({ crop, market, season, quantity });

    setResult(res);
    setIsLoading(false);
  };

  const trendColor = result?.trend === 'up' ? 'text-green-500' : result?.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Price Predictor</h1>
          <p className="text-muted-foreground mt-1">AI-powered crop price forecasting using real market data</p>
        </div>

        {/* Input Form */}
        <Card className="p-6 border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Crop Name *</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select crop..." />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Market Type *</Label>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select market..." />
                </SelectTrigger>
                <SelectContent>
                  {MARKETS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Season *</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select season..." />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity (quintals, optional)</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="h-12"
              />
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={isLoading || !crop || !market || !season}
            className="mt-6 w-full h-12 bg-primary font-semibold text-base shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Fetching market data...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />Predict Price</>
            )}
          </Button>
        </Card>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary mb-4"
              />
              <p className="text-muted-foreground text-sm">Analyzing real-time market data...</p>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Crop + trend header */}
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-heading text-2xl font-bold text-foreground">{crop}</h2>
                <Badge className={`flex items-center gap-1 ${
                  result.trend === 'up' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                  result.trend === 'down' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <TrendIcon trend={result.trend} />
                  {result.trend === 'up' ? '+' : result.trend === 'down' ? '-' : ''}{Math.abs(result.trend_percent || 0)}% (1 month)
                </Badge>
              </div>

              {/* Price cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PriceCard label="Current Price" value={`₹${result.current_price?.toLocaleString()}`} unit="per quintal" color="border-primary/30" delay={0} />
                <PriceCard label="1 Month" value={`₹${result.price_1_month?.toLocaleString()}`} unit="predicted" color="border-chart-2/30" delay={0.1} />
                <PriceCard label="3 Months" value={`₹${result.price_3_months?.toLocaleString()}`} unit="predicted" color="border-secondary/30" delay={0.2} />
                <PriceCard label="6 Months" value={`₹${result.price_6_months?.toLocaleString()}`} unit="predicted" color="border-chart-1/30" delay={0.3} />
              </div>

              {/* Revenue if quantity given */}
              {result.total_revenue && quantity && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-5 bg-primary/5 border-primary/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Revenue for {quantity} quintals</p>
                      <p className="text-3xl font-bold text-primary">₹{result.total_revenue?.toLocaleString()}</p>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Price range */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-5 border-border/50">
                  <h3 className="font-semibold text-sm text-foreground mb-3">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">₹{result.min_price?.toLocaleString()}</span>
                    <div className="flex-1 h-3 rounded-full bg-muted relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((result.current_price - result.min_price) / (result.max_price - result.min_price)) * 100}%`
                        }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">₹{result.max_price?.toLocaleString()}</span>
                  </div>
                </Card>
              </motion.div>

              {/* Chart */}
              {result.monthly_forecast?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-5 border-border/50">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      6-Month Price Forecast
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={result.monthly_forecast}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `₹${v}`} />
                        <Tooltip
                          formatter={(v) => [`₹${v?.toLocaleString()}`, 'Price']}
                          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>
              )}

              {/* Market factors */}
              {result.market_factors?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="p-5 border-border/50">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      Market Factors
                    </h3>
                    <ul className="space-y-2">
                      {result.market_factors.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.65 + i * 0.08 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                    {result.best_sell_time && (
                      <div className="mt-4 bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <p className="text-sm font-medium text-primary">
                          🕐 Best time to sell: {result.best_sell_time}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
