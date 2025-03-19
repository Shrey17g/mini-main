import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import QuickNav from './components/QuickNav';
import Statistics from './components/Statistics';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Adopt from './pages/Adopt';
import LostFound from './pages/LostFound';
import PawMart from './pages/PawMart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdoptionProcess from './pages/AdoptionProcess';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import CenterDashboard from './pages/CenterDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Community from './pages/Community';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';

  useEffect(() => {
    if (!userType && location.pathname !== '/login' && location.pathname !== '/') {
      navigate('/login');
      return;
    }

    if (userType && location.pathname === '/') {
      navigate(`/${userType}Dashboard`);
      return;
    }

    // Restore admin restrictions
    if (isAdmin && location.pathname === '/contact') {
      navigate(`/${userType}Dashboard`);
    }
  }, [userType, location.pathname, navigate, isAdmin]);

  // Show landing page if not authenticated and on root path
  if (!userType && location.pathname === '/') {
    return <LandingPage />;
  }

  // Show login page if not authenticated and on login path
  if (!userType && location.pathname === '/login') {
    return <Login />;
  }

  // Redirect to login if not authenticated
  if (!userType) {
    return null;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
      
      {/* Dashboard routes for each user type */}
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/centerDashboard" element={<CenterDashboard />} />
      <Route path="/customerDashboard" element={<CustomerDashboard />} />
      
      <Route path="/adopt" element={<><Adopt /><ScrollToTop /></>} />
      <Route path="/adoption-process" element={<><AdoptionProcess /><ScrollToTop /></>} />
      <Route path="/lost-found" element={<><LostFound /><ScrollToTop /></>} />
      <Route path="/pawmart" element={<><PawMart /><ScrollToTop /></>} />
      <Route path="/checkout" element={<><Checkout /><ScrollToTop /></>} />
      <Route path="/community" element={<><Community /><ScrollToTop /></>} />
      {!isAdmin && <Route path="/contact" element={<><Contact /><ScrollToTop /></>} />}
    </Routes>
  );
}

export default App;