import { useEffect, useState } from 'react';
import { agroApi } from '@/api/agroApi';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '@/components/shared/PageTransition';
import WelcomeHero from '@/components/dashboard/WelcomeHero';
import QuickStats from '@/components/dashboard/QuickStats';
import FarmingTips from '@/components/dashboard/FarmingTips';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    agroApi.me().then(setUser).catch(() => {});
  }, []);

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => agroApi.farms.list(),
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => agroApi.cropPredictions.list(),
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
