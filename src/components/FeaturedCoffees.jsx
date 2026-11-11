import { useState } from 'react'
import { useCart } from '../context/CartContext'

const featured = [
  {
    id: 'f1',
    name: 'Signature Espresso',
    tagline: 'Bold, rich & unforgettable',
    price: 4.50,
    img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80&auto=format&fit=crop',
    badge: 'Best Seller',
    badgeColor: '#f59e0b',
    description: 'Our signature double-shot espresso, brewed from single-origin Ethiopian beans with chocolate and berry notes.',
  },
  {
    id: 'f2',
    name: 'Caramel Bloom Latte',
    tagline: 'Silky smooth perfection',
    price: 5.50,
    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80&auto=format&fit=crop',
    badge: 'Fan Favourite',
    badgeColor: '#a86f35',
    description: 'Velvety steamed milk, a double shot of espresso, and our house-made salted caramel drizzle.',
  },
  {
    id: 'f3',
    name: 'Iced Brown Sugar Oat',
    tagline: 'Cool & indulgently sweet',
    price: 6.00,
    img: 'https://images.unsplash.com/photo-1579954115563-e72bf1697784?w=600&q=80&auto=format&fit=crop',
    badge: 'Seasonal',
    badgeColor: '#6b4220',
    description: 'Cold-brewed espresso over oat milk, brown sugar syrup, and cinnamon foam — a summer staple.',
  },
]

export default function FeaturedCoffees() {
  const { addItem } = useCart()
  const [added, setAdded] = useState({})

  function handleAdd(item) {
    addItem(item)
    setAdded((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 1200)
  }
  return (
    <section id="featured" className="py-24 px-6" style={{ backgroundColor: '#fdf8f0' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#a86f35' }}>
            Our Signatures
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Featured Coffees
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6b4220' }}>
            Lovingly crafted drinks that keep our guests coming back every morning.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{ backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(44,26,10,0.08)' }}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: item.badgeColor }}>
                {item.badge}
              </div>

              {/* Image area */}
              <div
                className="h-48 overflow-hidden relative"
                style={{ backgroundColor: '#f5e9d3' }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
                >
                  {item.name}
                </h3>
                <p className="text-sm mb-3 italic" style={{ color: '#a86f35' }}>
                  {item.tagline}
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#6b4220' }}>
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold" style={{ color: '#2c1a0a', fontFamily: "'Playfair Display', serif" }}>
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAdd(item)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: added[item.id] ? '#a86f35' : '#2c1a0a',
                      color: '#fdf8f0',
                    }}
                  >
                    {added[item.id] ? '✓ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
