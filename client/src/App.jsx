import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CompanyRegister from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import BusinessLogin from "./pages/BusinessLogin";
import DashboardLayout from "./components/DashboardLayout";
import AddEmployee from "./pages/AddEmployee";
import "./App.css";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import CRMApproval from "./pages/CRMApproval";
import ApprovedCompanies from "./pages/ApprovedCompanies";

function App() {
  return (
    <Router>
      <div className="mt-4">
        <Routes>
          {/* Default redirect to /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/register" element={<CompanyRegister />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/employee" element={<EmployeeLogin />} />

          {/* Business Manager Login */}
          <Route path="/login" element={<BusinessLogin />} />

          {/* Business Manager Dashboard Layout */}
          <Route path="/manager/dashboard" element={<DashboardLayout />}>
            <Route path="employees" element={<AddEmployee />} />
            {/* You can later add: customers, tickets, analytics, etc. */}
          </Route>
          {/* Admin Layout */}
        <Route path="/admin-layout" element={<AdminLayout />}>
          <Route path="/admin-layout/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-layout/approvals" element={<CRMApproval />} />
          <Route path="/admin-layout/approved-companies" element={<ApprovedCompanies />} />
        </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
