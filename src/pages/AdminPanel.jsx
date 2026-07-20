import { agroApi } from '@/api/agroApi';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import PageTransition from '@/components/shared/PageTransition';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, MessageSquare, Sprout, TrendingUp, MapPin, ShieldCheck } from 'lucide-react';

const statCards = [
  { key: 'farms', label: 'Farms', icon: MapPin, color: 'text-primary' },
  { key: 'crop_predictions', label: 'Crop Predictions', icon: Sprout, color: 'text-secondary' },
  { key: 'price_predictions', label: 'Price Forecasts', icon: TrendingUp, color: 'text-chart-1' },
  { key: 'chat_logs', label: 'Chat Logs', icon: MessageSquare, color: 'text-chart-2' },
  { key: 'crop_knowledge', label: 'Crop Knowledge', icon: Database, color: 'text-chart-3' },
];

function DataTable({ title, rows, columns, empty }) {
  return (
    <Card className="p-5 border-border/50 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
        <Badge variant="outline">{rows.length} rows</Badge>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {columns.map((column) => (
                  <th key={column.key} className="py-2 pr-4 font-medium">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id || row.crop_name} className="border-b border-border/60 last:border-0">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 pr-4 align-top text-foreground">
                      {column.render ? column.render(row) : row[column.key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-summary'],
    queryFn: () => agroApi.admin(),
    enabled: user.role === 'admin',
  });

  if (user.role !== 'admin') {
    return (
      <PageTransition>
        <Card className="p-6 border-primary/20">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground mb-5">This page shows database records and model logs, so it is only available to the admin.</p>
          <Link to="/AdminLogin">
            <Button className="bg-primary">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Go to Admin Login
            </Button>
          </Link>
        </Card>
      </PageTransition>
    );
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <Card className="p-6 border-destructive/30">
          <p className="text-destructive font-medium">Admin API failed: {error.message}</p>
        </Card>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Real backend database records and model activity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.key} className="p-4 border-border/50">
                <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-foreground">{data.stats[stat.key]}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <DataTable
          title="Farms Table"
          rows={data.farms}
          empty="No farms have been added yet."
          columns={[
            { key: 'farm_name', label: 'Farm' },
            { key: 'location', label: 'Location' },
            { key: 'region', label: 'Agro Region', render: (row) => row.region?.replace(/_/g, ' ') || 'N/A' },
            { key: 'soil_type', label: 'Soil', render: (row) => row.soil_type?.replace(/_/g, ' ') },
            { key: 'water_availability', label: 'Water' },
            { key: 'soil_ph', label: 'pH' },
          ]}
        />

        <DataTable
          title="Crop Prediction Logs"
          rows={data.cropPredictions}
          empty="No crop predictions have been generated yet."
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'farm_id', label: 'Farm ID' },
            { key: 'season', label: 'Season' },
            { key: 'top_crop', label: 'Top Crop', render: (row) => row.predictions?.[0]?.crop_name || 'N/A' },
            { key: 'score', label: 'Score', render: (row) => `${Math.round(row.predictions?.[0]?.success_probability || 0)}%` },
          ]}
        />

        <DataTable
          title="Price Prediction Logs"
          rows={data.pricePredictions}
          empty="No price predictions have been generated yet."
          columns={[
            { key: 'crop', label: 'Crop' },
            { key: 'market', label: 'Market' },
            { key: 'current_price', label: 'Current Price', render: (row) => `₹${row.current_price?.toLocaleString()}` },
            { key: 'price_6_months', label: '6 Month', render: (row) => `₹${row.price_6_months?.toLocaleString()}` },
            { key: 'trend', label: 'Trend' },
          ]}
        />

        <DataTable
          title="Kisan AI Chat Logs"
          rows={data.chatLogs}
          empty="No chat messages have been sent yet."
          columns={[
            { key: 'language', label: 'Lang' },
            { key: 'message', label: 'Question' },
            { key: 'answer', label: 'Answer', render: (row) => <span className="line-clamp-2">{row.answer}</span> },
          ]}
        />

        <DataTable
          title="Crop Knowledge Base"
          rows={data.cropKnowledge}
          empty="Crop knowledge seed data missing."
          columns={[
            { key: 'crop_name', label: 'Crop' },
            { key: 'seasons', label: 'Seasons', render: (row) => row.seasons.join(', ') },
            { key: 'soils', label: 'Soils', render: (row) => row.soils.slice(0, 4).join(', ') },
            { key: 'duration', label: 'Duration', render: (row) => `${row.duration} days` },
            { key: 'demand', label: 'Demand' },
          ]}
        />
      </div>
    </PageTransition>
  );
}
