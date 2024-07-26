import React, { useState, useEffect } from "react";
import {
  getUser,
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  updateNoteStatus,
} from "../api";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

const Keeper = () => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUser();
        setUsername(userResponse.data.username);

        const notesResponse = await getNotes();
        console.log(notesResponse);
        setNotes(notesResponse.data);
      } catch (error) {
        console.error("There was an error fetching data!", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddNote = async (newNote) => {
    try {
      const response = await createNote(newNote);
      console.log(newNote);
      setNotes((prevNotes) => [...prevNotes, response.data]);
    } catch (error) {
      console.error("There was an error creating the note!", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      console.log(id);
      await deleteNote(id);
      setNotes((prevNotes) =>
        prevNotes.filter((noteItem) => noteItem._id !== id)
      );
    } catch (error) {
      console.error("There was an error deleting the note!", error);
    }
  };

  const handleSave = async (id, newTitle, newContent) => {
    try {
      const response = await updateNote(id, {
        title: newTitle,
        content: newContent,
      });
      console.log(response);
      setNotes((prevNotes) =>
        prevNotes.map((noteItem) =>
          noteItem._id === id ? response.data : noteItem
        )
      );
    } catch (error) {
      console.error("There was an error updating the note!", error);
    }
  };

  const handleCheck = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "incomplete" ? "complete" : "incomplete";
      await updateNoteStatus(id, newStatus);
      setNotes((prevNotes) =>
        prevNotes.map((noteItem) =>
          noteItem._id === id ? { ...noteItem, status: newStatus } : noteItem
        )
      );
    } catch (error) {
      console.error("There was an error updating the note status!", error);
    }
  };

  return (
    <div>
      <h2 className="heading">Welcome, {username}!</h2>
      <CreateArea onAdd={handleAddNote} />
      {notes.map((noteItem, index) => (
        <Note
          key={index}
          id={noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          status={noteItem.status}
          onDelete={handleDeleteNote}
          onSave={handleSave}
          onCheck={handleCheck}
        />
      ))}
      <Footer />
    </div>
  );
};

export default Keeper;
