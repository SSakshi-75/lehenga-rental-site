import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Collection from './pages/Collection';
import Bridal from './pages/Bridal';
import Festive from './pages/Festive';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminLayout from './pages/Admin/AdminLayout';
import Inventory from './pages/Admin/Inventory';
import AddProduct from './pages/Admin/AddProduct';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminPortal from './pages/Admin/AdminPortal';
import UserManagement from './pages/Admin/UserManagement';
import AdminAuth from './pages/Admin/AdminAuth';
import ContentManagement from './pages/Admin/ContentManagement';
import Inquiries from './pages/Admin/Inquiries';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-luxury-bg flex flex-col">
        <Routes>
          {/* Storefront Routes with Navbar & Footer */}
          <Route element={<MainLayout />}>
            {/* Public Storefront - Users can browse without login */}
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/bridal" element={<Bridal />} />
            <Route path="/festive" element={<Festive />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Public Entry Points (Login/Register) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Storefront - Login required for actions/account */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<div>User Profile Placeholder</div>} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>
          </Route>

          {/* Separate Admin Routes */}
          <Route path="/rani-auth" element={<AdminAuth />} />
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/rani-manager" element={<AdminLayout />}>
              <Route index element={<AdminPortal />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<AddProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="inquiries" element={<Inquiries />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/users" element={<Navigate to="/rani-manager/users" replace />} />
          <Route path="/auth-manager" element={<Navigate to="/rani-manager" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
