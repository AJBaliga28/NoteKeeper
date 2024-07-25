import React, { useState } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Common.css";

const SignUp = () => {
  const [state, setState] = useState({
    username: "",
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
      const response = await axios.post("http://localhost:5000/signup", state);
      console.log(response.data); // handle successful response
      // Possibly redirect or update UI based on response
    } catch (error) {
      console.error(error); // handle error response
      // Show error message to user
    }
  };

  return (
    <div className="signup-container">
      <h2 className="heading">Sign up</h2>
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
        <button type="submit">
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
