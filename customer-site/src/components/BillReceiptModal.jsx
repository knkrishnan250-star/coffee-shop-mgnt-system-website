import { useState } from 'react'
import { useCustomerOrder } from '../context/CustomerOrderContext'

export default function BillReceiptModal({ order, onClose }) {
  const { shopSettings } = useCustomerOrder()
  const [copied, setCopied] = useState(false)

  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `
=== ${shopSettings.name.toUpperCase()} ===
${shopSettings.address}
GSTIN: ${shopSettings.gstin} | FSSAI: ${shopSettings.fssai}
Invoice: ${order.id} | Token: ${order.token}
Date: ${new Date(order.createdAt).toLocaleString()}
Type: ${order.orderType === 'dine_in' ? `Dine-In (${order.tableNumber})` : 'Takeaway (Pick-up)'}
Customer: ${order.customerName || 'Valued Guest'} (${order.customerPhone || 'N/A'})
------------------------------------------
${order.items.map((i) => `${i.qty}x ${i.name} - ₹${(i.price * i.qty).toFixed(2)}`).join('\n')}
------------------------------------------
Subtotal: ₹${order.subtotal?.toFixed(2) || '0.00'}
CGST (2.5%): ₹${((order.tax || 0) / 2).toFixed(2)}
SGST (2.5%): ₹${((order.tax || 0) / 2).toFixed(2)}
TOTAL DUE: ₹${order.total?.toFixed(2) || '0.00'}
Payment: PAY ON PICKUP TIME (${order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING AT COUNTER'})
==========================================
Thank you for visiting! Thrissur, Kerala.
    `.trim()

    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPaid = order.paymentStatus === 'PAID'
  const halfTax = ((order.tax || 0) / 2).toFixed(2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Top actions banner */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2c1a0a] text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <span className="font-semibold text-sm">Official Cafe Bill Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#a86f35] hover:bg-[#8b5a2b] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>🖨️</span> Print
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>📋</span> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-sm ml-1 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Thermal Bill Content */}
        <div className="p-6 md:p-8 text-stone-800 bg-[#fffdfa]" id="printable-bill">
          {/* Cafe Header */}
          <div className="text-center pb-4 border-b border-dashed border-stone-300">
            <div className="text-2xl mb-1">☕</div>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
            >
              {shopSettings.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#a86f35] font-bold">
              {shopSettings.tagline}
            </p>
            <p className="text-xs text-stone-600 mt-1">{shopSettings.address}</p>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              GSTIN: {shopSettings.gstin} • FSSAI: {shopSettings.fssai}
            </p>
            <p className="text-xs text-stone-500 font-mono">Phone: {shopSettings.phone}</p>
          </div>

          {/* Token & Order Banner */}
          <div className="my-4 py-3 px-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Order Token
              </p>
              <p className="text-2xl font-black text-[#2c1a0a] font-mono">{order.token}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  order.orderType === 'dine_in'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {order.orderType === 'dine_in'
                  ? `Dine-In • Table ${order.tableNumber || '1'}`
                  : 'Takeaway / Pickup'}
              </span>
              <p className="text-xs font-mono text-stone-500 mt-1">{order.id}</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 text-xs py-2 border-b border-stone-200 gap-y-1 text-stone-600">
            <div>
              <span className="font-semibold text-stone-700">Date:</span>{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </div>
            <div className="text-right">
              <span className="font-semibold text-stone-700">Time:</span>{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>
              <span className="font-semibold text-stone-700">Guest:</span>{' '}
              {order.customerName || 'Customer'}
            </div>
            <div className="text-right">
              <span className="font-semibold text-stone-700">Counter:</span> Swaraj-Reg-01
            </div>
          </div>

          {/* Line Items */}
          <div className="py-4 border-b border-dashed border-stone-300">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-200">
              <span className="w-1/2">Item Description</span>
              <span className="w-1/6 text-center">Qty</span>
              <span className="w-1/6 text-right">Rate</span>
              <span className="w-1/6 text-right">Amount</span>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {order.items?.map((item, index) => (
                <div key={index} className="py-2.5 flex items-start text-xs">
                  <div className="w-1/2 pr-2">
                    <p className="font-semibold text-stone-800">{item.name}</p>
                    {item.notes && (
                      <p className="text-[10px] text-amber-700 italic">“{item.notes}”</p>
                    )}
                  </div>
                  <div className="w-1/6 text-center text-stone-600 font-mono">{item.qty}</div>
                  <div className="w-1/6 text-right text-stone-600 font-mono">
                    ₹{item.price}
                  </div>
                  <div className="w-1/6 text-right font-bold text-stone-900 font-mono">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials & GST */}
          <div className="py-3 border-b border-stone-200 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-mono">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (2.5%)</span>
              <span className="font-mono">₹{halfTax}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (2.5%)</span>
              <span className="font-mono">₹{halfTax}</span>
            </div>
            <div className="flex justify-between items-center text-base font-black text-[#2c1a0a] pt-2 border-t border-stone-300">
              <span>NET TOTAL DUE</span>
              <span className="font-mono text-lg text-amber-800">
                ₹{order.total?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Payment Method Notice: UPI vs Pay on Counter */}
          <div className="py-3.5 my-2 rounded-xl bg-amber-50 border border-amber-200 px-3 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-700">Payment Method:</span>
              <span className="font-bold text-stone-900">
                {order.paymentMethod === 'upi' ? '📱 UPI Online Payment' : '💵 Pay on Counter (Cash / Counter UPI)'}
              </span>
            </div>
            {order.upiId && order.paymentMethod === 'upi' && (
              <div className="flex justify-between items-center text-[11px] font-mono text-stone-600">
                <span>VPA / UPI ID:</span>
                <span className="font-bold text-amber-900">{order.upiId}</span>
              </div>
            )}
            {order.upiRef && (
              <div className="flex justify-between items-center text-[11px] font-mono text-stone-600">
                <span>Ref / UTR:</span>
                <span>{order.upiRef}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-amber-200">
              <span className="font-bold text-stone-700">Status:</span>
              <span
                className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'
                }`}
              >
                {isPaid ? '✓ PAID IN FULL' : '⏳ PENDING - PAY AT COUNTER'}
              </span>
            </div>
            {!isPaid && (
              <p className="text-[11px] text-amber-800 pt-1">
                Please pay <strong>₹{order.total?.toFixed(2)}</strong> via Cash or UPI when collecting
                your order.
              </p>
            )}
          </div>

          {/* Barcode & WiFi */}
          <div className="mt-4 pt-3 text-center border-t border-dashed border-stone-300">
            <div className="flex justify-center items-center gap-[3px] h-8 my-2 opacity-80 overflow-hidden">
              {[2, 4, 1, 3, 5, 2, 6, 2, 3, 1, 4, 2, 5, 3, 1, 4, 2, 6, 3, 2, 4, 1, 5, 2].map(
                (w, idx) => (
                  <div key={idx} className="bg-black h-full" style={{ width: `${w}px` }} />
                )
              )}
            </div>
            <p className="font-mono text-[10px] text-stone-400 tracking-widest">{order.id}</p>
            <p className="text-[10px] text-stone-500 mt-2">
              Free Guest WiFi: <strong>BeanBloom_Thrissur</strong> • Password: <strong>kaapi123</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-2xl bg-[#2c1a0a] hover:bg-[#4a2e15] text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🖨️</span> Print Bill Receipt
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-stone-200 text-stone-800 font-semibold text-sm border border-stone-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
