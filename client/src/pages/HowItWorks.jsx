import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import pickYourPieceImg from '../assets/pick_your_piece.png';
import reserveTheDateImg from '../assets/reserve_the_date.png';
import enjoyAndReturnImg from '../assets/enjoy_and_return.png';

const DressIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 3c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1z" />
    <path d="M9 4c1 0 1 2 3 2s2-2 3-2" />
    <path d="M8 4l1 3h6l1-3M9 7l-3 14h12L15 7H9z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <rect x="3" y="5" width="18" height="15" rx="1" />
    <path d="M16 3v4M8 3v4M3 9h18" />
    <circle cx="7" cy="12" r="0.5" fill="currentColor" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    <circle cx="17" cy="12" r="0.5" fill="currentColor" />
    <circle cx="7" cy="15" r="0.5" fill="currentColor" />
    <circle cx="12" cy="15" r="0.5" fill="currentColor" />
    <circle cx="17" cy="15" r="0.5" fill="currentColor" />
    <circle cx="7" cy="18" r="0.5" fill="currentColor" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    <circle cx="17" cy="18" r="0.5" fill="currentColor" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M21 8l-9-4-9 4v8l9 4 9-4V8z" />
    <path d="M3 8l9 4 9-4" />
    <path d="M12 12v10" />
    <path d="M12 7c-1-1-2.5-1-2.5 0.5s1.5 2 2.5 2.5c1-0.5 2.5-1 2.5-2.5s-1.5-1.5-2.5-0.5z" />
  </svg>
);

const HowItWorks = () => {
  const [content, setContent] = React.useState({});

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        const contentMap = {};
        data.forEach(item => contentMap[item.key] = item.value);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching how it works content', error);
      }
    };
    fetchContent();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Pick Your Piece',
      description: 'Browse our curated collection and choose the designer lehenga that speaks to you.',
      img: content['how-it-works-step-1-img'] || pickYourPieceImg,
      icon: <DressIcon />
    },
    {
      number: '02',
      title: 'Reserve The Date',
      description: 'Select your rental duration and event date. We ensure it reaches you in pristine condition.',
      img: content['how-it-works-step-2-img'] || reserveTheDateImg,
      icon: <CalendarIcon />
    },
    {
      number: '03',
      title: 'Enjoy & Return',
      description: 'Wear it, love it, and send it back. We take care of the dry cleaning and maintenance.',
      img: content['how-it-works-step-3-img'] || enjoyAndReturnImg,
      icon: <BoxIcon />
    }
  ];

  const GoldDivider = () => (
    <div className="flex items-center justify-center gap-4 py-0.5">
      <div className="w-24 h-[0.5px] bg-luxury-gold/40"></div>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold">
        <path d="M20 1C21.5 1 23 3 23 6C23 9 21.5 11 20 11C18.5 11 17 9 17 6C17 3 18.5 1 20 1Z" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M10 6H17M23 6H30" stroke="currentColor" strokeWidth="0.5"/>
        <circle cx="10" cy="6" r="1" fill="currentColor"/>
        <circle cx="30" cy="6" r="1" fill="currentColor"/>
      </svg>
      <div className="w-24 h-[0.5px] bg-luxury-gold/40"></div>
    </div>
  );

  return (
    <div className="bg-[#FAF7F7] min-h-screen pt-16 pb-16 relative overflow-hidden font-poppins">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');`}
      </style>

      {/* Floral Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.05] pointer-events-none">
        <img src="https://www.transparentpng.com/download/floral/floral-corner-transparent-image-3.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none -scale-x-100 -scale-y-100">
        <img src="https://www.transparentpng.com/download/floral/floral-corner-transparent-image-3.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center relative z-10">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-luxury-gold text-[10px] font-bold tracking-[0.6em] uppercase mb-0.5">How It Works</p>
          <GoldDivider />
          <h1 className="text-2xl md:text-4xl font-['Playfair_Display'] text-[#4A2033] font-medium leading-tight mt-1 mb-1 tracking-normal uppercase">Three Simple Steps</h1>
          <p className="text-[#8E7681] text-[8px] md:text-[9px] font-bold tracking-[0.5em] uppercase">To Your Perfect Outfit</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="relative mb-12 w-full">
                <div className="aspect-[1.15/1] overflow-hidden rounded-sm shadow-[0_15px_45px_rgba(74,32,51,0.08)] bg-white">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                {/* Overlapping Icon */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#4A2033] text-white rounded-full flex items-center justify-center shadow-xl border-[3px] border-[#FAF7F7] z-20">
                  {React.cloneElement(step.icon, { className: 'w-7 h-7' })}
                </div>
              </div>
              
              <div className="space-y-3 w-full">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-['Playfair_Display'] text-luxury-gold italic font-medium leading-none">{step.number}</span>
                    <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#4A2033] uppercase leading-none">{step.title}</h3>
                  </div>
                  <GoldDivider />
                </div>
                <p className="text-[#8E7681] text-[9.5px] leading-relaxed uppercase tracking-[0.12em] font-semibold max-w-[220px] mx-auto text-center opacity-90">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA Section */}
        <div className="mt-20 pb-12">
          <div className="flex flex-col items-center gap-6">
            <div className="text-luxury-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <p className="text-[#4A2033] text-[10px] font-bold tracking-[0.4em] uppercase text-center max-w-2xl leading-loose">
              Stylish Outfits. Flexible Rentals. Memorable Moments.
            </p>
            <Link
              to="/collection"
              className="mt-4 px-12 py-4 bg-[#4A2033] text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#632c45] transition-all duration-500 shadow-xl rounded-sm"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
