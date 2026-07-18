import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, ShoppingBag, DollarSign, Store, Trash2, Edit, X, FileImage } from 'lucide-react';

const CATEGORIES = ['Chocolate', 'Fruit & Berries', 'Classic Bakes', 'Vegan & Healthy', 'Caramel & Crunch'];

export default function SellerDashboard() {
  const { currentUser, cakes, orders, addCake, deleteCake, updateOrderStatus } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // New cake form state
  const [cakeName, setCakeName] = useState('');
  const [cakePrice, setCakePrice] = useState('');
  const [cakeDescription, setCakeDescription] = useState('');
  const [cakeCategory, setCakeCategory] = useState(CATEGORIES[0]);
  const [cakeDiscount, setCakeDiscount] = useState('0');
  const [cakeStock, setCakeStock] = useState('10');
  const [cakeImageUrl, setCakeImageUrl] = useState('');
  const [specialSale, setSpecialSale] = useState(false);
  const [formError, setFormError] = useState('');

  // Seller specific data filters
  const myCakes = useMemo(() => {
    return cakes.filter(c => c.seller_id === currentUser?.id);
  }, [cakes, currentUser]);

  const myOrders = useMemo(() => {
    // Return orders containing items from this seller
    return orders.filter(order => 
      order.items.some(item => item.seller_id === currentUser?.id)
    );
  }, [orders, currentUser]);

  // Calculations for dashboard indicators
  const sellerStats = useMemo(() => {
    let totalRevenue = 0;
    let pendingCount = 0;

    myOrders.forEach(order => {
      if (order.status === 'Delivered') {
        // Only calculate total of items belonging to this seller
        const sellerItemsSum = order.items
          .filter(item => item.seller_id === currentUser?.id)
          .reduce((acc, item) => {
            const priceAfterDiscount = item.price * (1 - item.discount / 100);
            return acc + (priceAfterDiscount * item.quantity);
          }, 0);
        totalRevenue += sellerItemsSum;
      } else if (order.status !== 'Cancelled') {
        pendingCount++;
      }
    });

    return {
      revenue: totalRevenue,
      pendingOrders: pendingCount,
      totalListings: myCakes.length
    };
  }, [myOrders, myCakes, currentUser]);

  const handleAddCakeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!cakeName || !cakePrice || !cakeDescription) {
      setFormError('Please fill in Name, Price, and Description.');
      return;
    }

    const cakeData = {
      name: cakeName,
      price: cakePrice,
      description: cakeDescription,
      category: cakeCategory,
      discount: cakeDiscount,
      stock: cakeStock,
      image_url: cakeImageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      special_sale: specialSale
    };

    const result = await addCake(cakeData);
    if (result.success) {
      // Reset form fields
      setCakeName('');
      setCakePrice('');
      setCakeDescription('');
      setCakeCategory(CATEGORIES[0]);
      setCakeDiscount('0');
      setCakeStock('10');
      setCakeImageUrl('');
      setSpecialSale(false);
      setShowAddForm(false);
      alert('Product listed successfully!');
    } else {
      setFormError(result.error || 'Failed to list cake.');
    }
  };

  const handleDeleteCake = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const result = await deleteCake(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Placed') nextStatus = 'Accepted';
    else if (currentStatus === 'Accepted') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';

    if (nextStatus) {
      await updateOrderStatus(orderId, nextStatus);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Welcome Chef, {currentUser?.name}</h1>
          <p>Bakery Store: <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{currentUser?.shop_name}</span></p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {showAddForm ? <><X size={18} /> Close Panel</> : <><PlusCircle size={18} /> List New Cake</>}
        </button>
      </div>

      {/* Seller Metrics Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Earnings Card */}
        <div className="glass flex-center" style={{
          padding: '24px 32px',
          borderRadius: 'var(--radius-md)',
          justifyContent: 'flex-start',
          gap: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)', padding: '14px', borderRadius: '12px' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Store Earnings (Delivered)</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
              ₹{sellerStats.revenue.toFixed(0)}
            </h2>
          </div>
        </div>

        {/* Listings count Card */}
        <div className="glass flex-center" style={{
          padding: '24px 32px',
          borderRadius: 'var(--radius-md)',
          justifyContent: 'flex-start',
          gap: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '14px', borderRadius: '12px' }}>
            <Store size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Listed Products</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
              {sellerStats.totalListings}
            </h2>
          </div>
        </div>

        {/* Orders in queue Card */}
        <div className="glass flex-center" style={{
          padding: '24px 32px',
          borderRadius: 'var(--radius-md)',
          justifyContent: 'flex-start',
          gap: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'rgb(52, 211, 153)', padding: '14px', borderRadius: '12px' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Orders</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
              {sellerStats.pendingOrders}
            </h2>
          </div>
        </div>
      </div>

      {/* Add Cake Form Modal Panel */}
      {showAddForm && (
        <form onSubmit={handleAddCakeSubmit} className="glass" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--primary)',
          marginBottom: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h3 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            Cake Specifications
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Cake Name</label>
              <input 
                type="text" 
                placeholder="e.g. Premium White Forest Gateau" 
                value={cakeName}
                onChange={(e) => setCakeName(e.target.value)}
                className="form-input" 
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={cakeCategory}
                onChange={(e) => setCakeCategory(e.target.value)}
                className="form-select"
                required
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Ingredients & Details)</label>
            <textarea 
              placeholder="e.g. Baked with premium vanilla sponge, infused with fresh cherries and dark rum glaze..." 
              rows={3}
              value={cakeDescription}
              onChange={(e) => setCakeDescription(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Base Price (₹)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="499" 
                value={cakePrice}
                onChange={(e) => setCakePrice(e.target.value)}
                className="form-input" 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount (%)</label>
              <input 
                type="number" 
                min="0" 
                max="99" 
                placeholder="10" 
                value={cakeDiscount}
                onChange={(e) => setCakeDiscount(e.target.value)}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input 
                type="number" 
                min="1" 
                placeholder="10" 
                value={cakeStock}
                onChange={(e) => setCakeStock(e.target.value)}
                className="form-input" 
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="url" 
                placeholder="Paste unsplash or web image link (defaults to chocolate placeholder if empty)" 
                value={cakeImageUrl}
                onChange={(e) => setCakeImageUrl(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '42px' }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <FileImage size={16} />
              </span>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="specialsale"
              checked={specialSale}
              onChange={(e) => setSpecialSale(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="specialsale" style={{ fontWeight: 500, cursor: 'pointer' }}>
              Feature in **Special Sales** banner (glowing borders)
            </label>
          </div>

          {formError && (
            <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              {formError}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ height: '46px', borderRadius: 'var(--radius-sm)' }}>
            Publish Listing
          </button>
        </form>
      )}

      {/* Main Grid: Orders to prepare and Stock listings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px'
      }}>
        {/* Left Side Column: Orders Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Orders Awaiting Preparation ({myOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length})</h3>
          
          {myOrders.length > 0 ? (
            myOrders.map(order => {
              // Extract items belonging to this seller
              const sellerItems = order.items.filter(item => item.seller_id === currentUser.id);
              
              return (
                <div key={order.id} className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', display: 'block' }}>Order #{order.id}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: {order.delivery_date} ({order.delivery_time})</span>
                    </div>
                    <span className="badge" style={{
                      backgroundColor: order.status === 'Placed' ? 'var(--primary-glow)' : 'var(--secondary-glow)',
                      color: order.status === 'Placed' ? 'var(--primary)' : 'var(--secondary)'
                    }}>{order.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
                    {sellerItems.map((item, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                        <div className="flex-between">
                          <span style={{ fontWeight: 600 }}>{item.quantity}x {item.name} ({item.weight})</span>
                        </div>
                        {item.custom_message && (
                          <div style={{ color: 'var(--secondary)', fontStyle: 'italic', fontSize: '0.8rem', marginTop: '4px' }}>
                            Icing writing: "{item.custom_message}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Delivery metadata */}
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <div>Customer: {order.customer_name} ({order.customer_phone})</div>
                    <div>Address: {order.shipping_address}</div>
                  </div>

                  {/* Transition triggers */}
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, order.status)}
                      className="btn btn-secondary" 
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                    >
                      {order.status === 'Placed' && 'Accept & Begin Bake'}
                      {order.status === 'Accepted' && 'Mark as In-Oven (Baking)'}
                      {order.status === 'Preparing' && 'Mark Ready & Out for Delivery'}
                      {order.status === 'Out for Delivery' && 'Confirm Handed to Customer (Delivered)'}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders received yet. Make sure your prices are competitive!
            </div>
          )}
        </div>

        {/* Right Side Column: Listings Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Manage Store Inventory ({myCakes.length})</h3>

          {myCakes.length > 0 ? (
            myCakes.map(cake => (
              <div 
                key={cake.id} 
                className="glass" 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  alignItems: 'center',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <img 
                  src={cake.image_url} 
                  alt={cake.name} 
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                />
                
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cake.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Stock: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cake.stock} left</span>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                    ₹{cake.price.toFixed(0)} {cake.discount > 0 && `(${cake.discount}% off)`}
                  </div>
                </div>

                <div className="flex-center gap-sm">
                  <button 
                    onClick={() => handleDeleteCake(cake.id)} 
                    style={{ color: 'var(--primary)', padding: '6px' }}
                    title="Delete product listing"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              You haven't listed any cakes yet. Click "List New Cake" to populate your bakery storefront!
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
