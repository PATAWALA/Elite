import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomePage from '../pages/HomePage';
import ContactPage from '../pages/ContactPage';
import ScrollToTop from '../components/ScrollToTop';
import ProductListPage from '../pages/VehiculesListPage';
import ProductDetailPage from '../pages/VehiculesDetailPage';
import ProductItemDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import ProductsPage from '../pages/ProductsPage';
import CheckoutPage from '../pages/CheckoutPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <ScrollToTop />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicles" element={<ProductListPage />} />
              <Route path="/vehicles/:id" element={<ProductDetailPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductItemDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;