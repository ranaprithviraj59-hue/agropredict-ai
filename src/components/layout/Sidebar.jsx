import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Sprout, MapPin, History,
  Menu, X, LogOut, Leaf, Bot, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ThemeToggle from '@/components/shared/ThemeToggle';

const navItems = [
  { path: '/Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/Predict', icon: Sprout, label: 'Predict Crops' },
  { path: '/MyFarm', icon: MapPin, label: 'My Farm' },
  { path: '/PricePredictor', icon: TrendingUp, label: 'Price Predictor' },
  { path: '/ChatBot', icon: Bot, label: 'Kisan AI Chat' },
  { path: '/PredictionHistory', icon: History, label: 'History' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => base44.auth.logout();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link to="/Dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Leaf className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground leading-tight">CropAI</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Smart Farming</p>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {item.path === '/ChatBot' && !isActive && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-green-500"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-1">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive h-10 text-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 border-r border-border bg-card/80 backdrop-blur-sm h-screen sticky top-0">
        <div className="w-full overflow-hidden">
          <NavContent />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/Dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg">CropAI</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-card z-50 shadow-2xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}