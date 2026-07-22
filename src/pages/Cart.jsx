/**
 * @file Cart.jsx
 * @description Shopping cart and delivery fee adjustment manager.
 * Supports line item modifications, coupon codes, and dynamic delivery fee zoning.
 */
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Percent, Check } from 'lucide-react';

export default function Cart({ onNavigate, onSetTotals }) {
  // Access shopping cart utilities and location states from global context
  const { cart, updateCartQuantity, removeFromCart, applyCouponCode, selectedLocation } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Cart math
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const basePrice = item.cake.discount > 0 
        ? item.cake.price * (1 - item.cake.discount / 100)
        : item.cake.price;
      
      const surcharge = item.weight === '1 Kg' ? 350.00 : item.weight === '2 Kg' ? 800.00 : 0;
      return acc + (basePrice + surcharge) * item.quantity;
    }, 0);
  }, [cart]);

  /**
   * Dynamic Delivery Fee zone adjustments:
   * - Local Town zone: ₹39 delivery fee if the baker's shop matches buyer location.
   * - Outstation zone: ₹89 delivery fee if the baker's shop is cross-town.
   * - Weight surcharge: Add +₹20 handler fee for heavier 2 Kg cake transit.
   * - Free delivery threshold: Orders above ₹599 receive completely free delivery.
   */
  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    
    let baseDelivery = 39.00;
    let hasCrossTown = false;
    let hasHeavyCake = false;

    cart.forEach(item => {
      if (item.cake.seller_location !== selectedLocation) {
        hasCrossTown = true;
      }
      if (item.weight === '2 Kg') {
        hasHeavyCake = true;
      }
    });

    if (hasCrossTown) {
      baseDelivery = 89.00;
    }

    if (hasHeavyCake) {
      baseDelivery += 20.00;
    }

    if (subtotal > 599) {
      return 0.00;
    } else if (subtotal > 399) {
      return baseDelivery / 2;
    }

    return baseDelivery;
  }, [cart, subtotal, selectedLocation]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discount_type === 'percent') {
      return subtotal * (activeCoupon.discount_value / 100);
    }
    return Math.min(subtotal, activeCoupon.discount_value);
  }, [activeCoupon, subtotal]);

  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const result = applyCouponCode(couponCode);
    if (result.success) {
      setActiveCoupon(result.coupon);
      setCouponCode('');
    } else {
      setCouponError(result.error);
    }
  };

  const handleProceedToCheckout = () => {
    // Pass calculated totals up to be used on the checkout page
    onSetTotals({
      subtotal,
      deliveryFee,
      discountAmount,
      total,
      couponCode: activeCoupon ? activeCoupon.code : null
    });
    onNavigate('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <ShoppingBag size={64} style={{ color: 'var(--text-muted)' }} />
        <h2>Your Shopping Cart is Empty</h2>
        <p>You haven't added any sweet treats to your cart yet.</p>
        <button onClick={() => onNavigate('home')} className="btn btn-primary">
          <ArrowLeft size={16} /> Browse Cakes
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '32px' }}>Your Shopping Cart</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.map((item, idx) => {
            const basePrice = item.cake.discount > 0 
              ? item.cake.price * (1 - item.cake.discount / 100)
              : item.cake.price;
            const surcharge = item.weight === '1 Kg' ? 350.00 : item.weight === '2 Kg' ? 800.00 : 0;
            const itemUnitPrice = basePrice + surcharge;
            
            return (
              <div 
                key={idx} 
                className="glass" 
                style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  padding: '20px', 
                  borderRadius: 'var(--radius-md)',
                  alignItems: 'center',
                  border: '1px solid var(--glass-border)'
                }}
              >
                {/* Mini Image */}
                <img 
                  src={item.cake.image_url} 
                  alt={item.cake.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />

                {/* Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h4 style={{ color: 'var(--text-main)' }}>{item.cake.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Weight: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.weight}</span>
                  </div>
                  {item.customMessage && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                      Writing: "{item.customMessage}"
                    </div>
                  )}
                  <div style={{ fontWeight: 'bold', color: 'var(--secondary)', marginTop: '4px' }}>
                    ₹{itemUnitPrice.toFixed(0)} each
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex-center glass" style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)'
                }}>
                  <button 
                    onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                    style={{ width: '24px', fontWeight: 'bold' }}
                  >
                    -
                  </button>
                  <span style={{ width: '28px', textAlign: 'center', fontWeight: 'bold' }}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                    style={{ width: '24px', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button 
                  onClick={() => removeFromCart(idx)} 
                  style={{ color: 'var(--primary)', padding: '6px' }}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}

          <button 
            onClick={() => onNavigate('home')} 
            className="btn btn-text flex-center gap-sm" 
            style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>
        </div>

        {/* Right: Checkout Totals Box */}
        <div className="glass" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
            <div className="flex-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            
            {activeCoupon && (
              <div className="flex-between" style={{ color: 'rgb(52, 211, 153)' }}>
                <span className="flex-center gap-sm">
                  <Percent size={14} /> Coupon Code ({activeCoupon.code})
                </span>
                <span>-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}

            <div className="flex-between">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}</span>
            </div>

            {deliveryFee > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-8px' }}>
                Add ₹{(500 - subtotal).toFixed(0)} more to get Free Delivery!
              </span>
            )}
          </div>

          <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--glass-border)' }} />

          {/* Applied Coupon Promo Code Field */}
          {!activeCoupon ? (
            <form onSubmit={handleApplyCoupon} className="flex-center gap-sm">
              <input 
                type="text" 
                placeholder="Enter Promo Code (e.g. WAYANAD20)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="form-input"
                style={{ textTransform: 'uppercase', height: '42px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-outline" style={{ padding: '0 16px', height: '42px' }}>
                Apply
              </button>
            </form>
          ) : (
            <div className="flex-between glass" style={{
              padding: '10px 16px',
              border: '1px solid rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderRadius: 'var(--radius-sm)',
              color: 'rgb(52, 211, 153)',
              fontSize: '0.85rem'
            }}>
              <span className="flex-center gap-sm"><Check size={16} /> Promo applied: {activeCoupon.code}</span>
              <button 
                onClick={() => setActiveCoupon(null)} 
                style={{ textDecoration: 'underline', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold' }}
              >
                Remove
              </button>
            </div>
          )}
          {couponError && (
            <div style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '-12px' }}>
              {couponError}
            </div>
          )}

          <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--glass-border)' }} />

          <div className="flex-between" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--secondary)' }}>₹{total.toFixed(0)}</span>
          </div>

          <button 
            onClick={handleProceedToCheckout} 
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-sm)' }}
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
