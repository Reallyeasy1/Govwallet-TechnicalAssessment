import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { StaffPage } from "./pages/StaffPage";
import { RedemptionsPage } from "./pages/RedemptionsPage";

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
          <li>
            <Link to="/redemption">🎁 Redemption</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/redemption" element={<RedemptionsPage />} />
      </Routes>
    </div>
  );
}
