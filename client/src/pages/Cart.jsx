import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Trash2, Calendar, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, cartSubtotal, cartTax, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-12">
        <Link to="/" className="hover:text-black transition-colors">Home</Link> 
        <ChevronRight className="w-3 h-3" />
        <span className="text-black">My Bag</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-12 uppercase">Shopping Bag</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-black/10">
          <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-6" />
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-12">Your bag is currently empty.</p>
          <Link to="/collection" className="inline-block border border-black px-12 py-5 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-20">
          {/* List */}
          <div className="lg:col-span-2 space-y-12">
            {cartItems.map((item) => (
              <motion.div 
                layout
                key={item.cartId}
                className="flex flex-col sm:flex-row gap-10 border-b border-black/5 pb-12 relative group"
              >
                <div className="w-full sm:w-40 aspect-[3/4] bg-gray-50 overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-black">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Size: <span className="text-black">{item.size}</span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{item.startDate} — {item.endDate}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">
                      Duration: {item.days} days
                    </p>
                  </div>

                  <p className="text-[15px] font-bold text-black pt-4">₹{(item.totalPrice || 0).toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-10">
            <div className="bg-[#FCF7F7] p-6 md:p-10 sticky top-32">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] mb-10 border-b border-black/5 pb-4">Order Summary</h2>
              
              <div className="space-y-6 mb-10 text-[11px] font-bold uppercase tracking-widest">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-black">₹{(cartSubtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (Tax)</span>
                  <span className="text-black">₹{(Math.round(cartTax) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600">COMPLIMENTARY</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-12">
                <span className="text-[13px] font-bold uppercase tracking-[0.2em]">Total</span>
                <span className="text-3xl font-bold text-black">₹{(cartTotal || 0).toLocaleString()}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
              >
                Check Out <ArrowRight className="w-4 h-4" />
              </button>
              
              <p className="text-[9px] text-gray-400 text-center mt-6 uppercase tracking-[0.2em] font-bold">
                * All prices are inclusive of dry cleaning. GST added as per regulations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
