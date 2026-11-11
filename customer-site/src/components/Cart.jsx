import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCustomerOrder } from '../context/CustomerOrderContext'
import UpiPayment, { DEFAULT_UPI_ID } from './UpiPayment'

export default function Cart({ isOpen, onClose }) {
  const { cart, removeItem, increment, decrement, clearCart, totalItems, totalPrice } = useCart()
  const { createOrder, tables, shopSettings, setBillOrder, setTrackerOpen, serverOnline } = useCustomerOrder()

  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart' | 'checkout' | 'upi_modal' | 'processing' | 'success'
  const [orderType, setOrderType] = useState('takeaway') // 'takeaway' | 'dine_in'
  const [selectedTable, setSelectedTable] = useState('T-1')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [note, setNote] = useState('')
  const [paymentOption, setPaymentOption] = useState('upi') // 'upi' | 'counter'
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null)

  // 5% GST (standard restaurant GST in India: 2.5% CGST + 2.5% SGST)
  const tax = Number((totalPrice * 0.05).toFixed(2))
  const grandTotal = Number((totalPrice + tax).toFixed(2))

  const activeUpiId = shopSettings?.upiId || DEFAULT_UPI_ID

  const handlePlaceOrder = async (customPaymentDetails = {}) => {
    if (cart.length === 0) return

    setCheckoutStep('processing')

    const paymentMethod = customPaymentDetails.paymentMethod || (paymentOption === 'upi' ? 'upi' : 'cash_on_counter')
    const isUpi = paymentMethod === 'upi'

    const order = await createOrder({
      orderType,
      tableNumber: orderType === 'dine_in' ? selectedTable : null,
      customerName: customerName.trim() || 'Thrissur Guest',
      customerPhone: customerPhone.trim() || '+91 98470 00000',
      pickupTime: orderType === 'dine_in' ? 'Table Service' : '10–15 mins',
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        notes: note.trim(),
      })),
      subtotal: totalPrice,
      tax,
      total: grandTotal,
      paymentMethod,
      paymentStatus: isUpi ? 'PAID' : 'PENDING_CASH',
      upiId: isUpi ? activeUpiId : null,
      upiRef: customPaymentDetails.upiRef || '',
      notes: note.trim() || (isUpi ? 'Online Paid via UPI' : 'Pay on Counter'),
      orderSource: 'site_live',
    })

    setLastPlacedOrder(order)
    clearCart()
    setCheckoutStep('success')
  }

  const handleClose = () => {
    setCheckoutStep('cart')
    onClose()
  }

  const availableTables = tables.filter((t) => t.status !== 'occupied')

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(44,26,10,0.55)' }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '100%', maxWidth: '460px', backgroundColor: '#fdf8f0' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: '#e8d0a9', backgroundColor: '#2c1a0a' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">☕</span>
            <div>
              <h2
                className="text-lg font-bold text-[#f5e9d3]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {checkoutStep === 'checkout'
                  ? 'Checkout & Payment'
                  : checkoutStep === 'upi_modal'
                  ? 'Scan & Pay via UPI'
                  : checkoutStep === 'success'
                  ? 'Order Confirmed!'
                  : 'Your Order Bag'}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-amber-200">
                  {checkoutStep === 'checkout'
                    ? 'UPI Online or Pay on Counter'
                    : `${totalItems} fresh items`}
                </p>
                <span className="text-stone-500">•</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono ${serverOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {serverOnline ? 'Live Kitchen Sync' : 'Standby Sync'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: CART ITEMS */}
          {checkoutStep === 'cart' && (
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-6xl mb-4">☕</span>
                  <p className="font-bold text-lg mb-1" style={{ color: '#2c1a0a' }}>
                    Your Bag is Empty
                  </p>
                  <p className="text-xs text-stone-500 max-w-xs mb-6">
                    Add our authentic Kerala filter kaapi or snacks from the menu.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full bg-[#2c1a0a] text-amber-100 text-xs font-bold hover:bg-[#4a2e15] transition cursor-pointer"
                  >
                    Browse Thrissur Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#e8d0a9] shadow-xs"
                    >
                      <div className="flex-1 pr-3">
                        <h4 className="font-bold text-sm text-[#2c1a0a]">{item.name}</h4>
                        <p className="font-mono text-xs text-amber-800 font-semibold">
                          ₹{item.price} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-xl bg-amber-50 border border-amber-200">
                          <button
                            onClick={() => decrement(item.id)}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-amber-200 rounded-l-xl transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono text-stone-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-amber-200 rounded-r-xl transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Special instruction notes */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[#6b4220] uppercase tracking-wider mb-1.5">
                      Special Preparation Request
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. extra decoction, less sugar, hot & crispy pazham pori…"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl text-xs outline-none bg-white border border-[#e8d0a9] text-[#2c1a0a] focus:border-amber-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT WITH UPI & PAY ON COUNTER */}
          {checkoutStep === 'checkout' && (
            <div className="p-6 space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4220] mb-2">
                  1. Order Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      orderType === 'takeaway'
                        ? 'bg-[#2c1a0a] text-white border-[#2c1a0a] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">🥡</span>
                    <p className="font-bold text-sm">Takeaway</p>
                    <p className="text-[11px] opacity-80">Pick up at Swaraj Round counter</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      orderType === 'dine_in'
                        ? 'bg-[#2c1a0a] text-white border-[#2c1a0a] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">☕</span>
                    <p className="font-bold text-sm">Dine-In</p>
                    <p className="text-[11px] opacity-80">Table service in cafe</p>
                  </button>
                </div>
              </div>

              {/* Table Selection for Dine-in */}
              {orderType === 'dine_in' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-800">Select Seating Table:</span>
                    <span className="text-[11px] text-amber-800 font-semibold">
                      {availableTables.length} tables open
                    </span>
                  </div>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800 outline-none"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.section || 'General'} • {t.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4220] mb-2">
                  2. Guest Contact
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Rahul)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#e8d0a9] text-[#2c1a0a] outline-none focus:border-amber-600"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile (+91...)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#e8d0a9] text-[#2c1a0a] outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* 3. PAYMENT METHOD SELECTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4220] mb-2">
                  3. Select Payment Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* OPTION A: UPI / ONLINE PAY */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('upi')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      paymentOption === 'upi'
                        ? 'bg-amber-50/90 border-2 border-amber-600 ring-2 ring-amber-300/40 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">📱</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                          Instant
                        </span>
                      </div>
                      <p className="font-bold text-xs text-[#2c1a0a]">Online Pay via UPI</p>
                      <p className="text-[10px] text-stone-600 mt-0.5 leading-snug">
                        GPay • PhonePe • Paytm • QR
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-amber-200/60 font-mono text-[10px] text-amber-900 font-bold truncate">
                      {activeUpiId}
                    </div>
                  </button>

                  {/* OPTION B: PAY ON COUNTER */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('counter')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      paymentOption === 'counter'
                        ? 'bg-amber-50/90 border-2 border-amber-600 ring-2 ring-amber-300/40 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">💵</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-stone-100 text-stone-800">
                          Standard
                        </span>
                      </div>
                      <p className="font-bold text-xs text-[#2c1a0a]">Pay on Counter</p>
                      <p className="text-[10px] text-stone-600 mt-0.5 leading-snug">
                        Pay cash or UPI at cashier pickup
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-stone-600 font-medium">
                      Zero advance payment
                    </div>
                  </button>
                </div>

                {/* Sub-view if UPI selected */}
                {paymentOption === 'upi' ? (
                  <div className="mt-3">
                    <UpiPayment
                      amount={grandTotal}
                      upiId={activeUpiId}
                      orderToken="Online-Order"
                      onSuccess={(details) => handlePlaceOrder(details)}
                    />
                  </div>
                ) : (
                  <div className="mt-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-[#2c1a0a] flex items-center gap-1.5">
                        💵 Pay ₹{grandTotal} at Counter
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                        Pay on Pickup
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-[11px]">
                      Your order token will be generated immediately and sent to our Thrissur barista kitchen.
                      Pay via Cash, Card, or UPI when you arrive at our counter.
                    </p>
                    <div className="pt-2 border-t border-amber-200 flex items-center gap-1.5 text-[11px] text-amber-900 font-semibold">
                      <span>✓</span>
                      <span>Instant token booking • No gateway transaction fee</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlaceOrder({ paymentMethod: 'cash_on_counter', paymentStatus: 'PENDING_CASH' })}
                      className="w-full mt-2 py-3.5 rounded-xl bg-[#2c1a0a] hover:bg-[#4a2e15] text-amber-100 font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>💵 Place Order &amp; Pay at Counter (₹{grandTotal})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING SPINNER */}
          {checkoutStep === 'processing' && (
            <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
              <div className="w-14 h-14 rounded-full border-4 border-amber-600 border-t-transparent animate-spin mb-5" />
              <h3
                className="text-2xl font-bold text-[#2c1a0a] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Booking Your Order...
              </h3>
              <p className="text-xs text-stone-500">
                Pushing live to our Thrissur barista admin dashboard.
              </p>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS */}
          {checkoutStep === 'success' && lastPlacedOrder && (
            <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center shadow-inner">
                ✓
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-stone-950 font-mono shadow-xs">
                  Token {lastPlacedOrder.token}
                </span>
                <h3
                  className="text-2xl font-bold text-[#2c1a0a] mt-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Order Confirmed!
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Order ID: {lastPlacedOrder.id}
                </p>
              </div>

              {/* Order summary note */}
              <div className="w-full p-4 rounded-2xl bg-white border border-stone-200 text-left text-xs space-y-2 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Service:</span>
                  <span className="font-bold text-stone-800">
                    {lastPlacedOrder.orderType === 'dine_in'
                      ? `Dine-In • Table ${lastPlacedOrder.tableNumber}`
                      : 'Takeaway (Counter Pickup)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Payment:</span>
                  {lastPlacedOrder.paymentMethod === 'upi' ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      📱 UPI PAID • ₹{lastPlacedOrder.total}
                    </span>
                  ) : (
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      💵 Pay on Counter • ₹{lastPlacedOrder.total}
                    </span>
                  )}
                </div>
                {lastPlacedOrder.upiId && lastPlacedOrder.paymentMethod === 'upi' && (
                  <div className="flex justify-between text-[11px] font-mono text-stone-500">
                    <span>UPI ID:</span>
                    <span>{lastPlacedOrder.upiId}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-stone-100">
                  <span className="text-stone-500">Estimated Prep:</span>
                  <span className="font-bold text-[#2c1a0a]">10–15 minutes</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => setBillOrder(lastPlacedOrder)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#2c1a0a] hover:bg-[#4a2e15] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>🧾</span> View &amp; Print Bill Receipt
                </button>

                <button
                  onClick={() => {
                    handleClose()
                    setTrackerOpen(true)
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>📍</span> Track Live Order Status
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 transition cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer for Cart Step */}
        {cart.length > 0 && checkoutStep === 'cart' && (
          <div className="px-6 py-4 border-t border-[#e8d0a9] bg-white">
            <div className="space-y-1 mb-3 text-xs text-[#6b4220]">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-mono">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% Restaurant Rate)</span>
                <span className="font-mono">₹{tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2c1a0a] pt-1 border-t border-[#e8d0a9]">
                <span>Total Amount</span>
                <span className="font-mono text-amber-800">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('checkout')}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all bg-amber-500 hover:bg-amber-400 text-[#2c1a0a] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <span>·</span>
              <span className="font-mono">₹{grandTotal}</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
