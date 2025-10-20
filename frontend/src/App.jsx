import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMessages from './pages/admin/AdminMessages'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="boutique" element={<Shop />} />
        <Route path="produit/:id" element={<ProductDetail />} />
        <Route path="panier" element={<Cart />} />
        <Route path="commande" element={<Checkout />} />
        <Route path="confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="contact" element={<Contact />} />
        <Route path="a-propos" element={<About />} />
      </Route>

      {/* Routes admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
        <Route index element={<AdminProducts />} />
        <Route path="produits" element={<AdminProducts />} />
        <Route path="commandes" element={<AdminOrders />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>
    </Routes>
  )
}

export default App

