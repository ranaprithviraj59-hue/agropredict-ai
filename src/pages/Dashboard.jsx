import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '@/components/shared/PageTransition';
import WelcomeHero from '@/components/dashboard/WelcomeHero';
import QuickStats from '@/components/dashboard/QuickStats';
import FarmingTips from '@/components/dashboard/FarmingTips';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => base44.entities.Farm.list(),
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.CropPrediction.list('-created_date', 10),
  });

  const topCrop = predictions[0]?.predictions?.[0]?.crop_name;

  return (
    <PageTransition>
      <div className="space-y-8">
        <WelcomeHero userName={user?.full_name?.split(' ')[0]} />
        <QuickStats
          farmCount={farms.length}
          predictionCount={predictions.length}
          topCrop={topCrop}
          currentSeason="Rabi"
        />
        <FarmingTips />
      </div>
    </PageTransition>
  );
}