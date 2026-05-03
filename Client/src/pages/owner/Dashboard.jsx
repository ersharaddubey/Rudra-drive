import React, { useState, useEffect } from "react";
import { useCarContext } from "../../Context/context";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency, token } = useCarContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      }
    } catch (error) {
      toast.error("Failed to sync live data");
    }
  };

  useEffect(() => {
    if (token && isOwner) {
      fetchDashboardData();
    }
  }, [token, isOwner]);

  const stats = [
    { label: "Fleet Size", value: data.totalCars, trend: "+2 new", icon: "🚗", bg: "bg-blue-50" },
    { label: "Bookings", value: data.totalBookings, trend: "Active", icon: "📅", bg: "bg-purple-50" },
    { label: "Attention", value: data.pendingBookings, trend: "Required", icon: "⚠️", bg: "bg-rose-50" },
    { label: "Revenue", value: `${currency}${data.monthlyRevenue.toLocaleString()}`, trend: "Monthly", icon: "💰", bg: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Executive Overview</h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} text-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                stat.label === "Attention" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
              }`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-tight">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Transactions Table */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <div className="flex gap-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs text-gray-400 font-medium italic">Live Updates</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Settlement</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentBookings.length > 0 ? (
                  data.recentBookings.filter(b => b.car).map((booking, index) => (
                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                            {booking.car.brand[0]}
                          </div>
                          <p className="font-bold text-gray-700">{booking.car.brand} {booking.car.model}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                        {new Date(booking.createdAt).toDateString()}
                      </td>
                      <td className="px-8 py-6 text-right font-black text-gray-900">
                        {currency}{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className={`mx-auto w-fit px-4 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-tighter shadow-sm
                          ${booking.status === 'confirmed' ? 'bg-emerald-500 text-white' : 
                            booking.status === 'pending' ? 'bg-amber-400 text-white' : 'bg-gray-400 text-white'}`}>
                          {booking.status}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <span className="text-4xl block mb-4 opacity-20">📂</span>
                      <p className="text-gray-400 font-medium italic">No recent transactions recorded.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Analytics Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1A1C1E] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold tracking-tight">Net Profit</h2>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/30">
                  Monthly
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2 font-medium">Total earnings after platform fees.</p>
            </div>
            
            <div className="relative z-10 my-8">
              <h3 className="text-6xl font-black tracking-tighter">
                <span className="text-2xl font-light text-primary mr-2">{currency}</span>
                {data.monthlyRevenue.toLocaleString()}
              </h3>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                <span>Payout Progress</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_#yourPrimaryColor]"></div>
              </div>
            </div>

            {/* Aesthetic Blurs */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;