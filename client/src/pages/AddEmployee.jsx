import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiUsers, FiX, FiEdit2, FiPower } from "react-icons/fi";

export default function AddEmployee() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "Technical" });
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const token = localStorage.getItem("token");

  // Decode token for companyId
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCompanyId(decoded.companyId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [token]);

  const fetchEmployees = async () => {
    if (!companyId) return;
    try {
      const res = await axios.get(`http://localhost:5001/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    if (companyId) fetchEmployees();
  }, [companyId]);

  const showAlert = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // Update existing employee
        const res = await axios.put(
          `http://localhost:5001/api/employees/${editingEmployee._id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert(res.data.message);
      } else {
        // Add new employee
        const res = await axios.post(
          "http://localhost:5001/api/employees",
          { ...form, companyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert(res.data.message);
      }

      setForm({ name: "", email: "", password: "", department: "Technical" });
      setShowForm(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      showAlert(err.response?.data?.message || "Error saving employee");
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setForm({ name: emp.name, email: emp.email, password: "", department: emp.department });
    setShowForm(true);
  };

  const handleToggleStatus = async (emp) => {
    try {
      const res = await axios.patch(
        `http://localhost:5001/api/employees/${emp._id}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert(res.data.message);
      fetchEmployees();
    } catch (err) {
      showAlert("Error updating status");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#0F0F1A] text-gray-200 relative">
      {/* ✅ Floating message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className={`px-6 py-3 rounded-lg shadow-lg text-center font-medium ${
                message.toLowerCase().includes("success") || message.toLowerCase().includes("added")
                  ? "bg-green-600/90 text-white"
                  : "bg-red-600/90 text-white"
              }`}
            >
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8 border-b border-gray-700/50 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <FiUsers className="text-cyan-400" /> Employees
          </h1>
          <p className="text-gray-400 text-sm">Manage your team members</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingEmployee(null);
            setForm({ name: "", email: "", password: "", department: "Technical" });
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-5 py-2.5 rounded-lg font-medium shadow-xl"
        >
          <FiPlus /> Add Employee
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1A1A2E] p-6 rounded-xl border border-indigo-900/40">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-900 via-purple-900 to-cyan-900 text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center text-indigo-300">Name</th>
              <th className="py-3 px-4 text-center text-cyan-300">Email</th>
              <th className="py-3 px-4 text-center text-purple-300">Department</th>
              <th className="py-3 px-4 text-center text-blue-300">Tickets</th>
              <th className="py-3 px-4 text-center text-emerald-300">Status</th>
              <th className="py-3 px-4 text-center text-pink-300">Joined</th>
              <th className="py-3 px-4 text-center text-orange-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id} className="border-b border-gray-700/30 hover:bg-gray-700/30">
                  <td className="py-3 text-center">{emp.name}</td>
                  <td className="py-3 text-center">{emp.email}</td>
                  <td className="py-3 text-center">{emp.department}</td>
                  <td className="py-3 text-center">{emp.ticketsHandled ?? 0}</td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        emp.status === "Active"
                          ? "bg-green-600/30 text-green-400"
                          : "bg-red-600/30 text-red-400"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 text-center text-gray-500 text-xs">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-white flex items-center gap-1"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(emp)}
                      className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                        emp.status === "Active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white`}
                    >
                      <FiPower />
                      {emp.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No employees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="bg-[#1A1A2E] p-8 rounded-2xl shadow-xl border border-indigo-700/50 w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  {editingEmployee ? "Edit Employee" : "Add New Employee"}
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <FiX className="text-2xl text-gray-400 hover:text-red-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-lg border border-gray-600 focus:border-cyan-500"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-lg border border-gray-600 focus:border-cyan-500"
                />

                {/* ✅ Password placeholder now dynamic */}
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editingEmployee
                      ? "Password (leave blank to keep old)"
                      : "Password"
                  }
                  className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-lg border border-gray-600 focus:border-cyan-500"
                />

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-lg border border-gray-600"
                >
                  <option value="Technical">Technical</option>
                  <option value="Support">Support</option>
                  <option value="Sales">Sales</option>
                </select>

                <div className="flex justify-between pt-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white"
                  >
                    {editingEmployee ? "Save Changes" : "Save Employee"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
