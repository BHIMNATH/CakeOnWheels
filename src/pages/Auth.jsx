import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Store, Phone, MapPin, KeyRound, Sparkles } from 'lucide-react';

export default function Auth({ onNavigate }) {
  const { login, registerUser, errorMsg } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Role & Extra details
  const [role, setRole] = useState('buyer'); // 'buyer' | 'seller'
  const [address, setAddress] = useState('');
  const [shopName, setShopName] = useState('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        // Redirect to appropriate dashboard
        const sessionUser = JSON.parse(localStorage.getItem('local_user'));
        if (sessionUser?.role === 'buyer') onNavigate('home');
        else if (sessionUser?.role === 'seller') onNavigate('seller-dashboard');
        else if (sessionUser?.role === 'admin') onNavigate('admin-dashboard');
      } else {
        setLocalError(result.error || 'Login failed.');
      }
    } else {
      const extraData = role === 'seller' ? { shopName, phone } : { address, phone };
      const result = await registerUser(email, password, role, name, extraData);
      setLoading(false);
      if (result.success) {
        if (result.needsConfirm) {
          setSuccessMsg('Account registration initiated! Check your email to verify.');
        } else {
          setSuccessMsg('Account registered and logged in successfully!');
          setTimeout(() => {
            if (role === 'buyer') onNavigate('home');
            else onNavigate('seller-dashboard');
          }, 1500);
        }
      } else {
        setLocalError(result.error || 'Registration failed.');
      }
    }
  };

  // Quick Login Handler for ease of client testing
  const handleQuickLogin = async (roleType) => {
    setLoading(true);
    setLocalError('');
    let credentials = { email: '', password: 'password' };
    if (roleType === 'buyer') credentials.email = 'buyer@cake.com';
    else if (roleType === 'seller') credentials.email = 'seller@cake.com';
    else if (roleType === 'admin') credentials.email = 'admin@cake.com';

    const result = await login(credentials.email, credentials.password);
    setLoading(false);
    
    if (result.success) {
      if (roleType === 'buyer') onNavigate('home');
      else if (roleType === 'seller') onNavigate('seller-dashboard');
      else if (roleType === 'admin') onNavigate('admin-dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Quick Testing Portal Info */}
        <div className="glass" style={{
          padding: '20px 24px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--secondary)',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          textAlign: 'center'
        }}>
          <span className="badge badge-secondary" style={{ marginBottom: '12px', gap: '4px' }}>
            <KeyRound size={12} /> PORTFOLIO DEMO PORTAL
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.4' }}>
            Testing for portfolio presentation? Click any role below to bypass authentication and log in instantly with seeded data:
          </p>
          <div className="flex-center" style={{ gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleQuickLogin('buyer')}
              className="btn btn-outline" 
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '50px', border: '1px solid var(--primary)', color: 'var(--primary)' }}
            >
              Buyer Demo
            </button>
            <button 
              onClick={() => handleQuickLogin('seller')}
              className="btn btn-outline" 
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '50px', border: '1px solid var(--secondary)', color: 'var(--secondary)' }}
            >
              Seller Demo
            </button>
            <button 
              onClick={() => handleQuickLogin('admin')}
              className="btn btn-outline" 
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '50px', border: '1px solid var(--text-main)', color: 'var(--text-main)' }}
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Main Form Portal */}
        <div className="glass" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '8px' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.9rem' }}>
              {isLogin ? 'Sign in to access your customized dashboard' : 'Join as a Buyer or Seller today'}
            </p>
          </div>

          {/* Login/Signup Selector tabs */}
          <div className="flex-center glass" style={{
            padding: '4px',
            borderRadius: '50px',
            border: '1px solid var(--glass-border)'
          }}>
            <button 
              onClick={() => { setIsLogin(true); setLocalError(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '50px',
                fontWeight: 'bold',
                backgroundColor: isLogin ? 'var(--primary)' : 'transparent',
                color: isLogin ? 'white' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Log In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setLocalError(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '50px',
                fontWeight: 'bold',
                backgroundColor: !isLogin ? 'var(--primary)' : 'transparent',
                color: !isLogin ? 'white' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Conditional Signup details */}
            {!isLogin && (
              <>
                {/* Role Toggler */}
                <div className="form-group">
                  <label className="form-label">Join As</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className="glass"
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: role === 'buyer' ? '1.5px solid var(--primary)' : '1px solid var(--glass-border)',
                        backgroundColor: role === 'buyer' ? 'var(--primary-glow)' : 'transparent',
                        fontWeight: 'bold'
                      }}
                    >
                      Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className="glass"
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: role === 'seller' ? '1.5px solid var(--secondary)' : '1px solid var(--glass-border)',
                        backgroundColor: role === 'seller' ? 'var(--secondary-glow)' : 'transparent',
                        fontWeight: 'bold'
                      }}
                    >
                      Seller
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
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

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="tel" 
                      placeholder="e.g. +1 (555) 000-0000"
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

                {/* Seller Specific: Shop Name */}
                {role === 'seller' && (
                  <div className="form-group">
                    <label className="form-label">Bakery Shop Name</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="e.g. Sweet Delights Bakery"
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
                )}

                {/* Buyer Specific: Default Delivery Address */}
                {role === 'buyer' && (
                  <div className="form-group">
                    <label className="form-label">Default Delivery Address</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="e.g. 123 Sweet Lane, Sugar Land"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '42px' }}
                        required
                      />
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <MapPin size={16} />
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="e.g. test@example.com"
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

            {/* Password field */}
            <div className="form-group">
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

            {/* Success and Error Indicators */}
            {localError && (
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                {localError}
              </div>
            )}
            {errorMsg && !localError && (
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ color: 'rgb(52, 211, 153)', fontWeight: 600, fontSize: '0.85rem' }}>
                {successMsg}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}
            >
              {loading 
                ? 'Processing...' 
                : isLogin 
                  ? 'Access Account' 
                  : 'Register Account'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
