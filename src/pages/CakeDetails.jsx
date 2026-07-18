import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, ArrowLeft, ShieldAlert, Award, Calendar } from 'lucide-react';

const WEIGHTS = [
  { label: '1 lbs', surcharge: 0 },
  { label: '2 lbs', surcharge: 350.00 },
  { label: '5 lbs', surcharge: 1000.00 }
];

export default function CakeDetails({ cakeId, onBack, onNavigate }) {
  const { cakes, addToCart } = useApp();
  const [selectedWeight, setSelectedWeight] = useState(WEIGHTS[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const cake = useMemo(() => {
    return cakes.find(c => c.id === cakeId);
  }, [cakes, cakeId]);

  if (!cake) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <h2>Cake not found</h2>
        <button onClick={onBack} className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  const basePriceWithDiscount = cake.discount > 0 
    ? cake.price * (1 - cake.discount / 100)
    : cake.price;

  const finalUnitPrice = basePriceWithDiscount + selectedWeight.surcharge;
  const finalTotal = finalUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(cake, selectedWeight.label, customMessage, quantity);
    alert(`Added ${quantity}x (${selectedWeight.label}) ${cake.name} to your cart!`);
    onNavigate('cart');
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="btn btn-text flex-center gap-sm" 
        style={{ marginBottom: '32px', paddingLeft: 0 }}
      >
        <ArrowLeft size={18} /> Back to Catalog
      </button>

      {/* Main product details block */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '48px',
        alignItems: 'start'
      }}>
        {/* Left Side: Product Image */}
        <div className="glass" style={{
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden'
        }}>
          <img 
            src={cake.image_url} 
            alt={cake.name} 
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              maxHeight: '480px'
            }}
          />
        </div>

        {/* Right Side: Product customization panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '8px' }}>
              BY {cake.seller_name}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{cake.name}</h1>
            
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px' }}>
              <div className="flex-center gap-sm" style={{ color: 'var(--secondary)' }}>
                <Star size={18} fill="var(--secondary)" />
                <span style={{ fontWeight: 'bold' }}>{cake.rating}</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span style={{ color: 'var(--text-muted)' }}>{cake.reviews?.length || 0} customer reviews</span>
            </div>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            {cake.description}
          </p>

          <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--bg-card-border)' }} />

          {/* Surcharges & Math Info */}
          <div className="flex-between">
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unit Price</span>
              <div className="flex-center gap-sm" style={{ justifyContent: 'flex-start', marginTop: '4px' }}>
                <h2 style={{ color: 'var(--secondary)', fontSize: '2rem' }}>
                  ₹{finalUnitPrice.toFixed(0)}
                </h2>
                {cake.discount > 0 && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    ₹{(cake.price + selectedWeight.surcharge).toFixed(0)}
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Est. Total</span>
              <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', marginTop: '4px' }}>
                ₹{finalTotal.toFixed(0)}
              </h2>
            </div>
          </div>

          {/* Customization Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Weight Options */}
            <div>
              <span className="form-label" style={{ fontWeight: 600 }}>Select Weight</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {WEIGHTS.map(weight => (
                  <button
                    key={weight.label}
                    onClick={() => setSelectedWeight(weight)}
                    className="glass"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedWeight.label === weight.label 
                        ? '2px solid var(--secondary)' 
                        : '1px solid var(--glass-border)',
                      backgroundColor: selectedWeight.label === weight.label 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : 'var(--glass-bg)',
                      textAlign: 'center',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: selectedWeight.label === weight.label ? 'var(--secondary)' : 'var(--text-main)' }}>
                      {weight.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {weight.surcharge === 0 ? 'Base Price' : `+₹${weight.surcharge.toFixed(0)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Icing writing */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Custom Writing on Cake (Free)
              </label>
              <input
                type="text"
                placeholder="e.g. Happy 25th Birthday John"
                maxLength={32}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="form-input"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px', textAlign: 'right' }}>
                {customMessage.length}/32 characters
              </span>
            </div>

            {/* Quantity and Add to Cart Button */}
            <div className="flex-center gap-md" style={{ marginTop: '12px' }}>
              
              {/* Quantity input */}
              <div className="flex-center glass" style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                padding: '6px 12px',
                height: '48px'
              }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '32px', height: '32px', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: '32px', height: '32px', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flexGrow: 1, height: '48px', borderRadius: 'var(--radius-sm)' }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>

          <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--bg-card-border)' }} />

          {/* Delivery & Security Promises */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', color: 'var(--text-muted)' }}>
              <ShieldAlert size={16} style={{ color: 'var(--secondary)' }} />
              <span>100% Cash on Delivery</span>
            </div>
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', color: 'var(--text-muted)' }}>
              <Award size={16} style={{ color: 'var(--primary)' }} />
              <span>Prepared Fresh by Local Bakers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section style={{ marginTop: '64px', borderTop: '1px solid var(--bg-card-border)', paddingTop: '48px' }}>
        <h3 style={{ marginBottom: '32px' }}>Reviews & Ratings</h3>
        
        {cake.reviews && cake.reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {cake.reviews.map((review, idx) => (
              <div key={idx} className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{review.user}</div>
                  <div className="flex-center gap-sm" style={{ color: 'var(--secondary)' }}>
                    <Star size={14} fill="var(--secondary)" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No reviews yet for this cake. Be the first to order and leave a review!
          </div>
        )}
      </section>
    </div>
  );
}
