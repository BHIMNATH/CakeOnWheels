import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../supabaseClient';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Cake,
  MapPin
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, onSearch }) {
  const { currentUser, logout, cart, selectedLocation, updateLocation } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [searchVal, setSearchVal] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearch) onSearch(val);
  };

  const navTo = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '12px 24px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--glass-border)',
      padding: '12px 24px'
    }}>
      <div className="flex-between" style={{ width: '100%' }}>
        <div className="flex-center gap-md">
          {/* Brand Logo */}
          <div 
            onClick={() => navTo('home')} 
            className="flex-center gap-sm" 
            style={{ cursor: 'pointer', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-main)' }}
          >
            <Cake size={28} style={{ color: 'var(--primary)' }} />
            <span>Cake on <span style={{ color: 'var(--secondary)' }}>Wheels</span></span>
            {!isCloudModeFallback() && (
              <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.15)', color: 'rgb(52, 211, 153)', borderRadius: '4px', border: '1px solid rgb(16, 185, 129)', marginLeft: '6px' }}>CLOUD</span>
            )}
          </div>

          {/* Locality Location Selector */}
          <div className="flex-center gap-xs location-selector-badge" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: '50px',
            padding: '6px 14px',
            marginLeft: '12px'
          }}>
            <MapPin size={15} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '4px', fontWeight: 600 }}>Deliver to:</span>
            <select
              value={selectedLocation}
              onChange={(e) => updateLocation(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '6px'
              }}
            >
              <option value="Kalpetta" style={{ background: '#1c1917', color: '#fff' }}>Kalpetta</option>
              <option value="Sulthan Bathery" style={{ background: '#1c1917', color: '#fff' }}>Sulthan Bathery</option>
              <option value="Mananthavady" style={{ background: '#1c1917', color: '#fff' }}>Mananthavady</option>
              <option value="Vythiri" style={{ background: '#1c1917', color: '#fff' }}>Vythiri</option>
              <option value="Meppadi" style={{ background: '#1c1917', color: '#fff' }}>Meppadi</option>
              <option value="Ambalavayal" style={{ background: '#1c1917', color: '#fff' }}>Ambalavayal</option>
            </select>
          </div>
        </div>

        {/* Global Search Bar (Only shown when home page is active) */}
        {currentPage === 'home' && (
          <div style={{ position: 'relative', flex: '0 1 350px', margin: '0 20px', display: 'none' }} className="search-desktop">
            <input 
              type="text" 
              placeholder="Search mouth-watering cakes..." 
              value={searchVal}
              onChange={handleSearchChange}
              className="form-input"
              style={{ paddingLeft: '40px', borderRadius: '50px', fontSize: '0.9rem' }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <User size={16} />
            </span>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav flex-center gap-lg" style={{ display: 'flex' }}>
          <button onClick={() => navTo('home')} className={`btn-text ${currentPage === 'home' ? 'active' : ''}`} style={currentPage === 'home' ? {color: 'var(--primary)', fontWeight: 600} : {}}>Browse</button>
          
          {currentUser && currentUser.role === 'buyer' && (
            <button onClick={() => navTo('buyer-dashboard')} className={`btn-text ${currentPage === 'buyer-dashboard' ? 'active' : ''}`} style={currentPage === 'buyer-dashboard' ? {color: 'var(--primary)', fontWeight: 600} : {}}>My Orders</button>
          )}

          {currentUser && currentUser.role === 'seller' && (
            <button onClick={() => navTo('seller-dashboard')} className={`btn-text ${currentPage === 'seller-dashboard' ? 'active' : ''}`} style={currentPage === 'seller-dashboard' ? {color: 'var(--primary)', fontWeight: 600} : {}}>Seller Dashboard</button>
          )}

          {currentUser && currentUser.role === 'admin' && (
            <button onClick={() => navTo('admin-dashboard')} className={`btn-text ${currentPage === 'admin-dashboard' ? 'active' : ''}`} style={currentPage === 'admin-dashboard' ? {color: 'var(--primary)', fontWeight: 600} : {}}>Admin Console</button>
          )}

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--glass-border)' }}></div>

          {/* Theme Toggler */}
          <button onClick={toggleTheme} className="btn-text" style={{ padding: '4px' }} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--secondary)' }} /> : <Moon size={20} />}
          </button>

          {/* Cart Icon */}
          <button onClick={() => navTo('cart')} style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="btn-text">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="flex-center" style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid var(--bg-app)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="flex-center gap-md">
              <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                {currentUser.role}: {currentUser.name.split(' ')[0]}
              </span>
              <button onClick={() => { logout(); navTo('home'); }} className="btn-text flex-center gap-sm" title="Log Out">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex-center gap-md">
              <button onClick={() => navTo('seller-auth')} className="btn-text" style={{ fontSize: '0.85rem' }}>
                Sellers Portal
              </button>
              <button onClick={() => navTo('auth')} className="btn btn-primary" style={{ padding: '8px 18px', borderRadius: '50px', fontSize: '0.85rem' }}>
                <User size={16} /> Login
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Navbar Hamburger Controls */}
        <div className="mobile-nav-toggle" style={{ display: 'none' }}>
          <button onClick={toggleTheme} className="btn-text" style={{ marginRight: '16px' }}>
            {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--secondary)' }} /> : <Moon size={20} />}
          </button>
          
          <button onClick={() => navTo('cart')} style={{ position: 'relative', marginRight: '16px' }} className="btn-text">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="flex-center" style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%'
              }}>{cartCount}</span>
            )}
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn-text">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown glass" style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          gap: '16px',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)'
        }}>
          {/* Mobile Location Selector */}
          <div className="flex-center gap-xs" style={{
            padding: '10px 0',
            borderBottom: '1px solid var(--glass-border)',
            justifyContent: 'flex-start'
          }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '4px' }}>Deliver to:</span>
            <select
              value={selectedLocation}
              onChange={(e) => { updateLocation(e.target.value); setMobileMenuOpen(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="Kalpetta" style={{ background: '#1c1917', color: '#fff' }}>Kalpetta</option>
              <option value="Sulthan Bathery" style={{ background: '#1c1917', color: '#fff' }}>Sulthan Bathery</option>
              <option value="Mananthavady" style={{ background: '#1c1917', color: '#fff' }}>Mananthavady</option>
              <option value="Vythiri" style={{ background: '#1c1917', color: '#fff' }}>Vythiri</option>
              <option value="Meppadi" style={{ background: '#1c1917', color: '#fff' }}>Meppadi</option>
              <option value="Ambalavayal" style={{ background: '#1c1917', color: '#fff' }}>Ambalavayal</option>
            </select>
          </div>

          <button onClick={() => navTo('home')} className="btn-text" style={{ textAlign: 'left', padding: '10px 0' }}>Browse Cakes</button>
          
          {currentUser && currentUser.role === 'buyer' && (
            <button onClick={() => navTo('buyer-dashboard')} className="btn-text" style={{ textAlign: 'left', padding: '10px 0' }}>My Orders</button>
          )}

          {currentUser && currentUser.role === 'seller' && (
            <button onClick={() => navTo('seller-dashboard')} className="btn-text" style={{ textAlign: 'left', padding: '10px 0' }}>Seller Dashboard</button>
          )}

          {currentUser && currentUser.role === 'admin' && (
            <button onClick={() => navTo('admin-dashboard')} className="btn-text" style={{ textAlign: 'left', padding: '10px 0' }}>Admin Console</button>
          )}

          <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--glass-border)' }} />

          {currentUser ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                {currentUser.role}: {currentUser.name}
              </span>
              <button onClick={() => { logout(); navTo('home'); }} className="btn-text flex-center gap-sm">
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <button onClick={() => navTo('auth')} className="btn btn-primary" style={{ width: '100%' }}>
              <User size={16} /> Login / Sign Up
            </button>
          )}
        </div>
      )}

      {/* Responsive Inline Styles Override */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
            align-items: center;
          }
          .search-desktop {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

// Helper to safely access cloud connection state inside components
function isCloudModeFallback() {
  const isCloud = localStorage.getItem('is_supabase_cloud');
  return isCloud === 'true' || isSupabaseConfigured;
}
