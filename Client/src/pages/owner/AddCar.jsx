import React, { useState, useEffect, useCallback } from "react";
import Title from "../../components/owner/Title";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCarContext } from "../../Context/context";

// ==========================================
// 1. ADVANCED DATA MAP (FOR AUTO-FILL)
// ==========================================
const carDataMap = {
  SUV: {
    Mahindra: {
      "Thar ROXX": { seats: 5, out: 16, loc: 2500, fuel: "Diesel", trans: "Manual" },
      "XUV700": { seats: 7, out: 18, loc: 3500, fuel: "Petrol", trans: "Automatic" },
      "Scorpio-N": { seats: 7, out: 17, loc: 3000, fuel: "Diesel", trans: "Manual" }
    },
    Toyota: {
      "Fortuner": { seats: 7, out: 25, loc: 5000, fuel: "Diesel", trans: "Automatic" },
      "Innova Hycross": { seats: 7, out: 22, loc: 4500, fuel: "Petrol", trans: "Automatic" }
    },
    Tata: {
        "Safari": { seats: 7, out: 18, loc: 3200, fuel: "Diesel", trans: "Automatic" },
        "Harrier": { seats: 5, out: 17, loc: 3000, fuel: "Diesel", trans: "Manual" }
    }
  },
  Sedan: {
    Hyundai: {
      "Verna": { seats: 5, out: 12, loc: 2200, fuel: "Petrol", trans: "Manual" },
      "Aura": { seats: 5, out: 11, loc: 1800, fuel: "Petrol", trans: "Manual" }
    },
    Honda: {
        "City": { seats: 5, out: 14, loc: 2400, fuel: "Petrol", trans: "Automatic" },
        "Amaze": { seats: 5, out: 10, loc: 1600, fuel: "Petrol", trans: "Manual" }
    }
  },
  Hatchback: {
      Maruti: {
          "Swift": { seats: 5, out: 9, loc: 1400, fuel: "Petrol", trans: "Manual" },
          "Baleno": { seats: 5, out: 10, loc: 1500, fuel: "Petrol", trans: "Manual" }
      }
  }
};

const AddCar = () => {
  const { axios, currency, fetchcars, token } = useCarContext();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const carId = id ? id.trim() : null;
  const isEditMode = !!carId;

  // --- STATE MANAGEMENT ---
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [car, setCar] = useState({
    category: "",
    brand: "",
    model: "",
    year: "2026",
    basePrice: "", // Use a single basePrice field to match backend
    minKmPerDay: "300",
    description: "",
    transmission: "",
    fuel_type: "",
    seat_capacity: "",
    location: "",
  });
  const [pricingModel, setPricingModel] = useState("Outstation"); // State for pricing model selection

  // ==========================================
  // 2. FETCH VEHICLE DETAILS (EDIT MODE)
  // ==========================================
  const fetchCarDetails = useCallback(async () => {
    if (!carId || !token) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/owner/car/${carId}`);
      if (response.data.success && response.data.car) {
        const c = response.data.car;
        setCar({
          category: c.category || "",
          brand: c.brand || "",
          model: c.model || "",
          year: String(c.year || "2026"),
          basePrice: String(c.basePrice || ""), // Map backend basePrice to frontend basePrice
          minKmPerDay: String(c.minKm || "300"), // Map backend minKm to frontend minKmPerDay
          description: c.description || "",
          transmission: c.transmission || "",
          fuel_type: c.fuel_type || "",
          seat_capacity: String(c.seat_capacity || ""),
          location: c.location || "",
        });
        setPricingModel(c.pricingModel || "Outstation"); // Set pricing model from backend
        setExistingImageUrl(c.image || "");
      }
    } catch (error) {
      toast.error("Error loading vehicle data.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [carId, axios, token]);

  useEffect(() => {
    if (isEditMode) fetchCarDetails();
  }, [isEditMode, fetchCarDetails]);

  // ==========================================
  // 3. SMART AUTO-FILL LOGIC
  // ==========================================
  useEffect(() => {
    if (!isEditMode && car.category && car.brand && car.model) {
      const specs = carDataMap[car.category]?.[car.brand]?.[car.model];
      if (specs) {
        setCar(prev => ({
          ...prev,
          seat_capacity: String(specs.seats), 
          basePrice: String(specs.out), // Auto-fill basePrice with outstation rate
          fuel_type: specs.fuel,
          transmission: specs.trans,
          description: `Premium ${prev.brand} ${prev.model} with ${specs.seats} seats. Well maintained, clean interiors, and perfect for ${prev.category === 'SUV' ? 'long trips' : 'city drives'}.`
        }));
        setPricingModel("Outstation"); // Default to Outstation for auto-filled cars
      }
    }
  }, [car.category, car.brand, car.model, isEditMode]);

  // ==========================================
  // 4. SUBMIT HANDLER (MULTIPART FORM)
  // ==========================================
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!isEditMode && !image) {
        return toast.error("Please upload a vehicle image!");
    }

    setIsLoading(true);
    const loadingToast = toast.loading(isEditMode ? "Updating vehicle..." : "Listing vehicle...");

    try {
      const formData = new FormData();
      
      // Append image only if selected
      if (image) {
        formData.append("image", image);
      }
      
      // Prepare backend-ready JSON
      const carDataToSubmit = {
        category: car.category,
        brand: car.brand,
        model: car.model,
        year: Number(car.year),
        basePrice: Number(car.basePrice), // Send basePrice
        minKm: Number(car.minKmPerDay), // Send minKm
        pricingModel: pricingModel, // Send pricingModel
        description: car.description,
        transmission: car.transmission,
        fuel_type: car.fuel_type,
        seat_capacity: Number(car.seat_capacity),
        location: car.location,
      };

      formData.append("carData", JSON.stringify(carDataToSubmit));

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercentage(percentCompleted);
        }
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`/api/owner/update-car/${carId}`, formData, config);
      } else {
        response = await axios.post(`/api/owner/add-car`, formData, config);
      }

      if (response.data.success) {
        toast.success(response.data.message, { id: loadingToast });
        await fetchcars();
        navigate('/owner/manage-cars');
      } else {
        toast.error(response.data.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Process failed. Please try again.", { id: loadingToast });
      console.error(error);
    } finally {
      setIsLoading(false);
      setUploadPercentage(0);
    }
  };

  // ==========================================
  // 5. STYLES & UI HELPERS
  // ==========================================
  const inputStyle = "w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-gray-700 font-medium transition-all shadow-sm";
  const labelStyle = "text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block";
  const boxStyle = "bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-6";

  return (
    <div className="p-4 md:p-10 bg-[#F8F9FB] min-h-screen pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <Title title={isEditMode ? "Modify Listing" : "Register Vehicle"} />
            {isEditMode && (
                <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-xs font-bold border border-yellow-200">
                    EDITING MODE: {car.brand} {car.model}
                </div>
            )}
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-10 animate-in fade-in duration-700">
          
          {/* IMAGE UPLOAD BOX */}
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center hover:border-primary transition-all group cursor-pointer relative overflow-hidden">
            <label htmlFor="car-img" className="cursor-pointer text-center w-full">
              <div className="relative inline-block">
                <img 
                    src={image ? URL.createObjectURL(image) : (existingImageUrl || "https://via.placeholder.com/400x300?text=Upload+Image")} 
                    className="w-64 h-44 object-cover rounded-[2.5rem] shadow-2xl mb-6 transition-transform group-hover:scale-105" 
                    alt="Vehicle" 
                />
                {isLoading && uploadPercentage > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem]">
                        <span className="text-white font-black text-xl">{uploadPercentage}%</span>
                    </div>
                )}
              </div>
              <p className="text-sm font-black text-gray-500 uppercase tracking-tighter group-hover:text-primary transition-colors">
                {isEditMode ? "Replace High-Res Vehicle Image" : "Upload Hero Shot of Vehicle"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Supports JPG, PNG, WEBP (Max 5MB)</p>
              <input type="file" id="car-img" onChange={(e) => setImage(e.target.files[0])} hidden accept="image/*" />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 01. CORE SPECS */}
            <div className={boxStyle}>
              <h3 className="text-2xl font-black text-gray-800 italic flex items-center gap-4">
                <span className="w-10 h-3 bg-primary rounded-full"></span> 01. Specs
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Category</label>
                  <select className={inputStyle} value={car.category} onChange={(e) => setCar({...car, category: e.target.value, brand: "", model: ""})} required>
                    <option value="">Vehicle Class</option>
                    {Object.keys(carDataMap).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Mfg Year</label>
                  <input type="number" className={inputStyle} value={car.year} onChange={(e) => setCar({...car, year: e.target.value})} placeholder="2024" min="2015" max="2026" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Brand</label>
                  <select 
                    className={inputStyle} 
                    value={car.brand} 
                    onChange={(e) => setCar({...car, brand: e.target.value, model: ""})} 
                    required 
                    disabled={!car.category}
                  >
                    <option value="">Choose Brand</option>
                    {car.category && carDataMap[car.category] && 
                        Object.keys(carDataMap[car.category]).map(b => <option key={b} value={b}>{b}</option>)
                    }
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Model</label>
                  <select 
                    className={inputStyle} 
                    value={car.model} 
                    onChange={(e) => setCar({...car, model: e.target.value})} 
                    required 
                    disabled={!car.brand}
                  >
                    <option value="">Select Model</option>
                    {car.brand && carDataMap[car.category]?.[car.brand] && 
                        Object.keys(carDataMap[car.category][car.brand]).map(m => <option key={m} value={m}>{m}</option>)
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Transmission</label>
                  <select className={inputStyle} value={car.transmission} onChange={(e) => setCar({...car, transmission: e.target.value})} required>
                    <option value="">Gearbox</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Fuel</label>
                  <select className={inputStyle} value={car.fuel_type} onChange={(e) => setCar({...car, fuel_type: e.target.value})} required>
                    <option value="">Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 02. PRICING SPECS */}
            <div className={boxStyle}>
              <h3 className="text-2xl font-black text-gray-800 italic flex items-center gap-4">
                <span className="w-10 h-3 bg-blue-500 rounded-full"></span> 02. Pricing
              </h3>
              
              <div className="space-y-6"> 
                {/* Pricing Model Selection */}
                <div>
                  <label className={labelStyle}>Pricing Model</label>
                  <select 
                    className={inputStyle} 
                    value={pricingModel} 
                    onChange={(e) => setPricingModel(e.target.value)} 
                    required
                  >
                    <option value="Outstation">Outstation (Per KM)</option>
                    <option value="Local">Local (Package)</option>
                  </select>
                </div>

                {/* Base Price Input */}
                <div>
                  <label className={labelStyle}>
                    {pricingModel === 'Outstation' ? `Outstation Rate (${currency} / KM)` : `Local Package Price (${currency} / Day)`}
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-4 text-gray-400 font-bold">{currency}</span>
                    <input 
                      type="number" 
                      className={`${inputStyle} pl-12`} 
                      value={car.basePrice} 
                      onChange={(e) => setCar({...car, basePrice: e.target.value})} 
                      required 
                      placeholder={pricingModel === 'Outstation' ? "18" : "2500"} 
                    />
                  </div>
                </div>

                {/* Min KM / Day (Conditional) */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Min KM / Day</label>
                    <input 
                      type="number" 
                      className={inputStyle} 
                      value={car.minKmPerDay} 
                      onChange={(e) => setCar({...car, minKmPerDay: e.target.value})} 
                      disabled={pricingModel === 'Local'} // Disable if Local pricing
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Seating</label>
                    <input type="number" className={inputStyle} value={car.seat_capacity} onChange={(e) => setCar({...car, seat_capacity: e.target.value})} placeholder="5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 03. LOGISTICS & DETAILS */}
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div>
                    <label className={labelStyle}>Operational City</label>
                    <select className={inputStyle} value={car.location} onChange={(e) => setCar({...car, location: e.target.value})} required>
                        <option value="">Select City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                    </select>
                </div>
                <div className="lg:col-span-2">
                    <label className={labelStyle}>Vehicle Description & Owner's Note</label>
                    <textarea 
                        className={`${inputStyle} h-40 resize-none pt-4`} 
                        value={car.description} 
                        onChange={(e) => setCar({...car, description: e.target.value})} 
                        required 
                        placeholder="Mention AC, Carrier, GPS, or any specific rules..."
                    />
                </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex flex-col items-center">
            <button 
                type="submit" 
                disabled={isLoading} 
                className="group relative w-full max-w-2xl py-8 bg-black text-white rounded-[2.5rem] font-black text-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-300 disabled:scale-100 overflow-hidden"
            >
                <span className="relative z-10">
                    {isLoading ? "SYNCING DATA..." : (isEditMode ? "SAVE MODIFICATIONS" : "PUBLISH VEHICLE")}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 italic flex items-center justify-center pointer-events-none">
                    READY TO ROLL
                </div>
            </button>
            <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">By continuing, you agree to our Rental Partner Terms.</p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCar;