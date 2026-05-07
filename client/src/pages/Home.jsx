import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import axios from 'axios';
import lehengaHero from '../assets/lehenga-hero.png';


const Home = () => {
  const [content, setContent] = React.useState({});
  
  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        const contentMap = {};
        data.forEach(item => contentMap[item.key] = item.value);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching home content', error);
      }
    };
    fetchContent();
  }, []);

  const categories = [
    { 
      name: 'Bridal Lehenga', 
      img: (content['home-cat-bridal-img'] && content['home-cat-bridal-img'].trim()) || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', 
      desc: content['home-cat-bridal-desc'] || 'The Eternal Bride' 
    },
    { 
      name: 'Party Wear Lehenga', 
      img: (content['home-cat-party-img'] && content['home-cat-party-img'].trim()) || 'https://images.unsplash.com/photo-1605332766099-224449887010?q=80&w=800&auto=format&fit=crop', 
      desc: content['home-cat-party-desc'] || 'Evening Grandeur' 
    },
    { 
      name: 'Festive Lehenga', 
      img: (content['home-cat-festive-img'] && content['home-cat-festive-img'].trim()) || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop', 
      desc: content['home-cat-festive-desc'] || 'Vibrant Traditions' 
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={content['home-hero-bg'] || lehengaHero} 
            alt="Rani Luxury Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[12rem] font-display font-medium mb-4 tracking-[0.2em] leading-tight drop-shadow-2xl uppercase">
              RANI
            </h1>
            <div className="h-px w-32 bg-luxury-gold mx-auto mb-10 opacity-60"></div>
            <p className="max-w-2xl mx-auto text-[12px] font-bold uppercase tracking-[0.6em] mb-14 drop-shadow-md opacity-90">
              Lucknow's Finest Designer Luxury
            </p>
            <div className="flex justify-center">
              <Link
                to="/collection"
                className="bg-white text-black px-14 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 shadow-2xl border border-white"
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-[0.2em] text-luxury-black uppercase">Selected Work</h2>
            <div className="h-0.5 w-20 bg-luxury-gold"></div>
          </div>
          <Link to="/collection" className="text-[11px] font-semibold uppercase tracking-[0.2em] border-b border-luxury-black pb-1 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300">
            View All Lehengas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/collection?category=${encodeURIComponent(cat.name)}`}
              className="block"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-gray-50">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-luxury-black">{cat.name}</h3>
                <p className="text-[11px] text-luxury-gold font-display font-medium uppercase tracking-[0.3em]">{cat.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full Width Impact */}
      <section className="h-[60vh] md:h-[80vh] relative overflow-hidden flex items-center px-6 md:px-12 lg:px-32">
        <div className="absolute inset-0">
          <img
            src={content['home-impact-img'] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000&auto=format&fit=crop"}
            className="w-full h-full object-cover opacity-90"
            alt=""
          />
        </div>
        <div className="relative z-10 max-w-xl text-white">
          <h2 className="text-4xl md:text-6xl font-display font-medium mb-8 leading-tight tracking-widest">TIMELESS <br />DESIGN</h2>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] mb-12 leading-relaxed opacity-80">
            Every piece is curated to tell a story of heritage and modern craftsmanship. Experience the pinnacle of rental luxury.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest border border-white px-10 py-5 hover:bg-white hover:text-black transition-all"
          >
            Explore <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>



      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#FCF7F7] px-8 border-t border-black/5 text-center">
        <div className="max-w-[800px] mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-widest text-luxury-black uppercase">CONTACT US</h2>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-[11px]">
            Visit our boutique in Hazratganj or get in touch for personalized styling.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2">Location</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hazratganj, Lucknow</p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2">Email</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">hello@ranirentals.com</p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2">Phone</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">+91 88876 54321</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
