import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URLS } from "../../api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URLS.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

   
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful ✅");

      navigate("/feed");

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <div className="bg-white/70 backdrop-blur-xl shadow-2xl shadow-purple-100 rounded-[2.5rem] p-8 sm:p-12 w-full max-w-md border border-white relative z-10 transition-all hover:shadow-purple-200">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-6">
            <span className="text-3xl">🎸</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight text-center">
            Welcome Back
          </h2>
          <p className="text-gray-400 font-medium mt-2 italic">The stage is waiting for you</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full mt-2 p-4 rounded-2xl border border-gray-100 bg-white/50
              focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-medium placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
              <Link to="/forgot-password" className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 transition">Forgot Password?</Link>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-2 p-4 rounded-2xl border border-gray-100 bg-white/50
              focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-medium placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em]
            hover:bg-purple-700 shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all transform active:scale-[0.98] hover:scale-[1.02]"
          >
            Sign In to Jam
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-sm font-medium text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-bold hover:text-purple-700 transition">
              Create an artist profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
