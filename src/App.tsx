/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useStore } from './store/useStore';

import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { ProductDetails } from './pages/ProductDetails';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Profile } from './pages/Profile';
import { useOrderNotifications } from './hooks/useOrderNotifications';

export default function App() {
  const { theme, isLoggedIn, userId, loadOrders } = useStore();
  
  // Initialize order notifications polling
  useOrderNotifications();

  useEffect(() => {
    if (isLoggedIn && userId) {
      loadOrders(userId);
    }
  }, [isLoggedIn, userId, loadOrders]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </>
  );
}
