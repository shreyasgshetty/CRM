import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    businessEmail: "",
    managerName: "",
    password: "",
    industry: "",
    address: "",
    phone: "",
  });

  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/company/register",
        formData
      );
      console.log("Submitting formData:", formData);


      setToast({
        message: "✅ Registration successful! Waiting For Approval...",
        type: "success",
      });

      console.log(res.data);

      // Redirect after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setToast({
        message:
          "❌ " + (err.response?.data?.message || "Registration failed."),
        type: "error",
      });
    }
  };

  // Auto-hide toast after 4 seconds
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

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-8 sm:p-10 space-y-6 transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-100">
          Company Registration
        </h2>
        <p className="text-center text-sm text-gray-400">
          Register your company to access CRM features
        </p>

        {/* Input Fields */}
        {[
          { name: "companyName", type: "text", placeholder: "Company Name" },
          { name: "businessEmail", type: "email", placeholder: "Business Email" },
          { name: "managerName", type: "text", placeholder: "Business Manager Name" },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "industry", type: "text", placeholder: "Industry (e.g. Retail, Electronics)" },
          { name: "address", type: "text", placeholder: "Company Address" },
          { name: "phone", type: "text", placeholder: "Contact Number" },
        ].map((field, i) => (
          <div key={i}>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required={["address", "phone"].includes(field.name) ? false : true}
              className="border border-gray-700 w-full p-3 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200"
        >
          Register Company
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          If you have already registered,{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
