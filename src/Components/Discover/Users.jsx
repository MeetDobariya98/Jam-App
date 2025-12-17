import { useEffect, useState } from "react";
import { FaMusic, FaMapMarkerAlt } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=6")
      .then((res) => res.json())
      .then((data) => {
        const formattedUsers = data.results.map((user, index) => ({
          id: index,
          name: `${user.name.first} ${user.name.last}`,
          instrument: "Guitar", // demo (can come from backend)
          location: `${user.location.city}, ${user.location.country}`,
          image: user.picture.large,
        }));

        setUsers(formattedUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div>
      <div className="mx-4 sm:mx-10 lg:mx-40 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((user) => (
          <div
            key={user.id}
            className="w-full max-w-sm mx-auto px-3 py-3 bg-gray-100 rounded-md shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-3"
          >

            <div className="flex justify-center sm:justify-start">
              <img
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
                src={user.image}
                alt={user.name}
              />
            </div>

            <div className="text-center sm:text-left">
              <h1 className="font-bold">{user.name}</h1>

              <div className="flex gap-2 justify-center sm:justify-start items-center">
                <FaMusic className="text-purple-500" />
                <p className="text-sm">{user.instrument}</p>
              </div>

              <div className="flex gap-2 justify-center sm:justify-start items-center">
                <FaMapMarkerAlt className="text-purple-500" />
                <p className="text-sm">{user.location}</p>
              </div>

              <div className="flex justify-center sm:justify-start mt-3">
                <button className="bg-purple-500 hover:bg-purple-600 active:scale-95 px-5 py-1.5 text-white font-bold rounded-md">
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
