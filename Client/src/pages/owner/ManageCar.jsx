import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useCarContext } from "../../Context/context";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageCar = () => {
  const { isOwner, axios, currency, token } = useCarContext();
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-availability", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteCars = async (carId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this car?");
      if (!confirm) return;

      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token && isOwner) {
      fetchOwnerCars();
    }
  }, [token, isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full pb-20">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, manage bookings and remove them from the platform."
      />
      <div className="w-full rounded-xl overflow-hidden border border-borderColor mt-8 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="text-gray-500 bg-gray-50 border-b border-borderColor">
            <tr>
              <th className="p-4 font-semibold">Car Details</th>
              <th className="p-4 font-semibold max-lg:hidden">Category</th>
              <th className="p-4 font-semibold max-md:hidden">Description</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold max-md:hidden text-center">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400">No cars listed yet.</td>
              </tr>
            ) : (
              cars.map((car, index) => (
                <tr key={index} className="border-b border-borderColor hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img src={car.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-borderColor shadow-sm" />
                    <div>
                      <p className="font-bold text-gray-800 leading-tight">{car.brand} {car.model}</p>
                      <p className="text-xs text-gray-500 mt-1">{car.seat_capacity} Seats • {car.transmission}</p>
                    </div>
                  </td>
                  <td className="p-4 max-lg:hidden text-gray-600 font-medium">{car.category}</td>
                  <td className="p-4 max-md:hidden max-w-[200px]">
                    <p className="text-xs text-gray-500 line-clamp-2 italic">{car.description || "No description"}</p>
                  </td>
                  <td className="p-4 font-bold text-primary">
                    {currency}{Number(car.basePrice || 0).toLocaleString()}
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {car.pricingModel === 'Outstation' ? '/ KM' : '/ Day'} ({car.pricingModel})</p>
                  </td>
                  <td className="p-4 max-md:hidden text-center">
                    <span onClick={() => toggleAvailability(car._id)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all ${car.isAvailable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {car.isAvailable ? "Live" : "Hidden"}
                    </span>
                  </td>

                  {/* ACTIONS COLUMN - REWRITTEN FOR VISIBILITY */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* EDIT BUTTON */}
                      <button 
                        onClick={() => navigate(`/owner/edit-car/${car._id}`)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-100"
                        title="Edit Car"
                      >
                        <span className="text-lg">✏️</span>
                      </button>

                      {/* TOGGLE BUTTON */}
                      <button 
                        onClick={() => toggleAvailability(car._id)}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                        title="Toggle Status"
                      >
                        <span className="text-lg">{car.isAvailable ? "👁️" : "🙈"}</span>
                      </button>

                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => deleteCars(car._id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all border border-red-100"
                        title="Delete Car"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCar;