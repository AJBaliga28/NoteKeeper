import React, { useState } from "react";
import "../styles/Note.css";
import { FaTrash, FaPencilAlt, FaCheck, FaSave } from "react-icons/fa";

function Note({ id, title, content, status, onSave, onCheck, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    setIsEditing(false);
    onSave(id, editedTitle, editedContent); // Call onSave prop to save edited data
  }

  function handleCheck() {
    console.log("Browser - id: ", id);
    console.log("Browser - status: ", status);

    onCheck(id, status);
  }

  function handleDelete() {
    onDelete(id);
  }

  return (
    <div className={`note ${status === "complete" ? "note-complete" : ""}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button className="save-btn" onClick={handleSave}>
            <FaSave />
          </button>
        </>
      ) : (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
          <button className="edit-btn" onClick={handleEdit}>
            <FaPencilAlt />
          </button>
          <button className="del-btn" onClick={handleDelete}>
            <FaTrash />
          </button>
          <button className="check-btn" onClick={handleCheck}>
            <FaCheck />
          </button>
        </>
      )}
    </div>
  );
}

export default Note;
