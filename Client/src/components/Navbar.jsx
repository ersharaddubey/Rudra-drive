import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, CarFront, LogOut, LayoutDashboard, CalendarDays, UserCheck } from "lucide-react"; 
import toast from "react-hot-toast";
import { useCarContext } from "../Context/context";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, isOwner, axios, setIsOwner, token } = useCarContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleListYourCar = async () => {
    if (!token) {
      navigate("/user-login");
      return;
    }

    // Agar user hai par owner nahi, tabhi database update (role change) kare
    if (!isOwner) {
      try {
        const { data } = await axios.post("/api/owner/change-role");
        if (data.success) {
          setIsOwner(true);
          toast.success("Account upgraded to Owner!");
          navigate("/owner");
        }
      } catch (error) {
        toast.error("Upgrade failed. Try again.");
      }
    } else {
      navigate("/owner");
    }
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase">
            Rudra<span className="text-blue-600 italic">Drive</span>
          </h1>
        </Link>
        
        {/* --- Desktop Links: Based on Role --- */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Ye hamesha dikhega login ke baad */}
          {user && !isOwner && (
             <Link to="/my-bookings" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-all">
                <CalendarDays size={16} /> My Bookings
             </Link>
          )}

          {/* Ye TABHI dikhega jab user 'Owner' ban chuka ho */}
          {user && isOwner && (
            <Link to="/owner" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
              <LayoutDashboard size={16} /> Owner Dashboard
            </Link>
          )}
        </div>

        {/* --- Right Side Actions --- */}
        <div className="hidden md:flex items-center gap-5">
          
          {/* List Your Car: केवल तभी दिखाएं जब यूजर लॉग-इन न हो या वह Owner हो */}
          {(!user || isOwner) && (
            <button
              onClick={handleListYourCar}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                isOwner ? "bg-green-50 text-green-600 border border-green-200" : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              <CarFront size={16} />
              {isOwner ? "Partner Verified" : "List Your Car"}
            </button>
          )}
          
          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/user-register" className="text-[12px] font-bold uppercase tracking-widest text-slate-700 hover:text-blue-600">
                Register
              </Link>
              <Link to="/user-login" className="px-6 py-2 bg-slate-900 text-white text-[12px] font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all text-center">
                Login
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l pl-4">
               <div className="flex flex-col items-end">
                  <span className="text-[12px] font-bold text-slate-900 uppercase leading-none">
                    {user.name.split(' ')[0]}
                  </span>
                  {isOwner && <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">Owner Mode</span>}
               </div>
               <button onClick={logout} className="p-2 hover:bg-red-50 rounded-full text-red-500" title="Logout">
                  <LogOut size={18} />
               </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-[105]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-screen w-[280px] bg-white z-[110] lg:hidden p-8">
              <div className="flex flex-col gap-6 mt-10">
                <Link to="/" onClick={() => setOpen(false)} className="text-sm font-bold uppercase text-slate-900">Home</Link>
                
                {user && !isOwner && (
                   <Link to="/my-bookings" onClick={() => setOpen(false)} className="text-sm font-bold uppercase text-slate-900">My Bookings</Link>
                )}

                {/* Mobile Drawer: ओनर के लिए डैशबोर्ड लिंक */}
                {user && isOwner && (
                  <Link to="/owner" onClick={() => setOpen(false)} className="text-sm font-bold uppercase text-blue-600 font-black">Owner Dashboard</Link>
                )}
                
                <hr />
                
                {/* सामान्य यूजर्स (Customers) के लिए इस बटन को छुपाएं */}
                {(!user || isOwner) && (
                  <button onClick={() => { setOpen(false); handleListYourCar(); }} className="text-left text-sm font-bold uppercase text-blue-600">
                    {isOwner ? "Manage My Cars" : "Become a Partner"}
                  </button>
                )}

                {!user ? (
                  <>
                    <Link to="/user-register" onClick={() => setOpen(false)} className="text-sm font-bold uppercase text-slate-900">Register</Link>
                    <Link to="/user-login" onClick={() => setOpen(false)} className="w-full py-3 bg-slate-900 text-white text-center text-[12px] font-bold uppercase rounded-sm">Login</Link>
                  </>
                ) : (
                  <button onClick={() => { setOpen(false); logout(); }} className="mt-4 w-full py-3 bg-red-500 text-white text-[12px] font-bold uppercase rounded-sm">
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;