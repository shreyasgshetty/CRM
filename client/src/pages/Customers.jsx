// client/src/pages/Customers.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiActivity,
  FiRefreshCcw,
  FiTrash2,
  FiClock,
} from "react-icons/fi";

export default function Customers() {
  const token = localStorage.getItem("token");
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    location: "",
    leadSource: "",
    assignedTo: [],
    status: "Lead",
  });

  const api = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchEmployees = async () => {
  try {
    const res = await api.get("/employees");
    // Only include active employees for assignment
    const activeEmployees = res.data
      .filter((e) => e.status === "Active")
      .map((e) => ({ _id: e._id, name: e.name }));
    setEmployees(activeEmployees);
  } catch (err) {
    console.error("Error fetching employees:", err);
  }
};


  useEffect(() => {
    fetchCustomers();
    fetchEmployees();
  }, []);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      // Multi-select logic: capture all selected option values
      const vals = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setForm({ ...form, [name]: vals });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await api.put(`/customers/${editing._id}`, form);
        showMsg(res.data.message);
      } else {
        const res = await api.post(`/customers`, form);
        showMsg(res.data.message);
      }
      setShowForm(false);
      setEditing(null);
      // Reset form state
      setForm({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        location: "",
        leadSource: "",
        assignedTo: [],
        status: "Lead",
      });
      fetchCustomers();
    } catch (err) {
      showMsg(err.response?.data?.message || "Error");
    }
  };

  const handleDeleteOrRestore = async (c) => {
    try {
      if (!c.deletedAt) {
        const res = await api.delete(`/customers/${c._id}`);
        showMsg(res.data.message);
      } else {
        const res = await api.put(`/customers/${c._id}/restore`);
        showMsg(res.data.message);
      }
      fetchCustomers();
    } catch (err) {
      showMsg(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      contactName: c.contactName,
      email: c.email,
      phone: c.phone,
      location: c.location,
      leadSource: c.leadSource,
      // Map assignedTo objects to their IDs for the select input
      assignedTo: (c.assignedTo || []).map((a) => a._id),
      status: c.status,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen p-8 bg-[#0F0F1A] text-gray-200 relative">
      {/* ✅ Success Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-emerald-500 text-black px-6 py-3 rounded-xl shadow-lg font-semibold z-50"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Customers
        </h2>
        <button
          onClick={() => {
            setEditing(null);
            // Reset form state when opening the Add form
            setForm({
              name: "",
              contactName: "",
              email: "",
              phone: "",
              location: "",
              leadSource: "",
              assignedTo: [],
              status: "Lead",
            });
            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A2E] rounded-lg p-4 border border-gray-700/40 shadow-xl overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-gray-300 text-xs uppercase border-b border-gray-700/50">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Source</th>
              <th className="p-2">Assigned</th>
              <th className="p-2">Status</th>
              <th className="p-2">State</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length ? (
              customers.map((c) => (
                <motion.tr
                  key={c._id}
                  className={`border-t border-gray-700/30 hover:bg-gray-800/40 transition ${
                    c.deletedAt ? "opacity-50" : ""
                  }`}
                  layout
                >
                  <td className="p-2 font-medium">{c.name}</td>
                  <td className="p-2">{c.contactName || c.email}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.leadSource}</td>
                  <td className="p-2 text-gray-300">
                    {/* Display assigned employee names */}
                    {c.assignedTo && c.assignedTo.length > 0 ? (
                     <div className="flex flex-wrap gap-1">
                      {c.assignedTo.map((a) => (
                       <span key={a._id} className="text-xs bg-indigo-800/50 px-2 py-0.5 rounded-full">
                        {a.name}
                       </span>
                    ))}
                       <span className="ml-1 text-xs text-gray-400">
                          ({c.assignedTo.length})
                       </span>
                     </div>
                     ) : (
                    "Unassigned"
                    )}

                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        c.status === "Converted"
                          ? "bg-green-700/60 text-green-200"
                          : "bg-yellow-700/60 text-yellow-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {c.deletedAt ? "Inactive" : "Active"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-blue-600 hover:bg-blue-500 p-1.5 rounded"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteOrRestore(c)}
                      className="bg-red-600 hover:bg-red-500 p-1.5 rounded"
                    >
                      {c.deletedAt ? <FiRefreshCcw /> : <FiTrash2 />}
                    </button>
                    <button
                      onClick={() => setSelectedAudit(c)}
                      className="bg-gray-700 hover:bg-gray-600 p-1.5 rounded"
                    >
                      <FiActivity />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 rounded-2xl p-6 w-full max-w-xl border border-gray-700 shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">
                  {editing ? "Edit Customer" : "Add Customer"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null); // Clear editing on close
                  }}
                >
                  <FiX className="text-gray-400 hover:text-gray-200" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  "name",
                  "contactName",
                  "email",
                  "phone",
                  "location",
                  "leadSource",
                ].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                  />
                ))}

                {/* Status Field */}
                <select
                  name="status"
                  onChange={handleChange}
                  value={form.status}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                >
                  <option value="Lead">Lead</option>
                  <option value="Converted">Converted</option>
                </select>

                {/* AssignedTo Multi-Select */}
                <select
                  name="assignedTo"
                  multiple
                  onChange={handleChange}
                  value={form.assignedTo} // Use array of IDs
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                >
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold mt-2"
                >
                  {editing ? "Update" : "Add"} Customer
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Audit Trail Modal */}
      <AnimatePresence>
        {selectedAudit && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAudit(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 rounded-2xl p-6 w-full max-w-3xl border border-gray-700 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  Audit Trail — {selectedAudit.name}
                </h3>
                <button onClick={() => setSelectedAudit(null)}>
                  <FiX className="text-gray-400 hover:text-gray-200" />
                </button>
              </div>

              {selectedAudit.audit?.length ? (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                  {selectedAudit.audit.map((a, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gray-800/60 border border-gray-700/30"
                    >
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span className="flex items-center gap-1">
                          <FiClock /> {new Date(a.at).toLocaleString()}
                        </span>
                        <span className="text-indigo-400 font-medium capitalize">
                          {a.action}
                        </span>
                      </div>
                      <p className="text-sm">
                        <span className="text-gray-400">By:</span>{" "}
                        <span className="text-emerald-400">
                          {a.byName || "—"}
                        </span>
                      </p>

                      {a.note && (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          {a.note}
                        </p>
                      )}

                      {a.diff && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(a.diff).map(([k, v]) => (
                            <div key={k} className="text-sm">
                              <span className="text-gray-300 font-medium">
                                {k.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:{" "}
                              </span>
                              <span className="text-red-400 line-through">
                                {v.from || "—"}
                              </span>{" "}
                              <span className="text-gray-400">→</span>{" "}
                              <span className="text-green-400">{v.to}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No audit history found.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}