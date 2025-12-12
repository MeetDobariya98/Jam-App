import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back 👋
        </h2>

        <form className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-purple-600 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold 
            hover:bg-purple-700 transition-all duration-200 text-sm sm:text-base"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="grow h-px bg-gray-300"></div>
        </div>

        <button
          className="w-full border border-gray-400 py-3 rounded-xl flex items-center 
          justify-center gap-3 hover:bg-gray-50 transition text-sm sm:text-base"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          New here?{" "}
          <a href="#" className="text-purple-600 font-semibold hover:underline">
            Join Now
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;
