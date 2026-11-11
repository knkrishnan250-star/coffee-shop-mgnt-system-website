import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { ShopProvider, useShop } from './context/ShopContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedCoffees from './components/FeaturedCoffees'
import Menu from './components/Menu'
import About from './components/About'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Footer from './components/Footer'
import Cart from './components/Cart'
import AdminBase from './components/AdminBase'
import OrderTrackerModal from './components/OrderTrackerModal'
import BillReceiptModal from './components/BillReceiptModal'

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false)
  const {
    adminOpen,
    setAdminOpen,
    trackerOpen,
    setTrackerOpen,
    activeBillOrder,
    setActiveBillOrder,
    isHighOccupancyAlert,
    occupancyPercentage,
  } = useShop()

  return (
    <div className="min-h-screen bg-[#fdf8f0] relative">
      {/* Top Navbar */}
      <Navbar onCartClick={() => setCartOpen(true)} />

      {/* Main Public Website */}
      <main>
        <Hero />
        <FeaturedCoffees />
        <Menu />
        <About />
        <Reviews />
        <Location />
      </main>

      {/* Footer */}
      <Footer />

      {/* Customer Cart & Payment Drawer */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Coffee Shop Computer System Admin Base Modal */}
      <AdminBase isOpen={adminOpen} onClose={() => setAdminOpen(false)} />

      {/* Live Online Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
      />

      {/* Printable Bill / Thermal Receipt Modal */}
      <BillReceiptModal
        order={activeBillOrder}
        onClose={() => setActiveBillOrder(null)}
      />

      {/* Floating System Quick-Switcher Bar (bottom-right) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col sm:flex-row items-end sm:items-center gap-2 print:hidden">
        {/* Table Occupancy Alert floating pill (if high occupancy) */}
        {isHighOccupancyAlert && (
          <button
            onClick={() => setAdminOpen(true)}
            className="px-3.5 py-2 rounded-full text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-xl flex items-center gap-1.5 transition animate-pulse cursor-pointer border border-rose-400"
          >
            <span>⚠️</span>
            <span>Floor Alert ({occupancyPercentage}% Full)</span>
          </button>
        )}

        {/* Live Order Tracker quick pill */}
        <button
          onClick={() => setTrackerOpen(true)}
          className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#2c1a0a] hover:bg-[#4a2e15] text-amber-200 shadow-xl flex items-center gap-2 transition cursor-pointer border border-amber-900/40"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>📍 Track Order</span>
        </button>

        {/* POS Admin base quick launch button */}
        <button
          onClick={() => setAdminOpen(true)}
          className="px-4 py-2.5 rounded-full text-xs font-black bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl flex items-center gap-2 transition hover:scale-105 cursor-pointer border border-amber-600"
        >
          <span>🖥️</span>
          <span>Cafe Admin POS</span>
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ShopProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ShopProvider>
  )
}

export default App
