import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import UpiPayment, { DEFAULT_UPI_ID } from './UpiPayment'

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Filter Kaapi', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=75&auto=format&fit=crop' },
  { label: 'Espresso', url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=75&auto=format&fit=crop' },
  { label: 'Latte', url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200&q=75&auto=format&fit=crop' },
  { label: 'Cold Brew', url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=75&auto=format&fit=crop' },
  { label: 'Tea / Sulaimani', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=75&auto=format&fit=crop' },
  { label: 'Kerala Snack', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=75&auto=format&fit=crop' },
]

export default function Dashboard() {
  const {
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
  } = useAdmin()

  const [tab, setTab] = useState('orders') // 'orders' | 'tables' | 'pos' | 'menu_manage' | 'site_settings' | 'shift' | 'balance'
  const [orderFilter, setOrderFilter] = useState('active')
  const [search, setSearch] = useState('')
  const [clock, setClock] = useState(() => new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Balance Tab State
  const [expenseForm, setExpenseForm] = useState({ label: '', amount: '', category: 'petty_cash' })
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingOpening, setEditingOpening] = useState(false)
  const [openingInput, setOpeningInput] = useState(openingBalance)
  const [drawerInput, setDrawerInput] = useState(actualDrawerCount ?? '')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // POS State
  const [posCart, setPosCart] = useState([])
  const [posType, setPosType] = useState('takeaway')
  const [posTable, setPosTable] = useState('T-3')
  const [posGuest, setPosGuest] = useState('')
  const [posPaymentMethod, setPosPaymentMethod] = useState('cash_on_counter')
  const [showPosUpiModal, setShowPosUpiModal] = useState(false)
  const [posCategoryFilter, setPosCategoryFilter] = useState('All')

  // Add Item Modal / Form State
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Kaapi',
    price: 45,
    desc: '',
    img: SAMPLE_PHOTO_PRESETS[0].url,
    inStock: true,
  })

  // Site Settings Form State
  const [siteForm, setSiteForm] = useState(shopSettings)
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setSiteForm(shopSettings)
  }, [shopSettings])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refreshFromServer()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  // Filter Orders for KDS
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.token.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(search))

    if (!matchesSearch) return false

    if (orderFilter === 'active') return o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled'
    if (orderFilter === 'received') return o.orderStatus === 'received'
    if (orderFilter === 'preparing') return o.orderStatus === 'preparing'
    if (orderFilter === 'ready') return o.orderStatus === 'ready'
    if (orderFilter === 'completed') return o.orderStatus === 'completed'
    if (orderFilter === 'upi') return o.paymentMethod === 'upi'
    if (orderFilter === 'pending_cash') return o.paymentStatus === 'PENDING_CASH'
    if (orderFilter === 'all') return true
    return o.orderStatus === orderFilter
  })

  // POS Handlers
  const addPosItem = (item) => {
    setPosCart((prev) => {
      const ex = prev.find((i) => i.id === item.id)
      if (ex) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removePosItem = (id) => {
    setPosCart((prev) => prev.filter((i) => i.id !== id))
  }

  const handlePosSubmit = async (customDetails = {}) => {
    if (posCart.length === 0) return
    const subtotal = posCart.reduce((sum, i) => sum + i.price * i.qty, 0)
    const tax = Number((subtotal * 0.05).toFixed(2)) // 5% GST
    const total = Number((subtotal + tax).toFixed(2))

    const method = customDetails.paymentMethod || posPaymentMethod

    const order = await punchPosOrder({
      orderType: posType,
      tableNumber: posType === 'dine_in' ? posTable : null,
      customerName: posGuest.trim() || 'Counter Walk-in',
      customerPhone: '+91 In-Store',
      paymentMethod: method,
      paymentStatus: 'PAID',
      upiId: method === 'upi' ? (shopSettings.upiId || DEFAULT_UPI_ID) : null,
      upiRef: customDetails.upiRef || '',
      items: posCart,
      subtotal,
      tax,
      total,
      notes: 'Counter POS register order',
    })

    setPosCart([])
    setPosGuest('')
    setShowPosUpiModal(false)
    setActiveBillOrder(order)
    setTab('orders')
  }

  // Handle Add / Edit Item
  const handleSaveItem = async (e) => {
    e.preventDefault()
    const finalPrice = Math.max(20, Math.min(200, Number(itemForm.price) || 30))

    if (editingItemId) {
      await updateMenuItem(editingItemId, { ...itemForm, price: finalPrice })
    } else {
      await addMenuItem({ ...itemForm, price: finalPrice })
    }

    setShowAddModal(false)
    setEditingItemId(null)
    setItemForm({
      name: '',
      category: 'Kaapi',
      price: 45,
      desc: '',
      img: SAMPLE_PHOTO_PRESETS[0].url,
      inStock: true,
    })
  }

  const startEditItem = (item) => {
    setEditingItemId(item.id)
    setItemForm({
      name: item.name,
      category: item.category,
      price: item.price,
      desc: item.desc || '',
      img: item.img || SAMPLE_PHOTO_PRESETS[0].url,
      inStock: item.inStock !== false,
    })
    setShowAddModal(true)
  }

  // Handle Save Store Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    await updateShopSettings(siteForm)
    setSettingsSavedMessage(true)
    setTimeout(() => setSettingsSavedMessage(false), 2800)
  }

  const posSubtotal = posCart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const posTax = Number((posSubtotal * 0.05).toFixed(2))
  const posTotal = Number((posSubtotal + posTax).toFixed(2))

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-black">
      {/* ======================================================== */}
      {/* 1. TOP COMMAND BAR */}
      {/* ======================================================== */}
      <header className="h-16 px-6 bg-[#161b22] border-b border-zinc-800/90 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-zinc-100">
                {shopSettings.name}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                Admin POS &amp; KDS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Thrissur Swaraj Round South • GSTIN: {shopSettings.gstin || '32AABCB1234M1Z5'}
            </p>
          </div>
        </div>

        {/* Real-time Status & Sync Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-2 border transition ${
              serverConnected
                ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/70 border-rose-800/80 text-rose-300 animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span>{serverConnected ? 'Live Real-Time Sync (SSE)' : 'Sync Offline / Reconnecting'}</span>
          </div>

          <button
            onClick={handleManualRefresh}
            title="Refresh sync immediately"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-zinc-700/60"
          >
            <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer border ${
              soundEnabled
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {soundEnabled ? '🔔 Chime On' : '🔕 Muted'}
          </button>

          <div className="hidden lg:flex flex-col text-right font-mono text-xs text-zinc-400 border-l border-zinc-800 pl-4">
            <span className="text-zinc-200 font-bold">
              {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-[10px] text-zinc-500">
              {clock.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. EXECUTIVE METRICS HUD BAR */}
      {/* ======================================================== */}
      <section className="px-6 py-3 bg-[#13171e] border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          {/* Metric 1: Total Sales */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Gross Shift Sales</span>
            <span className="text-base font-black text-amber-400 mt-0.5">₹{totalSales.toFixed(2)}</span>
            <span className="text-[10px] text-zinc-400">{orders.length} total orders</span>
          </div>

          {/* Metric 2: UPI Collections */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <span>📱</span> UPI Collections
            </span>
            <span className="text-base font-black text-emerald-300 mt-0.5">₹{upiSales.toFixed(2)}</span>
            <span className="text-[10px] text-zinc-400 font-sans truncate">{shopSettings.upiId || DEFAULT_UPI_ID}</span>
          </div>

          {/* Metric 3: Counter Cash */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <span>💵</span> Cash Settled
            </span>
            <span className="text-base font-black text-zinc-200 mt-0.5">₹{cashSales.toFixed(2)}</span>
            <span className="text-[10px] text-zinc-400">At Register</span>
          </div>

          {/* Metric 4: Pending Cash */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Pending Counter Cash</span>
            <span className="text-base font-black text-amber-300 mt-0.5">₹{pendingCashTotal.toFixed(2)}</span>
            <span className="text-[10px] text-zinc-400">Collect on pickup</span>
          </div>

          {/* Metric 5: Active Kitchen Queue */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
            <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Kitchen Queue</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-black text-blue-300">{activeOrdersCount}</span>
              <span className="text-[10px] text-zinc-400">tickets in prep</span>
            </div>
            <span className="text-[10px] text-blue-400 font-sans">Live KDS</span>
          </div>

          {/* Metric 6: Table Occupancy */}
          <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
            isHighOccupancyAlert
              ? 'bg-rose-950/40 border-rose-800/80'
              : 'bg-zinc-900/80 border-zinc-800/90'
          }`}>
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Floor Tables</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-base font-black ${isHighOccupancyAlert ? 'text-rose-400' : 'text-zinc-200'}`}>
                {occupiedTables}/{totalTables}
              </span>
              <span className="text-[10px] text-zinc-400">({occupancyPercentage}%)</span>
            </div>
            <span className={`text-[10px] ${isHighOccupancyAlert ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
              {isHighOccupancyAlert ? '⚠️ Seating Full' : `${availableTables} Tables Open`}
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. INCOMING LIVE ORDER TOAST BANNER */}
      {/* ======================================================== */}
      {incomingAlertOrder && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 px-6 py-3 shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🔔</span>
            <div>
              <p className="font-black text-sm">
                NEW LIVE SITE ORDER RECEIVED • Token {incomingAlertOrder.token} (₹{incomingAlertOrder.total})
              </p>
              <p className="text-xs font-semibold opacity-90">
                Guest: {incomingAlertOrder.customerName || 'Online Customer'} • {incomingAlertOrder.orderType === 'dine_in' ? `Table ${incomingAlertOrder.tableNumber}` : 'Takeaway'} • Payment: {incomingAlertOrder.paymentMethod === 'upi' ? '📱 UPI Paid' : '💵 Pay on Counter'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTab('orders')
                setOrderFilter('active')
                setIncomingAlertOrder(null)
              }}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-amber-300 font-mono text-xs font-bold transition cursor-pointer shadow-md"
            >
              View in Kitchen Queue
            </button>
            <button
              onClick={() => setIncomingAlertOrder(null)}
              className="w-7 h-7 rounded-full bg-zinc-950/20 hover:bg-zinc-950/40 flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MAIN NAVIGATION TABS */}
      {/* ======================================================== */}
      <nav className="px-6 bg-[#161b22] border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex overflow-x-auto">
          {[
            { key: 'orders', label: 'Live Orders / KDS', icon: '📋', badge: activeOrdersCount },
            { key: 'tables', label: 'Table Occupation & Floor Map', icon: '🪑', badge: isHighOccupancyAlert ? '!' : null },
            { key: 'pos', label: 'Counter Express Register', icon: '⚡' },
            { key: 'menu_manage', label: 'Menu & Stock Manager', icon: '☕', badge: menuItems.filter((i) => !i.inStock).length > 0 ? `${menuItems.filter((i) => !i.inStock).length} Sold Out` : null },
            { key: 'site_settings', label: 'Store & UPI Details', icon: '💳' },
            { key: 'balance', label: 'Cash Balance Sheet', icon: '💰' },
            { key: 'shift', label: 'Shift & Sales Report', icon: '📊' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`px-4 py-3 font-semibold border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                tab === item.key
                  ? 'border-amber-400 text-amber-300 bg-zinc-800/50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-zinc-950 font-black">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div className="relative py-2 hidden sm:block">
            <input
              type="text"
              placeholder="Search Token, ID, Phone, Guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 outline-none w-64 focus:border-amber-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ======================================================== */}
      {/* 5. MAIN CONTENT PANELS */}
      {/* ======================================================== */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* ======================================================== */}
        {/* TAB 1: LIVE ORDERS (KDS) */}
        {/* ======================================================== */}
        {tab === 'orders' && (
          <div className="space-y-4 max-w-7xl mx-auto">
            {/* Filter chips bar */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-800/80 text-xs">
              {[
                { key: 'active', label: 'Active Kitchen Queue' },
                { key: 'received', label: 'New Received' },
                { key: 'preparing', label: 'Brewing' },
                { key: 'ready', label: 'Ready for Pickup' },
                { key: 'completed', label: 'Completed' },
                { key: 'upi', label: '📱 UPI Online Paid' },
                { key: 'pending_cash', label: '💵 Pay on Counter Due' },
                { key: 'all', label: 'All Orders' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setOrderFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    orderFilter === f.key
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-sm'
                      : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 border border-zinc-800/80 rounded-2xl bg-zinc-900/40 text-zinc-500 text-xs font-mono space-y-2">
                <span className="text-4xl block">☕</span>
                <p className="font-bold text-zinc-300">No orders match the current filter</p>
                <p className="text-[11px] text-zinc-500">Live website orders and counter punches appear here instantly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const isCashPending = order.paymentStatus === 'PENDING_CASH'
                  const isUpiPaid = order.paymentMethod === 'upi'

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-lg ${
                        order.orderStatus === 'received'
                          ? 'bg-[#181d26] border-amber-500/80 ring-2 ring-amber-500/30 shadow-amber-950/20'
                          : order.orderStatus === 'preparing'
                          ? 'bg-[#141922] border-blue-500/60 ring-1 ring-blue-500/30'
                          : order.orderStatus === 'ready'
                          ? 'bg-[#131d18] border-emerald-500/70 ring-1 ring-emerald-500/30'
                          : 'bg-zinc-900/50 border-zinc-800/80 opacity-80'
                      }`}
                    >
                      <div>
                        {/* Header Ticket Bar */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/90 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xl font-black text-amber-400">
                              {order.token}
                            </span>
                            <span className="font-mono text-xs text-zinc-400">{order.id}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Order Origin Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                              order.orderSource === 'counter_pos'
                                ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {order.orderSource === 'counter_pos' ? '🖥️ Register' : '🌐 Site Live'}
                            </span>

                            {/* Status Chip */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-black ${
                                order.orderStatus === 'received'
                                  ? 'bg-amber-400 text-zinc-950'
                                  : order.orderStatus === 'preparing'
                                  ? 'bg-blue-400 text-zinc-950'
                                  : order.orderStatus === 'ready'
                                  ? 'bg-emerald-400 text-zinc-950 animate-pulse'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Type */}
                        <div className="text-xs mb-3 space-y-1">
                          <div className="flex justify-between items-center text-zinc-200">
                            <span className="font-bold text-sm">{order.customerName || 'Walk-in Guest'}</span>
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                              {order.orderType === 'dine_in'
                                ? `Table ${order.tableNumber || '1'}`
                                : '🥡 Takeaway'}
                            </span>
                          </div>

                          <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                            <span>{order.customerPhone || ''}</span>
                            <span>
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="py-2.5 border-t border-b border-zinc-800/80 space-y-2 text-xs">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-zinc-300">
                              <div>
                                <span className="font-mono font-black text-amber-400 mr-2">
                                  {item.qty}×
                                </span>
                                <span className="font-medium text-zinc-100">{item.name}</span>
                                {item.notes && (
                                  <p className="text-[10px] text-amber-300/80 italic pl-5 mt-0.5">
                                    "{item.notes}"
                                  </p>
                                )}
                              </div>
                              <span className="font-mono text-zinc-400 font-semibold">
                                ₹{item.price * item.qty}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total & Payment Badge */}
                        <div className="pt-2.5 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 font-mono">Total Bill:</span>
                            <span className="font-mono font-black text-base text-zinc-100">
                              ₹{order.total}
                            </span>
                          </div>

                          {/* Payment Method Details */}
                          {isUpiPaid ? (
                            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/70 flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-1.5 text-emerald-300">
                                <span>📱</span>
                                <span className="font-bold">UPI PAID</span>
                                <span className="text-[10px] text-emerald-400 font-sans truncate">
                                  ({order.upiId || DEFAULT_UPI_ID})
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-400">✓ Settled</span>
                            </div>
                          ) : isCashPending ? (
                            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-amber-300 font-bold block">
                                  💵 Pay on Counter Due: ₹{order.total}
                                </span>
                                <span className="text-[10px] text-amber-400/80 font-mono">
                                  Collect cash on pickup
                                </span>
                              </div>
                              <button
                                onClick={() => markCashReceived(order.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition cursor-pointer shadow-sm"
                              >
                                Mark Paid
                              </button>
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                              <span>💵 Cash Settled</span>
                              <span className="text-emerald-400 font-bold">✓ PAID</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Stage Buttons */}
                      <div className="pt-3 border-t border-zinc-800 mt-3 flex items-center gap-2">
                        {order.orderStatus === 'received' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer shadow-md"
                          >
                            Start Brewing ☕
                          </button>
                        )}
                        {order.orderStatus === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white transition cursor-pointer shadow-md shadow-emerald-900/30"
                          >
                            Mark Ready 🔔
                          </button>
                        )}
                        {order.orderStatus === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition cursor-pointer"
                          >
                            Complete Order ✓
                          </button>
                        )}
                        {order.orderStatus === 'completed' && (
                          <span className="flex-1 text-center text-xs text-zinc-500 font-mono">
                            Fulfilled &amp; Cleared
                          </span>
                        )}

                        <button
                          onClick={() => setActiveBillOrder(order)}
                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition cursor-pointer border border-zinc-700/60"
                          title="Print Thermal Bill Receipt"
                        >
                          🧾 Bill
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FLOOR MAP & TABLES */}
        {/* ======================================================== */}
        {tab === 'tables' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-zinc-500 block">Total Cafe Tables</span>
                <span className="text-2xl font-black text-zinc-100 mt-1">{totalTables} Tables</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-zinc-500 block">Occupied Seating</span>
                <span className="text-2xl font-black text-rose-400 mt-1">
                  {occupiedTables} ({occupancyPercentage}%)
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-zinc-500 block">Open Available</span>
                <span className="text-2xl font-black text-emerald-400 mt-1">{availableTables} Open</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-zinc-500 block">Floor Alert Status</span>
                <span className={`text-base font-black mt-1 block ${isHighOccupancyAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isHighOccupancyAlert ? '⚠️ CAPACITY ALERT (>75%)' : '✓ Normal Capacity'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-zinc-200 text-xs block uppercase tracking-wider font-mono">
                Swaraj Round Seating Map &amp; Controls
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {tables.map((table) => {
                  const isLongStay = table.status === 'occupied' && (table.occupiedSinceMinutesAgo || 0) >= 45

                  return (
                    <div
                      key={table.id}
                      className={`p-4 rounded-2xl border text-xs flex flex-col justify-between transition ${
                        table.status === 'occupied'
                          ? isLongStay
                            ? 'bg-zinc-900 border-rose-500/80 ring-2 ring-rose-500/40'
                            : 'bg-zinc-900 border-rose-900/50'
                          : table.status === 'available'
                          ? 'bg-zinc-900/80 border-zinc-800'
                          : 'bg-zinc-900 border-amber-900/50'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-zinc-100 font-mono">{table.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-black ${
                              table.status === 'occupied'
                                ? 'bg-rose-500 text-zinc-950'
                                : table.status === 'available'
                                ? 'bg-emerald-500 text-zinc-950'
                                : 'bg-amber-500 text-zinc-950'
                            }`}
                          >
                            {table.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mb-3 font-mono">
                          {table.section} • {table.capacity} seats
                        </p>

                        {table.status === 'occupied' && (
                          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] mb-3 space-y-1">
                            <span className="text-zinc-200 block font-bold">
                              {table.customerName || 'Seated Guest'}
                            </span>
                            <div className="flex justify-between text-zinc-400 font-mono">
                              <span>Party of {table.guestCount || table.capacity}</span>
                              <span className={isLongStay ? 'text-rose-400 font-bold' : ''}>
                                {table.occupiedSinceMinutesAgo || 10}m elapsed
                              </span>
                            </div>
                            {isLongStay && (
                              <p className="text-[10px] text-rose-400 font-mono pt-1">
                                ⚠️ Table occupied &gt;45m alert
                              </p>
                            )}
                          </div>
                        )}

                        {table.status === 'available' && (
                          <div className="p-2.5 rounded-xl bg-zinc-950/40 text-[11px] mb-3 text-zinc-500 font-mono">
                            Ready for guests
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-zinc-800 flex gap-1.5 text-[11px]">
                        {table.status !== 'occupied' ? (
                          <button
                            onClick={() =>
                              updateTableStatus(table.id, 'occupied', {
                                customerName: 'Walk-in Guests',
                                guestCount: table.capacity,
                              })
                            }
                            className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition cursor-pointer"
                          >
                            Seat Guests
                          </button>
                        ) : (
                          <button
                            onClick={() => updateTableStatus(table.id, 'cleaning')}
                            className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition cursor-pointer"
                          >
                            Mark Cleaning
                          </button>
                        )}
                        <button
                          onClick={() => clearTable(table.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 transition cursor-pointer font-mono"
                        >
                          Free
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: COUNTER POS ORDER REGISTER */}
        {/* ======================================================== */}
        {tab === 'pos' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  Menu Quick-Add Keypad (₹20 to ₹200)
                </span>
                <div className="flex gap-1 overflow-x-auto text-xs">
                  {['All', 'Kaapi', 'Espresso', 'Latte', 'Cold Brew', 'Tea', 'Snacks'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPosCategoryFilter(c)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                        posCategoryFilter === c
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {menuItems
                  .filter((item) => posCategoryFilter === 'All' || item.category === posCategoryFilter)
                  .map((item) => (
                    <button
                      key={item.id}
                      disabled={!item.inStock}
                      onClick={() => addPosItem(item)}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        !item.inStock
                          ? 'bg-zinc-950/50 border-zinc-900 opacity-50 cursor-not-allowed'
                          : 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/80 hover:bg-zinc-800/80 cursor-pointer shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">
                          {item.category}
                        </span>
                        {!item.inStock && (
                          <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1 py-0.2 rounded font-mono font-bold">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs text-zinc-100 mt-1 truncate">{item.name}</p>
                      <p className="font-mono text-sm text-amber-400 mt-1 font-black">₹{item.price}</p>
                    </button>
                  ))}
              </div>
            </div>

            {/* POS Ticket Sidebar */}
            <div className="p-5 rounded-2xl bg-[#161b22] border border-zinc-800 flex flex-col justify-between text-xs shadow-xl">
              <div>
                <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800 mb-3">
                  <span className="font-mono font-black text-sm text-zinc-100 uppercase tracking-wider">
                    Counter Ticket
                  </span>
                  <button
                    onClick={() => setPosCart([])}
                    className="text-[11px] text-zinc-500 hover:text-rose-400 font-mono transition cursor-pointer"
                  >
                    Clear Ticket
                  </button>
                </div>

                {/* Service Type */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setPosType('takeaway')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      posType === 'takeaway' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🥡 Takeaway
                  </button>
                  <button
                    onClick={() => setPosType('dine_in')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      posType === 'dine_in' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ☕ Dine-In
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    placeholder="Guest Name (e.g. Rahul)"
                    value={posGuest}
                    onChange={(e) => setPosGuest(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none focus:border-amber-500"
                  />
                  {posType === 'dine_in' && (
                    <select
                      value={posTable}
                      onChange={(e) => setPosTable(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none"
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.status})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Payment Option Selector */}
                <div className="mb-3">
                  <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1.5">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPosPaymentMethod('cash_on_counter')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        posPaymentMethod === 'cash_on_counter'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      💵 Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPosPaymentMethod('upi')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        posPaymentMethod === 'upi'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      📱 UPI QR
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="max-h-52 overflow-y-auto divide-y divide-zinc-800/80 text-xs my-2 pr-1">
                  {posCart.length === 0 ? (
                    <p className="text-zinc-500 text-center py-8 font-mono">Tap items on the left to add</p>
                  ) : (
                    posCart.map((i) => (
                      <div key={i.id} className="py-2 flex justify-between items-center">
                        <div className="flex-1 pr-2">
                          <span className="text-zinc-200 font-bold">{i.name}</span>
                          <span className="text-zinc-500 font-mono block text-[10px]">
                            {i.qty} × ₹{i.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-amber-400">
                            ₹{i.price * i.qty}
                          </span>
                          <button
                            onClick={() => removePosItem(i.id)}
                            className="text-zinc-500 hover:text-rose-400 text-xs cursor-pointer px-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Totals & Submit */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 font-mono">
                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>Subtotal</span>
                  <span>₹{posSubtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>GST (5%)</span>
                  <span>₹{posTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-base text-zinc-100 pt-1 border-t border-zinc-800">
                  <span>Total Due</span>
                  <span className="text-amber-400">₹{posTotal.toFixed(2)}</span>
                </div>

                {posPaymentMethod === 'upi' ? (
                  <button
                    disabled={posCart.length === 0}
                    onClick={() => setShowPosUpiModal(true)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
                  >
                    <span>📱 Show UPI QR to Customer (₹{posTotal.toFixed(2)})</span>
                  </button>
                ) : (
                  <button
                    disabled={posCart.length === 0}
                    onClick={() => handlePosSubmit()}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-black text-xs transition cursor-pointer shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
                  >
                    <span>💵 Collect Cash &amp; Print Bill Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MENU & SOLD-OUT ITEM MANAGEMENT */}
        {/* ======================================================== */}
        {tab === 'menu_manage' && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-100">
                  Cafe Menu Catalog &amp; Sold-Out Control
                </h2>
                <p className="text-xs text-zinc-400">
                  Add items with photos, update prices (₹20 to ₹200 enforced), or toggle "Sold Out" status anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItemId(null)
                  setItemForm({
                    name: '',
                    category: 'Kaapi',
                    price: 45,
                    desc: '',
                    img: SAMPLE_PHOTO_PRESETS[0].url,
                    inStock: true,
                  })
                  setShowAddModal(true)
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>+</span> Add New Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {menuItems.map((item) => {
                const isSoldOut = item.inStock === false

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition ${
                      isSoldOut
                        ? 'bg-zinc-950/60 border-zinc-900 opacity-70'
                        : 'bg-zinc-900/90 border-zinc-800 shadow-sm'
                    }`}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-zinc-950 border border-zinc-800"
                    />

                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] uppercase text-zinc-400 font-bold">
                          {item.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                            isSoldOut
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : 'In Stock'}
                        </span>
                      </div>

                      <p className="font-bold text-zinc-100 truncate mt-0.5">{item.name}</p>
                      <p className="font-mono font-black text-amber-400 text-sm mt-0.5">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => toggleItemStock(item.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                            isSoldOut
                              ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200'
                              : 'bg-rose-950 hover:bg-rose-900 text-rose-300'
                          }`}
                        >
                          {isSoldOut ? 'Mark Available' : 'Mark Sold Out'}
                        </button>
                        <button
                          onClick={() => startEditItem(item)}
                          className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="px-2 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 text-[11px] cursor-pointer"
                          title="Delete item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: STORE & UPI DETAILS EDITOR */}
        {/* ======================================================== */}
        {tab === 'site_settings' && (
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-zinc-100">
                Store Information &amp; Official UPI Settings
              </h2>
              <p className="text-xs text-zinc-400">
                Configure your verified UPI ID, merchant name, and cafe store details. These sync live with the customer website and bills.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                <span>✓</span>
                <span>Store &amp; UPI settings saved and updated live across the ecosystem!</span>
              </div>
            )}

            {/* UPI Settings Highlight Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#181d26] border-2 border-amber-500/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-xs">
                    UPI
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">Official UPI Payment Details</h3>
                    <p className="text-[11px] text-zinc-400">Customer payments will be routed directly to this VPA address</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Active Gateway
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={siteForm.upiId || DEFAULT_UPI_ID}
                    onChange={(e) => setSiteForm({ ...siteForm, upiId: e.target.value.trim() })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-amber-300 font-mono font-bold outline-none focus:border-amber-500"
                    placeholder="e.g. ananthukrishna250@oksbi"
                    required
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">Current: ananthukrishna250@oksbi</p>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Payee / Merchant Business Name</label>
                  <input
                    type="text"
                    value={siteForm.upiName || 'Bean & Bloom Coffee House'}
                    onChange={(e) => setSiteForm({ ...siteForm, upiName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                    placeholder="Bean & Bloom Coffee House"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Displayed in GPay, PhonePe, Paytm</p>
                </div>
              </div>
            </div>

            {/* General Shop Settings Form */}
            <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Cafe / Shop Name</label>
                  <input
                    type="text"
                    value={siteForm.name || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={siteForm.tagline || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Kerala Shop Address</label>
                <textarea
                  rows={2}
                  value={siteForm.address || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Phone Numbers</label>
                  <input
                    type="text"
                    value={siteForm.phone || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={siteForm.email || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">GSTIN (Kerala Code 32)</label>
                  <input
                    type="text"
                    value={siteForm.gstin || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">FSSAI License No.</label>
                  <input
                    type="text"
                    value={siteForm.fssai || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, fssai: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Operating Hours</label>
                  <input
                    type="text"
                    value={siteForm.hours || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, hours: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  Save Store &amp; UPI Details Live
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CASH BALANCE SHEET */}
        {/* ======================================================== */}
        {tab === 'balance' && (
          <div className="max-w-5xl mx-auto space-y-5">
            {/* Shift Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  💰 Cash Drawer Balance Sheet
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Shift started: {new Date(shiftStartedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800 transition cursor-pointer"
                >
                  🔄 New Shift / Reset
                </button>
              </div>
            </div>

            {/* Reset Confirm Banner */}
            {showResetConfirm && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-600 flex items-center justify-between text-xs animate-pulse">
                <div>
                  <p className="font-bold text-rose-200">⚠️ Reset entire balance sheet? This will clear opening balance, expenses, and drawer count.</p>
                  <p className="text-rose-400 text-[11px] mt-1">This action cannot be undone. Order history is preserved.</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => { resetShift(); setShowResetConfirm(false); setOpeningInput(2000); setDrawerInput(''); }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── Top Balance Summary Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              {/* Opening Balance */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Opening Drawer</span>
                {editingOpening ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-zinc-400 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={openingInput}
                      onChange={(e) => setOpeningInput(e.target.value)}
                      className="w-24 px-2 py-1 bg-zinc-950 border border-amber-500 rounded-lg text-sm text-amber-300 font-black outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => { updateOpeningBalance(openingInput); setEditingOpening(false); }}
                      className="px-2 py-1 rounded-lg bg-amber-500 text-zinc-950 text-[10px] font-bold cursor-pointer"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-zinc-100">₹{openingBalance.toFixed(0)}</span>
                    <button
                      onClick={() => { setOpeningInput(openingBalance); setEditingOpening(true); }}
                      className="text-[10px] text-zinc-500 hover:text-amber-400 cursor-pointer"
                      title="Edit opening balance"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Cash in drawer at shift start</span>
              </div>

              {/* Cash Received */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">+ Cash Received</span>
                <span className="text-2xl font-black text-emerald-300 mt-1 block">₹{cashInFromOrders.toFixed(0)}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">
                  {orders.filter(o => o.paymentMethod !== 'upi' && o.paymentStatus === 'PAID').length} settled cash orders
                </span>
              </div>

              {/* Total Expenses / Payouts */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider block">− Cash Out / Expenses</span>
                <span className="text-2xl font-black text-rose-300 mt-1 block">₹{totalExpenses.toFixed(0)}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">{expenses.length} payouts logged</span>
              </div>

              {/* Expected Drawer */}
              <div className={`p-4 rounded-2xl border shadow-sm ${
                drawerDifference !== null
                  ? drawerDifference >= 0
                    ? 'bg-emerald-950/40 border-emerald-800'
                    : 'bg-rose-950/40 border-rose-800'
                  : 'bg-zinc-900 border-amber-800/60'
              }`}>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">= Expected in Drawer</span>
                <span className="text-2xl font-black text-amber-300 mt-1 block">₹{expectedDrawer.toFixed(0)}</span>
                <span className="text-[10px] text-zinc-400 mt-0.5 block">Opening + Cash In − Expenses</span>
              </div>
            </div>

            {/* ── Drawer Count & Reconciliation ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cash Drawer Count */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#181d26] border-2 border-amber-500/50 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-sm">₹</span>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-100">Physical Cash Count</h3>
                      <p className="text-[11px] text-zinc-400">Count the actual cash in drawer now</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-zinc-400 text-lg font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Count & enter..."
                      value={drawerInput}
                      onChange={(e) => setDrawerInput(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-lg text-amber-300 font-mono font-black outline-none focus:border-amber-500 placeholder:text-zinc-600 placeholder:text-sm placeholder:font-normal"
                    />
                  </div>
                  <button
                    onClick={() => updateActualDrawerCount(drawerInput)}
                    className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    Save Count
                  </button>
                </div>

                {actualDrawerCount !== null && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
                    <span className="text-zinc-400">Last counted: </span>
                    <span className="text-amber-300 font-bold text-sm">₹{actualDrawerCount.toFixed(0)}</span>
                  </div>
                )}
              </div>

              {/* Reconciliation Result */}
              <div className={`p-5 rounded-2xl border-2 shadow-xl space-y-3 ${
                drawerDifference === null
                  ? 'bg-zinc-900 border-zinc-700'
                  : drawerDifference === 0
                  ? 'bg-emerald-950/60 border-emerald-500/70'
                  : drawerDifference > 0
                  ? 'bg-blue-950/60 border-blue-500/70'
                  : 'bg-rose-950/60 border-rose-500/70'
              }`}>
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <span className="text-lg">
                    {drawerDifference === null ? '🔍' : drawerDifference === 0 ? '✅' : drawerDifference > 0 ? '📈' : '⚠️'}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">Reconciliation Status</h3>
                    <p className="text-[11px] text-zinc-400">Actual vs Expected comparison</p>
                  </div>
                </div>

                {drawerDifference === null ? (
                  <div className="text-center py-4 text-zinc-500 text-xs font-mono space-y-2">
                    <span className="text-3xl block">🔢</span>
                    <p>Enter your physical cash count to see reconciliation</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 block">Expected</span>
                        <span className="text-lg font-black text-amber-300">₹{expectedDrawer.toFixed(0)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 block">Actual Count</span>
                        <span className="text-lg font-black text-zinc-100">₹{actualDrawerCount.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl text-center ${
                      drawerDifference === 0
                        ? 'bg-emerald-900/40 border border-emerald-700'
                        : drawerDifference > 0
                        ? 'bg-blue-900/40 border border-blue-700'
                        : 'bg-rose-900/40 border border-rose-700'
                    }`}>
                      <span className={`text-2xl font-black block ${
                        drawerDifference === 0 ? 'text-emerald-300' : drawerDifference > 0 ? 'text-blue-300' : 'text-rose-300'
                      }`}>
                        {drawerDifference >= 0 ? '+' : ''}₹{drawerDifference.toFixed(0)}
                      </span>
                      <span className={`text-[11px] font-bold block mt-1 ${
                        drawerDifference === 0 ? 'text-emerald-400' : drawerDifference > 0 ? 'text-blue-400' : 'text-rose-400'
                      }`}>
                        {drawerDifference === 0 ? '✓ PERFECT BALANCE — Drawer matches exactly!' : drawerDifference > 0 ? '↑ CASH SURPLUS — More cash than expected' : '↓ CASH SHORT — Less cash than expected'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Balance Breakdown Visual ── */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                Cash Flow Breakdown
              </h3>

              {/* Visual flow bar */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-24 text-zinc-400 text-right">Opening</span>
                  <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="h-full bg-zinc-600 rounded-full flex items-center px-3" style={{ width: `${Math.min(100, (openingBalance / Math.max(1, expectedDrawer + totalExpenses)) * 100)}%` }}>
                      <span className="text-[10px] text-zinc-200 font-bold whitespace-nowrap">₹{openingBalance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-24 text-emerald-400 text-right">+ Cash In</span>
                  <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="h-full bg-emerald-700 rounded-full flex items-center px-3" style={{ width: `${Math.min(100, (cashInFromOrders / Math.max(1, expectedDrawer + totalExpenses)) * 100)}%` }}>
                      <span className="text-[10px] text-emerald-200 font-bold whitespace-nowrap">₹{cashInFromOrders.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-24 text-rose-400 text-right">− Expenses</span>
                  <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="h-full bg-rose-700 rounded-full flex items-center px-3" style={{ width: `${Math.min(100, (totalExpenses / Math.max(1, expectedDrawer + totalExpenses)) * 100)}%` }}>
                      <span className="text-[10px] text-rose-200 font-bold whitespace-nowrap">₹{totalExpenses.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 border-t border-zinc-800">
                  <span className="w-24 text-amber-400 text-right font-bold">= Balance</span>
                  <div className="flex-1 h-7 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="h-full bg-amber-600 rounded-full flex items-center px-3" style={{ width: `${Math.min(100, (expectedDrawer / Math.max(1, expectedDrawer + totalExpenses)) * 100)}%` }}>
                      <span className="text-xs text-zinc-950 font-black whitespace-nowrap">₹{expectedDrawer.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI info note */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center gap-2">
                <span className="text-base">📱</span>
                <div>
                  <span className="text-emerald-300 font-bold">UPI collections (₹{upiSales.toFixed(0)})</span> go directly to your bank ({shopSettings.upiId || DEFAULT_UPI_ID}) — not counted in the physical cash drawer.
                  <span className="block mt-0.5 text-zinc-500">Pending counter cash to collect: <span className="text-amber-300 font-bold">₹{pendingCashTotal.toFixed(0)}</span></span>
                </div>
              </div>
            </div>

            {/* ── Expense / Payout Log ── */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  Expense / Cash Payout Log
                </h3>
                <button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1"
                >
                  {showExpenseForm ? '✕ Close' : '+ Log Expense'}
                </button>
              </div>

              {/* Add Expense Form */}
              {showExpenseForm && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!expenseForm.label.trim() || !expenseForm.amount) return
                    addExpense({
                      label: expenseForm.label.trim(),
                      amount: Math.max(1, Number(expenseForm.amount)),
                      category: expenseForm.category,
                    })
                    setExpenseForm({ label: '', amount: '', category: 'petty_cash' })
                    setShowExpenseForm(false)
                  }}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-zinc-400 mb-1 font-medium">Category</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 outline-none"
                      >
                        <option value="petty_cash">💵 Petty Cash</option>
                        <option value="supplies">📦 Supplies / Milk / Coffee</option>
                        <option value="staff_pay">👤 Staff Payment</option>
                        <option value="tip_out">🤝 Tip Payout</option>
                        <option value="rent_utility">🏠 Rent / Utility</option>
                        <option value="refund">↩️ Customer Refund</option>
                        <option value="other">📝 Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Milk purchased from nearby shop"
                        value={expenseForm.label}
                        onChange={(e) => setExpenseForm({ ...expenseForm, label: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Amount (₹)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 font-mono outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Log Cash Out (−₹{expenseForm.amount || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExpenseForm(false)}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Expense List */}
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs font-mono space-y-2">
                  <span className="text-3xl block">📋</span>
                  <p>No expenses logged this shift</p>
                  <p className="text-[10px]">Click "Log Expense" to record any cash taken out of the drawer</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80 text-xs font-mono">
                  {expenses.map((exp) => {
                    const categoryIcons = {
                      petty_cash: '💵', supplies: '📦', staff_pay: '👤',
                      tip_out: '🤝', rent_utility: '🏠', refund: '↩️', other: '📝',
                    }
                    return (
                      <div key={exp.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{categoryIcons[exp.category] || '📝'}</span>
                          <div>
                            <span className="text-zinc-200 font-medium block">{exp.label}</span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(exp.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              {' • '}
                              {exp.category.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-rose-400 font-black text-sm">−₹{exp.amount}</span>
                          <button
                            onClick={() => removeExpense(exp.id)}
                            className="text-zinc-600 hover:text-rose-400 text-xs cursor-pointer px-1"
                            title="Delete expense"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ── Full Summary Table ── */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono mb-4">
                End-of-Shift Summary
              </h3>
              <div className="divide-y divide-zinc-800 text-xs font-mono">
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">Opening Drawer Cash</span>
                  <span className="text-zinc-100 font-bold">₹{openingBalance.toFixed(2)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-emerald-400">+ Cash Orders Collected</span>
                  <span className="text-emerald-300 font-bold">₹{cashInFromOrders.toFixed(2)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-rose-400">− Total Expenses / Payouts</span>
                  <span className="text-rose-300 font-bold">₹{totalExpenses.toFixed(2)}</span>
                </div>
                <div className="py-2.5 flex justify-between bg-zinc-950/50 -mx-5 px-5 rounded-xl">
                  <span className="text-amber-400 font-bold">= Expected Cash in Drawer</span>
                  <span className="text-amber-300 font-black text-sm">₹{expectedDrawer.toFixed(2)}</span>
                </div>
                {actualDrawerCount !== null && (
                  <>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-zinc-300">Actual Physical Count</span>
                      <span className="text-zinc-100 font-bold">₹{actualDrawerCount.toFixed(2)}</span>
                    </div>
                    <div className={`py-2.5 flex justify-between -mx-5 px-5 rounded-xl ${
                      drawerDifference === 0 ? 'bg-emerald-950/40' : drawerDifference > 0 ? 'bg-blue-950/40' : 'bg-rose-950/40'
                    }`}>
                      <span className={`font-bold ${drawerDifference === 0 ? 'text-emerald-400' : drawerDifference > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                        {drawerDifference === 0 ? '✓ Perfect Balance' : drawerDifference > 0 ? '↑ Surplus (Over)' : '↓ Short (Under)'}
                      </span>
                      <span className={`font-black text-sm ${drawerDifference === 0 ? 'text-emerald-300' : drawerDifference > 0 ? 'text-blue-300' : 'text-rose-300'}`}>
                        {drawerDifference >= 0 ? '+' : ''}₹{drawerDifference.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <div className="py-2.5 flex justify-between border-t-2 border-zinc-700 mt-2 pt-3">
                  <span className="text-zinc-400">Pending Cash to Collect (Due)</span>
                  <span className="text-amber-300 font-bold">₹{pendingCashTotal.toFixed(2)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">📱 UPI (Direct to Bank)</span>
                  <span className="text-emerald-300 font-bold">₹{upiSales.toFixed(2)}</span>
                </div>
                <div className="py-3 flex justify-between border-t-2 border-amber-500/50 mt-2 pt-3">
                  <span className="text-zinc-100 font-bold text-sm">Total Shift Revenue (All Methods)</span>
                  <span className="text-amber-400 font-black text-base">₹{totalSales.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: SHIFT & SALES REPORT */}
        {/* ======================================================== */}
        {tab === 'shift' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-mono">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                <span className="text-xs text-zinc-400 block font-bold">Total Shift Revenue</span>
                <span className="text-3xl font-black text-amber-400 mt-1 block">
                  ₹{totalSales.toFixed(2)}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">{orders.length} total orders</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                <span className="text-xs text-emerald-400 block font-bold">📱 UPI Online Collections</span>
                <span className="text-3xl font-black text-emerald-300 mt-1 block">
                  ₹{upiSales.toFixed(2)}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block font-mono truncate">{shopSettings.upiId || DEFAULT_UPI_ID}</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                <span className="text-xs text-amber-300 block font-bold">Pending Counter Cash</span>
                <span className="text-3xl font-black text-amber-300 mt-1 block">
                  ₹{pendingCashTotal.toFixed(2)}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Awaiting customer collection</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
              <span className="text-xs font-bold text-zinc-200 block mb-3 font-mono uppercase tracking-wider">
                Recent Orders Activity Log
              </span>
              <div className="divide-y divide-zinc-800/80 text-xs font-mono">
                {orders.map((o) => (
                  <div key={o.id} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="text-amber-400 font-bold mr-2 text-sm">{o.token}</span>
                      <span className="text-zinc-200 font-medium">{o.customerName || 'Walk-in'}</span>
                      <span className="text-zinc-500 ml-2">
                        ({o.paymentMethod === 'upi' ? '📱 UPI' : '💵 Counter'})
                      </span>
                      <span className={`ml-2 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        o.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-100 font-black text-sm">₹{o.total}</span>
                      <button
                        onClick={() => setActiveBillOrder(o)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] cursor-pointer"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* POS UPI QR SCAN MODAL */}
      {/* ======================================================== */}
      {showPosUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md">
            <UpiPayment
              amount={posTotal}
              orderToken="Register"
              upiId={shopSettings.upiId || DEFAULT_UPI_ID}
              payeeName={shopSettings.name || 'Bean & Bloom Coffee House'}
              onSuccess={(details) => handlePosSubmit(details)}
              onCancel={() => setShowPosUpiModal(false)}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT MENU ITEM MODAL */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-zinc-900 text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl p-6 text-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100">
                {editingItemId ? 'Edit Menu Item' : 'Add New Item to Menu'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sukku Kaapi / Banana Roast"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none"
                  >
                    <option value="Kaapi">Kaapi</option>
                    <option value="Espresso">Espresso</option>
                    <option value="Latte">Latte</option>
                    <option value="Cold Brew">Cold Brew</option>
                    <option value="Tea">Tea</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">
                    Price (₹20 to ₹200)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, ingredients, origin..."
                  value={itemForm.desc}
                  onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={itemForm.img}
                  onChange={(e) => setItemForm({ ...itemForm, img: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-amber-500"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-zinc-500 mr-1 self-center">Presets:</span>
                  {SAMPLE_PHOTO_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setItemForm({ ...itemForm, img: p.url })}
                      className="px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={itemForm.inStock}
                  onChange={(e) => setItemForm({ ...itemForm, inStock: e.target.checked })}
                  className="accent-amber-500"
                />
                <label htmlFor="inStockCheck" className="text-zinc-300 font-medium">
                  In Stock &amp; Available for Ordering
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition cursor-pointer"
                >
                  {editingItemId ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
