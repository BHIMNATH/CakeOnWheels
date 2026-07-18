import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CreditCard, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export default function Checkout({ onNavigate, totals }) {
  const { currentUser, placeOrder } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('12:00 PM - 03:00 PM');
  
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load defaults from current user
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Set minimum date to tomorrow
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!currentUser) {
      setErrorMsg('You must be logged in to complete checkout.');
      return;
    }
    
    if (!name || !phone || !address || !deliveryDate || !deliveryTime) {
      setErrorMsg('Please fill in all checkout fields.');
      return;
    }

    setLoadingOrder(true);
    const shippingInfo = { name, phone, address, deliveryDate, deliveryTime };
    const result = await placeOrder(shippingInfo, totals);
    setLoadingOrder(false);

    if (result.success) {
      setPlacedOrderDetails(result.order);
      setOrderSuccess(true);
    } else {
      setErrorMsg(result.error || 'Failed to place order.');
    }
  };

  if (!currentUser) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <h2>Sign In to Order Cakes</h2>
        <p>Please log in or create an account to finalize your order details.</p>
        <button onClick={() => onNavigate('auth')} className="btn btn-primary">
          Proceed to Login
        </button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container flex-center" style={{ minHeight: '75vh', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
        <div className="success-checkmark" style={{ color: 'rgb(52, 211, 153)', animation: 'popIn 0.5s ease-out' }}>
          <CheckCircle2 size={80} />
        </div>
        
        <h1 style={{ color: 'var(--text-main)' }}>Order Placed Successfully!</h1>
        <p style={{ maxWidth: '500px', fontSize: '1.1rem' }}>
          Thank you for choosing Cake on Wheels! Your order <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>#{placedOrderDetails?.id}</span> is now pending confirmation.
        </p>

        <div className="glass" style={{
          padding: '24px 32px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          width: '100%',
          maxWidth: '500px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h4 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', color: 'var(--text-main)' }}>Delivery Receipt</h4>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Deliver to:</span>
            <span style={{ fontWeight: 500 }}>{name}</span>
          </div>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Address:</span>
            <span style={{ fontWeight: 500, maxWidth: '280px', textAlign: 'right', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address}</span>
          </div>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scheduled Time:</span>
            <span style={{ fontWeight: 500 }}>{deliveryDate} ({deliveryTime})</span>
          </div>
          <div className="flex-between" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginTop: '6px' }}>
            <span style={{ fontWeight: 'bold' }}>Amount Due (COD):</span>
            <span style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '1.2rem' }}>₹{totals.total.toFixed(0)}</span>
          </div>
        </div>

        <div className="flex-center gap-md" style={{ marginTop: '12px' }}>
          <button onClick={() => onNavigate('buyer-dashboard')} className="btn btn-primary">
            Track Order Status
          </button>
          <button onClick={() => onNavigate('home')} className="btn btn-outline">
            Back to Marketplace
          </button>
        </div>

        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      
      {/* Back to Cart */}
      <button 
        onClick={() => onNavigate('cart')} 
        className="btn btn-text flex-center gap-sm" 
        style={{ marginBottom: '32px', paddingLeft: 0 }}
      >
        <ArrowLeft size={18} /> Back to Cart
      </button>

      <h1 style={{ marginBottom: '32px' }}>Delivery Details</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Side: Address Details Form */}
        <form onSubmit={handlePlaceOrder} className="glass" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            Recipient Information
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input 
              type="tel" 
              placeholder="e.g. +91 98456 78901"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea 
              placeholder="Enter complete address, landmark, and ZIP code in Wayanad, Kerala"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div className="form-group">
              <label className="form-label">Delivery Date</label>
              <input 
                type="date" 
                min={getMinDate()}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Slot</label>
              <select 
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="form-select"
                required
              >
                <option value="09:00 AM - 12:00 PM">Morning (9am - 12pm)</option>
                <option value="12:00 PM - 03:00 PM">Afternoon (12pm - 3pm)</option>
                <option value="03:00 PM - 06:00 PM">Evening (3pm - 6pm)</option>
                <option value="06:00 PM - 09:00 PM">Night (6pm - 9pm)</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loadingOrder}
            style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-sm)' }}
          >
            {loadingOrder ? 'Placing Order...' : 'Confirm Order & Place Product'}
          </button>
        </form>

        {/* Right Side: Order Billing Review */}
        <div className="glass" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h3>Billing Verification</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div className="flex-between">
              <span>Cart Subtotal</span>
              <span>₹{totals.subtotal.toFixed(0)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex-between" style={{ color: 'rgb(52, 211, 153)' }}>
                <span>Coupon Discount ({totals.couponCode})</span>
                <span>-₹{totals.discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex-between">
              <span>Delivery Fee</span>
              <span>{totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee.toFixed(0)}`}</span>
            </div>
            <div className="flex-between" style={{ fontWeight: 'bold', fontSize: '1.15rem', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '6px' }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--secondary)' }}>₹{totals.total.toFixed(0)}</span>
            </div>
          </div>

          <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--glass-border)' }} />

          {/* Payment Method Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Selected Payment Mode</span>
            
            <div className="flex-between glass" style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--secondary)',
              backgroundColor: 'rgba(245, 158, 11, 0.05)'
            }}>
              <div className="flex-center gap-md">
                <Truck size={24} style={{ color: 'var(--secondary)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold' }}>Cash On Delivery (COD)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay in cash upon doorstep delivery</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '6px' }}>
              By completing this order, you authorize local baking partners to prepare and deliver fresh cakes. Cancellation is only allowed before preparation starts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
