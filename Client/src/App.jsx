import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // Navigate add kiya
import MyBooking from "./pages/MyBooking";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import Footer from "./components/Footer";
import Dashboard from "./pages/owner/Dashboard";
import ManageCar from "./pages/owner/ManageCar";
import ManageBooking from "./pages/owner/ManageBooking";
import AddCar from "./pages/owner/AddCar";
import Layout from "./pages/owner/Layout";
import UserRegister from "./pages/User-Register";
import UserLogin from "./pages/User-Login";
import { Toaster } from "react-hot-toast";
import { useCarContext } from "./Context/context";
import Hero from "./components/Hero";
import toast from "react-hot-toast";

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, isAdminRoute }) => {
  const { token, isOwner } = useCarContext();

  if (!token && !localStorage.getItem("token")) return <Navigate to="/user-login" replace />;

  if (isAdminRoute && !isOwner) {
    toast.error("Access Denied! You are not an owner.");
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { token, isOwner } = useCarContext(); 
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <>
      <Toaster />
      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/user-login" element={<UserLogin />} />
        
        {/* --- PROTECTED ROUTE FOR MY BOOKINGS --- */}
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute>
              <MyBooking />
            </ProtectedRoute>
          } 
        />

        {/* --- OWNER ROUTES (Role base protection bhi add kar sakte hain) --- */}
        <Route path="/owner" element={<ProtectedRoute isAdminRoute={true}><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="manage-cars" element={<ManageCar />} />
          <Route path="manage-bookings" element={<ManageBooking />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="edit-car/:id" element={<AddCar />} /> {/* New route for editing */}
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;