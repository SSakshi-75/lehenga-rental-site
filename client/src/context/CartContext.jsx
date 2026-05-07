import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getContent } from '../utils/apifetch';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );
  const [globalGst, setGlobalGst] = useState(12);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const { data } = await getContent();
        const gstSetting = data.find(item => item.key === 'global-gst-rate');
        if (gstSetting) setGlobalGst(Number(gstSetting.value));
      } catch (err) {
        console.error('Error fetching global GST', err);
      }
    };
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, startDate, endDate, quantity = 1) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const itemTotalPrice = (diffDays * product.price * quantity) + (Number(product.securityDeposit || 0) * quantity);

    const newItem = {
      _id: product._id,
      name: product.name,
      image: product.images[0],
      pricePerDay: product.price,
      totalPrice: itemTotalPrice,
      size,
      startDate,
      endDate,
      days: diffDays,
      quantity,
      gst: product.gst || globalGst,
      cartId: Date.now() // Unique ID for cart items (allows multiple of same product with different dates)
    };

    setCartItems([...cartItems, newItem]);
  };

  const removeFromCart = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
    toast.error('Removed from registry');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartTax = cartItems.reduce((acc, item) => acc + (item.totalPrice * (item.gst / 100)), 0);
  const cartTotal = cartSubtotal + cartTax;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartSubtotal, cartTax, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
