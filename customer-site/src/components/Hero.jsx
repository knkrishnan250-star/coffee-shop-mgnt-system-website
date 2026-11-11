import { useCustomerOrder } from '../context/CustomerOrderContext'

export default function Hero() {
  const { shopSettings } = useCustomerOrder()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden bg-gradient-to-b from-[#2c1a0a] via-[#3a2010] to-[#2c1a0a] text-white"
    >
      {/* Background accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span>📍 Swaraj Round South, Thrissur</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Authentic Kerala Kaapi &amp; Artisan Brews
          </h1>

          <p className="text-base sm:text-lg text-[#e8d0a9] max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Welcome to {shopSettings.name}. Freshly roasted single-origin Wayanad coffee, traditional brass dabarah kaapi, and hot Kerala bakes right opposite the historic Vadakkunnathan Temple grounds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="#menu"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg bg-amber-500 hover:bg-amber-400 text-[#2c1a0a]"
            >
              Order Online · Pay on Pickup
            </a>
            <a
              href="#location"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-white/10 border border-[#e8d0a9]/40 text-[#fdf8f0]"
            >
              Visit Cafe in Thrissur
            </a>
          </div>

          {/* Quick Info badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-900/40 text-center lg:text-left">
            <div>
              <span className="font-mono text-2xl font-black text-amber-400">₹20–₹200</span>
              <p className="text-[11px] text-[#e8d0a9]/80 uppercase mt-0.5">Pocket-friendly</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-black text-amber-400">100%</span>
              <p className="text-[11px] text-[#e8d0a9]/80 uppercase mt-0.5">Kerala Roasted</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-black text-amber-400">7 AM–11 PM</span>
              <p className="text-[11px] text-[#e8d0a9]/80 uppercase mt-0.5">Daily in Thrissur</p>
            </div>
          </div>
        </div>

        {/* Right Column Visual */}
        <div className="relative flex justify-center z-10">
          <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/50 relative">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80&auto=format&fit=crop"
              alt="Kerala Filter Kaapi"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <span className="px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-black text-xs uppercase font-mono">
                  From ₹35
                </span>
                <p className="text-white font-bold text-lg mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Traditional Brass Dabarah Kaapi
                </p>
                <p className="text-amber-200 text-xs">Fresh cow milk • Wayanad Robusta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
