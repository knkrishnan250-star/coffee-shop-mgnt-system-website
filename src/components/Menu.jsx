import { useState } from 'react'
import { useCart } from '../context/CartContext'

const categories = ['All', 'Espresso', 'Latte', 'Cold Brew', 'Tea', 'Pastries']

const menuItems = [
  // Espresso
  { id: 1, name: 'Espresso', category: 'Espresso', price: 3.50, img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=120&q=75&auto=format&fit=crop', desc: 'Single origin, intense & bold' },
  { id: 2, name: 'Americano', category: 'Espresso', price: 4.00, img: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=120&q=75&auto=format&fit=crop', desc: 'Espresso diluted with hot water' },
  { id: 3, name: 'Macchiato', category: 'Espresso', price: 4.50, img: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=120&q=75&auto=format&fit=crop', desc: 'Espresso with a dash of steamed milk' },
  { id: 4, name: 'Cortado', category: 'Espresso', price: 4.50, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&q=75&auto=format&fit=crop', desc: 'Equal parts espresso and warm milk' },
  // Latte
  { id: 5, name: 'Classic Latte', category: 'Latte', price: 5.00, img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=120&q=75&auto=format&fit=crop', desc: 'Smooth espresso with creamy steamed milk' },
  { id: 6, name: 'Caramel Bloom Latte', category: 'Latte', price: 5.50, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&q=75&auto=format&fit=crop', desc: 'House salted caramel + steamed milk' },
  { id: 7, name: 'Vanilla Bean Latte', category: 'Latte', price: 5.50, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=120&q=75&auto=format&fit=crop', desc: 'Madagascar vanilla with oat milk' },
  { id: 8, name: 'Matcha Latte', category: 'Latte', price: 5.50, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=120&q=75&auto=format&fit=crop', desc: 'Premium ceremonial grade matcha' },
  // Cold Brew
  { id: 9, name: 'Cold Brew', category: 'Cold Brew', price: 5.00, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&q=75&auto=format&fit=crop', desc: '18-hour steeped, smooth & rich' },
  { id: 10, name: 'Iced Brown Sugar Oat', category: 'Cold Brew', price: 6.00, img: 'https://images.unsplash.com/photo-1579954115563-e72bf1697784?w=120&q=75&auto=format&fit=crop', desc: 'Brown sugar, cinnamon, oat milk' },
  { id: 11, name: 'Mocha Frappé', category: 'Cold Brew', price: 6.50, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&q=75&auto=format&fit=crop', desc: 'Blended cold brew with dark chocolate' },
  { id: 12, name: 'Vanilla Cold Foam', category: 'Cold Brew', price: 6.00, img: 'https://images.unsplash.com/photo-1596952954288-16862d37405b?w=120&q=75&auto=format&fit=crop', desc: 'Cold brew topped with sweet vanilla foam' },
  // Tea
  { id: 13, name: 'Chai Latte', category: 'Tea', price: 4.50, img: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=120&q=75&auto=format&fit=crop', desc: 'Spiced masala chai with steamed milk' },
  { id: 14, name: 'Earl Grey', category: 'Tea', price: 3.50, img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120&q=75&auto=format&fit=crop', desc: 'Classic bergamot black tea' },
  { id: 15, name: 'Hibiscus Iced Tea', category: 'Tea', price: 4.00, img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=120&q=75&auto=format&fit=crop', desc: 'Tart & floral, served over ice' },
  // Pastries
  { id: 16, name: 'Butter Croissant', category: 'Pastries', price: 3.50, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=75&auto=format&fit=crop', desc: 'Flaky, golden & freshly baked' },
  { id: 17, name: 'Cinnamon Roll', category: 'Pastries', price: 4.00, img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=120&q=75&auto=format&fit=crop', desc: 'Warm with cream cheese glaze' },
  { id: 18, name: 'Chocolate Muffin', category: 'Pastries', price: 3.75, img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=120&q=75&auto=format&fit=crop', desc: 'Double chocolate with walnut crumble' },
]

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { addItem } = useCart()
  const [added, setAdded] = useState({})

  function handleAdd(item) {
    addItem(item)
    setAdded((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 1200)
  }

  const filtered =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory)

  return (
    <section id="menu" className="py-24 px-6" style={{ backgroundColor: '#f5e9d3' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#a86f35' }}>
            What We Serve
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Our Full Menu
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6b4220' }}>
            Something for every mood, every morning, every craving.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              style={
                activeCategory === cat
                  ? { backgroundColor: '#2c1a0a', color: '#fdf8f0' }
                  : { backgroundColor: '#e8d0a9', color: '#4a2e15' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
              style={{ backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(44,26,10,0.06)' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#fdf8f0' }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate" style={{ color: '#2c1a0a' }}>
                  {item.name}
                </h3>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#8b5a2b' }}>
                  {item.desc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-sm" style={{ color: '#2c1a0a' }}>
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAdd(item)}
                  className="text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                  style={{
                    backgroundColor: added[item.id] ? '#2c1a0a' : '#a86f35',
                    color: '#fff',
                  }}
                >
                  {added[item.id] ? '✓ Added' : '+ Add'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
