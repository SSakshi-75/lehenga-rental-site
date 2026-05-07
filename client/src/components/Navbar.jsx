import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, User, UserPlus, LogOut, Search, X, Menu, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-50 px-4 md:px-8 py-4 md:py-5">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Left: Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Center/Left: Logo */}
        <Link to="/" className="text-3xl font-display font-medium tracking-[0.2em] text-luxury-black flex items-center gap-2">
          RANI
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-text">
          <Link to="/" className="hover:text-luxury-gold transition-colors duration-300">Home</Link>
          <Link to="/collection" className="hover:text-luxury-gold transition-colors duration-300">Lehenga</Link>
          <Link to="/bridal" className="hover:text-luxury-gold transition-colors duration-300">Bridal</Link>
          <Link to="/festive" className="hover:text-luxury-gold transition-colors duration-300">Festive</Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-5 sm:gap-6">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-luxury-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <Link to="/wishlist" className="relative hover:text-luxury-gold transition-colors hidden sm:block" title="Wishlist">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* User/Auth Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 hover:text-luxury-gold transition-all duration-300 py-1"
              title="Account"
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>
            
            {/* Dropdown Card */}
            {isUserMenuOpen && (
              <>
                {/* Backdrop to close */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
                
                <div className="absolute right-0 mt-4 w-48 bg-white border border-black/5 shadow-2xl py-4 z-50 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col">
                    {!user ? (
                      <>
                        <Link 
                          to="/login" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-luxury-gold hover:bg-gray-50 transition-all duration-300"
                        >
                          Login
                        </Link>
                        <Link 
                          to="/register" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-luxury-gold hover:bg-gray-50 transition-all duration-300"
                        >
                          Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/orders" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-luxury-gold hover:bg-gray-50 transition-all duration-300"
                        >
                          My Orders
                        </Link>

                        <Link 
                          to="/wishlist" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-luxury-gold hover:bg-gray-50 transition-all duration-300"
                        >
                          My Wishlist
                        </Link>
                        
                        <button 
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-all duration-300 mt-2"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <Link to="/cart" className="relative hover:text-luxury-gold transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Expandable Search */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full h-24 bg-white z-[60] flex items-center px-8">
          <form onSubmit={handleSearch} className="max-w-[1400px] mx-auto w-full relative">
            <input
              autoFocus
              type="text"
              placeholder="SEARCH OUR COLLECTION"
              className="w-full text-2xl font-light uppercase tracking-widest border-none outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setIsSearchOpen(false)} className="absolute right-0 top-1/2 -translate-y-1/2">
              <X className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[70] p-10 animate-in slide-in-from-left duration-300">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-8">
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col gap-8 text-xl font-bold uppercase tracking-widest pt-16">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/collection" onClick={() => setIsMenuOpen(false)}>Lehenga</Link>
            <Link to="/bridal" onClick={() => setIsMenuOpen(false)}>Bridal</Link>
            <Link to="/festive" onClick={() => setIsMenuOpen(false)}>Festive</Link>
            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <Heart className="w-5 h-5" /> Wishlist
            </Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>My Bag</Link>
            {!user && (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                  <User className="w-5 h-5" /> Sign In
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5" /> Register
                </Link>
              </>
            )}
            {user && (
              <>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)}>MY ORDERS ({user.name.split(' ')[0]})</Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest">
                  <LogOut className="w-5 h-5" /> LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
