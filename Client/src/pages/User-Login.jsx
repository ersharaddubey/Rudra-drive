import React, { useState, useEffect } from "react";
import { useCarContext } from "../Context/context";
import { toast } from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";

const UserLogin = () => {
  const { axios, setToken, fetchUser, setIsOwner } = useCarContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // सीधे नया टोकन भेजकर यूजर डेटा मंगाएं
        const fetchedUser = await fetchUser(data.token);
        const isUserOwner = fetchedUser.role === "owner" || fetchedUser.isOwner;
        
        toast.success("Welcome back to RudraDrive!");
        
        // Agar navigation state se redirect path milta hai toh wahan bhejenge
        // अन्यथा रोल के आधार पर सही पेज पर भेजें
        const destination = location.state?.from || (isUserOwner ? "/owner" : "/");
        navigate(destination);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F8F9FB]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Welcome <span className="text-primary">Back.</span>
          </h2>
          <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-[0.2em]">Login to your premium account</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-gray-700 font-medium transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-gray-700 font-medium transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-300"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 font-medium">
            Don't have an account?{" "}
            <Link to="/user-register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;