import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/admin", {
        email,
        password,
      });

      if (data.role === "admin") {
        localStorage.setItem("token", data.token);
        setToast({
          message: "✅ Admin login successful!",
          type: "success",
        });
        setTimeout(() => navigate("/admin/dashboard"), 2000);
      } else {
        setToast({
          message: "❌ Access denied: You are not an Admin.",
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message: "❌ Login failed! Check your credentials.",
        type: "error",
      });
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white px-4">
      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-8 sm:p-10 space-y-6 transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-100">
          Admin Login
        </h2>
        <p className="text-center text-sm text-gray-400">
          Access your admin dashboard securely
        </p>

        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-700 w-full p-3 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Password Input */}
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-700 w-full p-3 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200"
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}
