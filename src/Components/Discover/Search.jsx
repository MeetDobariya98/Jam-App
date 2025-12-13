import React, { useState } from "react";

const Search = () => {
  const stateCity = {
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  };

  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const formHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mx-4 sm:mx-10 md:mx-40 my-6">
      <h1 className="font-bold text-xl pt-2 text-center md:text-left">
        Discover Musicians
      </h1>

      <div className="p-4 rounded-md shadow-2xl mt-4">
        <form
          onSubmit={formHandler}
          className="flex flex-col md:flex-row md:flex-wrap gap-4 items-end"
        >
          {/* SEARCH NAME */}
          <div className="w-full md:w-auto">
            <label className="text-sm">Search Musicians</label><br />
            <input
              type="text"
              placeholder="Name"
              className="w-full outline outline-gray-300 px-3 py-1 rounded 
              focus:border-purple-300 focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* INSTRUMENT */}
          <div className="w-full md:w-auto">
            <label className="text-sm">Instrument</label><br />
            <select
              className="w-full outline outline-gray-300 px-3 py-1 rounded 
              focus:border-purple-300 focus:ring-2 focus:ring-purple-600"
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
          </div>

          {/* STATE */}
          <div className="w-full md:w-auto">
            <label className="text-sm">State</label><br />
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
              className="w-full outline outline-gray-300 px-3 py-1 rounded 
              focus:border-purple-300 focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select State</option>
              {Object.keys(stateCity).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div className="w-full md:w-auto">
            <label className="text-sm">City</label><br />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state}
              className="w-full outline outline-gray-300 px-3 py-1 rounded 
              focus:border-purple-300 focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select City</option>
              {state &&
                stateCity[state].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
            </select>
          </div>

          {/* BUTTON */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <button
              type="submit"
              className="w-full md:w-auto mt-2 md:mt-6 outline outline-gray-300 
              px-6 py-1 text-white font-semibold rounded bg-purple-500 
              hover:bg-purple-600 transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
