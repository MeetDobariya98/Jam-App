import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">

        <Link to={"/"}>
          <h1 className="font-Pacifico text-purple-600 text-2xl font-bold">
            Jam
          </h1>
        </Link>

        <button
          className="md:hidden text-gray-600 text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div className="hidden md:flex gap-6 text-gray-700 text-sm">
          <Link className="hover:text-purple-600" to="/">Home</Link>
          <Link className="hover:text-purple-600" to="/Discover">Discover</Link>
          <Link className="hover:text-purple-600" to="/Communities">Communities</Link>
          <Link className="hover:text-purple-600" to="/Profile">Profile</Link>
        </div>

        <div className="hidden md:flex gap-3">
          <Link to="/signup">
            <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Sign Up
            </button>
          </Link>

          <Link to="/login">
            <button className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300 transition">
              Log In
            </button>
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden flex flex-col items-start gap-3 px-6 pb-4 bg-white shadow-lg">
          <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/">Home</Link>
          <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Discover">Discover</Link>
          <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Communities">Communities</Link>
          <Link onClick={() => setOpen(false)} className="hover:text-purple-600" to="/Profile">Profile</Link>

          <div className="flex gap-3 mt-3">
            <Link to="/signup">
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Sign Up
              </button>
            </Link>

            <Link to="/login">
              <button className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300 transition">
                Log In
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
