import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.join(__dirname, 'db.json')

export const DEFAULT_SHOP_SETTINGS = {
  name: 'Bean & Bloom Coffee House',
  tagline: 'Authentic Kerala Kaapi & Artisan Brews',
  address: 'Swaraj Round South, Opp. Vadakkunnathan Temple, Thrissur, Kerala - 680001',
  phone: '+91 98470 12345 / 0487 242 8900',
  email: 'hello@beanbloomthrissur.in',
  gstin: '32AABCB1234M1Z5',
  fssai: '11322007000123',
  hours: '7:00 AM – 11:00 PM (All Days)',
  currency: '₹',
  upiId: 'ananthukrishna250@oksbi',
  upiName: 'Bean & Bloom Coffee House',
}

export const DEFAULT_MENU_ITEMS = [
  // Kaapi & Hot Brews
  {
    id: 1,
    name: 'Traditional Kerala Filter Kaapi',
    category: 'Kaapi',
    price: 35,
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=75&auto=format&fit=crop',
    desc: 'Wayanad robusta & chicory freshly decocted with frothed cow milk in traditional dabarah',
    inStock: true,
  },
  {
    id: 2,
    name: 'Sukku Malli Kaapi',
    category: 'Kaapi',
    price: 40,
    img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=75&auto=format&fit=crop',
    desc: 'Spiced herbal coffee with dry ginger, coriander seeds, and organic jaggery',
    inStock: true,
  },
  {
    id: 3,
    name: 'Single Origin Espresso',
    category: 'Espresso',
    price: 65,
    img: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=200&q=75&auto=format&fit=crop',
    desc: 'Bold double shot pulled from dark roasted Coorg & Wayanad estate beans',
    inStock: true,
  },
  {
    id: 4,
    name: 'Classic Americano',
    category: 'Espresso',
    price: 75,
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=75&auto=format&fit=crop',
    desc: 'Espresso topped with pure hot water, rich crema, smooth finish',
    inStock: true,
  },
  // Lattes
  {
    id: 5,
    name: 'Cardamom Spiced Latte',
    category: 'Latte',
    price: 120,
    img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200&q=75&auto=format&fit=crop',
    desc: 'Freshly ground Idukki green cardamom steamed with creamy milk and espresso',
    inStock: true,
  },
  {
    id: 6,
    name: 'Vanilla Bloom Latte',
    category: 'Latte',
    price: 130,
    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&q=75&auto=format&fit=crop',
    desc: 'Madagascar vanilla infused with steamed microfoam milk and espresso',
    inStock: true,
  },
  {
    id: 7,
    name: 'Jaggery Caramel Latte',
    category: 'Latte',
    price: 140,
    img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&q=75&auto=format&fit=crop',
    desc: 'House-made palm jaggery caramel reduction with rich milk coffee',
    inStock: true,
  },
  // Cold Brews & Refreshers
  {
    id: 8,
    name: 'Malabar Cold Brew',
    category: 'Cold Brew',
    price: 110,
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=75&auto=format&fit=crop',
    desc: 'Slow steeped for 18 hours in cold spring water, velvety chocolate notes',
    inStock: true,
  },
  {
    id: 9,
    name: 'South Indian Iced Kaapi',
    category: 'Cold Brew',
    price: 90,
    img: 'https://images.unsplash.com/photo-1579954115563-e72bf1697784?w=200&q=75&auto=format&fit=crop',
    desc: 'Chilled filter decoction with thickened milk and ice, frothed to perfection',
    inStock: true,
  },
  {
    id: 10,
    name: 'Thrissur Cold Frappé',
    category: 'Cold Brew',
    price: 150,
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=75&auto=format&fit=crop',
    desc: 'Blended cold espresso with rich Belgian dark chocolate and vanilla cream',
    inStock: true,
  },
  // Tea & Infusions
  {
    id: 11,
    name: 'Malabar Sulaimani Tea',
    category: 'Tea',
    price: 25,
    img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=75&auto=format&fit=crop',
    desc: 'Classic Kerala spiced black tea with mint, cinnamon, and fresh lemon',
    inStock: true,
  },
  {
    id: 12,
    name: 'Kattan Chai (Black Tea)',
    category: 'Tea',
    price: 20,
    img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&q=75&auto=format&fit=crop',
    desc: 'Strong brewed Nilgiri black tea sweetened with sugar or jaggery',
    inStock: true,
  },
  {
    id: 13,
    name: 'Elaichi Milk Chai',
    category: 'Tea',
    price: 30,
    img: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=200&q=75&auto=format&fit=crop',
    desc: 'Fresh farm milk boiled with crushed cardamom and premium tea leaves',
    inStock: true,
  },
  // Snacks & Bakery
  {
    id: 14,
    name: 'Kerala Pazham Pori (2 Pcs)',
    category: 'Snacks',
    price: 45,
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=75&auto=format&fit=crop',
    desc: 'Crispy golden fried Nendran banana fritters with sweet natural ripeness',
    inStock: true,
  },
  {
    id: 15,
    name: 'Malabar Chicken Cutlet (2 Pcs)',
    category: 'Snacks',
    price: 60,
    img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&q=75&auto=format&fit=crop',
    desc: 'Crumb-fried spicy minced chicken cutlet served with hot tomato relish',
    inStock: true,
  },
  {
    id: 16,
    name: 'Kerala Spiced Plum Cake Slice',
    category: 'Snacks',
    price: 50,
    img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&q=75&auto=format&fit=crop',
    desc: 'Rich Christmas-style plum cake with soaked raisins, tutty fruity, and aromatic spices',
    inStock: true,
  },
  {
    id: 17,
    name: 'Fresh Butter Croissant',
    category: 'Snacks',
    price: 85,
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=75&auto=format&fit=crop',
    desc: 'French flaky pastry baked with pure European churned butter',
    inStock: true,
  },
  {
    id: 18,
    name: 'Warm Bun Butter Jam',
    category: 'Snacks',
    price: 40,
    img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&q=75&auto=format&fit=crop',
    desc: 'Soft sweet bakery bun stuffed with generous salted butter and mixed fruit jam',
    inStock: true,
  },
]

export const DEFAULT_TABLES = [
  { id: 'T-1', name: 'Table 1', capacity: 2, section: 'Swaraj Round View', status: 'occupied', guestCount: 2, customerName: 'Rahul Menon', orderId: 'ORD-8921', occupiedSinceMinutesAgo: 38 },
  { id: 'T-2', name: 'Table 2', capacity: 4, section: 'Temple Facing', status: 'occupied', guestCount: 3, customerName: 'Anjali Nair', orderId: 'ORD-8922', occupiedSinceMinutesAgo: 50 },
  { id: 'T-3', name: 'Table 3', capacity: 2, section: 'Indoor AC Lounge', status: 'available', guestCount: 0, customerName: '', orderId: null },
  { id: 'T-4', name: 'Table 4', capacity: 4, section: 'Indoor AC Lounge', status: 'occupied', guestCount: 4, customerName: 'Vishnu & Friends', orderId: 'ORD-8924', occupiedSinceMinutesAgo: 20 },
  { id: 'T-5', name: 'Table 5', capacity: 2, section: 'Verandah Balcony', status: 'reserved', guestCount: 2, customerName: 'Dr. Joseph (3:00 PM)', orderId: null },
  { id: 'T-6', name: 'Table 6', capacity: 4, section: 'Courtyard Garden', status: 'available', guestCount: 0, customerName: '', orderId: null },
  { id: 'T-7', name: 'Table 7', capacity: 6, section: 'Courtyard Garden', status: 'occupied', guestCount: 5, customerName: 'Suresh Kumar', orderId: 'ORD-8925', occupiedSinceMinutesAgo: 14 },
  { id: 'T-8', name: 'Table 8', capacity: 2, section: 'Traditional Kaapi Counter', status: 'cleaning', guestCount: 0, customerName: '', orderId: null },
]

export const DEFAULT_ORDERS = [
  {
    id: 'ORD-8921',
    token: '#B-21',
    createdAt: new Date(Date.now() - 38 * 60000).toISOString(),
    customerName: 'Rahul Menon',
    customerPhone: '+91 98471 22334',
    orderType: 'dine_in',
    tableNumber: 'T-1',
    pickupTime: 'Table Service',
    items: [
      { id: 1, name: 'Traditional Kerala Filter Kaapi', price: 35, qty: 2, notes: 'Extra decoction' },
      { id: 14, name: 'Kerala Pazham Pori (2 Pcs)', price: 45, qty: 1, notes: 'Hot & crisp' },
    ],
    subtotal: 115,
    tax: 5.75,
    total: 120.75,
    paymentMethod: 'cash_on_counter',
    paymentStatus: 'PAID',
    orderStatus: 'completed',
    orderSource: 'site_live',
    notes: 'Dine-in T-1',
  },
  {
    id: 'ORD-8927',
    token: '#B-27',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
    customerName: 'Divya Nambiar',
    customerPhone: '+91 94470 55667',
    orderType: 'takeaway',
    tableNumber: null,
    pickupTime: '10–15 mins',
    items: [
      { id: 8, name: 'Malabar Cold Brew', price: 110, qty: 1, notes: 'Less ice' },
      { id: 5, name: 'Cardamom Spiced Latte', price: 120, qty: 1, notes: '' },
    ],
    subtotal: 230,
    tax: 11.50,
    total: 241.50,
    paymentMethod: 'cash_on_counter',
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'preparing',
    orderSource: 'site_live',
    notes: 'Takeaway - Pay on Counter',
  },
  {
    id: 'ORD-8930',
    token: '#B-30',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    customerName: 'Ananthu Krishna',
    customerPhone: '+91 98470 88990',
    orderType: 'takeaway',
    tableNumber: null,
    pickupTime: '5–10 mins',
    items: [
      { id: 1, name: 'Traditional Kerala Filter Kaapi', price: 35, qty: 1, notes: 'Strong' },
      { id: 15, name: 'Malabar Chicken Cutlet (2 Pcs)', price: 60, qty: 1, notes: 'Hot relish' },
    ],
    subtotal: 95,
    tax: 4.75,
    total: 99.75,
    paymentMethod: 'upi',
    paymentStatus: 'PAID',
    upiId: 'ananthukrishna250@oksbi',
    upiRef: 'UPI-OKSBI-9921',
    orderStatus: 'received',
    orderSource: 'site_live',
    notes: 'Online Paid via UPI: ananthukrishna250@oksbi',
  },
]

function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
      // Ensure default shopSettings has upiId
      if (!data.shopSettings) {
        data.shopSettings = DEFAULT_SHOP_SETTINGS
      } else {
        data.shopSettings = { ...DEFAULT_SHOP_SETTINGS, ...data.shopSettings }
        if (!data.shopSettings.upiId) {
          data.shopSettings.upiId = 'ananthukrishna250@oksbi'
        }
      }
      if (!data.menuItems || data.menuItems.length === 0) data.menuItems = DEFAULT_MENU_ITEMS
      if (!data.tables || data.tables.length === 0) data.tables = DEFAULT_TABLES
      if (!data.orders || data.orders.length === 0) data.orders = DEFAULT_ORDERS
      return data
    }
  } catch (err) {
    console.error('Failed to read db file:', err)
  }
  return {
    shopSettings: DEFAULT_SHOP_SETTINGS,
    menuItems: DEFAULT_MENU_ITEMS,
    tables: DEFAULT_TABLES,
    orders: DEFAULT_ORDERS,
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write db file:', err)
  }
}

let db = loadData()

// Connected SSE clients for live pushing to all dashboards and customers
const sseClients = new Set()

function broadcastEvent(eventType, payload) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`
  for (const client of sseClients) {
    try {
      client.write(message)
    } catch {
      sseClients.delete(client)
    }
  }
}

// Keep-alive ping every 15 seconds
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': ping\n\n')
    } catch {
      sseClients.delete(client)
    }
  }
}, 15000)

const server = http.createServer((req, res) => {
  // Ultra-permissive CORS for seamless communication between port 5173, 5174, etc.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:4000'}`)

  // Real-time Server-Sent Events (SSE) Stream
  if (req.method === 'GET' && url.pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })
    res.write(`: connected\nevent: initial_state\ndata: ${JSON.stringify({
      ordersCount: db.orders.length,
      timestamp: Date.now(),
      upiId: db.shopSettings.upiId || 'ananthukrishna250@oksbi',
    })}\n\n`)

    sseClients.add(res)
    req.on('close', () => {
      sseClients.delete(res)
    })
    return
  }

  // GET /api/health
  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      sseClientsCount: sseClients.size,
      ordersCount: db.orders.length,
      timestamp: Date.now(),
      upiId: db.shopSettings.upiId || 'ananthukrishna250@oksbi',
    }))
    return
  }

  // GET /api/data
  if (req.method === 'GET' && url.pathname === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(db))
    return
  }

  // PUT /api/settings (Update shop details)
  if (req.method === 'PUT' && url.pathname === '/api/settings') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const updates = JSON.parse(body)
        db.shopSettings = { ...db.shopSettings, ...updates }
        saveData(db)
        broadcastEvent('settings_updated', db.shopSettings)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(db.shopSettings))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // POST /api/menu (Add item)
  if (req.method === 'POST' && url.pathname === '/api/menu') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const item = JSON.parse(body)
        const newItem = {
          id: Date.now(),
          inStock: true,
          ...item,
          price: Math.max(20, Math.min(200, Number(item.price) || 50)),
        }
        db.menuItems.unshift(newItem)
        saveData(db)
        broadcastEvent('menu_updated', db.menuItems)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newItem))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // PUT /api/menu/:id (Update item or toggle sold-out)
  if (req.method === 'PUT' && url.pathname.startsWith('/api/menu/')) {
    const itemId = Number(url.pathname.replace('/api/menu/', ''))
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const updates = JSON.parse(body)
        if (updates.price) {
          updates.price = Math.max(20, Math.min(200, Number(updates.price)))
        }
        db.menuItems = db.menuItems.map((i) => (i.id === itemId ? { ...i, ...updates } : i))
        saveData(db)
        broadcastEvent('menu_updated', db.menuItems)
        const updated = db.menuItems.find((i) => i.id === itemId)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(updated))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // DELETE /api/menu/:id (Delete item)
  if (req.method === 'DELETE' && url.pathname.startsWith('/api/menu/')) {
    const itemId = Number(url.pathname.replace('/api/menu/', ''))
    db.menuItems = db.menuItems.filter((i) => i.id !== itemId)
    saveData(db)
    broadcastEvent('menu_updated', db.menuItems)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: true }))
    return
  }

  // POST /api/orders (Create order)
  if (req.method === 'POST' && url.pathname === '/api/orders') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const orderData = JSON.parse(body)
        const nextNum = Math.floor(1000 + Math.random() * 9000)
        const tokenNum = Math.floor(10 + Math.random() * 89)

        const paymentMethod = orderData.paymentMethod || 'cash_on_counter'
        const isUpi = paymentMethod === 'upi'

        const newOrder = {
          id: orderData.id || `ORD-${nextNum}`,
          token: orderData.token || `#B-${tokenNum}`,
          createdAt: orderData.createdAt || new Date().toISOString(),
          orderStatus: orderData.orderStatus || 'received',
          orderSource: orderData.orderSource || 'site_live',
          paymentMethod,
          paymentStatus: orderData.paymentStatus || (isUpi ? 'PAID' : 'PENDING_CASH'),
          upiId: orderData.upiId || 'ananthukrishna250@oksbi',
          upiRef: orderData.upiRef || '',
          ...orderData,
        }

        // Avoid duplicate in case client retried with same ID
        const existingIdx = db.orders.findIndex((o) => o.id === newOrder.id)
        if (existingIdx !== -1) {
          db.orders[existingIdx] = { ...db.orders[existingIdx], ...newOrder }
        } else {
          db.orders.unshift(newOrder)
        }

        if (newOrder.orderType === 'dine_in' && newOrder.tableNumber) {
          db.tables = db.tables.map((t) =>
            t.id === newOrder.tableNumber
              ? {
                  ...t,
                  status: 'occupied',
                  customerName: newOrder.customerName || 'Dine-in Guest',
                  orderId: newOrder.id,
                  occupiedSinceMinutesAgo: 0,
                }
              : t
          )
        }

        saveData(db)

        // Instant Realtime Notification to POS Admin and all connected screens
        broadcastEvent('order_created', newOrder)
        broadcastEvent('tables_updated', db.tables)

        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newOrder))
      } catch (err) {
        console.error('Error in POST /api/orders:', err)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // PUT /api/orders/:id (Update order status or payment)
  if (req.method === 'PUT' && url.pathname.startsWith('/api/orders/')) {
    const orderId = url.pathname.replace('/api/orders/', '')
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const updates = JSON.parse(body)
        db.orders = db.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
        saveData(db)
        const updated = db.orders.find((o) => o.id === orderId)

        // Instant Realtime Notification
        broadcastEvent('order_updated', updated)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(updated))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // PUT /api/tables/:id (Update table state)
  if (req.method === 'PUT' && url.pathname.startsWith('/api/tables/')) {
    const tableId = url.pathname.replace('/api/tables/', '')
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const updates = JSON.parse(body)
        db.tables = db.tables.map((t) => (t.id === tableId ? { ...t, ...updates } : t))
        saveData(db)
        const updated = db.tables.find((t) => t.id === tableId)

        broadcastEvent('tables_updated', db.tables)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(updated))
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Endpoint not found' }))
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`☕ Bean & Bloom Kerala Cafe API running with SSE stream on http://localhost:${PORT}`)
})
