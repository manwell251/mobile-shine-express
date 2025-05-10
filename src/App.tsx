
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Booking from '@/pages/Booking';
import NotFound from '@/pages/NotFound';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Customers from '@/pages/admin/Customers';
import Bookings from '@/pages/admin/Bookings';
import Jobs from '@/pages/admin/Jobs';
import Settings from '@/pages/admin/Settings';
import Accounting from '@/pages/admin/Accounting';
import AdminLayout from '@/components/admin/AdminLayout';
import Login from '@/pages/admin/Login';

// Auth Provider
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/jobs" element={<Jobs />} />
              <Route path="/admin/accounting" element={<Accounting />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
            
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
