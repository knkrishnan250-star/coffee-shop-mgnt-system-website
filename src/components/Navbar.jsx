import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Location', href: '#location' },
]

export default function Navbar({ onCartClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { setAdminOpen, setTrackerOpen, isHighOccupancyAlert, orders } = useShop()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled'
  ).length

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#2c1a0a]/95 backdrop-blur-md shadow-lg shadow-[#2c1a0a]/20'
          : 'bg-[#2c1a0a]/80 backdrop-blur-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <span className="text-2xl">☕</span>
          <div>
            <span
              className="font-display text-xl font-bold tracking-wide block leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#f5e9d3' }}
            >
              Bean &amp; Bloom
            </span>
            <span className="text-[10px] text-amber-300 tracking-wider uppercase font-semibold">
              Artisan Roastery &amp; Cafe
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: '#e8d0a9' }}
                onMouseEnter={(e) => (e.target.style.color = '#f59e0b')}
                onMouseLeave={(e) => (e.target.style.color = '#e8d0a9')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls: POS Computer Admin + Order Tracker + Cart */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Order Tracker Button */}
          <button
            onClick={() => setTrackerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#4a2e15] hover:bg-[#6b4220] text-amber-200 transition border border-amber-900/40 cursor-pointer"
            title="Track online order status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Track Order</span>
          </button>

          {/* Computer System Admin Base Button */}
          <button
            onClick={() => setAdminOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition shadow-xs cursor-pointer"
            title="Open Coffee Shop POS & Admin Computer System"
          >
            <span>🖥️</span>
            <span>POS &amp; Admin</span>
            {isHighOccupancyAlert ? (
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            ) : activeOrdersCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-900 text-amber-300">
                {activeOrdersCount}
              </span>
            ) : null}
          </button>

          {/* Order Now Button */}
          <a
            href="#menu"
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold transition hover:scale-105"
            style={{ backgroundColor: '#a86f35', color: '#fdf8f0' }}
          >
            Order Now
          </a>

          {/* Cart button */}
          <button
            onClick={onCartClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-full transition hover:scale-110 cursor-pointer"
            style={{ backgroundColor: '#4a2e15', color: '#fdf8f0' }}
            aria-label="Open cart"
          >
            🛒
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: '#f59e0b', color: '#2c1a0a' }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile buttons */}
        <div className="sm:hidden flex items-center gap-2">
          {/* Quick Admin pill */}
          <button
            onClick={() => setAdminOpen(true)}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-stone-950 flex items-center gap-1"
          >
            <span>🖥️</span>
            <span>Admin</span>
          </button>

          {/* Mobile Cart */}
          <button
            onClick={onCartClick}
            className="relative w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: '#4a2e15', color: '#fdf8f0' }}
            aria-label="Open cart"
          >
            🛒
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#f59e0b', color: '#2c1a0a' }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="flex flex-col gap-1 p-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
              style={{ backgroundColor: '#e8d0a9' }}
            />
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
              style={{ backgroundColor: '#e8d0a9' }}
            />
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
              style={{ backgroundColor: '#e8d0a9' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile drop menu */}
      {menuOpen && (
        <div className="sm:hidden px-6 pb-6 pt-2 bg-[#2c1a0a] border-t border-amber-900/40 space-y-3 text-sm">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-stone-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMenuOpen(false)
                setTrackerOpen(true)
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-stone-800 text-amber-200 text-center"
            >
              📍 Track Online Order
            </button>
            <button
              onClick={() => {
                setMenuOpen(false)
                setAdminOpen(true)
              }}
              className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 text-center"
            >
              🖥️ Open Cafe Admin &amp; POS Base
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
