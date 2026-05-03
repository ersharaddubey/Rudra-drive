import React, { useEffect } from "react";
import NavbarOwner from "../../components/owner/NavbarOwner";
import Sidebar from "../../components/owner/Sidebar";
import { Outlet } from "react-router-dom";
import { useCarContext } from "../../Context/context";

const Layout = () => {
  const { isOwner, navigate, user } = useCarContext();

  useEffect(() => {
    // Only redirect if user data has been loaded and user is not an owner
    if (user !== null && !isOwner) {
      navigate("/");
    }
  }, [isOwner, user]);

  return (
    <div className="flex flex-col">
      <NavbarOwner />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
