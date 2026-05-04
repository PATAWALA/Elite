import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomePage from '../pages/HomePage';
import ContactPage from '../pages/ContactPage';
import ScrollToTop from '../components/ScrollToTop';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ProductListPage from '../pages/VehiculesListPage';
import ProductDetailPage from '../pages/VehiculesDetailPage';
import ProductItemDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import ProductsPage from '../pages/ProductsPage';
import CheckoutPage from '../pages/CheckoutPage';

// Layout public (avec Navbar + Footer)
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <ScrollToTop />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Layout admin (sans Navbar, sans Footer)
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">{children}</div>
);

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Routes ADMIN - sans navbar ni footer */}
            <Route path="/admin/login" element={<AdminLayout><AdminLoginPage /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
            <Route path="/admin/*" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />

            {/* Routes PUBLIQUES - avec navbar et footer */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/vehicles" element={<PublicLayout><ProductListPage /></PublicLayout>} />
            <Route path="/vehicles/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductItemDetailPage /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>
        </Router>
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;