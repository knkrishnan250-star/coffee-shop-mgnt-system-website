import { useCart } from '../context/CartContext'

const featured = [
  {
    id: 1,
    name: 'Traditional Kerala Filter Kaapi',
    price: 35,
    tag: 'All-Time Thrissur Favorite',
    desc: 'Wayanad robusta & chicory freshly decocted with frothed cow milk in traditional brass dabarah.',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80&auto=format&fit=crop',
    notes: ['Wayanad Estate', 'Pure Brass Dabarah', 'Fresh Cow Milk'],
  },
  {
    id: 5,
    name: 'Cardamom Spiced Latte',
    price: 120,
    tag: 'House Special',
    desc: 'Freshly crushed Idukki green cardamom steamed with velvety microfoam milk and espresso.',
    img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&q=80&auto=format&fit=crop',
    notes: ['Idukki Cardamom', 'Oat or Dairy', 'Velvet Foam'],
  },
  {
    id: 8,
    name: 'Malabar Cold Brew',
    price: 110,
    tag: '18-Hour Brewed',
    desc: 'Slow steeped in chilled spring water for 18 hours. Ultra-smooth with notes of dark cacao.',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&auto=format&fit=crop',
    notes: ['Zero Acidity', 'Dark Chocolate', 'Over Ice'],
  },
]

export default function FeaturedCoffees() {
  const { addItem } = useCart()

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#fdf8f0' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-3 text-[#a86f35]">
            Handcrafted In Thrissur
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Signature Brews
          </h2>
          <p className="text-base max-w-xl mx-auto text-[#6b4220]">
            Prepared fresh to order right in the heart of cultural Kerala.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((coffee) => (
            <div
              key={coffee.id}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col bg-white border border-[#e8d0a9]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={coffee.img}
                  alt={coffee.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-md bg-amber-500 text-[#2c1a0a]"
                >
                  {coffee.tag}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
                    >
                      {coffee.name}
                    </h3>
                    <span className="font-mono text-xl font-bold text-[#a86f35]">
                      ₹{coffee.price}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed mb-4 text-[#6b4220]">{coffee.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {coffee.notes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#f5e9d3] text-[#4a2e15]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => addItem(coffee)}
                  className="w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer bg-[#2c1a0a] hover:bg-amber-600 text-[#fdf8f0]"
                >
                  Add to Bag · ₹{coffee.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
