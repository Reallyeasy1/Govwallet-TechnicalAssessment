import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { StaffPage } from "./pages/StaffPage";
import { RedemptionsPage } from "./pages/RedemptionsPage";

export function App() {
  return (
    <div style={appContainerStyle}>
      <Navbar />

      <div style={contentContainerStyle}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/redemption" element={<RedemptionsPage />} />
        </Routes>
      </div>
    </div>
  );
}

const appContainerStyle = {
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  padding: 0,
  margin: 0,
};

const contentContainerStyle = {
  padding: "40px 20px",
  marginTop: "0px",
  maxWidth: "1200px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: "40px auto",
};
