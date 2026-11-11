import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { playOrderChime, playReadyChime } from '../utils/audio'

const AdminContext = createContext(null)
const API_BASE = 'http://localhost:4000/api'

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

export const INITIAL_MENU_ITEMS = [
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
    desc: 'Rich Christmas-style plum cake with soaked raisins, tutty fruity, and spices',
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

export const INITIAL_TABLES = [
  { id: 'T-1', name: 'Table 1', capacity: 2, section: 'Swaraj Round View', status: 'occupied', guestCount: 2, customerName: 'Rahul Menon', orderId: 'ORD-8921', occupiedSinceMinutesAgo: 38 },
  { id: 'T-2', name: 'Table 2', capacity: 4, section: 'Temple Facing', status: 'occupied', guestCount: 3, customerName: 'Anjali Nair', orderId: 'ORD-8922', occupiedSinceMinutesAgo: 50 },
  { id: 'T-3', name: 'Table 3', capacity: 2, section: 'Indoor AC Lounge', status: 'available', guestCount: 0, customerName: '', orderId: null },
  { id: 'T-4', name: 'Table 4', capacity: 4, section: 'Indoor AC Lounge', status: 'occupied', guestCount: 4, customerName: 'Vishnu & Friends', orderId: 'ORD-8924', occupiedSinceMinutesAgo: 20 },
  { id: 'T-5', name: 'Table 5', capacity: 2, section: 'Verandah Balcony', status: 'reserved', guestCount: 2, customerName: 'Dr. Joseph (3:00 PM)', orderId: null },
  { id: 'T-6', name: 'Table 6', capacity: 4, section: 'Courtyard Garden', status: 'available', guestCount: 0, customerName: '', orderId: null },
  { id: 'T-7', name: 'Table 7', capacity: 6, section: 'Courtyard Garden', status: 'occupied', guestCount: 5, customerName: 'Suresh Kumar', orderId: 'ORD-8925', occupiedSinceMinutesAgo: 14 },
  { id: 'T-8', name: 'Table 8', capacity: 2, section: 'Traditional Kaapi Counter', status: 'cleaning', guestCount: 0, customerName: '', orderId: null },
]

export const INITIAL_ORDERS = [
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

export function AdminProvider({ children }) {
  const [shopSettings, setShopSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('thrissur_shop_settings')
      return saved ? JSON.parse(saved) : DEFAULT_SHOP_SETTINGS
    } catch {
      return DEFAULT_SHOP_SETTINGS
    }
  })

  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('thrissur_menu_items')
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS
    } catch {
      return INITIAL_MENU_ITEMS
    }
  })

  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_tables')
      return saved ? JSON.parse(saved) : INITIAL_TABLES
    } catch {
      return INITIAL_TABLES
    }
  })

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_orders')
      return saved ? JSON.parse(saved) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  const [activeBillOrder, setActiveBillOrder] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [serverConnected, setServerConnected] = useState(false)
  const [incomingAlertOrder, setIncomingAlertOrder] = useState(null)
  const [lastSyncTime, setLastSyncTime] = useState(Date.now())

  // ── Balance / Cash Drawer State ──
  const [openingBalance, setOpeningBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_opening_balance')
      return saved ? Number(saved) : 2000
    } catch {
      return 2000
    }
  })

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_expenses')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [actualDrawerCount, setActualDrawerCount] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_actual_drawer')
      return saved ? Number(saved) : null
    } catch {
      return null
    }
  })

  const [shiftStartedAt, setShiftStartedAt] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_shift_started')
      return saved || new Date().toISOString()
    } catch {
      return new Date().toISOString()
    }
  })

  const sseRef = useRef(null)

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thrissur_shop_settings', JSON.stringify(shopSettings))
      localStorage.setItem('thrissur_menu_items', JSON.stringify(menuItems))
      localStorage.setItem('pos_tables', JSON.stringify(tables))
      localStorage.setItem('pos_orders', JSON.stringify(orders))
      localStorage.setItem('pos_opening_balance', String(openingBalance))
      localStorage.setItem('pos_expenses', JSON.stringify(expenses))
      if (actualDrawerCount !== null) localStorage.setItem('pos_actual_drawer', String(actualDrawerCount))
      localStorage.setItem('pos_shift_started', shiftStartedAt)
    } catch (e) {
      console.warn('Storage sync error', e)
    }
  }, [shopSettings, menuItems, tables, orders, openingBalance, expenses, actualDrawerCount, shiftStartedAt])

  // Sync with shared API if running
  const refreshFromServer = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/data`, { cache: 'no-store' })
      if (!res.ok) {
        setServerConnected(false)
        return
      }
      const data = await res.json()
      setServerConnected(true)
      setLastSyncTime(Date.now())

      if (data.shopSettings) setShopSettings(data.shopSettings)
      if (data.menuItems) setMenuItems(data.menuItems)
      if (data.orders) setOrders(data.orders)
      if (data.tables) setTables(data.tables)
    } catch {
      setServerConnected(false)
    }
  }, [])

  // Real-time Server-Sent Events (SSE) Stream
  useEffect(() => {
    refreshFromServer()

    function connectSSE() {
      try {
        const es = new EventSource(`${API_BASE}/events`)
        sseRef.current = es

        es.onopen = () => {
          setServerConnected(true)
          setLastSyncTime(Date.now())
        }

        es.addEventListener('order_created', (e) => {
          try {
            const newOrder = JSON.parse(e.data)
            setOrders((prev) => {
              // Avoid duplicates
              const exists = prev.some((o) => o.id === newOrder.id)
              if (exists) {
                return prev.map((o) => (o.id === newOrder.id ? newOrder : o))
              }
              return [newOrder, ...prev]
            })

            // Trigger notification
            if (soundEnabled) {
              playOrderChime()
            }
            setIncomingAlertOrder(newOrder)
            setLastSyncTime(Date.now())
          } catch (err) {
            console.error('Failed to parse incoming order:', err)
          }
        })

        es.addEventListener('order_updated', (e) => {
          try {
            const updated = JSON.parse(e.data)
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
            )
            setLastSyncTime(Date.now())
          } catch {}
        })

        es.addEventListener('tables_updated', (e) => {
          try {
            const updatedTables = JSON.parse(e.data)
            setTables(updatedTables)
          } catch {}
        })

        es.addEventListener('menu_updated', (e) => {
          try {
            const updatedMenu = JSON.parse(e.data)
            setMenuItems(updatedMenu)
          } catch {}
        })

        es.addEventListener('settings_updated', (e) => {
          try {
            const updatedSettings = JSON.parse(e.data)
            setShopSettings(updatedSettings)
          } catch {}
        })

        es.onerror = () => {
          setServerConnected(false)
          es.close()
          setTimeout(connectSSE, 3000)
        }
      } catch {
        setServerConnected(false)
      }
    }

    connectSSE()

    const interval = setInterval(refreshFromServer, 2500)
    return () => {
      clearInterval(interval)
      if (sseRef.current) sseRef.current.close()
    }
  }, [refreshFromServer, soundEnabled])

  // Update shop settings right from the admin dashboard window
  const updateShopSettings = async (newSettings) => {
    setShopSettings(newSettings)
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
    } catch {
      // Standalone
    }
  }

  // Add new menu item (price strictly ₹20 to ₹200)
  const addMenuItem = async (itemData) => {
    const validatedPrice = Math.max(20, Math.min(200, Number(itemData.price) || 50))
    const newItem = {
      id: Date.now(),
      inStock: true,
      ...itemData,
      price: validatedPrice,
    }

    setMenuItems((prev) => [newItem, ...prev])

    try {
      await fetch(`${API_BASE}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
    } catch {
      // Standalone
    }
    return newItem
  }

  // Update existing menu item or toggle sold-out
  const updateMenuItem = async (id, updates) => {
    if (updates.price) {
      updates.price = Math.max(20, Math.min(200, Number(updates.price)))
    }

    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))

    try {
      await fetch(`${API_BASE}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch {
      // Standalone
    }
  }

  // Toggle sold out
  const toggleItemStock = async (id) => {
    const item = menuItems.find((i) => i.id === id)
    if (!item) return
    const newStock = !item.inStock
    updateMenuItem(id, { inStock: newStock })
  }

  // Delete menu item
  const deleteMenuItem = async (id) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id))
    try {
      await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' })
    } catch {
      // Standalone
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, orderStatus: newStatus }
          if (newStatus === 'completed' && o.paymentMethod === 'cash_on_counter') {
            updated.paymentStatus = 'PAID'
          }
          return updated
        }
        return o
      })
    )

    if (soundEnabled && newStatus === 'ready') playReadyChime()

    try {
      await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          ...(newStatus === 'completed' ? { paymentStatus: 'PAID' } : {}),
        }),
      })
    } catch {
      // Standalone
    }
  }

  // Mark cash received or mark UPI paid
  const markPaymentPaid = async (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: 'PAID' } : o))
    )

    try {
      await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' }),
      })
    } catch {
      // Standalone
    }
  }

  const markCashReceived = markPaymentPaid

  // Table status
  const updateTableStatus = async (tableId, status, extra = {}) => {
    const payload = {
      status,
      occupiedSinceMinutesAgo: status === 'occupied' ? 0 : null,
      orderId: status === 'available' ? null : undefined,
      customerName: status === 'available' ? '' : undefined,
      ...extra,
    }

    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, ...payload } : t)))

    try {
      await fetch(`${API_BASE}/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // Standalone
    }
  }

  const clearTable = (tableId) => {
    updateTableStatus(tableId, 'available', { guestCount: 0, customerName: '', orderId: null })
  }

  // Counter POS Order Punch
  const punchPosOrder = async (orderData) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000)
    const tokenNum = Math.floor(10 + Math.random() * 89)

    const paymentMethod = orderData.paymentMethod || 'cash_on_counter'
    const isUpi = paymentMethod === 'upi'

    const newOrder = {
      id: `ORD-${nextNum}`,
      token: `#B-${tokenNum}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'received',
      orderSource: 'counter_pos',
      paymentMethod,
      paymentStatus: 'PAID', // In-person register order is immediately settled
      upiId: isUpi ? (shopSettings.upiId || 'ananthukrishna250@oksbi') : null,
      ...orderData,
    }

    setOrders((prev) => [newOrder, ...prev])
    if (soundEnabled) playOrderChime()

    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })
    } catch {
      // Standalone
    }

    return newOrder
  }

  // Calculations
  const totalTables = tables.length
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length
  const availableTables = tables.filter((t) => t.status === 'available').length
  const reservedTables = tables.filter((t) => t.status === 'reserved').length
  const occupancyPercentage = Math.round((occupiedTables / totalTables) * 100)

  const isHighOccupancyAlert = occupancyPercentage >= 75
  const longStayTables = tables.filter(
    (t) => t.status === 'occupied' && (t.occupiedSinceMinutesAgo || 0) >= 45
  )

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const upiSales = orders
    .filter((o) => o.paymentMethod === 'upi' && o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.total || 0), 0)
  const cashSales = orders
    .filter((o) => o.paymentMethod !== 'upi' && o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingCashTotal = orders
    .filter((o) => o.paymentStatus === 'PENDING_CASH')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled'
  ).length

  // ── Balance Sheet Derived Values ──
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const cashInFromOrders = cashSales // Cash actually collected
  const expectedDrawer = openingBalance + cashInFromOrders - totalExpenses
  const drawerDifference = actualDrawerCount !== null ? actualDrawerCount - expectedDrawer : null

  // ── Balance Sheet Actions ──
  const addExpense = (expense) => {
    const newExpense = {
      id: `EXP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...expense,
    }
    setExpenses((prev) => [newExpense, ...prev])
  }

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const updateOpeningBalance = (amount) => {
    setOpeningBalance(Math.max(0, Number(amount) || 0))
  }

  const updateActualDrawerCount = (amount) => {
    setActualDrawerCount(amount === null || amount === '' ? null : Math.max(0, Number(amount) || 0))
  }

  const resetShift = () => {
    setOpeningBalance(2000)
    setExpenses([])
    setActualDrawerCount(null)
    setShiftStartedAt(new Date().toISOString())
    try {
      localStorage.removeItem('pos_opening_balance')
      localStorage.removeItem('pos_expenses')
      localStorage.removeItem('pos_actual_drawer')
      localStorage.removeItem('pos_shift_started')
    } catch {}
  }

  return (
    <AdminContext.Provider
      value={{
        shopSettings,
        updateShopSettings,
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleItemStock,
        deleteMenuItem,
        orders,
        tables,
        updateOrderStatus,
        markCashReceived,
        markPaymentPaid,
        updateTableStatus,
        clearTable,
        punchPosOrder,
        activeBillOrder,
        setActiveBillOrder,
        soundEnabled,
        setSoundEnabled,
        serverConnected,
        refreshFromServer,
        incomingAlertOrder,
        setIncomingAlertOrder,
        lastSyncTime,
        totalTables,
        occupiedTables,
        availableTables,
        reservedTables,
        occupancyPercentage,
        isHighOccupancyAlert,
        longStayTables,
        totalSales,
        upiSales,
        cashSales,
        pendingCashTotal,
        activeOrdersCount,
        // Balance Sheet
        openingBalance,
        updateOpeningBalance,
        expenses,
        addExpense,
        removeExpense,
        totalExpenses,
        cashInFromOrders,
        expectedDrawer,
        actualDrawerCount,
        updateActualDrawerCount,
        drawerDifference,
        shiftStartedAt,
        resetShift,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
