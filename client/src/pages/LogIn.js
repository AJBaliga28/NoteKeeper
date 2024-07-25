import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Common.css";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ email: "", password: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(state);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        alert("Login successful!");
        navigate("/create");
      }
    } catch (error) {
      console.error("There was an error logging in:", error);
      // Show error message to user
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Login</h2>
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
        <button type="submit">
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
