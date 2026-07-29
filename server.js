/**
 * @file server.js
 * @description Zero-dependency Node.js REST API Server.
 * Exposes endpoints localized for Wayanad, Kerala for consumption by Android applications (e.g., using Retrofit/Volley).
 * Runs on port 5200.
 */

import http from 'http';
import { URL } from 'url';

// Shared In-Memory Datastore localized for Wayanad, Kerala
let database = {
  users: [
    { id: 'usr-1', email: 'buyer@cake.com', password: 'password', role: 'buyer', name: 'Rahul Nair', address: 'Green View Villa, Kalpetta, Wayanad', phone: '+91 98456 78901' },
    { id: 'usr-2', email: 'seller@cake.com', password: 'password', role: 'seller', name: 'Chef Clara', shop_name: 'Malabar Whisk & Bakes', phone: '+91 98765 43210' },
    { id: 'usr-3', email: 'admin@cake.com', password: 'password', role: 'admin', name: 'System Admin', phone: '+91 90000 00000' }
  ],
  cakes: [
    { id: 'cake-1', name: 'Wayanad Honey & Cardamom Cake', price: 699.00, category: 'Classic Bakes', rating: 4.9, discount: 10, stock: 8, seller_name: 'Malabar Whisk', seller_location: 'Kalpetta', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-2', name: 'Malabar Spiced Plum Cake', price: 750.00, category: 'Chocolate', rating: 4.8, discount: 0, stock: 12, seller_name: 'Malabar Whisk', seller_location: 'Vythiri', image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-3', name: 'Coconut Mango Fusion Gateau', price: 899.00, category: 'Fruit & Berries', rating: 4.9, discount: 15, stock: 5, seller_name: 'Malabar Whisk', seller_location: 'Meppadi', image_url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-4', name: 'Vegan Ela Ada Custard Cake', price: 850.00, category: 'Vegan & Healthy', rating: 4.7, discount: 0, stock: 6, seller_name: 'Malabar Whisk', seller_location: 'Sulthan Bathery', image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-5', name: 'Jackfruit Caramel Crunch', price: 799.00, category: 'Caramel & Crunch', rating: 4.6, discount: 5, stock: 4, seller_name: 'Malabar Whisk', seller_location: 'Mananthavady', image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-6', name: 'Edakkal Chocolate Almond Fudge', price: 950.00, category: 'Chocolate', rating: 4.9, discount: 12, stock: 7, seller_name: 'Edakkal Sweets', seller_location: 'Ambalavayal', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-7', name: 'Premium Velvet Cream Cheese', price: 1100.00, category: 'Classic Bakes', rating: 4.8, discount: 0, stock: 5, seller_name: 'Wayanad Baking Co', seller_location: 'Sulthan Bathery', image_url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-8', name: 'Vythiri Fresh Strawberry Gateau', price: 999.00, category: 'Fruit & Berries', rating: 4.9, discount: 8, stock: 9, seller_name: 'Western Ghats Cakery', seller_location: 'Vythiri', image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-9', name: 'Meppadi Mango Custard Delight', price: 850.00, category: 'Fruit & Berries', rating: 4.7, discount: 0, stock: 10, seller_name: 'Tea Hills Bakery', seller_location: 'Meppadi', image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80' },
    { id: 'cake-10', name: 'Nutella Ferrero Rocher Fusion', price: 1250.00, category: 'Chocolate', rating: 4.8, discount: 15, stock: 6, seller_name: 'Hilltop Oven Bakes', seller_location: 'Mananthavady', image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80' }
  ],
  orders: [],
  coupons: [
    { code: 'WAYANAD20', discount_type: 'percent', discount_value: 20 },
    { code: 'KERALAFEST', discount_type: 'fixed', discount_value: 100 }
  ]
};

// Helper function to extract JSON request payload
const parseJsonBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
};

// Helper function to send standard JSON responses
const sendJson = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle pre-flight CORS requests
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // --- API ROUTE 1: GET /api/cakes (Fetch Cakes list) ---
  if (pathname === '/api/cakes' && method === 'GET') {
    const locationQuery = parsedUrl.searchParams.get('location');
    let cakeList = [...database.cakes];
    
    // Sort cakes so nearest bakers appear first if location parameter matches
    if (locationQuery) {
      cakeList.sort((a, b) => {
        const isANear = a.seller_location.toLowerCase() === locationQuery.toLowerCase() ? 1 : 0;
        const isBNear = b.seller_location.toLowerCase() === locationQuery.toLowerCase() ? 1 : 0;
        return isBNear - isANear;
      });
    }
    
    sendJson(res, 200, { success: true, cakes: cakeList });
    return;
  }

  // --- API ROUTE 2: POST /api/auth/login ---
  if (pathname === '/api/auth/login' && method === 'POST') {
    const { email, password } = await parseJsonBody(req);
    const user = database.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const sessionUser = { ...user };
      delete sessionUser.password;
      sendJson(res, 200, { success: true, user: sessionUser });
    } else {
      sendJson(res, 401, { success: false, error: 'Invalid email or password.' });
    }
    return;
  }

  // --- API ROUTE 3: POST /api/auth/register ---
  if (pathname === '/api/auth/register' && method === 'POST') {
    const { email, password, role, name, extraData } = await parseJsonBody(req);
    
    if (database.users.some(u => u.email === email)) {
      sendJson(res, 400, { success: false, error: 'Email already registered.' });
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      password,
      role: role || 'buyer',
      name,
      address: extraData?.address || '',
      phone: extraData?.phone || '',
      shop_name: extraData?.shopName || ''
    };

    database.users.push(newUser);
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    sendJson(res, 201, { success: true, user: sessionUser });
    return;
  }

  // --- API ROUTE 4: POST /api/orders (Submit New Cake Order) ---
  if (pathname === '/api/orders' && method === 'POST') {
    const { items, customerId, recipientInfo, couponCode } = await parseJsonBody(req);
    
    if (!items || items.length === 0) {
      sendJson(res, 400, { success: false, error: 'Shopping cart is empty.' });
      return;
    }

    // Calculate subtotal
    let subtotal = 0;
    items.forEach(item => {
      const cakeObj = database.cakes.find(c => c.id === item.cakeId);
      if (cakeObj) {
        const basePrice = cakeObj.discount > 0 
          ? cakeObj.price * (1 - cakeObj.discount / 100) 
          : cakeObj.price;
        const surcharge = item.weight === '1 Kg' ? 350.00 : item.weight === '2 Kg' ? 800.00 : 0;
        subtotal += (basePrice + surcharge) * item.quantity;
      }
    });

    // Proximity Delivery Fee Zones
    let deliveryFee = 39.00;
    let hasCrossTown = false;
    let hasHeavyCake = false;

    items.forEach(item => {
      const cakeObj = database.cakes.find(c => c.id === item.cakeId);
      if (cakeObj && cakeObj.seller_location !== recipientInfo.location) {
        hasCrossTown = true;
      }
      if (item.weight === '2 Kg') {
        hasHeavyCake = true;
      }
    });

    if (hasCrossTown) deliveryFee = 89.00;
    if (hasHeavyCake) deliveryFee += 20.00;

    // Subsidize delivery fees
    if (subtotal > 599) deliveryFee = 0.00;
    else if (subtotal > 399) deliveryFee = deliveryFee / 2;

    // GST calculation (5%)
    const gstAmount = subtotal * 0.05;

    // Validate Coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = database.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
      if (coupon) {
        if (coupon.discount_type === 'percent') {
          discountAmount = subtotal * (coupon.discount_value / 100);
        } else {
          discountAmount = Math.min(subtotal, coupon.discount_value);
        }
      }
    }

    const grandTotal = subtotal + gstAmount + deliveryFee - discountAmount;

    const newOrder = {
      id: `ord-${Date.now()}`,
      customer_id: customerId || 'guest',
      items,
      subtotal,
      delivery_fee: deliveryFee,
      gst_amount: gstAmount,
      discount_amount: discountAmount,
      total: grandTotal,
      recipient_info: recipientInfo,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    database.orders.push(newOrder);
    sendJson(res, 201, { success: true, order: newOrder });
    return;
  }

  // --- API ROUTE 5: GET /api/orders (Fetch Order queues) ---
  if (pathname === '/api/orders' && method === 'GET') {
    const customerId = parsedUrl.searchParams.get('customerId');
    let orderQueue = [...database.orders];

    if (customerId) {
      orderQueue = orderQueue.filter(o => o.customer_id === customerId);
    }
    sendJson(res, 200, { success: true, orders: orderQueue });
    return;
  }

  // --- API ROUTE 6: POST /api/coupons/validate (Validate Coupons) ---
  if (pathname === '/api/coupons/validate' && method === 'POST') {
    const { code } = await parseJsonBody(req);
    const coupon = database.coupons.find(c => c.code.toUpperCase() === (code || '').toUpperCase());

    if (coupon) {
      sendJson(res, 200, { success: true, coupon });
    } else {
      sendJson(res, 404, { success: false, error: 'Invalid coupon code.' });
    }
    return;
  }

  // Handle Route Not Found
  sendJson(res, 404, { success: false, error: 'Endpoint route not found.' });
});

const PORT = 5200;
server.listen(PORT, () => {
  console.log(`\n============== ANDROID BACKEND API SERVER ACTIVE ==============`);
  console.log(`➜ REST Base URL: http://localhost:${PORT}/api`);
  console.log(`Exposing endpoints:`);
  console.log(` - GET  /api/cakes?location=Vythiri`);
  console.log(` - POST /api/auth/login`);
  console.log(` - POST /api/auth/register`);
  console.log(` - POST /api/orders`);
  console.log(` - GET  /api/orders?customerId=usr-1`);
  console.log(` - POST /api/coupons/validate`);
  console.log(`================================================================\n`);
});
