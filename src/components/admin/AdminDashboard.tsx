import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  Film,
  Ticket,
  ArrowLeft,
  Globe,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardOverview } from './DashboardOverview';
import { OrdersManager } from './OrdersManager';
import { ProductsManager } from './ProductsManager';
import { ReviewsManager } from './ReviewsManager';
import { VideosManager } from './VideosManager';
import { CouponsManager } from './CouponsManager';
import { CustomersManager } from './CustomersManager';
import { AdminSettings } from './AdminSettings';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

interface AdminDashboardProps {
  onLogout: () => void;
  adminEmail: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, adminEmail }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'videos', label: 'Showcase Videos', icon: Film },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const currentPath = location.pathname;
  const getActiveTabId = () => {
    const match = menuItems.find(m => currentPath.includes(`/admin/${m.id}`));
    return match ? match.id : 'dashboard';
  };
  const activeTabId = getActiveTabId();

  return (
    <div className="min-h-screen bg-[#0D2217] text-white flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0B1D13] text-stone-200 border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="font-serif text-2xl font-bold text-white tracking-wide">
            Kriya <span className="text-emerald-400">Admin</span>
          </div>
          <button className="lg:hidden text-stone-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pb-3 text-xs font-mono text-emerald-400/80 truncate">
          {adminEmail}
        </div>

        {/* Back to Website Button in Sidebar */}
        <div className="px-4 pb-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all cursor-pointer shadow-sm group"
            title="Return to the customer facing store"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Website</span>
            </div>
            <Store className="w-4 h-4 text-emerald-400/80" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(`/admin/${item.id}`);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTabId === item.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'hover:bg-white/10 text-emerald-100/70 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTabId === item.id ? 'text-emerald-400' : ''}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0D2217]">
        {/* Header Bar with Back to Website Button */}
        <header className="bg-[#0B1D13] border-b border-white/10 px-4 py-3 sm:px-6 flex items-center justify-between shrink-0 relative z-30 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Kriya Admin</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full font-sans font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/20 active:scale-95 group font-sans"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Website</span>
              <Globe className="w-4 h-4 opacity-80 hidden sm:inline" />
            </button>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/orders" element={<OrdersManager />} />
            <Route path="/products" element={<ProductsManager />} />
            <Route path="/add-product" element={<div className="p-8"><h1 className="text-2xl font-serif text-white">Add Product Module</h1></div>} />
            <Route path="/edit-product" element={<div className="p-8"><h1 className="text-2xl font-serif text-white">Edit Product Module</h1></div>} />
            <Route path="/users" element={<CustomersManager />} />
            <Route path="/coupons" element={<CouponsManager />} />
            <Route path="/reviews" element={<ReviewsManager />} />
            <Route path="/videos" element={<VideosManager />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
