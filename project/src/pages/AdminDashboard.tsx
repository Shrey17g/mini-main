import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import QuickNav from '../components/QuickNav';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    const userType = localStorage.getItem('userType');
    
    if (!adminId || userType !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <QuickNav />
      <Footer />
      <ScrollToTop />
    </div>
  );
}