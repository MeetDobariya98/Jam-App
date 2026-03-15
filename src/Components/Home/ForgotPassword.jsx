import { useNavigate, Link } from "react-router-dom";
import { API_URLS } from "../../api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.auth.forgotPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to send reset link");
        return;
      }
      alert(data.message);
      setStep(2);
    } catch (err) {
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.auth.verifyOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Invalid or expired code");
        return;
      }
      setStep(3);
    } catch (err) {
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.auth.resetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email, 
          otp: form.otp, 
          newPassword: form.newPassword 
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Reset failed");
        return;
      }
      alert("Password reset successfully ✅");
      navigate("/login");
    } catch (err) {
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <div className="bg-white/70 backdrop-blur-xl shadow-2xl shadow-purple-100 rounded-[2.5rem] p-8 sm:p-12 w-full max-w-md border border-white relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-6">
            <span className="text-3xl">{step === 1 ? "🔑" : step === 2 ? "📧" : "🛡️"}</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center">
            {step === 1 ? "Reset Password" : step === 2 ? "Verify OTP" : "Set New Password"}
          </h2>
          <p className="text-gray-400 font-medium mt-2 italic text-center">
            {step === 1 
              ? "Enter your email to reclaim your stage" 
              : step === 2 
                ? "Enter the 6-digit code sent to your inbox"
                : "Create a strong new password"}
          </p>
        </div>

        {step === 1 && (
          <form className="space-y-6" onSubmit={handleSendReset}>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="yours@example.com"
                className="w-full mt-2 p-4 rounded-2xl border border-gray-100 bg-white/50 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Verification Code</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="123456"
                maxLength="6"
                className="w-full mt-2 p-4 rounded-2xl border border-gray-100 bg-white/50 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-bold text-center text-2xl tracking-[0.5em] placeholder:text-gray-200 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-xs font-bold text-gray-400 hover:text-purple-600 transition uppercase tracking-widest"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-2 p-4 rounded-2xl border border-gray-100 bg-white/50 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-2 p-4 rounded-2xl border border-gray-100 bg-white/50 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
        <div className="mt-8 text-center">
          <Link to="/login" className="text-purple-600 font-bold hover:text-purple-700 transition flex items-center justify-center gap-2">
            <span className="text-lg">←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
