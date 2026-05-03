import React, { useState, useEffect } from "react";
import { useCarContext } from "../Context/context";
import { motion, AnimatePresence } from "framer-motion";

const cityList = ["Mumbai"];

const slides = [
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920",
    title: "Premium Luxury Cars",
    desc: "Experience the ultimate comfort for your next journey."
  },
  {
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920",
    title: "Your Journey, Your Rules",
    desc: "Flexible rentals for every city commute."
  },
  {
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1920",
    title: "Reliable Roadside Help",
    desc: "24/7 support ensuring your safety always."
  }
];

const Hero = () => {
  const { pickupDate, setPickupDate, navigate } = useCarContext();
  const [activeTab, setActiveTab] = useState("Outstation");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form States
  const [pickupCity, setPickupCity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("SUV Local");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickupDate) {
      alert("Please select a Pickup Date");
      return;
    }
    const queryParams = new URLSearchParams({
      type: activeTab,
      pCity: pickupCity,
      pLoc: pickupLocation,
      dLoc: dropLocation,
      pDate: pickupDate,
      pTime: pickupTime,
      numberOfDays: numberOfDays.toString(),
      packageType: activeTab === "Local" ? selectedPackage : "",
    });
    navigate(`/cars?${queryParams.toString()}`);
  };

  // Label and Input adjustment for zero-scroll
  const labelStyle = "text-[9px] uppercase font-bold text-gray-400 tracking-widest absolute top-1.5 left-4";
  const inputStyle = "w-full pt-6 pb-1.5 px-4 bg-gray-50 border-none rounded-sm text-sm font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all";

  return (
    // overflow-hidden on main container is crucial
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white overflow-hidden fixed inset-0">
      
      {/* LEFT SIDE: Search Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-20 h-full bg-white">
        
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-4">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
              Book a <span className="text-primary italic">Rudra-Drive</span>
            </h1>
            
            <div className="flex gap-8 mt-4 border-b border-gray-100">
              {["Outstation", "Local"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-[11px] font-bold tracking-widest transition-all ${
                    activeTab === tab ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-2.5">
            <div className="grid grid-cols-1 gap-2.5">
              <div className="relative group">
                <label className={labelStyle}>City</label>
                <select required className={inputStyle} value={pickupCity} onChange={(e) => setPickupCity(e.target.value)}>
                  <option value="">Select City</option>
                  {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

              <div className="relative">
                <label className={labelStyle}>Pickup Address</label>
                <input type="text" required placeholder="Pickup Point" className={inputStyle} value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
              </div>

              <div className="relative">
                <label className={labelStyle}>{activeTab === "Outstation" ? "Destination" : "Drop Address"}</label>
                <input type="text" required placeholder={activeTab === "Outstation" ? "Going to?" : "Drop point"} className={inputStyle} value={dropLocation} onChange={(e) => setDropLocation(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <label className={labelStyle}>Pickup Date</label>
                  <input type="date" required className={inputStyle} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                </div>
                <div className="relative">
                  <label className={labelStyle}>Pickup Time</label>
                  <input type="time" required className={inputStyle} value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="relative">
                  <label className={labelStyle}>Duration (Days)</label>
                  <input type="number" min="1" className={inputStyle} value={numberOfDays} onChange={(e) => setNumberOfDays(Math.max(1, parseInt(e.target.value) || 1))} />
                </div>
                
                {activeTab === "Local" && (
                  <div className="relative">
                    <label className={labelStyle}>Package</label>
                    <select className={inputStyle} value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}>
                      <option value="SUV Local">SUV (8h/80km)</option>
                      <option value="Sedan Local">Sedan (8h/80km)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 bg-black text-white rounded-sm font-black text-[10px] uppercase tracking-[3px] hover:bg-primary transition-all active:scale-95 shadow-lg"
            >
              Search RudraDrive
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Image Slider */}
      <div className="hidden lg:block w-1/2 relative h-full bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img src={slides[currentSlide].image} alt="Car" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12 text-white">
               <p className="text-primary font-bold tracking-[5px] uppercase text-[10px] mb-2">Premium Mobility</p>
               <h3 className="text-3xl font-black uppercase italic leading-tight">{slides[currentSlide].title}</h3>
               <p className="text-gray-300 mt-2 max-w-sm text-xs leading-relaxed">{slides[currentSlide].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-12 flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? "w-8 bg-primary" : "w-4 bg-white/20"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;