import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { ColorRing } from "react-loader-spinner";

// Set the base URL for the API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const Keeper = () => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(""); // Added for error handling

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userResponse = await getUser();
        setUsername(userResponse.data.username);
        console.log("userResponse.data: ", userResponse.data);

        // Fetch notes
        const notesResponse = await getNotes();
        console.log("notesResponse: ", notesResponse);

        setNotes(notesResponse.data);
      } catch (error) {
        setError("Failed to fetch data. Please reload the browser.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserData();
  }, []);

  // useEffect(() => {
  //   console.log("Notes state updated:", notes);
  // }, [notes]);

  // Function to get user data
  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  // Function to get notes data
  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    } catch (error) {
      setError("Failed to get the notes. Please reload the browser.");
      console.error("Error getting notes:", error);
      throw error;
    }
  };

  const handleAddNote = async (newNote) => {
    if (!newNote.title || !newNote.content) {
      alert("Please enter both a title and content for the note!");
      return; // Prevent adding the note if validation fails
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.post("/api/notes", newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => [...prevNotes, response.data]);
      console.log(notes);
    } catch (error) {
      setError("Failed to add the note. Please reload the browser.");
      console.error("Error creating note:", error);
    }
  };

  // Function to delete a note
  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await api.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) =>
        prevNotes.filter((noteItem) => noteItem._id !== id)
      );
    } catch (error) {
      setError("Failed to delete the note. Please reload the browser.");
      console.error("Error deleting the note:", error);
    }
  };

  // Function to update a note's title and content
  const handleSave = async (id, newTitle, newContent, status) => {
    console.log(newTitle, newContent, status);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.put(
        `/api/notes/${id}`,
        {
          title: newTitle,
          content: newContent,
          status: status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotes((prevNotes) =>
        prevNotes.map((noteItem) =>
          noteItem._id === id ? response.data : noteItem
        )
      );
      console.log("After handleSave, id: ", id);
    } catch (error) {
      setError("Failed to update the note. Please reload the browser.");
      console.error("Error updating the note:", error);
    }
  };

  // Function to update the status of a note (complete/incomplete)
  // const handleCheck = async (id, currentStatus) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("No token found");
  //     }

  //     const newStatus =
  //       currentStatus === "incomplete" ? "complete" : "incomplete";
  //     await api.put(
  //       `/api/notes/${id}`,
  //       { status: newStatus },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setNotes((prevNotes) =>
  //       prevNotes.map((noteItem) =>
  //         noteItem._id === id ? { ...noteItem, status: newStatus } : noteItem
  //       )
  //     );
  //   } catch (error) {
  //     setError("Failed to update the note status. Please try again.");
  //     console.error("Error updating note status:", error);
  //   }
  // };

  // New
  const handleCheck = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const newStatus =
        currentStatus === "incomplete" ? "complete" : "incomplete";
      console.log("Updating note ID:", id, "New status:", newStatus); // Debugging log

      await api.put(
        `/api/notes/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes((prevNotes) =>
        prevNotes.map((noteItem) =>
          noteItem._id === id ? { ...noteItem, status: newStatus } : noteItem
        )
      );
    } catch (error) {
      setError("Failed to update the note status. Please try again.");
      console.error("Error updating note status:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="loader-container">
          <ColorRing
            key={isLoading}
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <>
          <h2 className="heading">
            {username ? "Welcome, " + username : "Username Loading..."}!
          </h2>

          {error && <p className="error-message">{error}</p>}
          <CreateArea onAdd={handleAddNote} />
          {notes.map((noteItem, id) => (
            <Note
              key={id}
              id={noteItem._id}
              title={noteItem.title}
              content={noteItem.content}
              status={noteItem.status}
              onDelete={handleDeleteNote}
              onSave={handleSave}
              onCheck={handleCheck}
            />
          ))}
        </>
      )}
      <Footer />
    </div>
  );
};

export default Keeper;
