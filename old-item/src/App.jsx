import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import SellItem from './pages/SellItem';
import EditItem from './pages/EditItem';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import CategoriesRoute from './pages/CategoriesRoute';
import QuickLinks from './pages/QuickLinks';
import ContactUs from './pages/ContactUs';
import Wishlist from './pages/Wishlist';
import Messages from './pages/Messages';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/categories" element={<CategoriesRoute />} />
            <Route path="/quick-links" element={<QuickLinks />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <SellItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a2036',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#2dd4bf', secondary: '#f1f5f9' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
