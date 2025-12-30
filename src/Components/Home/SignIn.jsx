import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignUp = () => {

  const navigate = useNavigate();

  const stateCity = {
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot","Junagdh","Morbi","Kuchh"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  };

  const [user, setUser] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    instrument: "",
    state: "",
    city: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

     
      alert("Signup successful ✅");

      // inside handleSubmit success block
      navigate("/login");
      
      setUser({
        name: "",
        lastname: "",
        email: "",
        password: "",
        instrument: "",
        state: "",
        city: "",
      });

    } catch (err) {
      console.error("Register error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-6 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden">

        <div className="bg-linear-to-r from-purple-500 to-purple-700 text-white p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            Join the Jam Community
          </h1>
          <p className="text-white/80 text-sm text-center mt-2">
            Connect with musicians worldwide and start creating amazing music together
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 sm:px-10 pb-8 mt-2 space-y-4">

            {/* NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                name="name"
                value={user.name}
                onChange={handleInput}
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
              />

              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={user.lastname}
                onChange={handleInput}
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={user.email}
              onChange={handleInput}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
            />

            {/* INSTRUMENT */}
            <select
              name="instrument"
              value={user.instrument}
              onChange={handleInput}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select Instrument</option>
              <option>Guitar</option>
              <option>Piano</option>
              <option>Drums</option>
              <option>Violin</option>
              <option>Vocals</option>
              <option>DJ Controller</option>
              <option>Tabla</option>
              <option>Flute</option>
            </select>

            {/* STATE */}
            <select
              name="state"
              value={user.state}
              onChange={(e) => {
                handleInput(e);
                setUser((prev) => ({ ...prev, city: "" }));
              }}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select State</option>
              {Object.keys(stateCity).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* CITY */}
            <select
              name="city"
              value={user.city}
              onChange={handleInput}
              disabled={!user.state}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select City</option>
              {user.state &&
                stateCity[user.state].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
            </select>

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Create a password"
              name="password"
              value={user.password}
              onChange={handleInput}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400"
            />

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Sign Up
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default SignUp;
