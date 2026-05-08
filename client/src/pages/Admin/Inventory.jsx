import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/apifetch';

const Inventory = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products', error);
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this designer piece?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search inventory by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-maroon text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              if (window.confirm('This will reset inventory with sample data. Continue?')) {
                try {
                  setLoading(true);
                  await axios.get('/api/products/seed');
                  await fetchProducts();
                  alert('Inventory seeded successfully!');
                } catch (err) { 
                  alert('Seed failed: ' + (err.response?.data?.message || err.message));
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Seed Inventory
          </button>
          <Link 
            to="/rani-manager/add-product"
            className="bg-maroon text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-900 transition-colors text-sm font-poppins"
          >
            <Plus className="w-4 h-4" /> New Lehenga
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Piece</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price/Day</th>
              <th className="px-6 py-4">Sizes</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-poppins text-sm">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10">Loading inventory...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No products found. {searchTerm ? 'Try a different search term.' : 'Add your first collection!'}</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                      <span className="font-semibold text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gold/10 text-gold text-[10px] font-bold rounded uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-maroon font-bold">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.size.map(s => (
                        <span key={s} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.inventory} pcs</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/rani-manager/edit-product/${product._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
