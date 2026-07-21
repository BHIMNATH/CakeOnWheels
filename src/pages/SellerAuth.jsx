import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, Mail, Lock, Phone, User, KeyRound } from 'lucide-react';

export default function SellerAuth({ onNavigate }) {
  const { login, registerUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        onNavigate('seller-dashboard');
      } else {
        setError(result.error || 'Seller login failed.');
      }
    } else {
      const result = await registerUser(email, password, 'seller', name, { shopName, phone });
      setLoading(false);
      if (result.success) {
        setSuccess('Seller store registered successfully!');
        setTimeout(() => onNavigate('seller-dashboard'), 1200);
      } else {
        setError(result.error || 'Seller registration failed.');
      }
    }
  };

  const handleQuickSeller = async () => {
    setLoading(true);
    setError('');
    const result = await login('seller@cake.com', 'password');
    setLoading(false);
    if (result.success) {
      onNavigate('seller-dashboard');
    } else {
      setError(result.error || 'Quick login failed.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Seller Quick Demo Box */}
        <div className="glass" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--secondary)',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          textAlign: 'center'
        }}>
          <span className="badge badge-secondary" style={{ marginBottom: '8px', gap: '4px' }}>
            <KeyRound size={12} /> BAKER PORTAL DEMO
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '10px' }}>
            Baker testing? One-click login to open the Chef Kitchen Oven Order queue:
          </p>
          <button 
            onClick={handleQuickSeller}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '10px', borderRadius: '50px', color: 'black', fontSize: '0.85rem' }}
          >
            ⚡ Instant Seller Login (Chef Clara)
          </button>
        </div>

        {/* Seller Login Card */}
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
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              margin: '0 auto 12px auto'
            }}>
              <Store size={26} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>
              Sellers & Bakers Portal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Manage your bakery listings, custom bakes & incoming orders
            </p>
          </div>

          {/* Login / Register Selector */}
          <div className="flex-center glass" style={{ padding: '4px', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
            <button 
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '50px',
                fontWeight: 'bold',
                backgroundColor: isLogin ? 'var(--secondary)' : 'transparent',
                color: isLogin ? 'black' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Seller Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '50px',
                fontWeight: 'bold',
                backgroundColor: !isLogin ? 'var(--secondary)' : 'transparent',
                color: !isLogin ? 'black' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Register Bakery
            </button>
          </div>

          <form onSubmit={handleSellerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {!isLogin && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Baker / Chef Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Chef Clara"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </span>
              </div>
            </div>

            {error && <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{error}</div>}
            {success && <div style={{ color: 'rgb(52, 211, 153)', fontWeight: 600, fontSize: '0.85rem' }}>{success}</div>}

            <button 
              type="submit" 
              className="btn btn-secondary"
              disabled={loading}
              style={{ width: '100%', height: '48px', color: 'black', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : isLogin ? 'Access Seller Dashboard' : 'Complete Bakery Signup'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
