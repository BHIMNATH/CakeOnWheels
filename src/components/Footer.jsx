import React from 'react';
import { Cake, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--glass-border)',
      marginTop: '80px',
      padding: '60px 0 30px 0',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Logo & Description */}
          <div>
            <div className="flex-center gap-sm" style={{
              justifyContent: 'flex-start',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: 'var(--text-main)',
              marginBottom: '20px'
            }}>
              <Cake size={24} style={{ color: 'var(--primary)' }} />
              <span>Cake on <span style={{ color: 'var(--secondary)' }}>Wheels</span></span>
            </div>
            <p style={{ fontSize: '0.95rem', marginBottom: '20px' }}>
              Freshly baked artisanal cakes delivered right to your doorstep. Supporting local home bakers and professional chefs in Wayanad, Kerala.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '1.1rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <li>Chocolate Creations</li>
              <li>Fruit & Berries</li>
              <li>Classic Birthday Cakes</li>
              <li>Vegan & Gluten-Free</li>
              <li>Custom Party Cakes</li>
            </ul>
          </div>

          {/* Portals & Logins */}
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '1.1rem' }}>Portals & Logins</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <li>
                <button onClick={() => onNavigate && onNavigate('auth')} className="btn-text" style={{ padding: 0 }}>
                  Customer Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('partner-auth')} className="btn-text" style={{ padding: 0 }}>
                  Sellers & Bakers Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('partner-auth')} className="btn-text" style={{ padding: 0, color: 'var(--primary)', fontWeight: 600 }}>
                  Admin Login (Page Bottom)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '1.1rem' }}>Get in Touch</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
              <li className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                <span>+91 94950 00123</span>
              </li>
              <li className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <span>support@cakeonwheels.com</span>
              </li>
              <li className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>Kalpetta, Wayanad, Kerala</span>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--glass-border)', marginBottom: '30px' }} />

        <div className="flex-between" style={{
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem'
        }}>
          <span>&copy; {new Date().getFullYear()} Cake on Wheels. All rights reserved.</span>
          <div className="flex-center gap-md" style={{ flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate && onNavigate('auth')} className="btn-text" style={{ fontSize: '0.8rem' }}>Login</button>
            <span style={{ color: 'var(--glass-border)' }}>|</span>
            <button onClick={() => onNavigate && onNavigate('partner-auth')} className="btn-text" style={{ fontSize: '0.8rem' }}>Sellers Login</button>
            <span style={{ color: 'var(--glass-border)' }}>|</span>
            <button onClick={() => onNavigate && onNavigate('partner-auth')} className="btn-text" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Admin Login (Bottom of Page)</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
