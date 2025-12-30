import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

  // 🔹 CHANGE PROFILE PHOTO
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = {
        ...user,
        profilePhoto: reader.result,
      };

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    };

    reader.readAsDataURL(file);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 sm:p-8">

        {/* PROFILE HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* PROFILE PHOTO */}
          <div className="relative">
            <img
              src={
                user.profilePhoto && user.profilePhoto.startsWith("data:image")
                  ? user.profilePhoto
                  : "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-purple-500"
            />

            {/* CHANGE PHOTO */}
            <label className="absolute bottom-0 right-0 bg-purple-600 text-white 
              w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
              hover:bg-purple-700 transition">
              ✎
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* BASIC INFO */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              {user.name} {user.lastname}
            </h1>
            <p className="text-gray-500">{user.email}</p>

            <span className="inline-block mt-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
              {user.instrument}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Instrument</p>
            <p className="font-semibold">{user.instrument}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">State</p>
            <p className="font-semibold">{user.state}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">City</p>
            <p className="font-semibold">{user.city}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Joined On</p>
            <p className="font-semibold">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
