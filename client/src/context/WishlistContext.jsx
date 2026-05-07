import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user || !user.token) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get('/api/users/wishlist', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user || !user.token) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      const { data } = await axios.post(`/api/users/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // The backend returns the updated list of IDs
      const isAdded = Array.isArray(data) && data.some(id => id.toString() === productId.toString());
      if (isAdded) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
      
      // Refresh the populated wishlist
      fetchWishlist();
    } catch (error) {
      toast.error("Error updating wishlist");
      console.error(error);
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist || !Array.isArray(wishlist)) return false;
    return wishlist.some(item => {
      const id = (typeof item === 'object' && item !== null) ? (item._id || item.id) : item;
      return id?.toString() === productId?.toString();
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
