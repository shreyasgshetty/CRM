// client/src/pages/AddEmployee.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddEmployee() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "Technical",
  });
  const [message, setMessage] = useState("");

  const companyId = "672123456789abcdef123456"; // default company ID
  const token = localStorage.getItem("token");

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/employees?companyId=${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/employees",
        { ...form, companyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", department: "Technical" });
      fetchEmployees(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <div className="relative">
      {/* ➕ Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
        >
          ➕ Add Employee
        </button>
      </div>

      {/* 🧾 Employee Table */}
      <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-300">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Department</th>
              <th className="p-2">Tickets Handled</th>
              <th className="p-2">Status</th>
              <th className="p-2">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b border-gray-700 hover:bg-gray-700/30">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.department}</td>
                <td className="p-2 text-center">{emp.ticketsHandled}</td>
                <td className="p-2">{emp.status}</td>
                <td className="p-2">{new Date(emp.joinedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧩 Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
            {message && <p className="text-indigo-400 mb-3">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded"
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded"
              />
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="Technical">Technical</option>
                <option value="Support">Support</option>
                <option value="Sales">Sales</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
