import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AddProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Bridal Lehenga',
    inventory: 1,
    size: [],
    color: '',
    gst: 12, // Default 12%
    images: [],
    fabric: '',
    work: '',
    delivery: '',
    securityDeposit: 0
  });
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        inventory: data.inventory,
        size: data.size,
        color: Array.isArray(data.color) ? data.color[0] : data.color,
        gst: data.gst || 12,
        images: data.images,
        fabric: data.fabric || '',
        work: data.work || '',
        delivery: data.delivery || '',
        securityDeposit: data.securityDeposit || 0
      });
    } catch (error) {
      console.error('Error fetching product', error);
      alert('Failed to load product details');
    }
  };

  const categories = ['Bridal Lehenga', 'Wedding Guest Lehenga', 'Party Wear Lehenga', 'Engagement Lehenga', 'Festive Lehenga'];
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeToggle = (sz) => {
    const updatedSizes = formData.size.includes(sz)
      ? formData.size.filter(s => s !== sz)
      : [...formData.size, sz];
    setFormData({ ...formData, size: updatedSizes });
  };

  const addImageUrl = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl('');
    }
  };

  const removeImage = (url) => {
    setFormData({ ...formData, images: formData.images.filter(img => img !== url) });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formDataUpload, config);
      setFormData(prev => ({ ...prev, images: [...prev.images, data.image] }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert('File upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let currentImages = [...formData.images];
    // If user forgot to click 'Add' but has a URL in the box
    if (imageUrl && !currentImages.includes(imageUrl)) {
      currentImages.push(imageUrl);
    }

    if (currentImages.length === 0) return alert('Please add at least one image URL');
    if (formData.size.length === 0) return alert('Please select at least one size');

    setLoading(true);
    try {
      const finalData = { ...formData, images: currentImages, color: [formData.color] };
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (isEdit) {
        await axios.put(`/api/products/${id}`, finalData, config);
      } else {
        await axios.post('/api/products', finalData, config);
      }

      setLoading(false);
      navigate('/rani-manager/inventory');
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} product`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Lehenga Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.name}
            />
            {/* Name Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'Zardosi Royal Red Lehenga',
                'Midnight Velvet Sequence Lehenga',
                'Pastel Bloom Organza Lehenga',
                'Golden Heritage Silk Lehenga',
                'Emerald Grace Mirror Work Lehenga'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setFormData({ ...formData, name: suggestion })}
                  className="text-[10px] bg-red-50 text-maroon px-3 py-1.5 rounded-full border border-red-100 hover:bg-maroon hover:text-white transition-all font-bold uppercase tracking-wider"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <div className="col-span-full">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.description}
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Rental Price / Day (₹)</label>
            <input
              type="number"
              name="price"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.price}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Security Deposit (₹)</label>
            <input
              type="number"
              name="securityDeposit"
              placeholder="2000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.securityDeposit}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">GST Percentage (%)</label>
            <input
              type="number"
              name="gst"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.gst}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Category</label>
            <select
              name="category"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.category}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Fabric Details</label>
            <input
              type="text"
              name="fabric"
              placeholder="e.g. Raw Silk, Soft Net"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins text-sm"
              onChange={handleChange}
              value={formData.fabric}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Work Details</label>
            <input
              type="text"
              name="work"
              placeholder="e.g. Zardosi, Gota Patti"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins text-sm"
              onChange={handleChange}
              value={formData.work}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Delivery Info</label>
            <input
              type="text"
              name="delivery"
              placeholder="e.g. 3-5 days across India"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins text-sm"
              onChange={handleChange}
              value={formData.delivery}
            />
          </div>
        </div>

        {/* Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(sz => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSizeToggle(sz)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                    formData.size.includes(sz)
                      ? 'bg-maroon text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Color</label>
            <input
              type="text"
              name="color"
              placeholder="e.g. Maroon, Emerald Green"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-maroon outline-none font-poppins"
              onChange={handleChange}
              value={formData.color}
            />
          </div>
        </div>

        {/* Image Management */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Lehenga Images</label>
          
          <div className="flex flex-col gap-6 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            {/* Gallery Upload Slots */}
            <div>
              <label className="block text-[10px] font-bold text-maroon uppercase mb-3 tracking-widest">Option 1: Upload from Gallery (3 Slots)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((slot) => (
                  <div key={slot} className="relative group">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id={`gallery-upload-${slot}`}
                      accept="image/*"
                    />
                    <label
                      htmlFor={`gallery-upload-${slot}`}
                      className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-maroon/30 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-maroon/10 transition-colors">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin text-maroon" /> : <Upload className="w-4 h-4 text-gray-400 group-hover:text-maroon" />}
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                          {uploading ? 'Uploading...' : `Upload Image ${slot}`}
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* URL Input */}
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-[10px] font-bold text-maroon uppercase mb-2 tracking-widest">Option 2: Add via URL</label>
              <div className="flex flex-col md:flex-row gap-4">
                <textarea
                  placeholder="Paste image URL here..."
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-maroon outline-none font-poppins text-sm resize-none h-12"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                ></textarea>
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="bg-maroon text-white px-8 py-3 rounded-xl font-bold hover:bg-red-900 transition-all text-xs uppercase tracking-widest shadow-lg shadow-maroon/10 h-12"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {formData.images.length === 0 && (
              <div className="col-span-full py-10 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-xs font-poppins">No images added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-maroon text-white px-10 py-4 rounded-xl font-bold font-poppins hover:bg-red-900 transition-all shadow-xl shadow-maroon/20 flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : isEdit ? 'Update Collection' : 'Publish Collection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
