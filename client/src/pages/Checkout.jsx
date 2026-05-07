import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, CreditCard, ArrowRight, Loader2, ChevronRight } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartSubtotal, cartTax, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('LUCKNOW');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone Validation
    if (phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: 1,
          image: item.image,
          price: item.totalPrice,
          size: item.size,
          startDate: item.startDate,
          endDate: item.endDate,
          days: item.days,
          product: item._id
        })),
        shippingAddress: { address, city, postalCode, phone },
        subtotalPrice: cartSubtotal,
        taxPrice: cartTax,
        totalPrice: cartTotal,
      };

      await axios.post('/api/orders', orderData, config);
      clearCart();
      setLoading(false);
      toast.success('Booking successful! Elegant choice.');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-12">
        <Link to="/cart" className="hover:text-black transition-colors">Bag</Link> 
        <ChevronRight className="w-3 h-3" />
        <span className="text-black">Checkout</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-12 uppercase">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border-b border-black/5 pb-4">
              <MapPin className="w-4 h-4" /> Shipping Information
            </h2>

            <div className="space-y-6">
              <input
                type="text"
                placeholder="ADDRESS"
                required
                className="w-full px-6 py-5 bg-[#FCF7F7] border-none text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="CITY"
                  required
                  className="w-full px-6 py-5 bg-[#FCF7F7] border-none text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="POSTAL CODE"
                  required
                  className="w-full px-6 py-5 bg-[#FCF7F7] border-none text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <input
                type="text"
                placeholder="CONTACT NUMBER"
                required
                maxLength="10"
                className="w-full px-6 py-5 bg-[#FCF7F7] border-none text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(val);
                }}
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border-b border-black/5 pb-4">
              <CreditCard className="w-4 h-4" /> Payment Selection
            </h2>
            <div className="p-6 border border-black bg-black text-white">
              <p className="text-[11px] font-bold uppercase tracking-widest">Complimentary Booking</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">Pay at Boutique / Verification Deposit</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
              <>Place Booking <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-[#FCF7F7] p-6 md:p-10">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-10 border-b border-black/5 pb-4">Your Selection</h2>
            <div className="space-y-8">
              {cartItems.map(item => (
                <div key={item.cartId} className="flex gap-6">
                  <div className="w-20 aspect-[3/4] overflow-hidden bg-white">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-black">{item.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.size} • {item.days} Days</p>
                    <p className="text-[13px] font-bold text-black mt-2">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-10 border-t border-black/5 space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span>GST (Tax)</span>
                <span>₹{Math.round(cartTax)}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-black/5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Total</span>
                <span className="text-3xl font-bold text-black">₹{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
