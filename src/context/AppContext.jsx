/**
 * @file AppContext.jsx
 * @description Application Global State & Data Context.
 * Manages marketplace datasets, shopping cart item states, order queues,
 * and user authentication profiles (supporting Supabase Cloud sync & local storage persistence).
 * 
 * Developed by Aswin Bhim Nath
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const AppContext = createContext();

// Pre-seeded Mock Data localized for Wayanad, Kerala
const MOCK_USERS = [
  { id: 'usr-1', email: 'buyer@cake.com', password: 'password', role: 'buyer', name: 'Rahul Nair', address: 'Green View Villa, Kalpetta, Wayanad, Kerala - 673121', phone: '+91 98456 78901' },
  { id: 'usr-2', email: 'seller@cake.com', password: 'password', role: 'seller', name: 'Chef Clara', shop_name: 'Malabar Whisk & Bakes', phone: '+91 98765 43210' },
  { id: 'usr-3', email: 'admin@cake.com', password: 'password', role: 'admin', name: 'System Admin', phone: '+91 90000 00000' }
];

const MOCK_CAKES = [
  {
    id: 'cake-1',
    name: 'Wayanad Honey & Cardamom Cake',
    description: 'Moist cardamom-infused sponge cake sweetened with organic forest honey sourced directly from the hills of Wayanad.',
    price: 499.00,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    category: 'Classic Bakes',
    rating: 4.9,
    discount: 10,
    special_sale: true,
    stock: 8,
    seller_id: 'usr-2',
    seller_name: 'Malabar Whisk',
    reviews: [
      { user: 'Bheem', rating: 5, comment: 'Authentic forest honey flavor! Perfect sweetness.' },
      { user: 'Anjali', rating: 4.8, comment: 'Highly recommended for Kerala tea-time.' }
    ]
  },
  {
    id: 'cake-2',
    name: 'Malabar Spiced Plum Cake',
    description: 'Traditional Malabar Christmas plum cake loaded with rum-soaked raisins, dates, candied peels, and warm spices.',
    price: 599.00,
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
    category: 'Chocolate',
    rating: 4.8,
    discount: 0,
    special_sale: false,
    stock: 12,
    seller_id: 'usr-2',
    seller_name: 'Malabar Whisk',
    reviews: [
      { user: 'Rahul', rating: 4.7, comment: 'Rich, moist and smells incredible.' }
    ]
  },
  {
    id: 'cake-3',
    name: 'Coconut Mango Fusion Gateau',
    description: 'Fluffy vanilla sponge layered with fresh Kerala coconut cream frosting and pure Alphonso mango pulp.',
    price: 649.00,
    image_url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80',
    category: 'Fruit & Berries',
    rating: 4.9,
    discount: 15,
    special_sale: true,
    stock: 5,
    seller_id: 'usr-2',
    seller_name: 'Malabar Whisk',
    reviews: []
  },
  {
    id: 'cake-4',
    name: 'Vegan Ela Ada Custard Cake',
    description: 'Plant-based dessert inspired by Kerala\'s traditional Ela Ada, prepared with roasted rice flour, dark jaggery syrup, and grated coconut.',
    price: 549.00,
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80',
    category: 'Vegan & Healthy',
    rating: 4.7,
    discount: 0,
    special_sale: false,
    stock: 6,
    seller_id: 'usr-2',
    seller_name: 'Malabar Whisk',
    reviews: [
      { user: 'Sreejith', rating: 4.7, comment: 'Tastes exactly like traditional Ela Ada! Genius creation.' }
    ]
  },
  {
    id: 'cake-5',
    name: 'Jackfruit Caramel Crunch',
    description: 'Sweet local Wayanad jackfruit preserves folded into buttery cake sponge, topped with crunchy caramelized cashew praline.',
    price: 520.00,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    category: 'Caramel & Crunch',
    rating: 4.6,
    discount: 5,
    special_sale: true,
    stock: 4,
    seller_id: 'usr-2',
    seller_name: 'Malabar Whisk',
    reviews: []
  }
];

const MOCK_COUPONS = [
  { code: 'WAYANAD20', discount_type: 'percent', discount_value: 20, active: true },
  { code: 'KERALAFEST', discount_type: 'fixed', discount_value: 100, active: true }
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cakes, setCakes] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCloudMode, setIsCloudMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Initialize Data
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('cakes').select('*').limit(1);
          if (error) throw error;
          
          setIsCloudMode(true);
          console.log("Connected to Supabase successfully!");
          await loadCloudData();
        } catch (e) {
          console.warn("Supabase database tables not fully ready, falling back to local mode.", e);
          setIsCloudMode(false);
          loadLocalData();
        }
      } else {
        console.log("Running in Local Fallback mode (No Supabase credentials).");
        setIsCloudMode(false);
        loadLocalData();
      }
      setLoading(false);
    };

    initApp();
  }, []);

  // Sync Cart with LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cake_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cake_cart', JSON.stringify(cart));
  }, [cart]);

  // Load Local Storage Data
  const loadLocalData = () => {
    // Cakes
    const localCakes = localStorage.getItem('local_cakes');
    if (localCakes) {
      setCakes(JSON.parse(localCakes));
    } else {
      localStorage.setItem('local_cakes', JSON.stringify(MOCK_CAKES));
      setCakes(MOCK_CAKES);
    }

    // Orders
    const localOrders = localStorage.getItem('local_orders');
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      localStorage.setItem('local_orders', JSON.stringify([]));
    }

    // Coupons
    const localCoupons = localStorage.getItem('local_coupons');
    if (localCoupons) {
      setCoupons(JSON.parse(localCoupons));
    } else {
      localStorage.setItem('local_coupons', JSON.stringify(MOCK_COUPONS));
      setCoupons(MOCK_COUPONS);
    }

    // Auth
    const localUser = localStorage.getItem('local_user');
    if (localUser) {
      setCurrentUser(JSON.parse(localUser));
    }
  };

  // Load Cloud Data
  const loadCloudData = async () => {
    try {
      const { data: dbCakes, error: e1 } = await supabase.from('cakes').select('*');
      if (e1) throw e1;
      setCakes(dbCakes || []);

      const { data: dbCoupons, error: e2 } = await supabase.from('coupons').select('*');
      if (e2) throw e2;
      setCoupons(dbCoupons || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: e3 } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (e3) throw e3;
        setCurrentUser(userData);

        await loadCloudOrders(userData);
      }
    } catch (err) {
      console.error("Error loading cloud data", err);
      setErrorMsg(err.message);
    }
  };

  const loadCloudOrders = async (user) => {
    try {
      let query = supabase.from('orders').select('*');
      if (user.role === 'buyer') {
        query = query.eq('customer_id', user.id);
      }
      const { data: dbOrders, error } = await query;
      if (error) throw error;
      setOrders(dbOrders || []);
    } catch (e) {
      console.error("Error loading orders from cloud", e);
    }
  };

  // --- Auth Handlers ---
  const login = async (email, password) => {
    setErrorMsg('');
    if (isCloudMode) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (userError) throw userError;

        setCurrentUser(userData);
        await loadCloudOrders(userData);
        return { success: true };
      } catch (err) {
        setErrorMsg(err.message);
        return { success: false, error: err.message };
      }
    } else {
      const localUsers = JSON.parse(localStorage.getItem('local_registered_users') || JSON.stringify(MOCK_USERS));
      const user = localUsers.find(u => u.email === email && u.password === password);
      if (user) {
        const sessionUser = { ...user };
        delete sessionUser.password;
        setCurrentUser(sessionUser);
        localStorage.setItem('local_user', JSON.stringify(sessionUser));
        
        const allOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        if (sessionUser.role === 'buyer') {
          setOrders(allOrders.filter(o => o.customer_id === sessionUser.id));
        } else {
          setOrders(allOrders);
        }
        return { success: true };
      } else {
        setErrorMsg('Invalid email or password.');
        return { success: false, error: 'Invalid email or password.' };
      }
    }
  };

  const registerUser = async (email, password, role, name, extraData = {}) => {
    setErrorMsg('');
    if (isCloudMode) {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        const profile = {
          id: data.user.id,
          email,
          role,
          name,
          shop_name: role === 'seller' ? extraData.shopName : null,
          address: extraData.address || '',
          phone: extraData.phone || ''
        };

        const { error: insertError } = await supabase.from('users').insert([profile]);
        if (insertError) throw insertError;

        setErrorMsg("Registration successful! Check your email to verify.");
        return { success: true, needsConfirm: true };
      } catch (err) {
        setErrorMsg(err.message);
        return { success: false, error: err.message };
      }
    } else {
      const localUsers = JSON.parse(localStorage.getItem('local_registered_users') || JSON.stringify(MOCK_USERS));
      if (localUsers.find(u => u.email === email)) {
        setErrorMsg('Email already registered.');
        return { success: false, error: 'Email already registered.' };
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        password,
        role,
        name,
        shop_name: role === 'seller' ? extraData.shopName : null,
        address: extraData.address || '',
        phone: extraData.phone || ''
      };

      localUsers.push(newUser);
      localStorage.setItem('local_registered_users', JSON.stringify(localUsers));
      
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      setCurrentUser(sessionUser);
      localStorage.setItem('local_user', JSON.stringify(sessionUser));
      setOrders([]);
      return { success: true };
    }
  };

  const signInWithGoogle = async (googleAccountData = {}) => {
    setErrorMsg('');
    if (isCloudMode) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return { success: true };
      } catch (err) {
        setErrorMsg(err.message);
        return { success: false, error: err.message };
      }
    } else {
      const gName = googleAccountData.name || 'Google User';
      const gEmail = googleAccountData.email || 'user.google@gmail.com';
      const gRole = googleAccountData.role || 'buyer';

      const googleUser = {
        id: `usr-google-${Date.now()}`,
        email: gEmail,
        name: gName,
        role: gRole,
        address: 'Hill View, Kalpetta, Wayanad, Kerala',
        phone: '+91 98765 43210',
        isGoogleAuth: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };

      setCurrentUser(googleUser);
      localStorage.setItem('local_user', JSON.stringify(googleUser));
      return { success: true, user: googleUser };
    }
  };

  const logout = async () => {
    if (isCloudMode) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('local_user');
    localStorage.removeItem('cake_cart');
  };

  // --- Cart Handlers ---
  const addToCart = (cake, weight, customMessage, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.cake.id === cake.id && 
                item.weight === weight && 
                item.customMessage === customMessage
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { cake, weight, customMessage, quantity }];
      }
    });
  };

  const updateCartQuantity = (index, quantity) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      if (quantity <= 0) {
        newCart.splice(index, 1);
      } else {
        newCart[index].quantity = quantity;
      }
      return newCart;
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Cakes Handlers ---
  const addCake = async (cakeData) => {
    if (!currentUser || currentUser.role !== 'seller') return { success: false, error: 'Unauthorized' };
    
    const newCake = {
      name: cakeData.name,
      description: cakeData.description,
      price: parseFloat(cakeData.price),
      image_url: cakeData.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      category: cakeData.category,
      discount: parseInt(cakeData.discount || 0),
      special_sale: cakeData.special_sale || false,
      stock: parseInt(cakeData.stock || 10),
      seller_id: currentUser.id,
      seller_name: currentUser.shop_name || currentUser.name,
      rating: 5.0,
      reviews: []
    };

    if (isCloudMode) {
      try {
        const { data, error } = await supabase.from('cakes').insert([newCake]).select().single();
        if (error) throw error;
        setCakes(prev => [data, ...prev]);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      const localCakes = JSON.parse(localStorage.getItem('local_cakes') || '[]');
      newCake.id = `cake-${Date.now()}`;
      const updatedCakes = [newCake, ...localCakes];
      localStorage.setItem('local_cakes', JSON.stringify(updatedCakes));
      setCakes(updatedCakes);
      return { success: true };
    }
  };

  const deleteCake = async (cakeId) => {
    if (isCloudMode) {
      try {
        const { error } = await supabase.from('cakes').delete().eq('id', cakeId);
        if (error) throw error;
        setCakes(prev => prev.filter(c => c.id !== cakeId));
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      const localCakes = JSON.parse(localStorage.getItem('local_cakes') || '[]');
      const updatedCakes = localCakes.filter(c => c.id !== cakeId);
      localStorage.setItem('local_cakes', JSON.stringify(updatedCakes));
      setCakes(updatedCakes);
      return { success: true };
    }
  };

  // --- Orders & Checkout (COD) Handlers ---
  const placeOrder = async (shippingInfo, totals) => {
    if (!currentUser) return { success: false, error: 'Please log in to place an order.' };

    const newOrder = {
      customer_id: currentUser.id,
      customer_name: shippingInfo.name,
      customer_phone: shippingInfo.phone,
      shipping_address: shippingInfo.address,
      items: cart.map(item => ({
        cake_id: item.cake.id,
        name: item.cake.name,
        price: item.cake.price,
        discount: item.cake.discount,
        weight: item.weight,
        custom_message: item.customMessage,
        quantity: item.quantity,
        seller_id: item.cake.seller_id
      })),
      total: totals.subtotal,
      discount_amount: totals.discountAmount,
      final_total: totals.total,
      status: 'Placed',
      delivery_date: shippingInfo.deliveryDate,
      delivery_time: shippingInfo.deliveryTime,
      created_at: new Date().toISOString()
    };

    if (isCloudMode) {
      try {
        const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
        if (error) throw error;
        setOrders(prev => [data, ...prev]);
        clearCart();
        return { success: true, order: data };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      newOrder.id = `ord-${Date.now()}`;
      const allOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const updatedOrders = [newOrder, ...allOrders];
      localStorage.setItem('local_orders', JSON.stringify(updatedOrders));
      
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      return { success: true, order: newOrder };
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (isCloudMode) {
      try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) throw error;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      const allOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('local_orders', JSON.stringify(updatedOrders));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      return { success: true };
    }
  };

  // --- Coupon Handlers ---
  const applyCouponCode = (code) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (coupon) {
      return { success: true, coupon };
    }
    return { success: false, error: 'Invalid or expired coupon code.' };
  };

  const createCoupon = async (couponData) => {
    const newCoupon = {
      code: couponData.code.toUpperCase().trim(),
      discount_type: couponData.discount_type || 'percent',
      discount_value: parseFloat(couponData.discount_value),
      active: true
    };

    if (isCloudMode) {
      try {
        const { data, error } = await supabase.from('coupons').insert([newCoupon]).select().single();
        if (error) throw error;
        setCoupons(prev => [...prev, data]);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      const localCoupons = JSON.parse(localStorage.getItem('local_coupons') || '[]');
      if (localCoupons.find(c => c.code === newCoupon.code)) {
        return { success: false, error: 'Coupon code already exists.' };
      }
      const updatedCoupons = [...localCoupons, newCoupon];
      localStorage.setItem('local_coupons', JSON.stringify(updatedCoupons));
      setCoupons(updatedCoupons);
      return { success: true };
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      cakes,
      cart,
      orders,
      coupons,
      loading,
      isCloudMode,
      errorMsg,
      login,
      registerUser,
      signInWithGoogle,
      logout,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      addCake,
      deleteCake,
      placeOrder,
      updateOrderStatus,
      applyCouponCode,
      createCoupon
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
