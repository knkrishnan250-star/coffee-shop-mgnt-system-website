import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'

export default function Cart({ isOpen, onClose }) {
  const { cart, removeItem, increment, decrement, clearCart, totalItems, totalPrice } = useCart()
  const {
    createOrder,
    tables,
    setActiveBillOrder,
    setTrackerOpen,
    occupancyPercentage,
    isHighOccupancyAlert,
  } = useShop()

  // Checkout form states
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart' | 'checkout' | 'processing' | 'success'
  const [orderType, setOrderType] = useState('takeaway') // 'takeaway' | 'dine_in'
  const [selectedTable, setSelectedTable] = useState('T-3')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash' (Cash on Take Time) | 'card' | 'upi'

  // Mock Card Form
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardHolder, setCardHolder] = useState('')

  // Placed order record
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null)

  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + tax

  // Handle final payment & order placement
  const handlePlaceOrder = () => {
    if (cart.length === 0) return

    setCheckoutStep('processing')

    // Simulate payment gateway delay (e.g. 1.2s for card/UPI, instant for cash)
    const delay = paymentMethod === 'cash' ? 700 : 1300

    setTimeout(() => {
      const isPaid = paymentMethod !== 'cash'
      const newOrder = createOrder({
        orderType,
        tableNumber: orderType === 'dine_in' ? selectedTable : null,
        customerName: customerName.trim() || 'Online Guest',
        customerPhone: customerPhone.trim() || '+1 555-0199',
        pickupTime: orderType === 'dine_in' ? 'Seated Dining' : '10–15 mins',
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          notes: note.trim(),
        })),
        subtotal: totalPrice,
        tax,
        total: grandTotal,
        paymentMethod,
        paymentStatus: isPaid ? 'PAID' : 'PENDING_CASH',
        notes: note.trim() || (paymentMethod === 'cash' ? 'Cash on Take Time' : 'Online prepaid'),
      })

      setLastPlacedOrder(newOrder)
      clearCart()
      setCheckoutStep('success')
    }, delay)
  }

  const handleClose = () => {
    setCheckoutStep('cart')
    onClose()
  }

  // Available tables for Dine-in
  const availableTablesList = tables.filter((t) => t.status === 'available')

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
                  ? 'Payment & Order Details'
                  : checkoutStep === 'success'
                  ? 'Order Confirmed!'
                  : 'Your Coffee Bag'}
              </h2>
              <p className="text-[11px] text-amber-200">
                {checkoutStep === 'checkout'
                  ? 'Step 2 of 2: Select payment method'
                  : `${totalItems} handcrafted items`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-200 hover:bg-stone-800 transition"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: CART ITEMS VIEW */}
          {checkoutStep === 'cart' && (
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-6xl mb-4">☕</span>
                  <p className="font-bold text-lg mb-1" style={{ color: '#2c1a0a' }}>
                    Your cart is empty
                  </p>
                  <p className="text-sm max-w-xs" style={{ color: '#a86f35' }}>
                    Discover our freshly roasted single-origin coffees and baked pastries!
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2.5 rounded-full text-sm font-semibold transition hover:scale-105"
                    style={{ backgroundColor: '#2c1a0a', color: '#fdf8f0' }}
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-xs border border-[#f0e2cd]"
                    >
                      <div
                        className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5e9d3]"
                      >
                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            ☕
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-[#2c1a0a]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#a86f35] font-mono mt-0.5">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrement(item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-[#f5e9d3] text-[#2c1a0a] hover:scale-105 transition"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-[#2c1a0a]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increment(item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-[#2c1a0a] text-[#fdf8f0] hover:scale-105 transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Total price + remove */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0 pl-1">
                        <span className="font-bold text-sm text-[#2c1a0a] font-mono">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-rose-600 hover:scale-110 transition"
                          title="Remove item"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Special barista instructions */}
                  <div className="mt-2">
                    <label className="block text-xs font-semibold mb-1 text-[#6b4220]">
                      Special Barista Instructions
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g., Oat milk, extra hot, double shot, no sugar..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl text-xs outline-none bg-white border border-[#e8d0a9] text-[#2c1a0a] placeholder:text-stone-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT & PAYMENT SELECTION */}
          {checkoutStep === 'checkout' && (
            <div className="p-6 space-y-6">
              {/* Dining Mode (Takeaway vs Dine-In) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4220] mb-2">
                  1. How would you like your coffee?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrderType('takeaway')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      orderType === 'takeaway'
                        ? 'bg-[#2c1a0a] text-white border-[#2c1a0a] shadow-md'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">🥡</span>
                    <p className="font-bold text-sm">Takeaway / Pickup</p>
                    <p className="text-[11px] opacity-80 mt-0.5">Ready in 10–15 mins</p>
                  </button>

                  <button
                    onClick={() => setOrderType('dine_in')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                      orderType === 'dine_in'
                        ? 'bg-[#2c1a0a] text-white border-[#2c1a0a] shadow-md'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">☕</span>
                    <p className="font-bold text-sm">Dine-In (Table)</p>
                    <p className="text-[11px] opacity-80 mt-0.5">Served at your table</p>
                    {isHighOccupancyAlert && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-stone-900">
                        {occupancyPercentage}% Full
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Table Selector for Dine-In */}
              {orderType === 'dine_in' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">Choose Your Table:</span>
                    <span className="text-[11px] text-amber-800 font-semibold">
                      {availableTablesList.length} tables currently open
                    </span>
                  </div>

                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800 outline-none"
                  >
                    {tables.map((t) => (
                      <option
                        key={t.id}
                        value={t.id}
                        disabled={t.status === 'occupied' || t.status === 'cleaning'}
                      >
                        {t.name} ({t.section} • {t.capacity} seats) — {t.status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4220] mb-2">
                  2. Your Details
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Liam)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#e8d0a9] text-[#2c1a0a] outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile (for ready alert)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#e8d0a9] text-[#2c1a0a] outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Integration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4220] mb-2">
                  3. Select Payment Method
                </label>

                <div className="space-y-2.5">
                  {/* Option 1: Cash on Take Time */}
                  <label
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-400'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="mt-1 accent-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#2c1a0a] flex items-center gap-1.5">
                          💵 Cash on Take Time (Pay on Pickup)
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        No online card required now. Pay <strong>${grandTotal.toFixed(2)}</strong> in
                        cash at the counter when you take your coffee!
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Online Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col gap-2 p-3.5 rounded-2xl border transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-400'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-amber-600"
                      />
                      <span className="font-bold text-sm text-[#2c1a0a] flex items-center gap-1.5">
                        💳 Credit / Debit Card (Instant Pay)
                      </span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div
                        className="mt-2 space-y-2 pt-2 border-t border-amber-200 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          placeholder="Card Number: 4532 •••• •••• 8821"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs"
                          />
                          <input
                            type="password"
                            placeholder="CVV: 123"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Name on Card"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 3: UPI / QR Code */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-400'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1 accent-amber-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-sm text-[#2c1a0a] flex items-center gap-1.5">
                        📱 UPI / Digital Wallet QR Code
                      </span>
                      <p className="text-xs text-stone-600 mt-1">
                        Instant scan &amp; pay via Google Pay, PhonePe, Apple Pay.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT PROCESSING ANIMATION */}
          {checkoutStep === 'processing' && (
            <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-6" />
              <h3
                className="text-2xl font-bold text-[#2c1a0a] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {paymentMethod === 'cash'
                  ? 'Generating Your Coffee Token...'
                  : 'Processing Secure Payment...'}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Communicating with Bean &amp; Bloom live barista system. Please do not close this
                window.
              </p>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS & ACTION BUTTONS */}
          {checkoutStep === 'success' && lastPlacedOrder && (
            <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 text-4xl flex items-center justify-center shadow-inner">
                ✓
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-stone-950 font-mono">
                  Token {lastPlacedOrder.token}
                </span>
                <h3
                  className="text-3xl font-bold text-[#2c1a0a] mt-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Order Placed!
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Order ID: <span className="font-mono font-bold">{lastPlacedOrder.id}</span>
                </p>
              </div>

              {/* Status info box */}
              <div className="w-full p-4 rounded-2xl bg-white border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Service:</span>
                  <span className="font-bold text-stone-800">
                    {lastPlacedOrder.orderType === 'dine_in'
                      ? `Dine-In • Table ${lastPlacedOrder.tableNumber}`
                      : 'Takeaway (Pick-up)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span
                    className={`font-bold ${
                      lastPlacedOrder.paymentMethod === 'cash'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {lastPlacedOrder.paymentMethod === 'cash'
                      ? `💵 Cash on Take Time ($${lastPlacedOrder.total.toFixed(2)})`
                      : '💳 Paid Online'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-100">
                  <span className="text-stone-500">Est. Ready:</span>
                  <span className="font-bold text-[#2c1a0a]">10–15 minutes</span>
                </div>
              </div>

              {/* Action Buttons: Bill Format & Live Tracker */}
              <div className="w-full space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setActiveBillOrder(lastPlacedOrder)
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#2c1a0a] hover:bg-[#4a2e15] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>🧾</span> View &amp; Print Bill Receipt
                </button>

                <button
                  onClick={() => {
                    handleClose()
                    setTrackerOpen(true)
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>📍</span> Track Live Order Progress
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 transition"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Drawer Action Footer */}
        {cart.length > 0 && checkoutStep !== 'success' && checkoutStep !== 'processing' && (
          <div className="px-6 py-4 border-t border-[#e8d0a9] bg-white">
            <div className="space-y-1.5 mb-3 text-xs text-[#6b4220]">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-mono">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2c1a0a] pt-1.5 border-t border-[#e8d0a9]">
                <span>Total</span>
                <span className="font-mono text-amber-800">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all bg-amber-500 hover:bg-amber-400 text-[#2c1a0a] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <span>·</span>
                <span className="font-mono">${grandTotal.toFixed(2)}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3 rounded-2xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm transition-all bg-[#2c1a0a] hover:bg-[#4a2e15] text-[#fdf8f0] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {paymentMethod === 'cash' ? (
                    <span>💵 Confirm Order (Cash on Pickup)</span>
                  ) : (
                    <span>☕ Pay &amp; Place Order · ${grandTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
