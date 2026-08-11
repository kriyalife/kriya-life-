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
  Ticket
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

        <div className="px-6 pb-6 text-xs font-mono text-emerald-400/80 truncate">
          {adminEmail}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
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
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#0B1D13] border-b border-white/10 p-4 flex items-center gap-4 shrink-0 relative z-30 text-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-serif text-xl font-bold text-white">
            Kriya Admin
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
