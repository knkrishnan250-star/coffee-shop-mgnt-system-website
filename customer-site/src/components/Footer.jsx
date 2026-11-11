import { useCustomerOrder } from '../context/CustomerOrderContext'

export default function Footer() {
  const { shopSettings } = useCustomerOrder()

  const currentYear = 2026

  return (
    <footer className="bg-[#2c1a0a] text-[#fdf8f0] py-16 px-6 border-t border-amber-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {shopSettings.name}
            </span>
          </div>
          <p className="text-xs text-[#e8d0a9] max-w-sm leading-relaxed">
            {shopSettings.tagline}. Roasting the finest Wayanad &amp; Coorg coffee beans in Thrissur, Kerala.
          </p>
          <div className="text-[11px] text-[#e8d0a9]/70 space-y-1 font-mono">
            <p>GSTIN: {shopSettings.gstin}</p>
            <p>FSSAI Lic No: {shopSettings.fssai}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs text-[#e8d0a9]">
            <li><a href="#home" className="hover:text-amber-400">Home</a></li>
            <li><a href="#menu" className="hover:text-amber-400">Menu (₹20 – ₹200)</a></li>
            <li><a href="#about" className="hover:text-amber-400">Thrissur Story</a></li>
            <li><a href="#location" className="hover:text-amber-400">Location &amp; Hours</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Visit Us</h4>
          <p className="text-xs text-[#e8d0a9] leading-relaxed">
            {shopSettings.address}
          </p>
          <p className="text-xs text-amber-300 font-mono">
            {shopSettings.phone}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-stone-800 text-center text-xs text-[#e8d0a9]/60">
        © {currentYear} {shopSettings.name}, Thrissur, Kerala. All rights reserved.
      </div>
    </footer>
  )
}
