import React, { useState } from "react";
import { useCarContext } from "../Context/context";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const UserRegister = () => {
  const { axios, setToken, fetchUser, setIsOwner } = useCarContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        phone,
        email,
        password,
        role,
      });

      if (data.success) {
        const isUserOwner = role === "owner";
        
        // Save token and update global context
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        // Update axios default header for subsequent requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setIsOwner(isUserOwner);
        
        // Fetch the newly registered user's profile
        await fetchUser();
        
        toast.success(isUserOwner ? "Welcome Partner! Your account is ready." : "Welcome to RudraDrive!");
        
        // रोल के हिसाब से सही पेज पर भेजें
        navigate(isUserOwner ? "/owner" : "/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F8F9FB]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Join <span className="text-primary">RudraDrive.</span>
          </h2>
          <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-[0.2em]">Start your premium journey today</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-gray-700 font-medium transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-gray-700 font-medium transition-all"
            />
          </div>

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

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-gray-700 font-medium transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 block">Account Type</label>
            <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100">
              <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl cursor-pointer transition-all ${role === 'user' ? 'bg-white shadow-sm text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                <input type="radio" value="user" checked={role === 'user'} onChange={(e) => setRole(e.target.value)} className="hidden" />
                <span>Customer</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl cursor-pointer transition-all ${role === 'owner' ? 'bg-white shadow-sm text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                <input type="radio" value="owner" checked={role === 'owner'} onChange={(e) => setRole(e.target.value)} className="hidden" />
                <span>Car Owner</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-300 disabled:scale-100"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/user-login" className="text-primary font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;