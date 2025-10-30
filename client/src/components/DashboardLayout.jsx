import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiUsers, FiUserPlus, FiFileText, FiLogOut, FiMenu } from "react-icons/fi";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔒 Check JWT Token for Auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🚪 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Employees", icon: <FiUsers />, path: "/manager/dashboard/employees" },
    { name: "Customers", icon: <FiUserPlus />, path: "/manager/dashboard/customers" },
    { name: "Tickets", icon: <FiFileText />, path: "/manager/dashboard/tickets" },
  ];

  return (
    <div className="fixed inset-0 flex bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 p-4 flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && "hidden"}`}>
            CRM Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <FiMenu size={22} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 mt-4 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          <FiLogOut />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-950 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
          {location.pathname.split("/").pop().charAt(0).toUpperCase() +
            location.pathname.split("/").pop().slice(1)}
        </h1>

        {/* Render Nested Pages */}
        <Outlet />
      </div>
    </div>
  );
}
