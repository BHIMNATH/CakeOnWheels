import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, ShoppingBag, Users, Star, PlusCircle, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { cakes, orders, coupons, updateOrderStatus, createCoupon } = useApp();
  const [showCouponForm, setShowCouponForm] = useState(false);

  // New coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [couponType, setCouponType] = useState('percent'); // 'percent' | 'fixed'
  const [couponError, setCouponError] = useState('');

  // Global platform statistics
  const platformStats = useMemo(() => {
    let totalRevenue = 0;
    let completedOrders = 0;
    let activeOrdersCount = 0;

    orders.forEach(order => {
      if (order.status === 'Delivered') {
        totalRevenue += order.final_total;
        completedOrders++;
      } else if (order.status !== 'Cancelled') {
        activeOrdersCount++;
      }
    });

    const averageRating = cakes.length > 0 
      ? cakes.reduce((acc, c) => acc + c.rating, 0) / cakes.length
      : 5.0;

    return {
      revenue: totalRevenue,
      completedOrders,
      activeOrders: activeOrdersCount,
      avgRating: averageRating.toFixed(1),
      totalCakes: cakes.length
    };
  }, [orders, cakes]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');

    if (!couponCode || !couponValue) {
      setCouponError('Please enter code and value.');
      return;
    }

    const couponData = {
      code: couponCode,
      discount_value: couponValue,
      discount_type: couponType
    };

    const result = await createCoupon(couponData);
    if (result.success) {
      setCouponCode('');
      setCouponValue('');
      setCouponType('percent');
      setShowCouponForm(false);
      alert('Coupon created successfully!');
    } else {
      setCouponError(result.error || 'Failed to create coupon.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '40px' }}>
        <div>
          <h1>Admin Control Panel</h1>
          <p style={{ color: 'var(--primary)', fontWeight: 600 }}>System Platform Analytics & Moderation</p>
        </div>
      </div>

      {/* Global Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Revenue metric */}
        <div className="glass flex-center" style={{ padding: '20px 24px', borderRadius: 'var(--radius-md)', justifyContent: 'flex-start', gap: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '10px', borderRadius: '8px' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Global Revenue</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2px' }}>
              ₹{platformStats.revenue.toFixed(0)}
            </h3>
          </div>
        </div>

        {/* Orders queue metric */}
        <div className="glass flex-center" style={{ padding: '20px 24px', borderRadius: 'var(--radius-md)', justifyContent: 'flex-start', gap: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Orders</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2px' }}>
              {platformStats.activeOrders}
            </h3>
          </div>
        </div>

        {/* Listed Cakes Count metric */}
        <div className="glass flex-center" style={{ padding: '20px 24px', borderRadius: 'var(--radius-md)', justifyContent: 'flex-start', gap: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'rgb(52, 211, 153)', padding: '10px', borderRadius: '8px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Cakes</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2px' }}>
              {platformStats.totalCakes}
            </h3>
          </div>
        </div>

        {/* Average Rating metric */}
        <div className="glass flex-center" style={{ padding: '20px 24px', borderRadius: 'var(--radius-md)', justifyContent: 'flex-start', gap: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: 'rgb(251, 191, 36)', padding: '10px', borderRadius: '8px' }}>
            <Star size={24} fill="rgb(251, 191, 36)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Rating</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2px' }}>
              {platformStats.avgRating} ★
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Global Orders & Promo Manager */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px'
      }}>
        {/* Left Side: Global Orders Moderation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Global Orders Pipeline ({orders.length})</h3>
          
          {orders.length > 0 ? (
            orders.map(order => (
              <div 
                key={order.id} 
                className="glass" 
                style={{ 
                  padding: '24px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div className="flex-between">
                  <div>
                    <span style={{ fontWeight: 'bold' }}>Order #{order.id}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                      Customer: {order.customer_name}
                    </span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                    ₹{order.final_total.toFixed(0)}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Delivery: {order.delivery_date} ({order.delivery_time})
                </div>

                {/* Direct Order Status Modifier Controls */}
                <div className="flex-between" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Logistics Status:</span>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="form-select"
                    style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem', 
                      background: 'var(--bg-app)', 
                      width: 'auto',
                      border: '1px solid var(--bg-card-border)',
                      color: 'var(--secondary)',
                      fontWeight: 600
                    }}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders have been placed on the platform yet.
            </div>
          )}
        </div>

        {/* Right Side: Coupons & Banners Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex-between">
            <h3>Discounts & Coupons</h3>
            <button 
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="btn btn-outline" 
              style={{ padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem' }}
            >
              {showCouponForm ? 'Close' : 'Add Coupon'}
            </button>
          </div>

          {/* New Coupon Creation Form */}
          {showCouponForm && (
            <form onSubmit={handleCreateCoupon} className="glass" style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input 
                  type="text" 
                  placeholder="e.g. SPECIAL30" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Discount Value</label>
                  <input 
                    type="number" 
                    placeholder="30" 
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    className="form-input" 
                    required
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Type</label>
                  <select 
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value)}
                    className="form-select"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Cash (₹)</option>
                  </select>
                </div>
              </div>

              {couponError && (
                <div style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>
                  {couponError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '8px', borderRadius: '4px', marginTop: '6px' }}>
                Create Promotion
              </button>
            </form>
          )}

          {/* List of active Coupons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coupons.map(coupon => (
              <div 
                key={coupon.code} 
                className="glass" 
                style={{ 
                  padding: '16px 20px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{coupon.code}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    Value: {coupon.discount_value}{coupon.discount_type === 'percent' ? '%' : '₹'} Off
                  </span>
                </div>
                <span className="badge badge-success">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
