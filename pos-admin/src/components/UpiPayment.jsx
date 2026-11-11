import { useState } from 'react'

export const DEFAULT_UPI_ID = 'ananthukrishna250@oksbi'
export const DEFAULT_UPI_NAME = 'Bean & Bloom Coffee House'

export function createUpiUri({
  upiId = DEFAULT_UPI_ID,
  name = DEFAULT_UPI_NAME,
  amount,
  token = '',
}) {
  const am = Number(amount || 0).toFixed(2)
  const tn = encodeURIComponent(`Order ${token || 'Coffee'}`)
  const pn = encodeURIComponent(name)
  return `upi://pay?pa=${upiId}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
}

export default function UpiPayment({
  amount,
  orderToken = '',
  upiId = DEFAULT_UPI_ID,
  payeeName = DEFAULT_UPI_NAME,
  onSuccess,
  onCancel,
}) {
  const [copied, setCopied] = useState(false)
  const [upiRef, setUpiRef] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const upiUri = createUpiUri({
    upiId,
    name: payeeName,
    amount,
    token: orderToken,
  })

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    upiUri
  )}`

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback
    }
  }

  const handleOpenApp = (appScheme) => {
    if (appScheme) {
      window.location.href = appScheme
    } else {
      window.location.href = upiUri
    }
  }

  const handleConfirm = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (onSuccess) {
        onSuccess({
          paymentMethod: 'upi',
          paymentStatus: 'PAID',
          upiId,
          upiRef: upiRef.trim() || `UPI-TXN-${Date.now().toString().slice(-6)}`,
        })
      }
    }, 600)
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-xl p-5 text-zinc-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-xs shadow-sm">
            UPI
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-100">Customer UPI Payment QR</h3>
            <p className="text-[11px] text-zinc-400">Display this QR to guest at counter</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Due</span>
          <span className="text-lg font-black text-amber-400 font-mono">₹{Number(amount).toFixed(2)}</span>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center justify-center py-2 bg-zinc-950 rounded-xl p-4 border border-zinc-800">
        <div className="relative p-3 bg-white rounded-2xl shadow-md border-2 border-amber-500">
          <img
            src={qrUrl}
            alt="UPI QR Code"
            className="w-44 h-44 object-contain rounded-lg"
            loading="eager"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
          <div
            style={{ display: 'none' }}
            className="w-44 h-44 flex flex-col items-center justify-center bg-zinc-100 text-zinc-900 rounded-lg text-center p-3 text-xs"
          >
            <span className="text-3xl mb-1">📱</span>
            <span className="font-bold text-zinc-900">Scan via UPI App</span>
            <span className="text-[10px] text-zinc-500 mt-1">Pay to:</span>
            <span className="font-mono font-bold text-amber-900 text-[11px]">{upiId}</span>
          </div>

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-zinc-950 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-sm whitespace-nowrap">
            BHIM UPI • GPay • PhonePe • Paytm
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 mt-4 text-center font-mono">
          Ask customer to scan with any UPI App
        </p>
      </div>

      {/* VPA / UPI ID Box */}
      <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Shop UPI ID</span>
          <p className="font-mono font-bold text-zinc-200 text-xs md:text-sm truncate select-all">
            {upiId}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyUpi}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
          }`}
        >
          {copied ? '✓ Copied' : '📋 Copy ID'}
        </button>
      </div>

      {/* UTR Reference Input */}
      <div className="space-y-1">
        <label className="block text-[11px] font-mono text-zinc-400">
          UPI UTR / Bank Reference No. <span className="text-zinc-600">(Optional)</span>
        </label>
        <input
          type="text"
          value={upiRef}
          onChange={(e) => setUpiRef(e.target.value)}
          placeholder="e.g. 432198765432"
          maxLength={24}
          className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-700 text-zinc-200 outline-none font-mono focus:border-amber-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-mono text-zinc-300 transition cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isVerifying}
          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying UPI…</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Confirm UPI Received (₹{Number(amount).toFixed(2)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
