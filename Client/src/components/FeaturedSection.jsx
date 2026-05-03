import React from "react";
import Title from "./Title";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; 
import { useCarContext } from "../Context/context";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cars, dummyCarData } = useCarContext();

  // Safety Check: Agar cars database se aa rahi hain toh wo, nahi toh dummy data
  const displayCars = cars && cars.length > 0 
    ? cars.slice(0, 6) 
    : dummyCarData.slice(0, 6);

  return (
    <section className="bg-white py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16"
      >
        {/* --- Header Section --- */}
        <div className="flex flex-col items-center text-center mb-16">
          <Title title="Featured Collection" subTitle="Our Best Fleet" />
          <p className="text-gray-400 mt-2 text-xs md:text-sm uppercase tracking-[4px] font-bold">
            Luxury • Comfort • Reliability
          </p>
        </div>

        {/* --- Car Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCars.map((car, index) => (
            <motion.div
              key={car?._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              // Card click par bhi link kaam karega
              onClick={() => {
                const params = searchParams.toString();
                navigate(`/car-details/${car?._id}${params ? `?${params}` : ""}`);
              }}
              className="group cursor-pointer bg-white border border-gray-100 p-3 rounded-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* --- Image Box --- */}
              <div className="relative aspect-[16/10] w-full bg-[#fcfcfc] overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
                  alt={car?.name || "Car"}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                  }}
                />
                
                <div className="absolute bottom-2 right-2 bg-black/5 px-2 py-1">
                   <p className="text-[9px] uppercase tracking-tighter font-bold text-gray-400">RudraDrive Premium</p>
                </div>
              </div>

              {/* --- Content Area --- */}
              <div className="mt-6 px-2 pb-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      {car?.name || "Premium Model"}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {car?.brand || "Authorized Fleet"} • {car?.fuelType || "Petrol"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-xl font-black italic leading-none">
                      ₹{car?.price || "0"}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Per Day</p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100 my-4 group-hover:bg-primary/30 transition-colors" />

                {/* Specs Row */}
                <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-500 tracking-tighter">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {car?.type || "Sedan"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {car?.seats || "5"} SEATS
                  </span>
                  
                  {/* --- Yahan Details Link Add kiya hai --- */}
                  <Link 
                    to={`/car-details/${car?._id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
                    onClick={(e) => e.stopPropagation()} // Card click event ko rokne ke liye
                    className="text-primary group-hover:underline cursor-pointer"
                  >
                    Details &gt;
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- View All Button --- */}
        <div className="flex justify-center mt-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate("/cars");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-4 bg-slate-900 text-white px-10 py-4 rounded-sm shadow-xl"
          >
            <span className="text-xs font-bold uppercase tracking-[4px]">Explore All Cars</span>
            <span className="text-xl">→</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedSection;