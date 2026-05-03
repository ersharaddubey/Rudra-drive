import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useCarContext } from "../../Context/context";
import { toast } from "react-hot-toast";

const ManageBooking = () => {
  const { currency, axios, token } = useCarContext();

  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner");
      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOwnerBookings();
    }
  }, [token]);
  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage bookings."
      />
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table>
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car </th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total Price</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter((b) => b.car)
              .map((booking, index) => (
                <tr
                  key={index}
                  className="border-t border-borderColor text-gray-500"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={booking.car.image}
                      alt=""
                      className="w-12 h-12 aspect-square rounded-md object-cover"
                    />
                    <p className="font-medium max-md:hidden">
                      {booking.car.brand} {booking.car.model}
                    </p>
                  </td>
                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate.split("T")[0]} to{" "}
                    {booking.returnDate.split("T")[0]}
                  </td>
                  <td className="p-3">
                    {currency}
                    {booking.totalAmount}
                  </td>
                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                      Offline
                    </span>
                  </td>
                  <td className="p-3">
                    {booking.status === "pending" ? (
                      <select
                        onChange={(e) =>
                          changeBookingStatus(booking._id, e.target.value)
                        }
                        className="px-2 py-1.5 border border-borderColor rounded-md outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={` text-xs px-3 py-1 rounded-full font-semibold ${
                          booking.status === "pending"
                            ? "text-yellow-500 bg-yellow-100"
                            : booking.status === "confirmed"
                            ? "text-green-500 bg-green-100"
                            : "text-red-500 bg-red-100"
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooking;
