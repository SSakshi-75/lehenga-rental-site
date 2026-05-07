import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-20 pb-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <h1 className="text-3xl md:text-6xl font-display font-medium tracking-[0.2em] text-center mb-10 md:mb-20 uppercase">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-widest">Get In Touch</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] leading-relaxed max-w-md">
                Have questions about sizing, styling, or bookings? Our concierge team is here to assist you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#FCF7F7] rounded-full"><MapPin className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1">Our Boutique</h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                    Main Market, Hazratganj<br />Lucknow, Uttar Pradesh 226001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#FCF7F7] rounded-full"><Mail className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1">Email Us</h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                    concierge@ranirentals.com<br />styling@ranirentals.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#FCF7F7] rounded-full"><Phone className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1">Call Us</h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                    +91 88876 54321<br />Mon-Sat: 10AM - 8PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FCF7F7] p-6 md:p-12 shadow-2xl">
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">First Name</label>
                  <input type="text" className="w-full bg-white border-b border-black/10 py-3 outline-none focus:border-black transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Last Name</label>
                  <input type="text" className="w-full bg-white border-b border-black/10 py-3 outline-none focus:border-black transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-white border-b border-black/10 py-3 outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Message</label>
                <textarea rows="4" className="w-full bg-white border-b border-black/10 py-3 outline-none focus:border-black transition-colors resize-none"></textarea>
              </div>
              <button className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
