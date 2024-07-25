import axios from "axios";

// Set the base URL for the API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set the Authorization header with the JWT token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Authentication API calls
export const loginUser = (credentials) => api.post("/login", credentials);
export const signupUser = (data) => api.post("/signup", data);

// User API calls
export const getUser = () => api.get("/api/user");

// Notes API calls
export const getNotes = () => api.get("/api/notes");
export const createNote = (note) => api.post("/api/notes", note);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);
export const updateNote = (id, note) => api.put(`/api/notes/${id}`, note);
export const updateNoteStatus = (id, status) =>
  api.put(`/api/notes/${id}`, { status });

// Set token in headers initially if available
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}
