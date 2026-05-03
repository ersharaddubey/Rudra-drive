import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();   // Hero se aaye params capture kar rahe hain

  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const handleClick = () => {
    const paramsString = searchParams.toString();
    const targetUrl = paramsString 
      ? `/car-details/${car._id}?${paramsString}` 
      : `/car-details/${car._id}`;

    navigate(targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={handleClick}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-white"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {car.isAvaliable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">{currency}{car.outstationRate || car.pricePerDay || 0}</span>
          <span className="text-sm text-white/80">/km</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">{car.brand} {car.model}</h3>
            <p className="text-muted-foreground text-sm">
              {car.category} • {car.year}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">👥</span> {car.seat_capacity}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">⛽</span> {car.fuel_type}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">⚙️</span> {car.transmission}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">📍</span> {car.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;