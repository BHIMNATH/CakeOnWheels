import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, ShieldCheck, Mail, Lock, Phone, User, KeyRound, ArrowRight } from 'lucide-react';

export default function PartnerAuth({ onNavigate }) {
  const { login, registerUser, errorMsg } = useApp();
  
  // Seller State
  const [isSellerLogin, setIsSellerLogin] = useState(true);
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [shopName, setShopName] = useState('');

  // Admin State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [sellerError, setSellerError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [sellerSuccess, setSellerSuccess] = useState('');

  // Handle Seller Authentication
  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    setSellerError('');
    setSellerSuccess('');
    setLoading(true);

    if (isSellerLogin) {
      const result = await login(sellerEmail, sellerPassword);
      setLoading(false);
      if (result.success) {
        onNavigate('seller-dashboard');
      } else {
        setSellerError(result.error || 'Seller login failed.');
      }
    } else {
      const result = await registerUser(sellerEmail, sellerPassword, 'seller', sellerName, { shopName, phone: sellerPhone });
      setLoading(false);
      if (result.success) {
        setSellerSuccess('Seller store registered successfully!');
        setTimeout(() => onNavigate('seller-dashboard'), 1200);
      } else {
        setSellerError(result.error || 'Seller registration failed.');
      }
    }
  };

  // Handle Admin Authentication
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);

    const result = await login(adminEmail, adminPassword);
    setLoading(false);
    if (result.success) {
      onNavigate('admin-dashboard');
    } else {
      setAdminError(result.error || 'Admin login failed.');
    }
  };

  // Quick Login Shortcuts
  const handleQuickLogin = async (roleType) => {
    setLoading(true);
    setSellerError('');
    setAdminError('');
    
    let email = roleType === 'seller' ? 'seller@cake.com' : 'admin@cake.com';
    const result = await login(email, 'password');
    setLoading(false);

    if (result.success) {
      if (roleType === 'seller') onNavigate('seller-dashboard');
      else onNavigate('admin-dashboard');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px' }}>
      
      {/* SECTION 1: TOP PAGE - SELLERS LOGIN & REGISTRATION */}
      <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Seller Quick Demo Box */}
        <div className="glass" style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--secondary)',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          textAlign: 'center'
        }}>
          <span className="badge badge-secondary" style={{ marginBottom: '10px', gap: '4px' }}>
            <Store size={12} /> BAKER / SELLER PORTAL DEMO
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '12px' }}>
            Baker testing? One-click login to open the Chef Kitchen Oven Order queue:
          </p>
          <button 
            onClick={() => handleQuickLogin('seller')}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '10px', borderRadius: '50px', color: 'black', fontSize: '0.85rem' }}
          >
            Instant Seller Login (Chef Clara)
          </button>
        </div>

        {/* Sellers Main Card */}
        <div className="glass" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="flex-center" style={{
              backgroundColor: 'var(--secondary-glow)',
              color: 'var(--secondary)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              margin: '0 auto 12px auto'
            }}>
              <Store size={24} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>
              Sellers & Bakers Portal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Manage your bakery listings, custom cakes & incoming orders
            </p>
          </div>

          {/* Login / Register Selector */}
          <div className="flex-center glass" style={{ padding: '4px', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
            <button 
              onClick={() => { setIsSellerLogin(true); setSellerError(''); setSellerSuccess(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '50px',
                fontWeight: 'bold',
                backgroundColor: isSellerLogin ? 'var(--secondary)' : 'transparent',
                color: isSellerLogin ? 'black' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Seller Login
            </button>
            <button 
              onClick={() => { setIsSellerLogin(false); setSellerError(''); setSellerSuccess(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '50px',
                fontWeight: 'bold',
                backgroundColor: !isSellerLogin ? 'var(--secondary)' : 'transparent',
                color: !isSellerLogin ? 'black' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Register Bakery
            </button>
          </div>

          <form onSubmit={handleSellerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {!isSellerLogin && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Baker / Chef Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Chef Clara"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      required
                    />
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <User size={16} />
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Bakery Shop Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Malabar Whisk & Bakes"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      required
                    />
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <Store size={16} />
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact Phone</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 98456 78901"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      required
                    />
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <Phone size={16} />
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Store Email</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="e.g. seller@cake.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={sellerPassword}
                  onChange={(e) => setSellerPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </span>
              </div>
            </div>

            {sellerError && <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{sellerError}</div>}
            {sellerSuccess && <div style={{ color: 'rgb(52, 211, 153)', fontWeight: 600, fontSize: '0.85rem' }}>{sellerSuccess}</div>}

            <button 
              type="submit" 
              className="btn btn-secondary"
              disabled={loading}
              style={{ width: '100%', height: '48px', color: 'black', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : isSellerLogin ? 'Access Seller Dashboard' : 'Complete Bakery Signup'}
            </button>
          </form>
        </div>
      </div>

      {/* DIVIDER BETWEEN SELLER AND ADMIN */}
      <div style={{ width: '100%', maxWidth: '520px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
        <span className="badge badge-primary" style={{ gap: '6px' }}>
          <ShieldCheck size={14} /> ADMIN ACCESS AT BOTTOM
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
      </div>

      {/* SECTION 2: BOTTOM PAGE - ADMIN LOGIN PORTAL */}
      <div id="admin-login-section" style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div className="glass" style={{
          padding: '36px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--primary)',
          backgroundColor: 'rgba(248, 113, 113, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="flex-center" style={{
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              margin: '0 auto 10px auto'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
              Administrator Console Login
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              System moderation, unit economics calculator & rider assignment controls
            </p>
          </div>

          {/* Quick Admin Login Button */}
          <button 
            onClick={() => handleQuickLogin('admin')}
            className="btn btn-outline" 
            style={{ width: '100%', padding: '8px', fontSize: '0.8rem', borderRadius: '50px', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            ⚡ Instant Admin Demo Login (System Admin)
          </button>

          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Admin Account Email</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="admin@cake.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Admin Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </span>
              </div>
            </div>

            {adminError && <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{adminError}</div>}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-sm)', marginTop: '6px' }}
            >
              {loading ? 'Authenticating...' : 'Enter Admin Console'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
