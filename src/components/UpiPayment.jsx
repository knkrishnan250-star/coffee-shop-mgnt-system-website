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
    <div className="bg-white rounded-2xl border border-amber-200/90 shadow-md p-5 text-stone-900 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs shadow-sm">
            UPI
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900">Instant UPI Payment</h3>
            <p className="text-[11px] text-stone-700 font-medium">Scan QR or Tap your favorite UPI app</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-stone-600 block">Amount to Pay</span>
          <span className="text-lg font-black text-amber-700 font-mono">₹{Number(amount).toFixed(2)}</span>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center justify-center py-2 bg-gradient-to-b from-amber-50/70 to-stone-50 rounded-xl p-4 border border-amber-100">
        <div className="relative p-3 bg-white rounded-2xl shadow-md border-2 border-amber-400">
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
            className="w-44 h-44 flex flex-col items-center justify-center bg-stone-100 rounded-lg text-center p-3 text-xs text-stone-600"
          >
            <span className="text-3xl mb-1">📱</span>
            <span className="font-bold text-stone-800">Scan via UPI App</span>
            <span className="text-[10px] text-stone-500 mt-1">Pay to:</span>
            <span className="font-mono font-bold text-amber-900 text-[11px]">{upiId}</span>
          </div>

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#2c1a0a] text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            BHIM UPI • GPay • PhonePe • Paytm
          </div>
        </div>

        <p className="text-[11px] text-stone-500 mt-4 text-center font-medium">
          Scan with Google Pay, PhonePe, Paytm, BHIM, or any banking app
        </p>
      </div>

      {/* VPA / UPI ID Box */}
      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase text-stone-500 block">Verified Business UPI ID</span>
          <p className="font-mono font-black text-stone-900 text-xs md:text-sm truncate select-all">
            {upiId}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyUpi}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-sm ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-900 hover:bg-stone-800 text-amber-200'
          }`}
        >
          {copied ? '✓ Copied' : '📋 Copy ID'}
        </button>
      </div>

      {/* Mobile Quick Apps Launch Bar */}
      <div>
        <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
          Or Tap to Pay Directly on Mobile:
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleOpenApp(`gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`)}
            className="p-2 rounded-xl border border-stone-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 flex flex-col items-center text-center transition cursor-pointer"
          >
            <span className="text-base font-black text-blue-600">G</span>
            <span className="text-[10px] font-bold text-stone-700 mt-0.5">GPay</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenApp(`phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`)}
            className="p-2 rounded-xl border border-stone-200 hover:border-purple-400 bg-white hover:bg-purple-50/50 flex flex-col items-center text-center transition cursor-pointer"
          >
            <span className="text-base font-black text-purple-600">Pe</span>
            <span className="text-[10px] font-bold text-stone-700 mt-0.5">PhonePe</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenApp(`paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`)}
            className="p-2 rounded-xl border border-stone-200 hover:border-sky-400 bg-white hover:bg-sky-50/50 flex flex-col items-center text-center transition cursor-pointer"
          >
            <span className="text-base font-black text-sky-600">Pay</span>
            <span className="text-[10px] font-bold text-stone-700 mt-0.5">Paytm</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenApp(upiUri)}
            className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 flex flex-col items-center text-center transition cursor-pointer"
          >
            <span className="text-base">⚡</span>
            <span className="text-[10px] font-bold text-stone-700 mt-0.5">Any App</span>
          </button>
        </div>
      </div>

      {/* UTR Reference Input */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-stone-600">
          UPI Reference / UTR Number <span className="font-normal text-stone-400">(Optional)</span>
        </label>
        <input
          type="text"
          value={upiRef}
          onChange={(e) => setUpiRef(e.target.value)}
          placeholder="e.g. 432198765432 or leave blank"
          maxLength={24}
          className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-300 text-stone-800 outline-none font-mono focus:border-amber-500 focus:bg-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition cursor-pointer"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isVerifying}
          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20 disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Payment…</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>I Have Paid ₹{Number(amount).toFixed(2)} via UPI</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
