import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-heading">Welcome to Notes Keeper!</h1>
      <p className="home-para">
        Organize your thoughts and ideas efficiently with our easy-to-use
        note-taking app.
      </p>
      <ul className="features">
        <li>Create, edit, and delete notes effortlessly</li>
        <li>Organize notes with tags and labels</li>
        <li>Access your notes from anywhere</li>
      </ul>
      <button className="call-to-action">
        {" "}
        <a href="/login">Get Started </a>
      </button>
    </div>
  );
};

export default Home;
