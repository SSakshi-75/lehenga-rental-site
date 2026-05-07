import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Festive = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [tempPriceRange, setTempPriceRange] = useState([0, 10000]);
  const [tempSize, setTempSize] = useState('');

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [size, setSize] = useState('');
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        const contentMap = {};
        data.forEach(item => contentMap[item.key] = item.value);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching festive content', error);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products`, {
          params: {
            category: 'Festive Lehenga',
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            size
          }
        });
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching festive products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [priceRange, size]);

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Festive Banner/Header */}
      <div className="relative h-[250px] md:h-[400px] mb-16 overflow-hidden rounded-sm flex items-center justify-center">
        <img
          src={content['festive-hero-bg'] || "/assets/images/festive-banner.png"}
          alt="Festive Collection"
          className="absolute inset-0 w-full h-full object-center object-cover brightness-[0.8]"
        />
        <div className="relative text-center text-white z-10 px-4">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-medium tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">FESTIVE</h1>
          <p className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.4em] opacity-80 max-w-lg mx-auto leading-loose">
            Celebrate every moment with vibrant colors and intricate details. Perfect for every celebration.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-8">
        <div>
          <h2 className="text-3xl font-display font-medium tracking-widest mb-2 text-luxury-black">The Festive Edit</h2>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-muted">
            {products.length} Pieces Found
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
        >
          {showFilters ? (
            <><X className="w-4 h-4" /> Hide Filters</>
          ) : (
            <><Filter className="w-4 h-4" /> Refine Search</>
          )}
        </button>
      </div>

      {/* Signature Look Section */}
      <div className="mb-16 bg-luxury-bg/50 p-6 rounded-sm border border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group overflow-hidden rounded-sm aspect-[4/4]">
            <img
              src={content['festive-signature-img'] || "/assets/images/festive-look.png"}
              alt="Signature Festive Look"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Stylist's Choice</span>
              <h3 className="text-3xl md:text-5xl font-display font-medium tracking-widest text-luxury-black leading-tight uppercase">THE FESTIVE <br />SPIRIT LOOK</h3>
              <p className="text-[13px] text-luxury-text/70 leading-relaxed max-w-md font-sans">
                Vibrant, energetic, and deeply traditional. This curated look features our Sun-Kissed Yellow Lehenga, paired with heavy jhumkas and a contrasting pink potli bag for the perfect celebration vibe.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-luxury-black">Craft Detail</h4>
                <ul className="text-[11px] text-luxury-muted space-y-2 uppercase tracking-wider">
                  <li>• Real Mirror Work</li>
                  <li>• Gota Patti Borders</li>
                  <li>• Cotton Silk Blend</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-luxury-black">Best For</h4>
                <p className="text-[11px] text-luxury-muted leading-relaxed uppercase tracking-wider">
                  Haldi ceremonies, Sangeet nights, and grand festive gatherings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ width: window.innerWidth > 1024 ? '256px' : '100%', opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden lg:pr-8 lg:border-r border-black/5 mb-8 lg:mb-0"
            >
              <div className="w-full lg:w-64 space-y-10">
                {/* Price */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black/5 pb-2">Price Range</h3>
                  <div className="space-y-4 pt-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      className="w-full accent-black"
                      value={tempPriceRange[1]}
                      onChange={(e) => setTempPriceRange([0, parseInt(e.target.value)])}
                    />
                    <div className="flex justify-between text-[10px] font-bold font-mono">
                      <span>₹0</span>
                      <span>₹{tempPriceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black/5 pb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setTempSize(tempSize === sz ? '' : sz)}
                        className={`w-10 h-10 border text-[10px] font-bold transition-all ${tempSize === sz ? 'bg-black text-white border-black' : 'border-black/10 text-gray-400 hover:border-black'
                          }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => {
                      setPriceRange(tempPriceRange);
                      setSize(tempSize);
                    }}
                    className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setTempSize(''); setTempPriceRange([0, 10000]);
                      setSize(''); setPriceRange([0, 10000]);
                    }}
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline py-2 text-center"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-black/10">
              <p className="text-xl font-light uppercase tracking-widest text-gray-400">No festive pieces match your criteria.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-x-4 md:gap-x-8 gap-y-12`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Festive;
