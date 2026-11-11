import { useState } from 'react'

export default function BillReceiptModal({ order, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `
=== BEAN & BLOOM ARTISAN COFFEE ===
Invoice: ${order.id} | Token: ${order.token}
Date: ${new Date(order.createdAt).toLocaleString()}
Type: ${order.orderType === 'dine_in' ? `Dine-In (${order.tableNumber})` : 'Takeaway (Pick-up)'}
Customer: ${order.customerName || 'Valued Guest'} (${order.customerPhone || 'N/A'})
------------------------------------------
${order.items.map((i) => `${i.qty}x ${i.name} - $${(i.price * i.qty).toFixed(2)}`).join('\n')}
------------------------------------------
Subtotal: $${order.subtotal?.toFixed(2) || '0.00'}
Tax (8%): $${order.tax?.toFixed(2) || '0.00'}
TOTAL: $${order.total?.toFixed(2) || '0.00'}
Payment: ${order.paymentMethod?.toUpperCase()} (${order.paymentStatus})
==========================================
Thank you for your visit!
    `.trim()

    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isCash = order.paymentMethod === 'cash'
  const isPaid = order.paymentStatus === 'PAID'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Top actions banner (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2c1a0a] text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <span className="font-semibold text-sm">Official Customer Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#a86f35] hover:bg-[#8b5a2b] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Print thermal bill"
            >
              <span>🖨️</span> Print
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Copy text"
            >
              <span>📋</span> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-sm ml-1 transition cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Thermal Bill Content (Formatted for standard POS receipt layout) */}
        <div className="p-6 md:p-8 text-stone-800 bg-[#fffdfa]" id="printable-bill">
          {/* Cafe Header */}
          <div className="text-center pb-4 border-b border-dashed border-stone-300">
            <div className="text-2xl mb-1">☕</div>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
            >
              BEAN &amp; BLOOM
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#a86f35] font-bold">
              Artisan Coffee Roasters
            </p>
            <p className="text-xs text-stone-500 mt-1">124 Espresso Lane, Arts District</p>
            <p className="text-xs text-stone-500">Phone: +1 (555) 382-2633 • Tax ID: BB-99214</p>
          </div>

          {/* Token & Order Banner */}
          <div className="my-4 py-3 px-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Order Token
              </p>
              <p className="text-2xl font-black text-[#2c1a0a]">{order.token}</p>
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
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="text-right">
              <span className="font-semibold text-stone-700">Time:</span>{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>
              <span className="font-semibold text-stone-700">Guest:</span>{' '}
              {order.customerName || 'Walk-in Guest'}
            </div>
            <div className="text-right">
              <span className="font-semibold text-stone-700">Cashier:</span> POS-Reg-01
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-4 border-b border-dashed border-stone-300">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-200">
              <span className="w-1/2">Item Description</span>
              <span className="w-1/6 text-center">Qty</span>
              <span className="w-1/6 text-right">Price</span>
              <span className="w-1/6 text-right">Total</span>
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
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="w-1/6 text-right font-bold text-stone-900 font-mono">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="py-3 border-b border-stone-200 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">${order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>State / City Tax (8%)</span>
              <span className="font-mono">${order.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Packaging &amp; Eco Cup Fee</span>
              <span className="font-mono">$0.00 (Free)</span>
            </div>
            <div className="flex justify-between items-center text-base font-black text-[#2c1a0a] pt-2 border-t border-stone-300">
              <span>GRAND TOTAL</span>
              <span className="font-mono text-lg text-emerald-700">
                ${order.total?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Payment Status & Details */}
          <div className="py-3.5 my-2 rounded-xl bg-stone-50 border border-stone-200 px-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-700">Payment Method:</span>
              <span className="uppercase font-semibold text-stone-800">
                {order.paymentMethod === 'cash'
                  ? '💵 Cash on Take Time (Pickup)'
                  : order.paymentMethod === 'upi'
                  ? '📱 UPI / QR Scan'
                  : '💳 Credit/Debit Card'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1.5 pt-1.5 border-t border-stone-200/60">
              <span className="font-bold text-stone-700">Payment Status:</span>
              <span
                className={`px-2 py-0.5 rounded font-black text-[11px] uppercase tracking-wide ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isPaid ? '✓ PAID IN FULL' : '⏳ PENDING - CASH AT COUNTER'}
              </span>
            </div>
            {isCash && !isPaid && (
              <p className="text-[11px] text-amber-700 mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                💡 Please pay <strong>${order.total?.toFixed(2)}</strong> in cash when collecting
                your order at the counter!
              </p>
            )}
          </div>

          {/* Barcode & WiFi Details */}
          <div className="mt-4 pt-3 text-center border-t border-dashed border-stone-300">
            {/* Visual barcode mockup */}
            <div className="flex justify-center items-center gap-[3px] h-9 my-2 opacity-80 overflow-hidden">
              {[2, 4, 1, 3, 5, 2, 6, 2, 3, 1, 4, 2, 5, 3, 1, 4, 2, 6, 3, 2, 4, 1, 5, 2].map(
                (w, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                )
              )}
            </div>
            <p className="font-mono text-[10px] text-stone-400 tracking-widest">{order.id}</p>

            <div className="mt-3 text-[11px] text-stone-500">
              <p className="font-semibold text-[#2c1a0a]">Brewed with ❤️ Bean &amp; Bloom</p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                Complimentary WiFi: <strong>BeanBloom_Guest</strong> • Password: <strong>coffee123</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
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
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
