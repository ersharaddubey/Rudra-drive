import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Mock Data for Fallback
const dummyCarData = [
  { _id: "1", brand: "BMW", model: "Luxury Sedan", fuel_type: "Petrol", basePrice: 15, pricingModel: "Outstation", minKm: 300, seat_capacity: 5, transmission: "Automatic", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920" },
  { _id: "2", brand: "Audi", model: "Premium SUV", fuel_type: "Diesel", basePrice: 2500, pricingModel: "Local", seat_capacity: 7, transmission: "Automatic", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920" },
];

// Axios Default Config
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "";

// 1. Context ko internal rakhein (Vite Fast Refresh error fix)
const CarContext = createContext();

export const CarContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // 2. Optimized Axios Header Management
  const updateAxiosHeader = (newToken) => {
    if (newToken) {
      // Backend headers.token aur authorization dono check kar sakta hai
      axios.defaults.headers.common["token"] = newToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      delete axios.defaults.headers.common["token"];
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // 3. User Data Fetching
  const fetchUser = async (explicitToken) => {
    const activeToken = explicitToken || token;
    if (!activeToken) return;

    try {
      updateAxiosHeader(activeToken);
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        // User role check
        const checkOwner = data.user.isOwner || data.user.role === "owner";
        setIsOwner(checkOwner);
        return data.user; // Return user data for login flow
      } else {
        // Agar token expire ya invalid ho
        if (data.message === "Unauthorized" || data.message === "Invalid Token") {
          logout();
        }
      }
    } catch (error) {
      console.error("Fetch User Error:", error.message);
      if (error.response?.status === 401) logout();
      throw error; // Throw error to be caught in login page
    }
  };

  // 4. Cars Data Fetching
  const fetchcars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error("Fetch Cars Error:", error.message);
    }
  };

  // 5. Helper for Car Pricing logic
  const getCarPricing = (car, tripType = "Outstation", days = 1) => {
    if (!car) return { rate: 0, total: 0 };
    const rate = Number(car.basePrice || 0);
    const total = car.pricingModel === "Outstation" 
      ? (days * (car.minKm || 300) * rate) 
      : (days * rate);
    return { rate, total };
  };

  // 5. Logout Logic
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    updateAxiosHeader(null);
    navigate("/");
    toast.success("Logged out successfully");
  };

  // 6. Token Sync Effect
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      updateAxiosHeader(token);
      fetchUser();
    } else {
      updateAxiosHeader(null);
    }
  }, [token]);

  // Initial Data Load
  useEffect(() => {
    fetchcars();
  }, []);

  const value = {
    navigate,
    currency,
    axios,
    user,
    token,
    setToken,
    setUser,
    setIsOwner,
    showLogin,
    setShowLogin,
    logout,
    cars,
    dummyCarData,
    setCars,
    fetchUser,
    fetchcars,
    pickupDate,
    getCarPricing,
    setPickupDate,
    returnDate,
    setReturnDate,
    isOwner,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

// 7. Custom Hook for easy access
export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error("useCarContext must be used within a CarContextProvider");
  }
  return context;
};