import React, { useState } from "react";
import { signupUser } from "../api";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Common.css";

const SignUp = () => {
  const [state, setState] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signupUser(state);
      alert("Signup successful!");
      // Possibly redirect or update UI
      navigate("/login");
    } catch (error) {
      setErrorMessage("Error when signing up.");
      console.error("There was an error signing up:", error);
      // Show error message to user
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="signup-container">
      <h2 className="heading">Sign up!</h2>
      {isLoading && (
        <div className="loading-overlay">
          <p>Signing you up!</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-control">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="submit-btn" type="submit">
          <FaArrowRight />
        </button>
      </form>
      <p className="connecting-para">
        Have an account? <a href="/login">Log In!</a>
      </p>
    </div>
  );
};

export default SignUp;
