import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { useCarContext } from "../Context/context";
import { toast } from "react-hot-toast";
import {motion} from 'motion/react';

const dummyMyBookingsData = [
  { _id: "b1", car: { brand: "BMW", model: "X5", year: "2023", category: "SUV", location: "Delhi" }, status: "confirmed", pickupDate: "2023-10-01", returnDate: "2023-10-05", totalAmount: 25000, createdAt: "2023-09-25" },
  { _id: "b2", car: { brand: "Audi", model: "A6", year: "2022", category: "Sedan", location: "Mumbai" }, status: "pending", pickupDate: "2023-11-10", returnDate: "2023-11-12", totalAmount: 15000, createdAt: "2023-11-01" },
];

const MyBooking = () => {
  const { axios, user, currency } = useCarContext();

  const [booking, setBooking] = useState([]);
  
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBooking(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchMyBookings();
    } else {
      // Show dummy bookings when user is not logged in
      setBooking(dummyMyBookingsData);
    }
  }, [user]);

  return (
    <motion.div 
    initial={{opacity:0 , y:30}}
    animate={{opacity:1 , y:0}}
    transition={{ duration: 0.6 }}
    className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 2xl:px-48 text-sm max-w-7xl ">
      <Title
        title="My Bookings"
        subTitle="View and manage your bookings"
        align="left"
      />
      <div>
        {booking
          .filter((b) => b.car)
          .map((booking, index) => (
            <motion.div
              initial={{opacity:0 , y:20}}
              whileInView={{opacity:1 , y:0}}
              transition={{ duration: 0.4 , delay:index*0.1}}
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
            >
              {/* Car Image + Details  */}
              <div className="md:col-span-1">
                <div className="rounded-md overflow-hidden mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920"
                    className="w-full h-auto object-cover aspect-video"
                    alt=""
                  />
                </div>
                <p className="text-lg font-medium mt-2">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-gray-500">
                  {booking.car.year} . {booking.car.category} .{" "}
                  {booking.car.location}
                </p>
              </div>

              {/* Booking Details */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="px-3 py-1.5 bg-light rounded ">
                    Booking #{index + 1}
                  </p>
                  <p
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-400/15 text-green-600"
                        : "bg-red-400/15 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </p>
                </div>

                <div className="flex items-start gap-2 mt-3">
                  <span className="w-4 h-4 mt-1">📅</span>
                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    <p>
                      {booking.pickupDate.split("T")[0]} To{" "}
                      {booking.returnDate.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-3">
                  <span className="w-4 h-4 mt-1">📍</span>
                  <div>
                    <p className="text-gray-500">Pickup Location</p>
                    <p>{booking.car.location}</p>
                  </div>
                </div>
              </div>

              {/* price */}
              <div className="md:col-span-1 flex flex-col gap-6 justify-between">
                <div className="text-sm text-gray-500 text-right">
                  <p> Total Amount</p>
                  <h1 className="text-2xl font-semibold text-primary">
                    {currency}
                    {booking.totalAmount}
                  </h1>
                  <p>Booked On: {booking.createdAt.split("T")[0]}</p>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

export default MyBooking;
