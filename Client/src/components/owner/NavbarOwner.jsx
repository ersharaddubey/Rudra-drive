import React from "react";
import { Link } from "react-router-dom";
import { useCarContext } from "../../Context/context";

const NavbarOwner = () => {
  const { user } = useCarContext();

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all ">
      <Link to="/" className="flex items-center">
        <h1
          className="text-2xl md:text-3xl font-bold text-primary"
          style={{ fontFamily: 'serif' }}
        >
          RudraDrive
        </h1>
      </Link>

      <p>Welcome {user?.name || "Owner"}</p>
    </div>
  );
};

export default NavbarOwner;
