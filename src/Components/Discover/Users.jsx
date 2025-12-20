import { useEffect, useState, useRef, useCallback } from "react";
import { FaMusic, FaMapMarkerAlt } from "react-icons/fa";

/* ------------------ DATA ------------------ */

const instruments = ["Guitar", "Drums", "Keyboard", "Bass"];

const indiaStates = {
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  Delhi: ["New Delhi"],
  Karnataka: ["Bengaluru", "Mysuru"],
  TamilNadu: ["Chennai", "Coimbatore"],
  UttarPradesh: ["Lucknow", "Noida"],
  WestBengal: ["Kolkata"],
};

const USERS_PER_PAGE = 6;

/* ------------------ COMPONENT ------------------ */

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Search states
  const [name, setName] = useState("");
  const [instrument, setInstrument] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const observer = useRef();

  /* ------------------ FETCH USERS ------------------ */

  const fetchUsers = async () => {
    setLoading(true);

    const res = await fetch(
      `https://randomuser.me/api/?results=${USERS_PER_PAGE}&page=${page}`
    );
    const data = await res.json();

    const stateKeys = Object.keys(indiaStates);

    const newUsers = data.results.map((user, index) => {
      const randomState =
        stateKeys[(page + index) % stateKeys.length];
      const randomCity =
        indiaStates[randomState][
          (page + index) % indiaStates[randomState].length
        ];

      return {
        id: `${page}-${index}`,
        name: `${user.name.first} ${user.name.last}`,
        instrument: instruments[(page + index) % instruments.length],
        state: randomState,
        city: randomCity,
        image: user.picture.large,
      };
    });

    setAllUsers((prev) => [...prev, ...newUsers]);
    setVisibleUsers((prev) => [...prev, ...newUsers]);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  /* ------------------ INFINITE SCROLL ------------------ */

  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  /* ------------------ SEARCH ------------------ */

  const handleSearch = () => {
    let result = allUsers;

    // Name search (case-insensitive)
    if (name.trim()) {
      result = result.filter((u) =>
        u.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (instrument) {
      result = result.filter((u) => u.instrument === instrument);
    }

    if (state) {
      result = result.filter((u) => u.state === state);
    }

    // STRICT city filter
    if (city) {
      result = result.filter((u) => u.city === city);
    }

    setVisibleUsers(result);
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="mx-4 sm:mx-10 lg:mx-40">

      {/* 🔍 SEARCH PANEL */}
      <div className="bg-white mt-4 shadow-md rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-5 gap-4">

        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-md"
        />

        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Instrument</option>
          {instruments.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>

        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCity("");
          }}
          className="border p-2 rounded-md"
        >
          <option value="">State</option>
          {Object.keys(indiaStates).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state}
          className="border p-2 rounded-md disabled:bg-gray-100"
        >
          <option value="">City</option>
          {state &&
            indiaStates[state].map((c) => (
              <option key={c}>{c}</option>
            ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md"
        >
          Search
        </button>
      </div>

      {/* 👤 USER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleUsers.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No users found
          </p>
        ) : (
          visibleUsers.map((user, index) => {
            const isLast = index === visibleUsers.length - 1;

            return (
              <div
                key={user.id}
                ref={isLast ? lastUserRef : null}
                className="w-full max-w-sm mx-auto px-3 py-3 bg-gray-100 rounded-md shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div className="flex justify-center sm:justify-start">
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={user.image}
                    alt={user.name}
                  />
                </div>

                <div>
                  <h1 className="font-bold">{user.name}</h1>

                  <div className="flex gap-2 items-center">
                    <FaMusic className="text-purple-500" />
                    <p className="text-sm">{user.instrument}</p>
                  </div>

                  <div className="flex gap-2 items-center">
                    <FaMapMarkerAlt className="text-purple-500" />
                    <p className="text-sm">
                      {user.city}, {user.state}
                    </p>
                  </div>

                  <button className="mt-3 bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-md">
                    Connect
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {loading && (
        <p className="text-center py-6 text-gray-500">
          Loading more users...
        </p>
      )}
    </div>
  );
};

export default Users;
