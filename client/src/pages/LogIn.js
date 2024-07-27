import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Common.css";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setErrorMessage(""); // Clear error on input change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      console.log(state);
      const response = await loginUser(state);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        alert("Successfully logged in.");
        setErrorMessage(""); // Clear error message
        navigate("/create");
      }
    } catch (error) {
      console.error("There was an error logging in:", error);
      setErrorMessage("Invalid email or password.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Login</h2>
      {isLoading && (
        <div className="loading-overlay">
          <p>Signing you in!</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
        <button className="submit-btn" type="submit" disabled={isLoading}>
          <FaArrowRight />
        </button>
      </form>
      <p className="connecting-para">
        Not registered? <a href="/signup">Sign up!</a>
      </p>
    </div>
  );
};

export default Login;
