import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setPage("login")}
          className={`px-4 py-2 rounded ${page === "login" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Login
        </button>
        <button
          onClick={() => setPage("register")}
          className={`px-4 py-2 rounded ${page === "register" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Register
        </button>
      </div>

      <div className="mt-4">
        {page === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default App;
