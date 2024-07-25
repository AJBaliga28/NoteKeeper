import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { jwtDecode } from "jwt-decode";

const Keeper = () => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("");

  function extractUserIdAndToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Missing token");
      return {};
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Adjust this according to your token's payload structure
      return { token, userId };
    } catch (error) {
      console.error("Error decoding token:", error);
      return {};
    }
  }

  useEffect(() => {
    const { token, userId } = extractUserIdAndToken();
    if (!token || !userId) return;

    axios
      .get("/api/user", {
        headers: { Authorization: `Bearer ${token}`, "user-id-header": userId },
      })
      .then((response) => {
        setUsername(response.data.username);
        return axios.get("/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "user-id-header": userId,
          },
        });
      })
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching data!", error);
      });
  }, []);

  function addNote(newNote) {
    const { token, userId } = extractUserIdAndToken();
    if (!token || !userId) return;

    axios
      .post("/api/notes", newNote, {
        headers: { Authorization: `Bearer ${token}`, "user-id-header": userId },
      })
      .then((response) => {
        setNotes((prevNotes) => [...prevNotes, response.data]);
      })
      .catch((error) => {
        console.error("There was an error creating the note!", error);
      });
  }

  function deleteNote(id) {
    const { token, userId } = extractUserIdAndToken();
    if (!token || !userId) return;

    axios
      .delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "user-id-header": userId },
      })
      .then(() => {
        setNotes((prevNotes) =>
          prevNotes.filter((noteItem) => noteItem._id !== id)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the note!", error);
      });
  }

  function handleSave(id, newTitle, newContent) {
    const { token, userId } = extractUserIdAndToken();
    if (!token || !userId) return;

    axios
      .put(
        `/api/notes/${id}`,
        { title: newTitle, content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "user-id-header": userId,
          },
        }
      )
      .then((response) => {
        setNotes((prevNotes) =>
          prevNotes.map((noteItem) =>
            noteItem._id === id ? response.data : noteItem
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the note!", error);
      });
  }

  function handleCheck(id, currentStatus) {
    const { token, userId } = extractUserIdAndToken();
    if (!token || !userId) return;

    const newStatus =
      currentStatus === "incomplete" ? "complete" : "incomplete";

    axios
      .put(
        `/api/notes/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "user-id-header": userId,
          },
        }
      )
      .then((response) => {
        setNotes((prevNotes) =>
          prevNotes.map((noteItem) =>
            noteItem._id === id ? { ...noteItem, status: newStatus } : noteItem
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the note status!", error);
      });
  }

  return (
    <div>
      <h2 className="heading">Welcome, {username}!</h2>
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => (
        <Note
          key={index}
          id={noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          status={noteItem.status}
          onDelete={deleteNote}
          onSave={handleSave}
          onCheck={handleCheck}
        />
      ))}
      <Footer />
    </div>
  );
};

export default Keeper;
