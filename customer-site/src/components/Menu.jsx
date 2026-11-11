import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCustomerOrder } from '../context/CustomerOrderContext'

const categories = ['All', 'Kaapi', 'Espresso', 'Latte', 'Cold Brew', 'Tea', 'Snacks']

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { addItem } = useCart()
  const { menuItems } = useCustomerOrder()
  const [added, setAdded] = useState({})

  function handleAdd(item) {
    if (!item.inStock) return
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
          <p className="text-xs font-bold tracking-widest uppercase mb-3 text-[#a86f35]">
            Freshly Roasted in Thrissur
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2c1a0a' }}
          >
            Our Cafe Menu
          </h2>
          <p className="text-base max-w-xl mx-auto text-[#6b4220]">
            From traditional brass dabarah filter kaapi to slow-steeped cold brews and warm Malabar bakery snacks.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 cursor-pointer"
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
          {filtered.map((item) => {
            const isSoldOut = item.inStock === false

            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 bg-white shadow-xs border border-stone-200/80 relative overflow-hidden ${
                  isSoldOut ? 'opacity-70 grayscale-[20%]' : 'hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {/* Image */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-[#fdf8f0] relative"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase text-white bg-rose-600 px-1 py-0.5 rounded">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                      {item.category}
                    </span>
                    {isSoldOut && (
                      <span className="text-[10px] font-bold text-rose-600 uppercase">
                        Sold Out Today
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#2c1a0a] truncate mt-0.5">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#a86f35] line-clamp-1 mt-0.5">{item.desc}</p>
                  <span className="font-black text-sm text-[#2c1a0a] font-mono mt-1 block">
                    ₹{item.price}
                  </span>
                </div>

                {/* Add button */}
                <button
                  disabled={isSoldOut}
                  onClick={() => handleAdd(item)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition flex-shrink-0 ${
                    isSoldOut
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : added[item.id]
                      ? 'bg-emerald-600 text-white scale-110'
                      : 'bg-[#2c1a0a] hover:bg-amber-600 text-white cursor-pointer hover:scale-105'
                  }`}
                  title={isSoldOut ? 'Sold out for today' : 'Add to bag'}
                >
                  {isSoldOut ? '✕' : added[item.id] ? '✓' : '+'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
