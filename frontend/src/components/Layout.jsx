import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UserChatWidget from './UserChatWidget';
import CartSidebar from './CartSidebar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Chat uniquement pour utilisateurs connectés (pas admin) */}
      {isAuthenticated && user?.role !== 'admin' && <UserChatWidget />}
      <CartSidebar />
    </div>
  );
};

export default Layout;

