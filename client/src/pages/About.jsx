import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        const contentMap = {};
        data.forEach(item => contentMap[item.key] = item.value);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching about content', error);
      }
    };
    fetchContent();
  }, []);
  return (
    <div className="pt-10 pb-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] text-[#4A2033] font-medium tracking-[0.1em] uppercase leading-tight">
              Our Story
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px] leading-loose max-w-lg">
              Born in the historic heart of Lucknow, RANI is more than just a rental boutique—it's a celebration of heritage, craftsmanship, and sustainable luxury.
            </p>
            <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px] leading-loose max-w-lg">
              Founded on the belief that royal elegance should be accessible to everyone, we curate only the finest designer pieces, from traditional Chikankari to modern avant-garde lehengas.
            </p>
          </div>
          <div className="aspect-video md:aspect-[3/2] bg-gray-50 relative">
            <img 
              src={content['about-story-img'] || "https://images.pexels.com/photos/36965765/pexels-photo-36965765.jpeg"} 
              className="w-full h-full object-cover shadow-2xl"
              alt="Our Story Aesthetic"
            />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 md:w-48 md:h-48 border-8 border-[#FCF7F7] -z-10"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-black/5">
          {[
            { t: 'Sustainability', d: 'Reducing fashion waste by promoting the circular economy of luxury designer wear.' },
            { t: 'Authenticity', d: 'Each piece is hand-verified for quality and original designer craftsmanship.' },
            { t: 'Heritage', d: 'Preserving the art of Lucknowi embroidery and traditional Indian textiles.' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-widest">{item.t}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] leading-relaxed">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
