import { useCustomerOrder } from '../context/CustomerOrderContext'

export default function About() {
  const { shopSettings } = useCustomerOrder()

  return (
    <section id="about" className="py-24 px-6 bg-[#f5e9d3]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-xs font-bold tracking-widest uppercase text-[#a86f35]">
            Our Story in the Cultural Capital
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Rooted in Thrissur’s Kaapi Culture
          </h2>
          <p className="text-base text-[#6b4220] leading-relaxed">
            Nestled on the iconic Swaraj Round in Thrissur, {shopSettings.name} was born out of a deep reverence for Kerala’s coffee heritage. We source beans directly from generational coffee planters in the high-range hills of Wayanad and Coorg.
          </p>
          <p className="text-base text-[#6b4220] leading-relaxed">
            Whether you’re on an evening stroll around the Thekkinkadu Maidan after temple darshan, or catching up with friends over a hot cup of Sukku Kaapi and crispy Pazham Pori, our doors are open with authentic warmth.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#e8d0a9]">
              <span className="text-2xl font-black text-[#2c1a0a] font-mono">₹20</span>
              <p className="text-xs text-[#a86f35] font-semibold mt-1">Starting Price Point</p>
              <p className="text-[11px] text-stone-500">Accessible artisan quality</p>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#e8d0a9]">
              <span className="text-2xl font-black text-[#2c1a0a] font-mono">100%</span>
              <p className="text-xs text-[#a86f35] font-semibold mt-1">Pay on Pickup</p>
              <p className="text-[11px] text-stone-500">Order online, pay at counter</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-[#e8d0a9] h-96">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80&auto=format&fit=crop"
              alt="Cafe in Thrissur"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
