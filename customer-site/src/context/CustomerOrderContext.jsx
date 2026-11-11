import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const CustomerOrderContext = createContext(null)
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

export const DEFAULT_TABLES = [
  { id: 'T-1', name: 'Table 1', capacity: 2, section: 'Swaraj Round View', status: 'available' },
  { id: 'T-2', name: 'Table 2', capacity: 4, section: 'Temple Facing', status: 'available' },
  { id: 'T-3', name: 'Table 3', capacity: 2, section: 'Indoor AC Lounge', status: 'available' },
  { id: 'T-4', name: 'Table 4', capacity: 4, section: 'Indoor AC Lounge', status: 'available' },
  { id: 'T-5', name: 'Table 5', capacity: 2, section: 'Verandah Balcony', status: 'available' },
  { id: 'T-6', name: 'Table 6', capacity: 4, section: 'Courtyard Garden', status: 'available' },
]

export function CustomerOrderProvider({ children }) {
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

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('customer_orders')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [tables, setTables] = useState(DEFAULT_TABLES)
  const [activeOrderId, setActiveOrderId] = useState(() => {
    try {
      return localStorage.getItem('customer_active_order_id') || ''
    } catch {
      return ''
    }
  })

  const [trackerOpen, setTrackerOpen] = useState(false)
  const [billOrder, setBillOrder] = useState(null)
  const [serverOnline, setServerOnline] = useState(false)

  const sseRef = useRef(null)

  // Local storage sync
  useEffect(() => {
    try {
      localStorage.setItem('thrissur_shop_settings', JSON.stringify(shopSettings))
      localStorage.setItem('thrissur_menu_items', JSON.stringify(menuItems))
      localStorage.setItem('customer_orders', JSON.stringify(orders))
      if (activeOrderId) {
        localStorage.setItem('customer_active_order_id', activeOrderId)
      }
    } catch (e) {
      console.warn('Storage sync error', e)
    }
  }, [shopSettings, menuItems, orders, activeOrderId])

  // Sync with shared API if running
  const refreshFromBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/data`, { cache: 'no-store' })
      if (!res.ok) {
        setServerOnline(false)
        return
      }
      const data = await res.json()
      setServerOnline(true)

      if (data.shopSettings) setShopSettings(data.shopSettings)
      if (data.menuItems) setMenuItems(data.menuItems)
      if (data.tables) setTables(data.tables)

      if (data.orders) {
        setOrders((localOrders) => {
          const map = new Map(localOrders.map((o) => [o.id, o]))
          data.orders.forEach((serverOrder) => {
            if (map.has(serverOrder.id)) {
              map.set(serverOrder.id, { ...map.get(serverOrder.id), ...serverOrder })
            }
          })
          return Array.from(map.values())
        })
      }
    } catch {
      setServerOnline(false)
    }
  }, [])

  // Real-time SSE Connection
  useEffect(() => {
    refreshFromBackend()

    function connectSSE() {
      try {
        const es = new EventSource(`${API_BASE}/events`)
        sseRef.current = es

        es.onopen = () => {
          setServerOnline(true)
        }

        es.addEventListener('order_updated', (e) => {
          try {
            const updatedOrder = JSON.parse(e.data)
            setOrders((prev) =>
              prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
            )
          } catch {}
        })

        es.addEventListener('menu_updated', (e) => {
          try {
            const newMenu = JSON.parse(e.data)
            setMenuItems(newMenu)
          } catch {}
        })

        es.addEventListener('settings_updated', (e) => {
          try {
            const newSettings = JSON.parse(e.data)
            setShopSettings(newSettings)
          } catch {}
        })

        es.addEventListener('tables_updated', (e) => {
          try {
            const newTables = JSON.parse(e.data)
            setTables(newTables)
          } catch {}
        })

        es.onerror = () => {
          setServerOnline(false)
          es.close()
          // Reconnect after 3 seconds
          setTimeout(connectSSE, 3000)
        }
      } catch {
        setServerOnline(false)
      }
    }

    connectSSE()

    const timer = setInterval(refreshFromBackend, 2500)
    return () => {
      clearInterval(timer)
      if (sseRef.current) sseRef.current.close()
    }
  }, [refreshFromBackend])

  // Create order - Supports UPI & Pay on Counter
  const createOrder = async (orderPayload) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000)
    const tokenNum = Math.floor(10 + Math.random() * 89)

    const paymentMethod = orderPayload.paymentMethod || 'cash_on_counter'
    const isUpi = paymentMethod === 'upi'

    const newOrder = {
      id: `ORD-${nextNum}`,
      token: `#B-${tokenNum}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'received',
      orderSource: 'site_live',
      paymentMethod,
      paymentStatus: orderPayload.paymentStatus || (isUpi ? 'PAID' : 'PENDING_CASH'),
      upiId: orderPayload.upiId || shopSettings.upiId || 'ananthukrishna250@oksbi',
      upiRef: orderPayload.upiRef || '',
      ...orderPayload,
    }

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })
      if (res.ok) {
        const savedOrder = await res.json()
        setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)])
        setActiveOrderId(savedOrder.id)
        setServerOnline(true)
        return savedOrder
      }
    } catch {
      // Standalone mode / server temporary unreachable
    }

    setOrders((prev) => [newOrder, ...prev])
    setActiveOrderId(newOrder.id)
    return newOrder
  }

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0]

  return (
    <CustomerOrderContext.Provider
      value={{
        shopSettings,
        menuItems,
        orders,
        activeOrder,
        activeOrderId,
        setActiveOrderId,
        tables,
        createOrder,
        trackerOpen,
        setTrackerOpen,
        billOrder,
        setBillOrder,
        serverOnline,
        refreshFromBackend,
      }}
    >
      {children}
    </CustomerOrderContext.Provider>
  )
}

export function useCustomerOrder() {
  const ctx = useContext(CustomerOrderContext)
  if (!ctx) throw new Error('useCustomerOrder must be used within CustomerOrderProvider')
  return ctx
}
