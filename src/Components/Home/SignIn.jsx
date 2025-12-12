import React from "react";

const SignUp = () => {
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

        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-purple-600 text-white text-sm sm:text-base font-semibold rounded-full">
              1
            </div>

            <div className="w-10 sm:w-12 h-1 bg-gray-300" />

            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 text-gray-400 text-sm sm:text-base font-semibold rounded-full">
              2
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-3 mb-6 text-sm sm:text-base">
          Step 1 of 2: Account Information
        </p>

        <div className="px-6 sm:px-10 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
            />

            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            className="mt-4 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Create a password (min. 8 characters)"
            className="mt-4 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="mt-4 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
          />

          <button className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-purple-700 transition">
            Next Step
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-xs sm:text-sm">or continue with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="w-full sm:w-1/2 border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition text-sm">
              <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5" />
              Google
            </button>

            <button className="w-full sm:w-1/2 border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition text-sm">
              <img src="https://img.icons8.com/ios-filled/50/mac-os.png" className="w-5" />
              Apple
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
