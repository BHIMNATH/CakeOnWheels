import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CakeDetails from './pages/CakeDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import PartnerAuth from './pages/PartnerAuth';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Loader2 } from 'lucide-react';

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
