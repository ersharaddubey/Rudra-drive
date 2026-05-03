import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCarContext } from "../Context/context";
import { motion } from "framer-motion";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cars, dummyCarData } = useCarContext();

  const [input, setInput] = useState("");
  const [filterCars, setFilterCars] = useState([]);

  // URL se details nikalna calculation ke liye
  const tripType = searchParams.get("type") || "Outstation";
  const packageType = searchParams.get("packageType") || "";
  const pDate = searchParams.get("pDate");
  const isFromHero = !!pDate;

  // === PRICE CALCULATION FUNCTION ===
  // Wahi logic jo CarDetails mein use ho raha hai
  const getDisplayPrice = (car) => {
    if (tripType === "Outstation") {
      // Outstation ke liye rate per KM (agar car.outstationRate nahi hai toh fallback 12)
      return car.outstationRate || 12; 
    } else {
      // Local ke liye package price (fallback 2500)
      return car.localPackagePrice || 2500;
    }
  };

  const applyFilter = () => {
    let carsToFilter = cars && cars.length > 0 ? cars : dummyCarData;

    if (tripType === "Local" && packageType) {
      if (packageType.includes("SUV")) {
        carsToFilter = carsToFilter.filter(car => 
          car.category?.toLowerCase().includes("suv")
        );
      } else if (packageType.includes("Sedan")) {
        carsToFilter = carsToFilter.filter(car => 
          car.category?.toLowerCase().includes("sedan")
        );
      }
    }

    if (input.trim() !== "") {
      const searchTerm = input.toLowerCase();
      carsToFilter = carsToFilter.filter((car) => 
        car.brand?.toLowerCase().includes(searchTerm) ||
        car.model?.toLowerCase().includes(searchTerm) ||
        car.category?.toLowerCase().includes(searchTerm) ||
        car.name?.toLowerCase().includes(searchTerm)
      );
    }

    setFilterCars(carsToFilter);
  };

  useEffect(() => {
    applyFilter();
  }, [input, cars, tripType, packageType]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="mb-8">
          <p className="text-[13px] font-bold uppercase tracking-widest text-gray-400">
            Found <span className="text-slate-900">{filterCars.length}</span> Models
            {isFromHero && (
              <span className="ml-2 text-primary">/ {tripType} {packageType && `/ ${packageType}`}</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filterCars.map((car, index) => {
            // Har car ke liye price calculate karein
            const displayPrice = getDisplayPrice(car);

            return (
              <motion.div
                key={car?._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  navigate(`/car-details/${car?._id}?${params.toString()}`);
                }}
                className="group cursor-pointer bg-white border border-gray-100 p-3 rounded-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-[16/10] w-full bg-[#fcfcfc] overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
                    alt={car?.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=No+Image"; }}
                  />
                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 border border-gray-100">
                    <p className="text-[8px] font-black uppercase text-slate-800 tracking-tighter">Premium Selection</p>
                  </div>
                </div>

                <div className="mt-6 px-2 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
                        {car?.brand} {car?.model || "Model"}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {car?.fuel_type || car?.fuelType || "Petrol"} • {car?.transmission || "Manual"}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-primary text-xl font-black italic leading-none">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter mt-1 text-nowrap">
                        {tripType === "Outstation" ? "Per KM" : "Base Fare"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gray-100 my-4 group-hover:bg-primary/30 transition-colors" />

                  <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-500 tracking-tighter">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 
                      {car?.category || "SUV"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 
                      {car?.seat_capacity || car?.seats || "5"} SEATS
                    </span>
                    <button className="text-primary font-black group-hover:translate-x-1 transition-transform">
                      BOOK &gt;
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filterCars.length === 0 && (
          <div className="text-center py-32 bg-slate-50 border border-dashed border-gray-200">
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No Cars Found</h3>
            <p className="text-gray-400 mt-2 font-bold uppercase text-xs">Try changing your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;