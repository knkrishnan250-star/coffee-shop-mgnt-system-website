import { useState, useEffect } from 'react'
import { useShop } from '../context/ShopContext'

const MENU_SHORTCUTS = [
  { id: 1, name: 'Espresso', price: 3.50, category: 'Espresso' },
  { id: 2, name: 'Americano', price: 4.00, category: 'Espresso' },
  { id: 5, name: 'Classic Latte', price: 5.00, category: 'Latte' },
  { id: 6, name: 'Caramel Bloom Latte', price: 5.50, category: 'Latte' },
  { id: 9, name: 'Cold Brew', price: 5.00, category: 'Cold Brew' },
  { id: 10, name: 'Iced Brown Sugar Oat', price: 6.00, category: 'Cold Brew' },
  { id: 16, name: 'Butter Croissant', price: 3.50, category: 'Pastries' },
  { id: 17, name: 'Cinnamon Roll', price: 4.00, category: 'Pastries' },
]

export default function AdminBase({ isOpen, onClose }) {
  const {
    orders,
    tables,
    updateOrderStatus,
    markPaymentReceived,
    updateTableStatus,
    clearTable,
    createOrder,
    totalTables,
    occupiedTables,
    reservedTables,
    availableTables,
    occupancyPercentage,
    longStayTables,
    isHighOccupancyAlert,
    setActiveBillOrder,
    soundEnabled,
    setSoundEnabled,
  } = useShop()

  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'tables' | 'pos' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('active') // 'active' | 'received' | 'preparing' | 'ready' | 'completed' | 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(() => new Date())

  // Quick POS State
  const [posCart, setPosCart] = useState([])
  const [posOrderType, setPosOrderType] = useState('takeaway')
  const [posTable, setPosTable] = useState('T-3')
  const [posCustomerName, setPosCustomerName] = useState('')
  const [posPaymentMethod, setPosPaymentMethod] = useState('cash')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!isOpen) return null

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    if (orderFilter === 'active') {
      return order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled'
    }
    if (orderFilter === 'all') return true
    return order.orderStatus === orderFilter
  })

  // Quick POS handlers
  const addPosItem = (item) => {
    setPosCart((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removePosItem = (id) => {
    setPosCart((prev) => prev.filter((i) => i.id !== id))
  }

  const handlePosSubmit = () => {
    if (posCart.length === 0) return

    const subtotal = posCart.reduce((sum, i) => sum + i.price * i.qty, 0)
    const tax = subtotal * 0.08
    const total = subtotal + tax

    const newOrder = createOrder({
      orderType: posOrderType,
      tableNumber: posOrderType === 'dine_in' ? posTable : null,
      customerName: posCustomerName.trim() || 'Counter Guest',
      customerPhone: 'Walk-in',
      items: posCart,
      subtotal,
      tax,
      total,
      paymentMethod: posPaymentMethod,
      paymentStatus: posPaymentMethod === 'cash' ? 'PAID' : 'PAID', // In POS counter cash is handed immediately
      notes: 'Counter POS terminal order',
    })

    // Reset POS cart
    setPosCart([])
    setPosCustomerName('')
    setActiveBillOrder(newOrder)
    setActiveTab('orders')
  }

  // Analytics totals
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const cashOrders = orders.filter((o) => o.paymentMethod === 'cash')
  const onlineOrders = orders.filter((o) => o.paymentMethod !== 'cash')

  return (
    <div className="fixed inset-0 z-50 bg-[#1f1610] text-stone-100 flex flex-col font-sans overflow-hidden">
      {/* Top Admin System Bar */}
      <header className="h-16 px-6 bg-[#160d07] border-b border-stone-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-xl">
            🖥️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-white uppercase font-mono">
                Cafe Computer System • Admin Base
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                TERMINAL 01 ONLINE
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Bean &amp; Bloom Roasters • POS, Kitchen Display &amp; Floor Management
            </p>
          </div>
        </div>

        {/* Live system metrics in header */}
        <div className="hidden lg:flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-800">
            <span className="text-stone-400">Total Sales:</span>
            <span className="font-mono font-bold text-amber-400">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-800">
            <span className="text-stone-400">Tables Occupied:</span>
            <span
              className={`font-mono font-bold ${
                isHighOccupancyAlert ? 'text-rose-400 font-black animate-pulse' : 'text-emerald-400'
              }`}
            >
              {occupiedTables}/{totalTables} ({occupancyPercentage}%)
            </span>
          </div>

          <div className="font-mono text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
            🕒 {currentTime.toLocaleTimeString()}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition border ${
              soundEnabled
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
            title="Toggle notification chime"
          >
            {soundEnabled ? '🔔 Chime On' : '🔕 Chime Off'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-2 border border-stone-700 cursor-pointer"
          >
            <span>🚪</span> Exit Admin View
          </button>
        </div>
      </header>

      {/* Occupancy Alert Banner (triggers when occupancy is high or long stay tables detected) */}
      {(isHighOccupancyAlert || longStayTables.length > 0) && (
        <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 px-6 py-2.5 border-b border-rose-800/60 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <span className="font-bold text-rose-300 uppercase tracking-wide mr-2">
                Floor Occupation Alert:
              </span>
              {isHighOccupancyAlert && (
                <span className="text-stone-200 mr-3">
                  Cafe capacity is at <strong>{occupancyPercentage}%</strong> ({occupiedTables} of{' '}
                  {totalTables} tables occupied).
                </span>
              )}
              {longStayTables.length > 0 && (
                <span className="text-amber-200">
                  Long-stay alert on{' '}
                  <strong>{longStayTables.map((t) => t.name).join(', ')}</strong> (&gt;45 mins).
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tables')}
            className="px-3 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-100 text-[11px] font-bold uppercase transition"
          >
            Manage Tables
          </button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="px-6 bg-[#180f08] border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-400 bg-stone-900/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>📋</span>
            <span>Live Orders / KDS</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
              {orders.filter((o) => o.orderStatus !== 'completed').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'tables'
                ? 'border-amber-500 text-amber-400 bg-stone-900/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>🪑</span>
            <span>Table Occupation System</span>
            {isHighOccupancyAlert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'pos'
                ? 'border-amber-500 text-amber-400 bg-stone-900/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>⚡</span>
            <span>Walk-in Counter POS</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'analytics'
                ? 'border-amber-500 text-amber-400 bg-stone-900/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>📊</span>
            <span>Sales &amp; Shift Report</span>
          </button>
        </div>

        {/* Global Quick Search */}
        {activeTab === 'orders' && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search Token, ID, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 px-3 py-1.5 pl-8 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500">
              🔍
            </span>
          </div>
        )}
      </div>

      {/* Main Tab View Container */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#1a120c]">
        {/* ========================================================== */}
        {/* TAB 1: LIVE ORDERS / KITCHEN DISPLAY SYSTEM */}
        {/* ========================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 mr-1">Filter:</span>
                {[
                  { key: 'active', label: 'All Active' },
                  { key: 'received', label: 'Received (New)' },
                  { key: 'preparing', label: 'Brewing' },
                  { key: 'ready', label: 'Ready for Pickup' },
                  { key: 'completed', label: 'Completed' },
                  { key: 'all', label: 'All Orders' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setOrderFilter(f.key)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                      orderFilter === f.key
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-stone-400">
                Showing <strong className="text-stone-200">{filteredOrders.length}</strong> orders
              </div>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-stone-900/30 rounded-3xl border border-stone-800">
                <span className="text-4xl block mb-2">☕</span>
                <p className="text-stone-300 font-semibold">No orders in this view</p>
                <p className="text-stone-500 text-xs mt-1">
                  Place an order from customer menu or switch filter above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const isCash = order.paymentMethod === 'cash'
                  const isPaid = order.paymentStatus === 'PAID'
                  const isDineIn = order.orderType === 'dine_in'

                  return (
                    <div
                      key={order.id}
                      className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                        order.orderStatus === 'received'
                          ? 'bg-[#29170e] border-amber-600/70 shadow-lg shadow-amber-950/40'
                          : order.orderStatus === 'preparing'
                          ? 'bg-[#1e1b15] border-amber-700/40'
                          : order.orderStatus === 'ready'
                          ? 'bg-[#0f241a] border-emerald-600/50'
                          : 'bg-stone-900/60 border-stone-800 opacity-80'
                      }`}
                    >
                      <div>
                        {/* Top Token & Status Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl text-base font-black bg-stone-950 text-amber-300 font-mono border border-stone-800">
                              {order.token}
                            </span>
                            <div>
                              <span className="font-mono text-xs font-semibold text-stone-400 block">
                                {order.id}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                order.orderStatus === 'received'
                                  ? 'bg-amber-500 text-stone-950 animate-pulse'
                                  : order.orderStatus === 'preparing'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : order.orderStatus === 'ready'
                                  ? 'bg-emerald-500 text-stone-950 font-bold'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Type */}
                        <div className="p-3 rounded-2xl bg-stone-950/40 border border-stone-800/80 mb-3 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-stone-200">
                              👤 {order.customerName || 'Customer'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isDineIn
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-purple-950 text-purple-300 border border-purple-800'
                              }`}
                            >
                              {isDineIn ? `Dine-In • Table ${order.tableNumber}` : 'Takeaway (Pick-up)'}
                            </span>
                          </div>
                          {order.customerPhone && (
                            <p className="text-[11px] text-stone-500">📞 {order.customerPhone}</p>
                          )}
                          {order.notes && (
                            <p className="text-[11px] text-amber-300/80 italic mt-1">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Item list */}
                        <div className="space-y-1.5 py-2 mb-3 border-y border-stone-800/80 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-stone-300">
                              <span className="font-medium">
                                <span className="font-bold text-amber-400 mr-2 font-mono">
                                  {item.qty}x
                                </span>
                                {item.name}
                                {item.notes && (
                                  <span className="block text-[10px] text-stone-500 pl-5 italic">
                                    {item.notes}
                                  </span>
                                )}
                              </span>
                              <span className="font-mono text-stone-400">
                                ${(item.price * item.qty).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Payment alert & summary */}
                        <div className="flex items-center justify-between py-1 mb-4 text-xs">
                          <span className="text-stone-400">Total:</span>
                          <span className="font-mono font-bold text-base text-stone-100">
                            ${order.total?.toFixed(2)}
                          </span>
                        </div>

                        {/* Cash on take time warning pill */}
                        {isCash && !isPaid ? (
                          <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-600/60 mb-4 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-amber-300 block">
                                💵 Cash on Pickup Due
                              </span>
                              <span className="text-[10px] text-amber-200/80">
                                Collect ${order.total?.toFixed(2)} at counter
                              </span>
                            </div>
                            <button
                              onClick={() => markPaymentReceived(order.id)}
                              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition cursor-pointer"
                            >
                              Receive Cash
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-4">
                            <span>✓</span>
                            <span>Paid via {order.paymentMethod?.toUpperCase()}</span>
                          </div>
                        )}
                      </div>

                      {/* Barista Action Buttons */}
                      <div className="pt-2 border-t border-stone-800 flex flex-wrap gap-2">
                        {order.orderStatus === 'received' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>☕</span> Start Brewing
                          </button>
                        )}

                        {order.orderStatus === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>🔔</span> Mark Ready
                          </button>
                        )}

                        {order.orderStatus === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 py-2 px-3 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>✨</span> Complete &amp; Hand Over
                          </button>
                        )}

                        {order.orderStatus === 'completed' && (
                          <span className="flex-1 py-2 text-center text-xs text-stone-500 italic">
                            Order closed
                          </span>
                        )}

                        <button
                          onClick={() => setActiveBillOrder(order)}
                          className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs border border-stone-700 transition flex items-center gap-1 cursor-pointer"
                          title="Print Receipt"
                        >
                          <span>🧾</span> Bill
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: TABLE OCCUPATION SYSTEM & ALERT */}
        {/* ========================================================== */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            {/* Top Table Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-xs text-stone-400 block mb-1">Total Tables</span>
                <span className="text-2xl font-black font-mono text-stone-100">{totalTables}</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60">
                <span className="text-xs text-rose-300 block mb-1">Occupied (Seated)</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-rose-300">
                    {occupiedTables}
                  </span>
                  <span className="text-xs font-bold text-rose-400">
                    {occupancyPercentage}% Cap
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60">
                <span className="text-xs text-emerald-300 block mb-1">Available (Free)</span>
                <span className="text-2xl font-black font-mono text-emerald-300">
                  {availableTables}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-900/60">
                <span className="text-xs text-amber-300 block mb-1">Reserved</span>
                <span className="text-2xl font-black font-mono text-amber-300">
                  {reservedTables}
                </span>
              </div>
            </div>

            {/* Occupancy Alert Notification Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-[#22160d] border border-amber-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📢</span>
                  <h3 className="font-bold text-stone-100 text-sm">
                    Automated Floor &amp; Table Occupation Monitoring
                  </h3>
                </div>
                <p className="text-xs text-stone-400">
                  The system tracks seating duration and triggers automated alerts when tables
                  exceed 45-minute stays or cafe reaches 75% peak capacity.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    isHighOccupancyAlert
                      ? 'bg-rose-500 text-stone-950 animate-bounce'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isHighOccupancyAlert
                    ? '⚠️ PEAK OCCUPANCY REACHED'
                    : '✓ SEATING NORMAL'}
                </span>
              </div>
            </div>

            {/* Interactive Table Layout Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-stone-200 text-sm">
                  Floor Seating Map &amp; Table Controls
                </h3>
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Cleaning
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tables.map((table) => {
                  const isLongStay =
                    table.status === 'occupied' && (table.occupiedSinceMinutesAgo || 0) >= 45

                  return (
                    <div
                      key={table.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                        table.status === 'occupied'
                          ? isLongStay
                            ? 'bg-gradient-to-br from-rose-950/80 to-stone-900 border-rose-600 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/40'
                            : 'bg-rose-950/30 border-rose-800/60'
                          : table.status === 'available'
                          ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60'
                          : table.status === 'reserved'
                          ? 'bg-amber-950/20 border-amber-800/40'
                          : 'bg-blue-950/20 border-blue-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-lg font-mono text-stone-100">
                            {table.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              table.status === 'occupied'
                                ? 'bg-rose-500 text-stone-950'
                                : table.status === 'available'
                                ? 'bg-emerald-500 text-stone-950'
                                : table.status === 'reserved'
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-blue-500 text-stone-950'
                            }`}
                          >
                            {table.status}
                          </span>
                        </div>

                        <p className="text-xs text-stone-400 mb-3">
                          {table.section} • {table.capacity} Seats
                        </p>

                        {/* Occupant details */}
                        {table.status === 'occupied' && (
                          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs mb-3 space-y-1">
                            <p className="font-semibold text-stone-200">
                              👤 {table.customerName || 'Seated Guests'}
                            </p>
                            <div className="flex justify-between text-stone-400 text-[11px]">
                              <span>Party of {table.guestCount || 2}</span>
                              <span
                                className={`font-mono font-bold ${
                                  isLongStay ? 'text-rose-400 animate-pulse' : 'text-stone-300'
                                }`}
                              >
                                ⏱️ {table.occupiedSinceMinutesAgo || 15}m seated
                              </span>
                            </div>
                            {isLongStay && (
                              <p className="text-[10px] text-rose-300 font-bold pt-1 border-t border-rose-900/60">
                                ⚠️ Table occupied &gt;45m alert!
                              </p>
                            )}
                          </div>
                        )}

                        {table.status === 'reserved' && (
                          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs mb-3">
                            <span className="text-amber-200 font-medium">
                              {table.customerName || 'Reservation pending'}
                            </span>
                          </div>
                        )}

                        {table.status === 'cleaning' && (
                          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs mb-3">
                            <span className="text-blue-200 font-medium">
                              Sanitizing &amp; resetting table...
                            </span>
                          </div>
                        )}

                        {table.status === 'available' && (
                          <div className="p-2.5 rounded-xl bg-stone-950/30 text-xs mb-3 text-stone-500">
                            Ready for walk-in or dine-in order
                          </div>
                        )}
                      </div>

                      {/* Quick Status Control Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-stone-800/80">
                        {table.status !== 'occupied' ? (
                          <button
                            onClick={() =>
                              updateTableStatus(table.id, 'occupied', {
                                customerName: 'Walk-in Guest',
                                guestCount: table.capacity,
                              })
                            }
                            className="py-1.5 px-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold transition"
                          >
                            Mark Seated
                          </button>
                        ) : (
                          <button
                            onClick={() => updateTableStatus(table.id, 'cleaning')}
                            className="py-1.5 px-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold transition"
                          >
                            Needs Clean
                          </button>
                        )}

                        {table.status === 'cleaning' ? (
                          <button
                            onClick={() => clearTable(table.id)}
                            className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold transition"
                          >
                            Mark Ready
                          </button>
                        ) : (
                          <button
                            onClick={() => clearTable(table.id)}
                            className="py-1.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
                          >
                            Free Table
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: WALK-IN / COUNTER POS ORDERING */}
        {/* ========================================================== */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Menu Selection */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="font-bold text-stone-200 text-sm">
                  Quick Barista POS Keypad (Tap to Add)
                </h3>
                <span className="text-xs text-stone-400">Direct order punch</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MENU_SHORTCUTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addPosItem(item)}
                    className="p-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition group cursor-pointer"
                  >
                    <span className="text-xs text-amber-500 font-mono block mb-1 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <p className="font-bold text-sm text-stone-200 group-hover:text-amber-300">
                      {item.name}
                    </p>
                    <p className="font-mono text-xs text-stone-400 mt-2 font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: POS Register Ticket / Checkout */}
            <div className="p-5 rounded-3xl bg-[#140c06] border border-stone-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                  <h3 className="font-bold text-stone-200 text-sm">Register Ticket</h3>
                  <button
                    onClick={() => setPosCart([])}
                    className="text-[11px] text-stone-500 hover:text-rose-400 transition"
                  >
                    Clear Ticket
                  </button>
                </div>

                {/* Dine-in vs Takeaway selector */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setPosOrderType('takeaway')}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      posOrderType === 'takeaway'
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    🥡 Takeaway
                  </button>
                  <button
                    onClick={() => setPosOrderType('dine_in')}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      posOrderType === 'dine_in'
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    ☕ Dine-In
                  </button>
                </div>

                {/* Customer name & table picker */}
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Customer Name (optional)"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-600"
                  />

                  {posOrderType === 'dine_in' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">Select Table:</span>
                      <select
                        value={posTable}
                        onChange={(e) => setPosTable(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none"
                      >
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* POS Ticket Cart items */}
                <div className="max-h-48 overflow-y-auto divide-y divide-stone-800/80 my-2">
                  {posCart.length === 0 ? (
                    <p className="text-xs text-stone-500 text-center py-6">
                      Click menu items on the left to add to ticket
                    </p>
                  ) : (
                    posCart.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-stone-200">{item.name}</span>
                          <span className="text-stone-500 block font-mono">
                            {item.qty} × ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-100">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removePosItem(item.id)}
                            className="text-stone-500 hover:text-rose-400 text-xs ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* POS Totals & Payment Method */}
              <div className="pt-3 border-t border-stone-800 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span className="font-mono">
                      ${posCart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Tax (8%)</span>
                    <span className="font-mono">
                      ${(posCart.reduce((s, i) => s + i.price * i.qty, 0) * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-100 pt-1 border-t border-stone-800">
                    <span>Total Due</span>
                    <span className="font-mono text-amber-400 text-base">
                      ${(posCart.reduce((s, i) => s + i.price * i.qty, 0) * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  {['cash', 'card', 'upi'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPosPaymentMethod(m)}
                      className={`py-1.5 rounded-xl font-bold uppercase transition ${
                        posPaymentMethod === m
                          ? 'bg-amber-600 text-stone-950'
                          : 'bg-stone-900 text-stone-400'
                      }`}
                    >
                      {m === 'cash' ? '💵 Cash' : m === 'card' ? '💳 Card' : '📱 UPI'}
                    </button>
                  ))}
                </div>

                {/* Print & Charge Button */}
                <button
                  disabled={posCart.length === 0}
                  onClick={handlePosSubmit}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-black text-xs transition cursor-pointer"
                >
                  Charge &amp; Print Bill Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: SALES & SHIFT REPORT */}
        {/* ========================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800">
                <span className="text-xs text-stone-400 block mb-1">Total Daily Revenue</span>
                <span className="text-3xl font-black font-mono text-amber-400">
                  ${totalRevenue.toFixed(2)}
                </span>
                <p className="text-[11px] text-stone-500 mt-2">Across all payment channels</p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800">
                <span className="text-xs text-stone-400 block mb-1">Cash on Pickup Revenue</span>
                <span className="text-3xl font-black font-mono text-emerald-400">
                  ${cashOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)}
                </span>
                <p className="text-[11px] text-stone-500 mt-2">
                  {cashOrders.length} cash orders processed
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800">
                <span className="text-xs text-stone-400 block mb-1">Online / Card Payments</span>
                <span className="text-3xl font-black font-mono text-blue-400">
                  ${onlineOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)}
                </span>
                <p className="text-[11px] text-stone-500 mt-2">
                  {onlineOrders.length} digital card &amp; UPI orders
                </p>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800">
              <h3 className="font-bold text-stone-200 text-sm mb-4">Shift Order Log</h3>
              <div className="divide-y divide-stone-800 text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-amber-400 mr-2">{o.token}</span>
                      <span className="text-stone-300 font-semibold">{o.customerName || 'Guest'}</span>
                      <span className="text-stone-500 text-[11px] ml-2">({o.paymentMethod})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-stone-200">
                        ${o.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setActiveBillOrder(o)}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        View Bill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
