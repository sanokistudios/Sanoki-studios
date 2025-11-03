import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminMessages from './pages/admin/AdminMessages'
import AdminCollections from './pages/admin/AdminCollections'
import AdminOrders from './pages/admin/AdminOrders'
import AdminHeroImages from './pages/admin/AdminHeroImages'
import AdminPaintings from './pages/admin/AdminPaintings'
import Prints from './pages/Prints'
import PaintingDetail from './pages/PaintingDetail'
import SearchResults from './pages/SearchResults'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="boutique" element={<Shop />} />
          <Route path="recherche" element={<SearchResults />} />
          <Route path="produit/:id" element={<ProductDetail />} />
          <Route path="prints" element={<Prints />} />
          <Route path="peinture/:id" element={<PaintingDetail />} />
          <Route path="panier" element={<Cart />} />
          <Route path="commande" element={<Checkout />} />
          <Route path="confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="a-propos" element={<About />} />
          
          {/* Routes auth */}
          <Route path="connexion" element={<Login />} />
          <Route path="inscription" element={<Register />} />
          <Route path="mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          
          {/* Routes protégées utilisateur */}
          <Route path="profil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Routes admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<AdminProducts />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="hero-images" element={<AdminHeroImages />} />
          <Route path="peintures" element={<AdminPaintings />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

