import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920",
    title: "Premium Luxury Cars",
    subtitle: "Experience the ultimate comfort and style for your next journey.",
    buttonText: "Book Now"
  },
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920",
    title: "Self-Drive Freedom",
    subtitle: "Rent at affordable prices and explore the city on your own terms.",
    buttonText: "View Fleet"
  },
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920",
    title: "24/7 Roadside Support",
    subtitle: "We ensure your safety with well-maintained cars and instant help.",
    buttonText: "Learn More"
  }
];

const CarHeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
          
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 lg:px-32">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 translate-y-0 transition-transform duration-700">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
              {slide.subtitle}
            </p>
            <button className="w-fit bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button 
        onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              current === i ? "w-8 bg-blue-600" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarHeroSlider;