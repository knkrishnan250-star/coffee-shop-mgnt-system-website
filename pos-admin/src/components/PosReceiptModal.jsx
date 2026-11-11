import { useAdmin } from '../context/AdminContext'

export default function PosReceiptModal({ order, onClose }) {
  const { shopSettings } = useAdmin()

  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  const isPaid = order.paymentStatus === 'PAID'
  const halfTax = ((order.tax || 0) / 2).toFixed(2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-sm bg-white text-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none text-xs">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 text-white print:hidden">
          <div className="flex items-center gap-2 font-medium">
            <span>🧾</span>
            <span>Register Receipt #{order.token}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition cursor-pointer"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Thermal Content */}
        <div className="p-6 text-zinc-800 bg-white" id="printable-bill">
          <div className="text-center pb-3 border-b border-dashed border-zinc-300">
            <h2 className="text-base font-bold tracking-tight text-zinc-950 uppercase">
              {shopSettings.name}
            </h2>
            <p className="text-[11px] text-zinc-500">{shopSettings.address}</p>
            <p className="text-[11px] text-zinc-500 font-mono">
              GSTIN: {shopSettings.gstin} • FSSAI: {shopSettings.fssai}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">Ph: {shopSettings.phone}</p>
          </div>

          <div className="my-3 py-2 px-3 rounded-lg bg-zinc-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Token</span>
              <p className="text-lg font-black text-zinc-950 font-mono">{order.token}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                {order.orderType === 'dine_in'
                  ? `Table ${order.tableNumber || '1'}`
                  : 'Takeaway'}
              </span>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">{order.id}</p>
            </div>
          </div>

          <div className="space-y-1 py-1 border-b border-zinc-200 text-[11px] text-zinc-600">
            <div className="flex justify-between">
              <span>Date &amp; Time:</span>
              <span>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Guest:</span>
              <span className="font-medium text-zinc-900">{order.customerName || 'Walk-in'}</span>
            </div>
            <div className="flex justify-between">
              <span>Counter:</span>
              <span>Swaraj-POS-01</span>
            </div>
          </div>

          {/* Items */}
          <div className="py-3 border-b border-dashed border-zinc-300">
            <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400 pb-1">
              <span>Item</span>
              <span>Qty / Rate</span>
              <span>Total</span>
            </div>
            <div className="space-y-2 mt-1">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <div className="pr-2">
                    <span className="font-semibold text-zinc-900">{item.name}</span>
                    {item.notes && <p className="text-[10px] text-zinc-500 italic">({item.notes})</p>}
                  </div>
                  <div className="font-mono text-zinc-500">
                    {item.qty} × ₹{item.price}
                  </div>
                  <div className="font-mono font-bold text-zinc-900">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials & GST */}
          <div className="py-2.5 border-b border-zinc-200 space-y-1 text-[11px]">
            <div className="flex justify-between text-zinc-600">
              <span>Item Subtotal</span>
              <span className="font-mono">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>CGST (2.5%)</span>
              <span className="font-mono">₹{halfTax}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>SGST (2.5%)</span>
              <span className="font-mono">₹{halfTax}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-zinc-950 pt-1 border-t border-zinc-200">
              <span>Total Due</span>
              <span className="font-mono">₹{order.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="my-2.5 p-2 rounded bg-zinc-50 border border-zinc-200 text-[11px] space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">Method:</span>
              <span className="font-bold text-zinc-900">
                {order.paymentMethod === 'upi' ? '📱 UPI Online Payment' : '💵 Pay on Counter'}
              </span>
            </div>
            {order.paymentMethod === 'upi' && (
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>VPA / UPI ID:</span>
                <span>{order.upiId || shopSettings.upiId || 'ananthukrishna250@oksbi'}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-zinc-200">
              <span className="text-zinc-600">Status:</span>
              <span className={`font-bold uppercase ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isPaid ? '✓ PAID IN FULL' : '⏳ PENDING - PAY AT COUNTER'}
              </span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-zinc-400">
            Thank you for visiting {shopSettings.name}, Thrissur!
          </div>
        </div>

        <div className="p-3 bg-zinc-100 border-t border-zinc-200 flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition cursor-pointer"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
