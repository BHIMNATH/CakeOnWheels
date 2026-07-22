/**
 * @file App.jsx
 * @description Main application component for Cake on Wheels.
 * Defines page-level state routing, global context providers, and layout styling.
 */
import React, { useState, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages to split bundle size and optimize FCP (First Contentful Paint)
const Home = lazy(() => import('./pages/Home'));
const CakeDetails = lazy(() => import('./pages/CakeDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Auth = lazy(() => import('./pages/Auth'));
const SellerAuth = lazy(() => import('./pages/SellerAuth'));
const AdminAuth = lazy(() => import('./pages/AdminAuth'));
const PartnerAuth = lazy(() => import('./pages/PartnerAuth'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function AppContent() {
  const { loading } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCakeId, setSelectedCakeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    deliveryFee: 0,
    discountAmount: 0,
    total: 0,
    couponCode: null
  });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSelectCake = (cakeId) => {
    setSelectedCakeId(cakeId);
    handleNavigate('cake-details');
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px', background: 'var(--bg-app)', color: 'var(--text-main)' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontWeight: 500 }}>Whisking up the best cakes...</h3>
        <style>{`
          .animate-spin {
            animation: spin 1.2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <Navbar 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        onSearch={setSearchQuery} 
      />

      {/* Main Page Area */}
      <main style={{ flexGrow: 1, padding: '0 24px' }}>
        <Suspense fallback={
          <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <h4 style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Loading section...</h4>
            <style>{`
              .animate-spin {
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }>
          {currentPage === 'home' && (
            <Home onSelectCake={handleSelectCake} searchQuery={searchQuery} />
          )}
          {currentPage === 'cake-details' && (
            <CakeDetails 
              cakeId={selectedCakeId} 
              onBack={() => handleNavigate('home')} 
              onNavigate={handleNavigate} 
            />
          )}
          {currentPage === 'cart' && (
            <Cart 
              onNavigate={handleNavigate} 
              onSetTotals={setCheckoutTotals} 
            />
          )}
          {currentPage === 'checkout' && (
            <Checkout 
              onNavigate={handleNavigate} 
              totals={checkoutTotals} 
            />
          )}
          {currentPage === 'auth' && (
            <Auth onNavigate={handleNavigate} />
          )}
          {currentPage === 'seller-auth' && (
            <SellerAuth onNavigate={handleNavigate} />
          )}
          {currentPage === 'admin-auth' && (
            <AdminAuth onNavigate={handleNavigate} />
          )}
          {currentPage === 'partner-auth' && (
            <PartnerAuth onNavigate={handleNavigate} />
          )}
          {currentPage === 'buyer-dashboard' && (
            <BuyerDashboard />
          )}
          {currentPage === 'seller-dashboard' && (
            <SellerDashboard />
          )}
          {currentPage === 'admin-dashboard' && (
            <AdminDashboard />
          )}
        </Suspense>
      </main>

      {/* Footer layout */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
