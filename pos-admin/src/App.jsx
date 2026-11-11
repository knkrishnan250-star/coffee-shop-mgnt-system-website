import { AdminProvider, useAdmin } from './context/AdminContext'
import Dashboard from './components/Dashboard'
import PosReceiptModal from './components/PosReceiptModal'

function MainLayout() {
  const { activeBillOrder, setActiveBillOrder } = useAdmin()

  return (
    <>
      <Dashboard />
      <PosReceiptModal
        order={activeBillOrder}
        onClose={() => setActiveBillOrder(null)}
      />
    </>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <MainLayout />
    </AdminProvider>
  )
}
