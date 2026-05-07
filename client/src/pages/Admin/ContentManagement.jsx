import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Save, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Settings, Upload } from 'lucide-react';

const ContentManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [content, setContent] = useState({
    // Homepage
    'home-hero-bg': '',
    'home-cat-bridal-img': '',
    'home-cat-bridal-desc': '',
    'home-cat-party-img': '',
    'home-cat-party-desc': '',
    'home-cat-festive-img': '',
    'home-cat-festive-desc': '',
    'home-impact-img': '',
    // How It Works
    'how-it-works-step-1-img': '',
    'how-it-works-step-2-img': '',
    'how-it-works-step-3-img': '',
    'how-it-works-additional-1-img': '',
    'how-it-works-additional-2-img': '',
    // About
    'about-story-img': '',
    // Collection Pages
    'bridal-hero-bg': '',
    'bridal-signature-img': '',
    'festive-hero-bg': '',
    'festive-signature-img': '',
    // Global Settings
    'global-gst-rate': '12',
  });
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        const contentMap = {};
        data.forEach(item => {
          contentMap[item.key] = item.value;
        });
        
        setContent(prev => ({
          ...prev,
          ...contentMap
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const items = Object.entries(content).map(([key, value]) => ({
        key,
        value,
        type: key.includes('img') || key.includes('bg') ? 'image' : 'setting'
      }));

      await axios.post('/api/content/bulk', { items }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setMessage({ type: 'success', text: 'Content updated successfully! Changes are live.' });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update content. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      });
      handleChange(key, data.image);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-maroon" />
      </div>
    );
  }

  const ImageInput = ({ label, id, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-maroon" />
          {label}
        </label>
        {uploading[id] && <Loader2 className="w-4 h-4 animate-spin text-maroon" />}
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(id, e.target.value)}
            placeholder="Image URL"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-maroon outline-none text-xs transition-all bg-gray-50/50"
          />
          <div className="relative">
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, id)}
              className="hidden"
              id={`file-${id}`}
              accept="image/*"
            />
            <label
              htmlFor={`file-${id}`}
              className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-maroon hover:text-white transition-all flex items-center gap-2"
            >
              <Upload className="w-3 h-3" />
              Gallery
            </label>
          </div>
        </div>
        
        {value && (
          <div className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL'; }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-widest border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">PREVIEW</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-poppins font-black text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-maroon" />
            CONTENT MANAGEMENT
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Update high-end imagery and dynamic sections of your boutique site.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all transform active:scale-95 ${
            saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-maroon text-white hover:bg-maroon-dark shadow-xl shadow-maroon/20'
          }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'SAVING CHANGES...' : 'SAVE ALL CHANGES'}
        </button>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold uppercase tracking-wide">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-16">
        {/* Homepage Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-maroon uppercase tracking-[0.3em]">Homepage Visuals</h2>
            <div className="h-[1px] flex-1 bg-maroon/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ImageInput label="Home Hero Background" id="home-hero-bg" value={content['home-hero-bg']} />
            <ImageInput label="Home Impact Background" id="home-impact-img" value={content['home-impact-img']} />
          </div>

          <div className="flex items-center gap-4 mt-12 mb-8">
            <h2 className="text-xl font-black text-maroon uppercase tracking-[0.3em]">Selected Work (Categories)</h2>
            <div className="h-[1px] flex-1 bg-maroon/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <ImageInput label="Bridal Category Image" id="home-cat-bridal-img" value={content['home-cat-bridal-img']} />
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Bridal Subtitle</label>
                <input 
                  type="text" 
                  value={content['home-cat-bridal-desc']} 
                  onChange={(e) => handleChange('home-cat-bridal-desc', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-maroon outline-none text-xs bg-gray-50/50"
                />
              </div>
            </div>

            <div className="space-y-6">
              <ImageInput label="Party Wear Category Image" id="home-cat-party-img" value={content['home-cat-party-img']} />
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Party Wear Subtitle</label>
                <input 
                  type="text" 
                  value={content['home-cat-party-desc']} 
                  onChange={(e) => handleChange('home-cat-party-desc', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-maroon outline-none text-xs bg-gray-50/50"
                />
              </div>
            </div>

            <div className="space-y-6">
              <ImageInput label="Festive Category Image" id="home-cat-festive-img" value={content['home-cat-festive-img']} />
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Festive Subtitle</label>
                <input 
                  type="text" 
                  value={content['home-cat-festive-desc']} 
                  onChange={(e) => handleChange('home-cat-festive-desc', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-maroon outline-none text-xs bg-gray-50/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-maroon uppercase tracking-[0.3em]">How It Works Page</h2>
            <div className="h-[1px] flex-1 bg-maroon/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ImageInput label="Step 01: Pick Your Piece" id="how-it-works-step-1-img" value={content['how-it-works-step-1-img']} />
            <ImageInput label="Step 02: Reserve The Date" id="how-it-works-step-2-img" value={content['how-it-works-step-2-img']} />
            <ImageInput label="Step 03: Enjoy & Return" id="how-it-works-step-3-img" value={content['how-it-works-step-3-img']} />
            <ImageInput label="Additional Image 01" id="how-it-works-additional-1-img" value={content['how-it-works-additional-1-img']} />
            <ImageInput label="Additional Image 02" id="how-it-works-additional-2-img" value={content['how-it-works-additional-2-img']} />
          </div>
        </section>

        {/* About & Collections Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-maroon uppercase tracking-[0.3em]">About & Collection Pages</h2>
            <div className="h-[1px] flex-1 bg-maroon/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ImageInput label="About Story Image" id="about-story-img" value={content['about-story-img']} />
            <div className="h-[1px] col-span-full bg-gray-100 my-4"></div>
            <ImageInput label="Bridal Page Banner" id="bridal-hero-bg" value={content['bridal-hero-bg']} />
            <ImageInput label="Bridal Signature Look" id="bridal-signature-img" value={content['bridal-signature-img']} />
            <ImageInput label="Festive Page Banner" id="festive-hero-bg" value={content['festive-hero-bg']} />
            <ImageInput label="Festive Signature Look" id="festive-signature-img" value={content['festive-signature-img']} />
          </div>
        </section>

        {/* Global Settings Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-maroon uppercase tracking-[0.3em]">Global Configuration</h2>
            <div className="h-[1px] flex-1 bg-maroon/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Settings className="w-4 h-4 text-maroon" />
                  Default GST Rate (%)
                </label>
              </div>
              <div className="space-y-4">
                <input
                  type="number"
                  value={content['global-gst-rate']}
                  onChange={(e) => handleChange('global-gst-rate', e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-maroon outline-none text-sm transition-all bg-gray-50/50"
                />
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                  This rate will be used as the default for all products unless specifically overridden.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 bg-luxury-gold/5 p-8 rounded-3xl border border-luxury-gold/20 flex items-center justify-between">
        <div className="max-w-lg">
          <h3 className="text-maroon font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            Quick Note
          </h3>
          <p className="text-sm text-maroon/60 leading-relaxed font-medium">
            Changes made here will update the live site immediately. Please ensure you use high-quality image URLs (Unsplash, Pexels, or your own CDN) to maintain the premium feel of RANI.
          </p>
        </div>
        <ImageIcon className="w-16 h-16 text-luxury-gold/20" />
      </div>
    </div>
  );
};

export default ContentManagement;
