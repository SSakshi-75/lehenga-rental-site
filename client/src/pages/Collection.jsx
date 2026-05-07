import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, X, ChevronDown } from 'lucide-react';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [category, setCategory] = useState('');
  const [tempPriceRange, setTempPriceRange] = useState([0, 10000]);
  const [tempSize, setTempSize] = useState('');
  const [tempColor, setTempColor] = useState('');
  const [tempDate, setTempDate] = useState('');

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [availableDate, setAvailableDate] = useState('');

  const location = useLocation();
  
  // Sync URL params with state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    } else if (!location.search.includes('category')) {
      // Only clear if category is not in URL at all (to allow sidebar filters to work)
      // Actually, if we want the URL to be the source of truth, we should update the URL when sidebar filters are clicked.
      // But for now, let's just ensure the navbar links work.
      setCategory('');
    }
  }, [location.search]);

  const searchParams = new URLSearchParams(location.search);
  const querySearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products`, {
          params: {
            category,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            size,
            color,
            availableDate,
            search: querySearch
          }
        });
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, priceRange, size, color, availableDate, querySearch]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    setSize(tempSize);
    setColor(tempColor);
    setAvailableDate(tempDate);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-medium tracking-widest mb-2 text-luxury-black">Lehenga</h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-muted">
            {products.length} Products Found
          </p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
        >
          <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Horizontal Category Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-6 md:gap-8 mb-12 border-b border-black/5 pb-6">
        {['All', 'Bridal Lehenga', 'Wedding Guest Lehenga', 'Party Wear Lehenga', 'Engagement Lehenga', 'Festive Lehenga', 'Designer Pieces'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === 'All' ? '' : cat)}
            className={`whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${
              (cat === 'All' && !category) || category === cat 
                ? 'text-black border-black' 
                : 'text-gray-400 border-transparent hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-full lg:w-64 space-y-10 animate-in slide-in-from-left duration-300">
            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b-2 border-luxury-gold pb-2 text-black">Category</h3>
              <div className="flex flex-wrap lg:flex-col gap-3">
                {['Bridal Lehenga', 'Wedding Guest Lehenga', 'Party Wear Lehenga', 'Engagement Lehenga', 'Festive Lehenga', 'Designer Pieces'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(category === cat ? '' : cat)}
                    className={`text-left text-[10px] font-bold uppercase tracking-widest transition-colors ${category === cat ? 'text-black font-black' : 'text-gray-400 hover:text-black'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-4">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b-2 border-luxury-gold pb-2 text-black">Price Range</h3>
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
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b-2 border-luxury-gold pb-2 text-black">Size</h3>
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

            {/* Color */}
            <div className="space-y-4">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b-2 border-luxury-gold pb-2 text-black">Color</h3>
              <div className="flex flex-wrap gap-3">
                {['Maroon', 'Gold', 'Crimson', 'Yellow', 'Pink', 'Green'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setTempColor(tempColor === col ? '' : col)}
                    className="flex items-center gap-2 group"
                  >
                    <div className={`w-4 h-4 rounded-full border border-black/10 transition-all ${tempColor === col ? 'ring-2 ring-luxury-gold ring-offset-2' : ''}`} style={{ backgroundColor: col.toLowerCase() }}></div>
                    <span className={`text-[10px] uppercase tracking-widest transition-colors ${tempColor === col ? 'font-bold text-black' : 'text-gray-400 group-hover:text-black'}`}>{col}</span>
                  </button>
                ))}
                <button className="w-8 h-8 flex items-center justify-center border border-dashed border-black/20 rounded-full text-gray-400 hover:text-black hover:border-black transition-all">
                  <span className="text-lg font-light">+</span>
                </button>
              </div>
            </div>

            {/* Available Date */}
            <div className="space-y-4">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b-2 border-luxury-gold pb-2 text-black">Available Date</h3>
              <input 
                type="date"
                className="w-full bg-gray-50 border border-black/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-black transition-all"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />
            </div>

            <div className="pt-6 space-y-3">
              <button 
                onClick={handleApplyFilters}
                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
              >
                Apply Filters
              </button>
              <button 
                onClick={() => { 
                  setCategory(''); setSize(''); setPriceRange([0, 10000]); setColor(''); setAvailableDate('');
                  setTempSize(''); setTempPriceRange([0, 10000]); setTempColor(''); setTempDate('');
                }}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline py-2"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-black/10">
              <p className="text-xl font-light uppercase tracking-widest text-gray-400">No pieces found in this category.</p>
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

export default Collection;
