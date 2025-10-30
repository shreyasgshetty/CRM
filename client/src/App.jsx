import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CompanyRegister from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import BusinessLogin from "./pages/BusinessLogin";
import DashboardLayout from "./components/DashboardLayout";
import AddEmployee from "./pages/AddEmployee";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="mt-4">
        <Routes>
          {/* Default redirect to /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Core Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CompanyRegister />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/employee" element={<EmployeeLogin />} />

          {/* Business Manager Login */}
          <Route path="/login-business" element={<BusinessLogin />} />

          {/* Business Manager Dashboard Layout */}
          <Route path="/manager/dashboard" element={<DashboardLayout />}>
            <Route path="employees" element={<AddEmployee />} />
            {/* You can later add: customers, tickets, analytics, etc. */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
