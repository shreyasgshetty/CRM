// client/src/pages/AddEmployee.jsx
import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
    role: "Sales",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // temporary fix until company login is done
      const companyId = "672123456789abcdef123456"; // 🔹 put an existing company _id from MongoDB
      const password = "default123"; // 🔹 temporary password for employee

      const res = await axios.post(
        "http://localhost:5001/api/employees",
        { ...form, companyId, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setForm({ name: "", email: "", designation: "", role: "Sales" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
      {message && <p className="mb-4 text-indigo-400">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 bg-gray-700 rounded"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-700 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="designation"
          placeholder="Designation"
          className="w-full p-2 bg-gray-700 rounded"
          value={form.designation}
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full p-2 bg-gray-700 rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="Sales">Sales</option>
          <option value="Support">Support</option>
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}
