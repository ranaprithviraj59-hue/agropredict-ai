import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Sprout, MapPin, History,
  Menu, X, LogOut, Bot, TrendingUp, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useAuth } from '@/lib/AuthContext';

const baseNavItems = [
  { path: '/Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/Predict', icon: Sprout, label: 'Predict Crops' },
  { path: '/MyFarm', icon: MapPin, label: 'My Farm' },
  { path: '/PricePredictor', icon: TrendingUp, label: 'Price Predictor' },
  { path: '/ChatBot', icon: Bot, label: 'Kisan AI' },
  { path: '/PredictionHistory', icon: History, label: 'History' },
];

export default function TopNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = user?.role === 'admin'
    ? [...baseNavItems, { path: '/AdminPanel', icon: ShieldCheck, label: 'Admin Panel' }]
    : [...baseNavItems, { path: '/AdminLogin', icon: ShieldCheck, label: 'Admin Login' }];

  const handleLogout = () => {
    logout();
    window.location.assign('/Dashboard');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 glass-nav rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 transition-all duration-300">
      
      {/* Brand Name ONLY (No logo icon, no PRO badge, no subtext) */}
      <Link to="/Dashboard" className="flex items-center flex-shrink-0">
        <h1 className="font-heading font-extrabold text-2xl tracking-tight text-white leading-none">
          Crop<span className="text-emerald-400">AI</span>
        </h1>
      </Link>

      {/* Center Navigation Links (Single Line, Spacious Pills) */}
      <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Medium Screen Nav Items (Between lg and xl) */}
      <nav className="hidden lg:flex xl:hidden items-center gap-1">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
              }`}>
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Right Controls (Theme Toggle + Logout ONLY, No end status text) */}
      <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-xs font-bold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>{user?.role === 'admin' ? 'Exit Admin' : 'Logout'}</span>
        </Button>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="flex lg:hidden items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl text-white hover:bg-slate-800"
        >
          {mobileOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 mt-3 p-4 rounded-2xl glass-nav space-y-2 shadow-2xl border border-slate-700/50"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="w-full justify-start gap-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>{user?.role === 'admin' ? 'Exit Admin' : 'Logout'}</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
