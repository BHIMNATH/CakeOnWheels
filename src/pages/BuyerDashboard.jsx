import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, Calendar, MapPin, CheckCircle2, Clock, Play } from 'lucide-react';

const STATUS_STEPS = ['Placed', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function BuyerDashboard() {
  const { currentUser, orders, updateOrderStatus } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const getStatusIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  // Demo simulator to easily demonstrate the logistics flow to clients in one browser screen!
  const handleSimulateNextStatus = async (order) => {
    const currentIndex = getStatusIndex(order.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1];
      await updateOrderStatus(order.id, nextStatus);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '24px' }}>Welcome, {currentUser?.name}</h1>
        <div className="glass flex-center" style={{
          flexDirection: 'column',
          padding: '60px 40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          gap: '16px'
        }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)' }} />
          <h3>No Orders Placed Yet</h3>
          <p>You haven't ordered any cakes yet. Visit our marketplace to satisfy your sweet tooth!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: '32px' }}>Welcome back, {currentUser?.name}</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Side: Orders History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Your Order History</h3>
          
          {orders.map(order => (
            <div 
              key={order.id} 
              className="glass" 
              onClick={() => setSelectedOrderId(order.id)}
              style={{ 
                padding: '20px', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer',
                border: activeOrder?.id === order.id ? '2px solid var(--secondary)' : '1px solid var(--glass-border)',
                backgroundColor: activeOrder?.id === order.id ? 'rgba(255,255,255,0.05)' : 'var(--glass-bg)',
                transition: 'var(--transition)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)' }}>
                  Order #{order.id}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)} cakes
              </div>

              <div className="flex-between">
                <span className="badge" style={{
                  backgroundColor: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: order.status === 'Delivered' ? 'rgb(52, 211, 153)' : 'rgb(251, 191, 36)',
                  border: order.status === 'Delivered' ? '1px solid rgb(16, 185, 129)' : '1px solid rgb(245, 158, 11)'
                }}>
                  {order.status}
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                  ₹{order.final_total.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Detailed Tracker of Selected Order */}
        {activeOrder && (
          <div className="glass" style={{
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ color: 'var(--text-main)' }}>Live Logistics Tracker</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID: #{activeOrder.id}</span>
              </div>
              
              {/* Demo Mode Simulator Tool */}
              {activeOrder.status !== 'Delivered' && (
                <button 
                  onClick={() => handleSimulateNextStatus(activeOrder)}
                  className="btn btn-outline" 
                  style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Simulate dispatch steps directly for demo purposes"
                >
                  <Play size={12} fill="currentColor" /> Simulate Next Step
                </button>
              )}
            </div>

            {/* Visual Step Progress Tracker Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = getStatusIndex(activeOrder.status) >= idx;
                const isActive = activeOrder.status === step;
                
                return (
                  <div key={step} className="flex-center" style={{ justifyContent: 'flex-start', gap: '20px', position: 'relative' }}>
                    
                    {/* Visual Line connector */}
                    {idx < STATUS_STEPS.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '19px',
                        top: '30px',
                        bottom: '-18px',
                        width: '2px',
                        backgroundColor: getStatusIndex(activeOrder.status) > idx ? 'var(--secondary)' : 'var(--glass-border)',
                        zIndex: 0
                      }}></div>
                    )}

                    {/* Step Icon Indicator */}
                    <div className="flex-center" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      zIndex: 1,
                      backgroundColor: isCompleted ? 'var(--secondary)' : 'var(--bg-app)',
                      border: isCompleted ? '2px solid var(--secondary)' : '2px solid var(--glass-border)',
                      color: isCompleted ? 'black' : 'var(--text-muted)',
                      boxShadow: isActive ? '0 0 15px var(--secondary-glow)' : 'none',
                      animation: isActive ? 'pulse 2s infinite' : 'none',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>

                    {/* Step label description */}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                        fontSize: '1.05rem' 
                      }}>
                        {step}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {step === 'Placed' && 'Order successfully uploaded to queue'}
                        {step === 'Accepted' && 'Seller verified recipe & schedule'}
                        {step === 'Preparing' && 'Fresh cake baking in oven'}
                        {step === 'Out for Delivery' && 'Assigned courier en-route'}
                        {step === 'Delivered' && 'Order received at doorstep'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr style={{ border: '0', height: '1px', backgroundColor: 'var(--glass-border)' }} />

            {/* Delivery details Summary block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Shipping To:</span>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>
                    {activeOrder.customer_name} - {activeOrder.shipping_address}
                  </div>
                </div>
              </div>

              <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Time Frame:</span>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>
                    {activeOrder.delivery_date} ({activeOrder.delivery_time})
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items receipt */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '12px' }}>
                Order Items:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeOrder.items.map((item, index) => (
                  <div key={index} className="flex-between" style={{ fontSize: '0.9rem' }}>
                    <span>{item.quantity}x {item.name} ({item.weight})</span>
                    <span style={{ fontWeight: 500 }}>₹{((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                
                <div className="flex-between" style={{ fontWeight: 'bold', fontSize: '1.05rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '10px', marginTop: '6px' }}>
                  <span>Total Due (COD)</span>
                  <span style={{ color: 'var(--secondary)' }}>₹{activeOrder.final_total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 var(--secondary-glow); }
          70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }
      `}</style>
    </div>
  );
}
