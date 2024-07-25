import React from "react";
import "../styles/Footer.css";
import { FaHeart } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <hr />
      <p className="footer-para">
        {" "}
        Made with <FaHeart /> by{" "}
        <a href="https://github.com/AJBaliga28/" className="github-link">
          {" "}
          A.J.Baliga{" "}
        </a>{" "}
      </p>
      <p className="footer-para">Copyright ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
