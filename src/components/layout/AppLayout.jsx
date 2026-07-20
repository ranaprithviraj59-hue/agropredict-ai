import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import FloatingParticles from '../shared/FloatingParticles';

export default function AppLayout() {
  return (
    <div className="min-h-screen relative flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* REAL-WORLD FULL-PAGE EDGE-TO-EDGE FARM WALLPAPER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 dark:opacity-60 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/farm_bg.jpg')` }}
        />
        {/* Subtle Dark Gradient Layer for Optimal Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/50 to-slate-950/90 backdrop-blur-[1px]" />
      </div>

      <FloatingParticles />

      {/* Floating Centered Blurred Navbar */}
      <TopNavbar />

      {/* Main Content Area with generous top spacing under navbar */}
      <main className="flex-1 relative z-10 px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 md:pt-48 pb-20 max-w-7xl w-full mx-auto space-y-12">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-8 border-t border-white/10 backdrop-blur-md text-center text-xs text-slate-300">
        <p>© 2026 CropAI • Precision Smart Agriculture</p>
      </footer>
    </div>
  );
}