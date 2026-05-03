import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCarContext } from "../../Context/context";
import { toast } from "react-hot-toast";

const ownerMenuLinks = [
  { name: "Dashboard", path: "/owner", icon: "📊", coloredIcon: "📊" },
  { name: "Manage Cars", path: "/owner/manage-cars", icon: "🚗", coloredIcon: "🚗" },
  { name: "Manage Bookings", path: "/owner/manage-bookings", icon: "📅", coloredIcon: "📅" },
  { name: "Add Car", path: "/owner/add-car", icon: "➕", coloredIcon: "➕" },
];

const Sidebar = () => {
  const { user, axios, fetchUser } = useCarContext();
  const location = useLocation();
  const [image, setImage] = useState("");

  const updateImage = async () => {
    if (!image) return;
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axios.post("/api/owner/update-image", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(""); // Clear local image first
        // Small delay to ensure database update completes
        setTimeout(async () => {
          await fetchUser(); // Wait for user data to refresh
        }, 500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13  md:max-w-60 w-full border-r border-borderColor text-sm ">
      <div className="group relative">
        <label htmlFor="image">
          <img
            key={user?.image || "default"}
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop"
            }
            alt=""
            className="w-9 h-9 rounded-full md:h-14 md:w-14  "
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
          <div
            className="absolute hidden top-0 left-0 right-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer"
            onClick={updateImage}
          >
            <span className="text-white">✏️</span>
          </div>
        </label>
      </div>
      {image && (
        <button
          onClick={updateImage}
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
        >
          Save
          <span>✔️</span>
        </button>
      )}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>
      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6  ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-500/90"
            }`}
          >
            <span className="text-lg">
              {link.path === location.pathname ? link.coloredIcon : link.icon}
            </span>
            <span className="max-md:hidden">{link.name}</span>
            <div
              className={`${
                link.path === location.pathname && "bg-primary"
              } w-1.5 h-8 rounded-l right-0 absolute `}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
