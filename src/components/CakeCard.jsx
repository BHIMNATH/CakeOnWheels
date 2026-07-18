import React from 'react';
import { Star, ShoppingCart, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CakeCard({ cake, onSelect }) {
  const { addToCart } = useApp();

  const discountedPrice = cake.discount > 0 
    ? (cake.price * (1 - cake.discount / 100)).toFixed(2)
    : cake.price.toFixed(2);

  const handleQuickAdd = (e) => {
    e.stopPropagation(); // Avoid triggering card click navigation
    addToCart(cake, '1 lbs', '', 1);
    
    // Quick notification animation could go here
    alert(`Added 1 lbs of ${cake.name} to your cart!`);
  };

  return (
    <div 
      className={`premium-card ${cake.special_sale ? 'glow-gold' : ''}`} 
      onClick={() => onSelect(cake.id)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Product Image & Badges */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img 
          src={cake.image_url} 
          alt={cake.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="cake-card-img"
        />
        
        {/* Discount Badge */}
        {cake.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <Percent size={12} />
            <span>{cake.discount}% OFF</span>
          </div>
        )}

        {/* Special Sale Indicator */}
        {cake.special_sale && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'var(--secondary)',
            color: 'black',
            padding: '6px 12px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            SPECIAL SALE
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex-between">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>
            BY {cake.seller_name.toUpperCase()}
          </span>
          <div className="flex-center gap-sm" style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            <Star size={16} fill="var(--secondary)" />
            <span>{cake.rating}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '4px 0' }}>{cake.name}</h3>
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '40px',
          lineHeight: '1.4'
        }}>
          {cake.description}
        </p>

        {/* Price & Cart Action */}
        <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--bg-card-border)' }}>
          <div>
            {cake.discount > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{cake.price.toFixed(0)}
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                  ₹{parseFloat(discountedPrice).toFixed(0)}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                ₹{cake.price.toFixed(0)}
              </span>
            )}
          </div>

          <button 
            onClick={handleQuickAdd}
            className="btn btn-primary"
            style={{ 
              width: '42px', 
              height: '42px', 
              padding: 0, 
              borderRadius: '50%', 
              boxShadow: 'none'
            }}
            title="Quick add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .premium-card:hover .cake-card-img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
