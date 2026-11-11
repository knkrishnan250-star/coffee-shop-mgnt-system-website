import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useCustomerOrder } from '../context/CustomerOrderContext'

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
  const { setTrackerOpen, activeOrder } = useCustomerOrder()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <ul className="hidden md:flex items-center gap-7">
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

        {/* Right side controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Order Tracker */}
          <button
            onClick={() => setTrackerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#4a2e15] hover:bg-[#6b4220] text-amber-200 transition border border-amber-900/40 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Track Order {activeOrder ? `(${activeOrder.token})` : ''}</span>
          </button>

          {/* Order Now */}
          <a
            href="#menu"
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold transition hover:scale-105"
            style={{ backgroundColor: '#a86f35', color: '#fdf8f0' }}
          >
            Order Now
          </a>

          {/* Cart */}
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

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setTrackerOpen(true)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#4a2e15] text-amber-200"
          >
            Track
          </button>
          <button
            onClick={onCartClick}
            className="relative w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: '#4a2e15', color: '#fdf8f0' }}
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center bg-amber-500 text-stone-950">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="p-1.5 text-stone-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden px-6 pb-4 pt-2 bg-[#2c1a0a] space-y-2 border-t border-amber-900/30">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm py-1 text-stone-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
