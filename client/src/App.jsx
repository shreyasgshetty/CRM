import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import CompanyRegister from "./pages/Register";
import "./App.css";

function App() {
  return (
    <Router>
      

      <div className="mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CompanyRegister />} />
          {/* Optional default route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
