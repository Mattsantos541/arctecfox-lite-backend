import React from "react";
import LogoutButton from "./LogoutButton";

function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">ArcTecFox</h1>
      <LogoutButton />
    </nav>
  );
}

export default Navbar;
