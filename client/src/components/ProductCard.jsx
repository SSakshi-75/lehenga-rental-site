import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { createInquiry } from '../utils/apifetch';

const ProductCard = ({ product }) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [enquiryData, setEnquiryData] = React.useState({ name: '', email: '', phone: '', address: '', city: '', message: '' });
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFav = isInWishlist(product._id);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    
    if (enquiryData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true);
    try {
      await createInquiry({
        product: product._id,
        productName: product.name,
        ...enquiryData
      });
      toast.success('Inquiry sent successfully! We will contact you soon.');
      setIsEnquiryModalOpen(false);
      setEnquiryData({ name: '', email: '', phone: '', address: '', city: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Link to={`/product/${product._id}`}>
        <div className="aspect-[4/3.8] overflow-hidden bg-white relative">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Heart/Wishlist Overlay */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product._id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${isFav ? 'bg-black text-white' : 'bg-white/80 text-black opacity-0 group-hover:opacity-100'}`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add Overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-white/90 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-center text-black">
              View Details
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-luxury-text group-hover:text-luxury-gold transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          {!product.isAvailable && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5">
              Booked
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-luxury-text">₹{product.price.toLocaleString()}</p>
          <span className="text-[9px] text-luxury-muted font-bold uppercase tracking-widest">PER DAY</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Link 
            to={`/product/${product._id}`}
            className="flex-1 bg-black text-white py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-center hover:bg-luxury-text transition-colors duration-300"
          >
            Book Now
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsEnquiryModalOpen(true);
            }}
            className="flex-1 bg-white border border-black text-black py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
          >
            Inquiry
          </button>
        </div>
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsEnquiryModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-lg w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsEnquiryModalOpen(false)}
                className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-medium tracking-widest text-black uppercase mb-2">Product Inquiry</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Inquiry for: {product.name}</p>
              </div>
              
              <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={enquiryData.name}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setEnquiryData({...enquiryData, name: val});
                      }}
                      className="w-full p-3 border border-gray-100 bg-gray-50 text-xs focus:outline-none focus:border-black transition-colors"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Email</label>
                    <input 
                      type="email" 
                      required
                      value={enquiryData.email}
                      onChange={(e) => setEnquiryData({...enquiryData, email: e.target.value.toLowerCase()})}
                      className="w-full p-3 border border-gray-100 bg-gray-50 text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                    <input 
                      type="tel" 
                      required
                      maxLength="10"
                      value={enquiryData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setEnquiryData({...enquiryData, phone: val});
                      }}
                      className="w-full p-3 border border-gray-100 bg-gray-50 text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">City</label>
                    <input 
                      type="text" 
                      required
                      value={enquiryData.city}
                      onChange={(e) => setEnquiryData({...enquiryData, city: e.target.value})}
                      className="w-full p-3 border border-gray-100 bg-gray-50 text-xs focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g. Lucknow"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Address</label>
                    <input 
                      type="text" 
                      required
                      value={enquiryData.address}
                      onChange={(e) => setEnquiryData({...enquiryData, address: e.target.value})}
                      className="w-full p-3 border border-gray-100 bg-gray-50 text-xs focus:outline-none focus:border-black transition-colors"
                      placeholder="Street, Area"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <textarea 
                    rows="4"
                    required
                    value={enquiryData.message}
                    onChange={(e) => setEnquiryData({...enquiryData, message: e.target.value})}
                    className="w-full p-3 border border-gray-100 bg-gray-50 text-xs focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
