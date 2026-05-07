import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="pt-10 md:pt-20 pb-20 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="flex items-center gap-4 mb-12">
          <Heart className="w-6 h-6 md:w-8 md:h-8 fill-black" />
          <h1 className="text-2xl md:text-4xl font-display font-medium tracking-widest uppercase">My Wishlist</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-32 space-y-8">
            <div className="inline-block p-8 bg-[#FCF7F7] rounded-full mb-4">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-400">Your wishlist is empty</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto">
              Save your favorite designer pieces here to keep track of them for your special occasions.
            </p>
            <Link 
              to="/collection" 
              className="inline-block px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
