// Navbar.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegStickyNote } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    alert("You have successfully logged out.");
    window.location.href = "/login"; // Redirect to login if no token
  };

  return (
    <nav className="navbar">
      <h2>
        <Link to="/">
          <FaRegStickyNote size={"1.25em"} className="home-btn" />
        </Link>
      </h2>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="dropdown">
            <div className="dropdown-content">
              <Link to="#" onClick={handleLogout}>
                <FiLogIn size={"2em"} className="login-btn" />
              </Link>
            </div>
          </div>
        ) : (
          <h2>
            <Link to="/login">
              <MdAccountCircle size={"1.25em"} className="acc-btn" />
            </Link>
          </h2>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
