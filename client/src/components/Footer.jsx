import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-black pt-16 md:pt-24 pb-12 border-t border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 border-b border-black/5 pb-16 md:pb-20">
        {/* Brand */}
        <div className="space-y-8">
          <Link to="/" className="text-2xl font-bold tracking-[0.3em] flex items-center gap-2 uppercase">
            RANI
          </Link>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
            Curating the finest designer lehengas for your special moments. Luxury rental service that brings elegance to your doorstep.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"><Share2 className="w-4 h-4" /></a>
            <a href="#" className="p-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"><Globe className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Quick Links</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <li><Link to="/collection" className="hover:text-black transition-colors">Shop Collection</Link></li>
            <li><Link to="/how-it-works" className="hover:text-black transition-colors">How it Works</Link></li>
            <li><Link to="/about" className="hover:text-black transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Collections</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <li><Link to="/collection?category=Bridal" className="hover:text-black transition-colors">Bridal Wear</Link></li>
            <li><Link to="/collection?category=Party" className="hover:text-black transition-colors">Party Lehengas</Link></li>
            <li><Link to="/collection?category=Festive" className="hover:text-black transition-colors">Festive Collection</Link></li>
            <li><Link to="/collection?category=Designer" className="hover:text-black transition-colors">Designer Pieces</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Get in Touch</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Hazratganj, Lucknow</li>
            <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> +91 88876 54321</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> lucknow@ranirentals.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300">
        <p>© 2026 Rani Rentals. All Rights Reserved.</p>
        <div className="flex gap-10">
          <a href="#" className="hover:text-black">Privacy Policy</a>
          <a href="#" className="hover:text-black">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
