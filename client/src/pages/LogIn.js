import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Common.css";

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(state);
    try {
      const response = await axios.post("http://localhost:5000/login", state);
      console.log(response.data); // handle successful response
      // Possibly redirect or update UI based on response

      if (response.status === 200) {
        // Store the JWT token in local storage
        const token = response.data.token;
        localStorage.setItem("token", token);
        // Alert for successful login
        alert("Login successful!");
        // Redirect to the "/create" page
        navigate("/create");
        // console.log("Reached.");
      }
    } catch (error) {
      console.error(error); // handle error response
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
