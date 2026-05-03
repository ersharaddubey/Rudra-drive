import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCarContext } from "../Context/context";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import { 
  MapPin, Calendar, Clock, ChevronLeft, Fuel, Users, Settings2, ShieldCheck 
} from "lucide-react";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cars, dummyCarData, axios, user, getCarPricing } = useCarContext();

  const [car, setCar] = useState(null);
  const [estimation, setEstimation] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  // Extract all params from URL
  const pCity = searchParams.get("pCity") || "";
  const pLoc = searchParams.get("pLoc") || "";
  const dLoc = searchParams.get("dLoc") || "";
  const pDate = searchParams.get("pDate") || "";
  const pTime = searchParams.get("pTime") || "10:00";
  const tripType = searchParams.get("type") || "Outstation";
  const numberOfDays = parseInt(searchParams.get("numberOfDays")) || 1;
  const packageType = searchParams.get("packageType") || "";

  // Return Date Calculation
  const calculatedReturnDate = useMemo(() => {
    if (tripType !== "Outstation" || !pDate) return pDate;
    const date = new Date(pDate);
    date.setDate(date.getDate() + numberOfDays);
    return date.toISOString().split("T")[0];
  }, [pDate, numberOfDays, tripType]);

  // Price Estimation
  useEffect(() => {
    if (!car) return;
    
    const { total } = getCarPricing(car, tripType, numberOfDays);
    setEstimation(total);
  }, [car, tripType, numberOfDays, getCarPricing]);

  // Load Car Data
  useEffect(() => {
    const foundCar = cars.find((c) => c._id === id) || dummyCarData?.find((c) => c._id === id);
    setCar(foundCar);
    window.scrollTo(0, 0);
  }, [cars, id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book this car");
      return;
    }

    // Validate if search parameters exist
    if (!pDate || !pLoc || !dLoc) {
      toast.error("Please select Pickup Date and Location from the home page first.");
      navigate("/");
      return;
    }

    setIsBooking(true);
    try {
      const bookingPayload = {
        car: id,
        pickupDate: pDate || new Date().toISOString().split('T')[0],
        returnDate: calculatedReturnDate,
        pickupLocation: pLoc || "Not Specified",
        dropLocation: dLoc || "Not Specified",
        tripType,
        numberOfDays,
        packageType,
        totalEstimation: estimation,
      };

      const { data } = await axios.post("/api/bookings/create", bookingPayload);
      if (data.success) {
        toast.success("Booking request sent successfully!");
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setIsBooking(false);
    }
  };

  if (!car) return <div className="h-screen flex items-center justify-center font-bold text-xl">Loading car details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 mt-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-8 text-slate-500 hover:text-primary font-bold uppercase text-xs tracking-widest transition-all"
      >
        <ChevronLeft size={16} /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Car Info */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <img 
              src={car.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"} 
              alt={car.brand} 
              className="w-full h-[300px] md:h-[450px] object-cover rounded-[2rem] shadow-2xl"
            />
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic">
                {car.brand} <span className="text-blue-600">{car.model}</span>
              </h1>
              <p className="text-slate-400 font-bold mt-2 flex items-center gap-2 uppercase tracking-widest text-sm">
                <ShieldCheck size={16} className="text-green-500" /> Verified Premium Vehicle
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-600">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing starts at</p>
              <p className="text-3xl font-black text-slate-900">
                ₹{Number(car.basePrice || 0).toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-500">{car.pricingModel === 'Outstation' ? '/KM' : '/Day'}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SpecCard icon={<Users size={20}/>} label="Capacity" value={`${car.seat_capacity || car.seats} Seats`} />
            <SpecCard icon={<Fuel size={20}/>} label="Fuel Type" value={car.fuel_type || car.fuelType} />
            <SpecCard icon={<Settings2 size={20}/>} label="Transmission" value={car.transmission} />
            <SpecCard icon={<MapPin size={20}/>} label="Base City" value={car.location || pCity || "Not specified"} />
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 italic uppercase">Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {car.description || "Enjoy a smooth and luxury ride with RudraDrive. This vehicle is well-maintained and comes with professional chauffeur options."}
            </p>
          </div>
        </div>

        {/* RIGHT: Booking Summary */}
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-28 shadow-2xl border border-white/5"
          >
            <h2 className="text-2xl font-black italic uppercase mb-8 border-b border-white/10 pb-4 text-blue-500">Booking Summary</h2>
            
            <div className="space-y-6">
              <SummaryItem icon={<MapPin size={14}/>} label="City" value={pCity || "Not Selected"} />
              <SummaryItem icon={<MapPin size={14}/>} label="Pickup Point" value={pLoc || "Not Selected"} />
              <SummaryItem icon={<MapPin size={14}/>} label="Destination" value={dLoc || "Not Selected"} />
              <SummaryItem icon={<Calendar size={14}/>} label="Pickup" value={`${pDate} at ${pTime}`} />
              <SummaryItem icon={<Clock size={14}/>} label="Duration" value={`${numberOfDays} Day(s)`} />
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[3px] mb-1">Total Estimation</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹{estimation.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-3 leading-tight uppercase">
                  *Excludes tolls, parking and state taxes, and ₹500 additional charges for the driver.
                </p>
              </div>
              <button
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/30 disabled:bg-slate-700 disabled:cursor-not-allowed"
              >
                {isBooking ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const SpecCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-300">
    <div className="text-blue-600 group-hover:text-white mb-3 transition-colors">{icon}</div>
    <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 uppercase tracking-widest mb-1">{label}</p>
    <p className="font-bold text-slate-900 group-hover:text-white">{value}</p>
  </div>
);

const SummaryItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 w-full">
    <div className="mt-1 text-blue-500 flex-shrink-0">{icon}</div>
    
    {/* min-w-0 flex box ke andar text wrapping enable karne ke liye zaroori hai */}
    <div className="flex-1 min-w-0"> 
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
      
      {/* break-words se lamba text automatic next line mein aa jayega */}
      <p className="text-sm font-semibold text-white break-words leading-tight">
        {value}
      </p>
    </div>
  </div>

);

export default CarDetails;