import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingParticles from '../shared/FloatingParticles';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen relative">
      <FloatingParticles />
      <Sidebar />
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 relative z-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}