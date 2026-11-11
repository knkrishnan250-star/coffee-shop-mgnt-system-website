import { useCustomerOrder } from '../context/CustomerOrderContext'

export default function Location() {
  const { shopSettings } = useCustomerOrder()

  return (
    <section id="location" className="py-24 px-6 bg-[#fdf8f0]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-3 text-[#a86f35]">
            Find Us in Kerala
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Visit Our Thrissur Coffee House
          </h2>
          <p className="text-base max-w-xl mx-auto text-[#6b4220]">
            Located right at Swaraj Round with ample parking, breezy verandah seating, and AC lounge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#e8d0a9] shadow-xs">
            <span className="text-3xl block mb-4">📍</span>
            <h3 className="text-lg font-bold text-[#2c1a0a] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Address
            </h3>
            <p className="text-sm text-[#6b4220] leading-relaxed">
              {shopSettings.address}
            </p>
            <p className="text-xs text-[#a86f35] font-semibold mt-3">
              Landmark: Opp. South Gopuram, Thekkinkadu Maidan
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#e8d0a9] shadow-xs">
            <span className="text-3xl block mb-4">🕒</span>
            <h3 className="text-lg font-bold text-[#2c1a0a] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Opening Hours
            </h3>
            <p className="text-sm text-[#6b4220] leading-relaxed">
              <strong>{shopSettings.hours}</strong>
            </p>
            <p className="text-xs text-[#a86f35] font-semibold mt-3">
              Hot decoction brewing starting 7:00 AM sharp!
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#e8d0a9] shadow-xs">
            <span className="text-3xl block mb-4">📞</span>
            <h3 className="text-lg font-bold text-[#2c1a0a] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Call &amp; Direct Pickup
            </h3>
            <p className="text-sm text-[#6b4220] leading-relaxed">
              Phone: <strong>{shopSettings.phone}</strong>
            </p>
            <p className="text-xs text-[#a86f35] font-semibold mt-3">
              Email: {shopSettings.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
