import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { CustomerOrderProvider, useCustomerOrder } from './context/CustomerOrderContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedCoffees from './components/FeaturedCoffees'
import Menu from './components/Menu'
import About from './components/About'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Footer from './components/Footer'
import Cart from './components/Cart'
import OrderTrackerModal from './components/OrderTrackerModal'
import BillReceiptModal from './components/BillReceiptModal'

function MainContent() {
  const [cartOpen, setCartOpen] = useState(false)
  const { trackerOpen, setTrackerOpen, billOrder, setBillOrder } = useCustomerOrder()

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Navbar onCartClick={() => setCartOpen(true)} />

      <main>
        <Hero />
        <FeaturedCoffees />
        <Menu />
        <About />
        <Reviews />
        <Location />
      </main>

      <Footer />

      {/* Cart Drawer */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
      />

      {/* Bill Receipt Modal */}
      <BillReceiptModal
        order={billOrder}
        onClose={() => setBillOrder(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <CustomerOrderProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </CustomerOrderProvider>
  )
}
