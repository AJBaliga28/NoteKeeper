import React from "react";
import "../styles/NotFound.css";
const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <a href="/" className="link-home">
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
