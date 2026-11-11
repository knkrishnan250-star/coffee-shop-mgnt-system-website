import { useState, useEffect } from 'react'
import { useShop } from '../context/ShopContext'

const STATUS_STEPS = [
  { key: 'received', label: 'Order Received', icon: '📝', desc: 'Sent to barista kitchen' },
  { key: 'preparing', label: 'Brewing Coffee', icon: '☕', desc: 'Beans ground & espresso pulling' },
  { key: 'ready', label: 'Ready for Pickup', icon: '🔔', desc: 'Hot & fresh at pickup counter' },
  { key: 'completed', label: 'Order Fulfilled', icon: '✨', desc: 'Enjoy your coffee!' },
]

export default function OrderTrackerModal({ isOpen, onClose }) {
  const { orders, activeCustomerOrderId, setActiveCustomerOrderId, setActiveBillOrder } = useShop()
  const [countdown, setCountdown] = useState(12 * 60) // 12 minutes in seconds

  const currentOrder =
    orders.find((o) => o.id === activeCustomerOrderId) ||
    orders[0]

  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen || !currentOrder) return null

  const getStepIndex = (status) => {
    switch (status) {
      case 'received':
        return 0
      case 'preparing':
        return 1
      case 'ready':
        return 2
      case 'completed':
        return 3
      default:
        return 0
    }
  }

  const currentStep = getStepIndex(currentOrder.orderStatus)
  const isTakeaway = currentOrder.orderType === 'takeaway'

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60
  const formattedCountdown = `${mins}:${secs < 10 ? '0' : ''}${secs}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-[#fffdfa] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#2c1a0a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">☕</span>
            <div>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Live Order Tracker
              </h2>
              <p className="text-xs text-amber-200">Real-time status from Bean &amp; Bloom</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Order Selector if multiple orders exist */}
        {orders.length > 1 && (
          <div className="px-6 py-2.5 bg-amber-50/60 border-b border-amber-200/50 flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">Viewing Order:</span>
            <select
              value={activeCustomerOrderId}
              onChange={(e) => setActiveCustomerOrderId(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 cursor-pointer outline-none"
            >
              {orders.slice(0, 5).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.token} • {o.id} ({o.orderType === 'dine_in' ? `Table ${o.tableNumber}` : 'Takeaway'}) - ${o.total.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          {/* Main Status Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#fdf8f0] to-[#f5e9d3] border border-[#e8d0a9] text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2c1a0a] text-white text-3xl mb-3 shadow-md">
              {STATUS_STEPS[currentStep].icon}
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-[#2c1a0a] text-amber-300">
              Token {currentOrder.token}
            </div>

            <h3
              className="text-2xl font-bold text-[#2c1a0a] mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {STATUS_STEPS[currentStep].label}
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              {STATUS_STEPS[currentStep].desc}
            </p>

            {/* Live Countdown (if in received or preparing) */}
            {currentStep < 2 ? (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-amber-200 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-stone-700">Estimated Ready in:</span>
                <span className="text-sm font-black text-amber-800 font-mono">
                  ~{formattedCountdown}
                </span>
              </div>
            ) : currentStep === 2 ? (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-300">
                <span className="text-emerald-700 font-bold text-sm">
                  🔔 Ready at the Barista Counter!
                </span>
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-300">
                <span className="text-stone-700 font-bold text-xs">✨ Order Completed</span>
              </div>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-2">
            <div className="relative flex items-center justify-between">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx <= currentStep
                const isCurrent = idx === currentStep
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-200 scale-110'
                          : isDone
                          ? 'bg-[#2c1a0a] text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isDone && idx < currentStep ? '✓' : step.icon}
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-semibold text-center whitespace-nowrap ${
                        isCurrent ? 'text-[#2c1a0a] font-bold' : 'text-stone-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pickup & Payment Details Notice */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="font-semibold text-stone-600">Order Method:</span>
              <span className="font-bold text-stone-800">
                {isTakeaway ? '🥡 Takeaway (Counter Pickup)' : `☕ Dine-In (Table ${currentOrder.tableNumber})`}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="font-semibold text-stone-600">Payment:</span>
              <div className="text-right">
                <span className="font-bold text-stone-800 block">
                  {currentOrder.paymentMethod === 'cash'
                    ? '💵 Cash on Take Time (Pickup)'
                    : currentOrder.paymentMethod === 'upi'
                    ? '📱 UPI / QR Code'
                    : '💳 Card Payment'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase ${
                    currentOrder.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {currentOrder.paymentStatus === 'PAID'
                    ? 'PAID ONLINE'
                    : `Please pay $${currentOrder.total?.toFixed(2)} at Counter`}
                </span>
              </div>
            </div>

            {/* Ordered items preview */}
            <div>
              <p className="font-semibold text-stone-600 mb-1">Items in this order:</p>
              <div className="space-y-1">
                {currentOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-stone-700">
                    <span>
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-mono font-medium">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setActiveBillOrder(currentOrder)
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#2c1a0a] hover:bg-[#4a2e15] text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>🧾</span> View &amp; Print Bill
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition cursor-pointer"
            >
              Keep Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
