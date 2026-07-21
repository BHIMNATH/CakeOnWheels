import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Lock, KeyRound } from 'lucide-react';

export default function AdminAuth({ onNavigate }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      onNavigate('admin-dashboard');
    } else {
      setError(result.error || 'Admin login failed.');
    }
  };

  const handleQuickAdmin = async () => {
    setLoading(true);
    setError('');
    const result = await login('admin@cake.com', 'password');
    setLoading(false);
    if (result.success) {
      onNavigate('admin-dashboard');
    } else {
      setError(result.error || 'Quick login failed.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Quick Admin Demo Box */}
        <div className="glass" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--primary)',
          backgroundColor: 'rgba(248, 113, 113, 0.05)',
          textAlign: 'center'
        }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px', gap: '4px' }}>
            <KeyRound size={12} /> ADMIN DEMO ACCESS
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '10px' }}>
            Testing system console? One-click login as Administrator:
          </p>
          <button 
            onClick={handleQuickAdmin}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '10px', borderRadius: '50px', fontSize: '0.85rem' }}
          >
            ⚡ Instant Admin Demo Login
          </button>
        </div>

        {/* Admin Login Card */}
        <div className="glass" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: 'rgba(248, 113, 113, 0.02)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="flex-center" style={{
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              margin: '0 auto 12px auto'
            }}>
              <ShieldCheck size={26} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>
              System Admin Portal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Authorized administrator console for platform metrics & unit economics
            </p>
          </div>

          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Administrator Email</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="admin@cake.com"
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
              <label className="form-label">Admin Password</label>
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

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Enter Admin Console'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
