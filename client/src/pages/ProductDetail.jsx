import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../utils/apifetch';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { ChevronRight, Heart, X, ShieldCheck, Truck, RefreshCcw, Minus, Plus, Info } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFav = isInWishlist(id);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [rentalDuration, setRentalDuration] = useState(3);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [comments, setComments] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [measurements, setMeasurements] = useState({ chest: '', waist: '', hip: '' });
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const rentalCost = product.price * rentalDuration * quantity;
      const depositCost = (product.securityDeposit || 0) * quantity;
      setTotalPrice(rentalCost + depositCost);
    }
  }, [rentalDuration, product, quantity]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return false;
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental start and end dates');
      return false;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return false;
    }
    
    addToCart(product, selectedSize, startDate, endDate, quantity);
    toast.success('Added to Bag');
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      navigate('/cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <div className="text-center py-40 uppercase tracking-widest font-bold">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen pt-4 md:pt-10 px-4 md:px-10 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto mb-6 text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/collection" className="hover:text-black">Collection</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Left: Image & Description Section */}
        <div className="lg:w-[55%] flex gap-4 h-fit">
          {/* Vertical Thumbnails */}
          <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-[3/4] border transition-all ${
                  selectedImage === idx ? 'border-black' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image and Description Column */}
          <div className="flex-1 space-y-8">
            <div 
              className="aspect-[3/4] md:aspect-[3/4.5] overflow-hidden relative bg-gray-50 cursor-zoom-in"
              onClick={() => setIsImageModalOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Mobile Thumbnails */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-2 h-2 rounded-full ${selectedImage === idx ? 'bg-black' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Description - Now restricted to image width */}
            <div className="py-6 border-t border-black/5">
              <p className="text-[11px] text-gray-500 leading-relaxed uppercase tracking-[0.15em] font-medium border-l border-black/10 pl-6">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="lg:w-[45%] space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl font-light tracking-wide uppercase text-black leading-tight">
                {product.name}
              </h1>
              <button 
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-full transition-all duration-300 ${isFav ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'}`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-2xl font-medium text-black">Rs. {(product.price || 0).toLocaleString()}</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">(Excl. {product.gst || 12}% GST)</span>
              <span className="text-gray-400 line-through text-sm italic opacity-50">Rs. {(product.price ? product.price * 1.5 : 0).toLocaleString()}</span>
            </div>
          </div>



          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Select Size <span className="text-red-500">•</span></label>
            </div>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center text-[11px] font-bold transition-all border ${
                    selectedSize === size 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection Box */}
          <div className="bg-[#FFF8F8] border border-[#FFE4E4] p-6 rounded-sm space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Select Date <span className="text-red-500">•</span></label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Select End Date <span className="text-red-500">•</span></label>
                <input 
                  type="date" 
                  min={startDate || new Date().toISOString().split('T')[0]}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black bg-white"
                />
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-100">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Select Quantity</label>
            <div className="flex items-center border border-black h-12">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="w-16 flex items-center justify-center text-sm font-bold border-l border-r border-black/10">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          {/* Total Price Display */}
          <div className="flex justify-between items-center py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Total (Incl. Rs. {(product.securityDeposit || 2000).toLocaleString()} Refundable Deposit)</span>
            <span className="text-xl font-bold text-black">Rs. {(totalPrice || 0).toLocaleString()}</span>
          </div>

          <button 
            onClick={handleBuyNow}
            className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all duration-300 shadow-sm"
          >
            Book Now
          </button>

          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Chest</label>
                <input 
                  type="text" 
                  placeholder=""
                  value={measurements.chest}
                  onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Waist</label>
                <input 
                  type="text" 
                  placeholder=""
                  value={measurements.waist}
                  onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Hip</label>
                <input 
                  type="text" 
                  placeholder=""
                  value={measurements.hip}
                  onChange={(e) => setMeasurements({...measurements, hip: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="space-y-2 pt-4">
          {/* Size Chart Trigger (Matches User Design) */}
          <button 
            onClick={() => setIsSizeModalOpen(true)}
            className="w-full py-5 border border-black flex justify-center items-center bg-white group mt-8 mb-4 hover:bg-black hover:text-white transition-all duration-500"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Size Chart</span>
          </button>

            {/* Refundable Deposit Accordion */}
            <div className="border border-black">
              <button 
                onClick={() => setOpenAccordion(openAccordion === 'deposit' ? null : 'deposit')}
                className="w-full py-4 px-6 flex justify-center items-center bg-white group relative"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-black">Refundable Deposit</span>
                <ChevronRight className={`absolute right-6 w-4 h-4 transition-transform duration-300 ${openAccordion === 'deposit' ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openAccordion === 'deposit' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white px-6 pb-6"
                  >
                    <div className="border-t border-gray-100 pt-4 text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed">
                      <p>A refundable security deposit of Rs. {(product.securityDeposit || 2000).toLocaleString()} is collected at checkout and will be returned within 48 hours of product pickup after quality check.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Other Details */}
          <div className="pt-8 border-t border-gray-100 space-y-6">
            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                Authentic Products
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <Truck className="w-4 h-4" />
                Free Alterations
              </div>
            </div>
            
            <div className="text-[11px] leading-relaxed text-gray-500 space-y-2 uppercase tracking-wide">
              <p><span className="font-bold text-gray-800">Fabric:</span> {product.fabric || 'Raw Silk blouse and lehenga, Soft net dupatta'}</p>
              <p><span className="font-bold text-gray-800">Work:</span> {product.work || 'Digital printed motifs, embellished with stones, mirror abla, gota patti'}</p>
              <p><span className="font-bold text-gray-800">Delivery:</span> {product.delivery || 'Standard 3-5 days across India'}</p>
            </div>
          </div>
        </div>
    </div>

      {/* Image Full Screen Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-6 right-8 text-white hover:text-luxury-gold transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="max-w-full max-h-full overflow-auto text-center">
              <img 
                src={product.images[selectedImage]} 
                alt="" 
                className="inline-block max-w-full max-h-[90vh] object-contain shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {isSizeModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsSizeModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-xl w-full p-6 md:p-12 relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsSizeModalOpen(false)}
                className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-display font-medium tracking-widest text-black mb-10 text-center uppercase">Size Guide</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-bold uppercase tracking-widest text-center">
                  <thead>
                    <tr className="border-b border-black/5">
                      <th className="pb-4 text-gray-400 text-left">Size</th>
                      <th className="pb-4 text-gray-400">Chest</th>
                      <th className="pb-4 text-gray-400">Waist</th>
                      <th className="pb-4 text-gray-400">Hip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {[
                      { s: 'S', c: '34"', w: '26"', h: '36"' },
                      { s: 'M', c: '36"', w: '28"', h: '38"' },
                      { s: 'L', c: '38"', w: '30"', h: '40"' },
                      { s: 'XL', c: '40"', w: '32"', h: '42"' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-5 text-black text-left">{row.s}</td>
                        <td className="py-5 text-gray-500">{row.c}</td>
                        <td className="py-5 text-gray-500">{row.w}</td>
                        <td className="py-5 text-gray-500">{row.h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-10 p-6 bg-[#FCF7F7] text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-relaxed text-center">
                <p>All measurements are in inches. <br/> For custom alterations, please provide your measurements in the fields on the product page.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;

