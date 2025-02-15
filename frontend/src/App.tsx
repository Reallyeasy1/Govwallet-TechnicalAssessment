import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { StaffPage } from "./pages/StaffPage";

export function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">🏠 Home</Link>
          </li>
          <li>
            <Link to="/staff">👥 Staff</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </div>
  );
}
