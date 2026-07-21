import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Store, Phone, MapPin, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Auth({ onNavigate }) {
  const { login, registerUser, signInWithGoogle, isCloudMode, errorMsg } = useApp();
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

  // Google Modal State for Demo/Local mode
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState('Rahul (Google Account)');
  const [googleEmail, setGoogleEmail] = useState('rahul.g@gmail.com');
  const [googleRole, setGoogleRole] = useState('buyer');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
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

  const handleGoogleSignInClick = async () => {
    if (isCloudMode) {
      setLoading(true);
      await signInWithGoogle();
      setLoading(false);
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleConfirmGoogleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signInWithGoogle({
      name: googleName,
      email: googleEmail,
      role: googleRole
    });
    setLoading(false);
    setShowGoogleModal(false);
    if (result.success) {
      setSuccessMsg('Signed in with Google successfully!');
      setTimeout(() => {
        if (googleRole === 'buyer') onNavigate('home');
        else onNavigate('seller-dashboard');
      }, 800);
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

          {/* Google Authentication Button */}
          <button 
            type="button"
            onClick={handleGoogleSignInClick}
            className="btn glass"
            style={{
              width: '100%',
              height: '46px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '1px solid var(--glass-border)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-main)',
              transition: 'var(--transition)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
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

      {/* Google OAuth Interactive Popup Modal */}
      {showGoogleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass" style={{
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '440px',
            width: '90%',
            border: '1.5px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: 'var(--bg-card)'
          }}>
            <div className="flex-center" style={{ flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 style={{ fontSize: '1.4rem' }}>Google Account Auth</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Authenticate with your Google profile credentials.</p>
            </div>

            <form onSubmit={handleConfirmGoogleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Google Profile Name</label>
                <input 
                  type="text" 
                  value={googleName} 
                  onChange={(e) => setGoogleName(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Google Email</label>
                <input 
                  type="email" 
                  value={googleEmail} 
                  onChange={(e) => setGoogleEmail(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Account Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setGoogleRole('buyer')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: googleRole === 'buyer' ? '1.5px solid var(--primary)' : '1px solid var(--glass-border)',
                      backgroundColor: googleRole === 'buyer' ? 'var(--primary-glow)' : 'transparent',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoogleRole('seller')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      border: googleRole === 'seller' ? '1.5px solid var(--secondary)' : '1px solid var(--glass-border)',
                      backgroundColor: googleRole === 'seller' ? 'var(--secondary-glow)' : 'transparent',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Seller
                  </button>
                </div>
              </div>

              <div className="flex-center gap-md" style={{ marginTop: '8px' }}>
                <button type="button" onClick={() => setShowGoogleModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Authorize Google Sign-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

