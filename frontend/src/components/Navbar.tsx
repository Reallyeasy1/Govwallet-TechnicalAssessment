import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <nav style={navBarStyle}>
      <ul style={navListStyle}>
        <li style={navItemStyle}>
          <Link to="/" style={linkStyle}>
            🏡 Home
          </Link>
        </li>
        <li style={navItemStyle}>
          <Link to="/staff" style={linkStyle}>
            👥 Staff
          </Link>
        </li>
        <li style={navItemStyle}>
          <Link to="/redemption" style={linkStyle}>
            🎁 Redemption
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const navBarStyle = {
  backgroundColor: "#2c3e50",
  padding: "12px 20px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  position: "sticky" as const,
  top: 0,
  zIndex: 1000,
  width: "100%",
};

const navListStyle = {
  listStyleType: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 0,
  margin: 0,
};

const navItemStyle = {
  margin: "0 25px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#ecf0f1",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "8px 16px",
  transition: "background-color 0.3s",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
};
