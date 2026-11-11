import { createContext, useContext, useState, useEffect } from 'react'
import { playOrderChime, playReadyChime } from '../utils/audio'

const ShopContext = createContext(null)

const INITIAL_TABLES = [
  { id: 'T-1', name: 'Table 1', capacity: 2, section: 'Indoor Corner', status: 'occupied', guestCount: 2, customerName: 'Sarah M.', orderId: 'ORD-8921', occupiedSinceMinutesAgo: 38 },
  { id: 'T-2', name: 'Table 2', capacity: 4, section: 'Window View', status: 'occupied', guestCount: 3, customerName: 'David K.', orderId: 'ORD-8922', occupiedSinceMinutesAgo: 52 }, // Long stay alert!
  { id: 'T-3', name: 'Table 3', capacity: 2, section: 'Indoor Center', status: 'available', guestCount: 0, customerName: '', orderId: null },
  { id: 'T-4', name: 'Table 4', capacity: 4, section: 'Indoor Center', status: 'occupied', guestCount: 4, customerName: 'Alex & Team', orderId: 'ORD-8924', occupiedSinceMinutesAgo: 20 },
  { id: 'T-5', name: 'Table 5', capacity: 2, section: 'Window View', status: 'reserved', guestCount: 2, customerName: 'Emma Watson (2:30 PM)', orderId: null },
  { id: 'T-6', name: 'Table 6', capacity: 4, section: 'Garden Patio', status: 'available', guestCount: 0, customerName: '', orderId: null },
  { id: 'T-7', name: 'Table 7', capacity: 6, section: 'Garden Patio', status: 'occupied', guestCount: 5, customerName: 'Liam Chen', orderId: 'ORD-8925', occupiedSinceMinutesAgo: 14 },
  { id: 'T-8', name: 'Table 8', capacity: 2, section: 'Bar Counter', status: 'cleaning', guestCount: 0, customerName: '', orderId: null },
]

const INITIAL_ORDERS = [
  {
    id: 'ORD-8921',
    token: '#B-21',
    createdAt: new Date(Date.now() - 38 * 60000).toISOString(),
    customerName: 'Sarah M.',
    customerPhone: '+1 555-0192',
    orderType: 'dine_in',
    tableNumber: 'T-1',
    pickupTime: 'Immediate',
    items: [
      { id: 5, name: 'Classic Latte', price: 5.00, qty: 1, notes: 'Oat milk' },
      { id: 16, name: 'Butter Croissant', price: 3.50, qty: 1, notes: 'Warmed' },
    ],
    subtotal: 8.50,
    tax: 0.68,
    total: 9.18,
    paymentMethod: 'card',
    paymentStatus: 'PAID',
    orderStatus: 'completed',
    notes: 'Guest seated at T-1',
  },
  {
    id: 'ORD-8922',
    token: '#B-22',
    createdAt: new Date(Date.now() - 52 * 60000).toISOString(),
    customerName: 'David K.',
    customerPhone: '+1 555-0348',
    orderType: 'dine_in',
    tableNumber: 'T-2',
    pickupTime: 'Immediate',
    items: [
      { id: 1, name: 'Espresso', price: 3.50, qty: 2, notes: 'Double shot' },
      { id: 17, name: 'Cinnamon Roll', price: 4.00, qty: 1, notes: 'Extra glaze' },
    ],
    subtotal: 11.00,
    tax: 0.88,
    total: 11.88,
    paymentMethod: 'cash',
    paymentStatus: 'PAID',
    orderStatus: 'completed',
    notes: 'Working on laptop',
  },
  {
    id: 'ORD-8927',
    token: '#B-27',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
    customerName: 'Jessica Alba',
    customerPhone: '+1 555-4921',
    orderType: 'takeaway',
    tableNumber: null,
    pickupTime: '10–15 mins',
    items: [
      { id: 6, name: 'Caramel Bloom Latte', price: 5.50, qty: 2, notes: 'Less ice' },
      { id: 10, name: 'Iced Brown Sugar Oat', price: 6.00, qty: 1, notes: 'Extra cinnamon' },
    ],
    subtotal: 17.00,
    tax: 1.36,
    total: 18.36,
    paymentMethod: 'cash', // Cash on Take Time!
    paymentStatus: 'PENDING_CASH',
    orderStatus: 'preparing',
    notes: 'Takeaway - Call when ready. Pay cash at counter.',
  },
  {
    id: 'ORD-8928',
    token: '#B-28',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    customerName: 'Marcus Vance',
    customerPhone: '+1 555-8821',
    orderType: 'takeaway',
    tableNumber: null,
    pickupTime: '15 mins',
    items: [
      { id: 9, name: 'Cold Brew', price: 5.00, qty: 1, notes: 'Black' },
      { id: 18, name: 'Chocolate Muffin', price: 3.75, qty: 2, notes: '' },
    ],
    subtotal: 12.50,
    tax: 1.00,
    total: 13.50,
    paymentMethod: 'upi',
    paymentStatus: 'PAID',
    orderStatus: 'received',
    notes: 'Online order placed via mobile app',
  },
]

export function ShopProvider({ children }) {
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('beanbloom_tables')
      return saved ? JSON.parse(saved) : INITIAL_TABLES
    } catch {
      return INITIAL_TABLES
    }
  })

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('beanbloom_orders')
      return saved ? JSON.parse(saved) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  const [activeCustomerOrderId, setActiveCustomerOrderId] = useState(() => {
    try {
      return localStorage.getItem('beanbloom_active_order') || 'ORD-8927'
    } catch {
      return 'ORD-8927'
    }
  })

  const [adminOpen, setAdminOpen] = useState(false)
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [activeBillOrder, setActiveBillOrder] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('beanbloom_tables', JSON.stringify(tables))
    } catch (e) {
      console.warn('Storage error', e)
    }
  }, [tables])

  useEffect(() => {
    try {
      localStorage.setItem('beanbloom_orders', JSON.stringify(orders))
    } catch (e) {
      console.warn('Storage error', e)
    }
  }, [orders])

  useEffect(() => {
    try {
      if (activeCustomerOrderId) {
        localStorage.setItem('beanbloom_active_order', activeCustomerOrderId)
      }
    } catch (e) {
      console.warn('Storage error', e)
    }
  }, [activeCustomerOrderId])

  // Create new order
  const createOrder = (orderData) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000)
    const tokenNum = Math.floor(10 + Math.random() * 89)
    const newOrder = {
      id: `ORD-${nextNum}`,
      token: `#B-${tokenNum}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'received',
      ...orderData,
    }

    setOrders((prev) => [newOrder, ...prev])
    setActiveCustomerOrderId(newOrder.id)

    // If dine in and table specified, update table status
    if (newOrder.orderType === 'dine_in' && newOrder.tableNumber) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === newOrder.tableNumber || t.name.toLowerCase() === newOrder.tableNumber.toLowerCase()
            ? {
                ...t,
                status: 'occupied',
                customerName: newOrder.customerName || 'Dine-in Guest',
                orderId: newOrder.id,
                guestCount: t.guestCount || 2,
                occupiedSinceMinutesAgo: 0,
              }
            : t
        )
      )
    }

    if (soundEnabled) {
      playOrderChime()
    }

    return newOrder
  }

  // Update order status (received -> preparing -> ready -> completed)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = { ...order, orderStatus: newStatus }
          if (newStatus === 'completed' && order.paymentMethod === 'cash') {
            updated.paymentStatus = 'PAID'
          }
          return updated
        }
        return order
      })
    )

    if (soundEnabled && (newStatus === 'ready' || newStatus === 'received')) {
      playReadyChime()
    }
  }

  // Mark cash received
  const markPaymentReceived = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentStatus: 'PAID' } : order
      )
    )
  }

  // Update table status
  const updateTableStatus = (tableId, status, extra = {}) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status,
              occupiedSinceMinutesAgo: status === 'occupied' ? 0 : null,
              orderId: status === 'available' ? null : t.orderId,
              customerName: status === 'available' ? '' : t.customerName,
              ...extra,
            }
          : t
      )
    )
  }

  // Free table
  const clearTable = (tableId) => {
    updateTableStatus(tableId, 'available', { guestCount: 0, customerName: '', orderId: null })
  }

  // Active customer order helper
  const customerOrder = orders.find((o) => o.id === activeCustomerOrderId) || orders[0]

  // Calculated metrics
  const totalTables = tables.length
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length
  const reservedTables = tables.filter((t) => t.status === 'reserved').length
  const availableTables = tables.filter((t) => t.status === 'available').length
  const cleaningTables = tables.filter((t) => t.status === 'cleaning').length
  const occupancyPercentage = Math.round((occupiedTables / totalTables) * 100)

  // Tables with long-stay alert (> 45 min)
  const longStayTables = tables.filter(
    (t) => t.status === 'occupied' && (t.occupiedSinceMinutesAgo || 0) >= 45
  )

  const isHighOccupancyAlert = occupancyPercentage >= 75

  return (
    <ShopContext.Provider
      value={{
        tables,
        orders,
        createOrder,
        updateOrderStatus,
        markPaymentReceived,
        updateTableStatus,
        clearTable,
        // Customer active order
        activeCustomerOrderId,
        setActiveCustomerOrderId,
        customerOrder,
        // Metrics & Alerts
        totalTables,
        occupiedTables,
        reservedTables,
        availableTables,
        cleaningTables,
        occupancyPercentage,
        longStayTables,
        isHighOccupancyAlert,
        // Modals & Nav
        adminOpen,
        setAdminOpen,
        trackerOpen,
        setTrackerOpen,
        activeBillOrder,
        setActiveBillOrder,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}
