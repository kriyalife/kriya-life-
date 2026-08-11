import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { WishlistPage } from './components/WishlistPage';
import { AdminPanel } from './components/AdminPanel';
import { BookOrderPage } from './components/BookOrderPage';
import { SkinQuizModal } from './components/SkinQuizModal';
import { CinematicGallery } from './components/CinematicGallery';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import ContactPage from './components/ContactPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { RefundPolicy } from './components/RefundPolicy';
import { FAQPage } from './components/FAQPage';
import { AboutPage } from './components/AboutPage';
import { Login } from './components/admin/Login';
import { UserAuthPage } from './components/UserAuthPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WhatsAppButton } from './components/WhatsAppButton';

// We create a ProductsPage to satisfy the /products route
const ProductsPage = () => (
  <div className="pt-24 bg-[#0D2217] text-white min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <h1 className="text-3xl font-serif text-white mb-4">Our Formulations</h1>
      <p className="text-emerald-100/80">Explore our bioactive botanical collection designed for ultimate skin wellness.</p>
    </div>
    <ProductGrid />
  </div>
);

// We create a Home page wrapper
const HomePage = () => (
  <>
    <Hero />
    <ProductGrid />
    <CinematicGallery />
    <BrandStory />
  </>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0D2217] text-white flex flex-col font-sans selection:bg-emerald-400 selection:text-stone-950 overflow-x-hidden w-full relative">
    <Navbar />
    <main className="flex-1 pb-16 sm:pb-0">
      {children}
    </main>
    <Footer />
    <MobileBottomNav />
    <CartDrawer />
    <SkinQuizModal />
    <ToastContainer />
    <OrderConfirmationModal />
    <WhatsAppButton />
  </div>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0D2217] text-white flex flex-col font-sans selection:bg-emerald-400 selection:text-stone-950 overflow-x-hidden w-full relative">
    <main className="flex-1">
      {children}
    </main>
    <ToastContainer />
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const { currentUser } = useShop();

  // Only allow admin account kriyalifescience@gmail.com for admin routes
  const isAdmin = currentUser?.email?.toLowerCase() === "kriyalifescience@gmail.com";
  if (location.pathname.startsWith("/admin") && !isAdmin) {
    return <AdminLayout><Login /></AdminLayout>;
  }

  return (
    <>
      
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><UserAuthPage /></MainLayout>} />
        <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
        <Route path="/product/detail" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
        <Route path="/orders" element={<MainLayout><OrderTrackingPage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/refund" element={<MainLayout><RefundPolicy /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><FAQPage /></MainLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout><AdminPanel /></AdminLayout>} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AppRoutes />
      </ShopProvider>
    </BrowserRouter>
  );
}
