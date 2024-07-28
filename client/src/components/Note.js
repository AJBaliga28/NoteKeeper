import React, { useState } from "react";
import "../styles/Note.css";
import { FaTrash, FaPencilAlt, FaCheck, FaSave } from "react-icons/fa";

function Note({ id, title, content, status, onSave, onCheck, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  function handleEdit() {
    setIsEditing(true);
    console.log("handleEdit: ", id);
  }

  const handleCheck = (id, status) => {
    console.log("handleCheck note.js - ", id, status);
    if (id && status) {
      onCheck(id, status);
    } else {
      console.error("Note ID or status is undefined");
    }
  };
  const handleDelete = (id) => {
    console.log("handleDel note.js - ", id);
    if (id) {
      onDelete(id);
    } else {
      console.error("Note ID is undefined");
    }
  };

  const handleSave = () => {
    console.log("From handleSave: ");
    console.log("New Title and Content: ", editedTitle, editedContent);
    console.log("After Edit: ", status);
    if (id && editedTitle && editedContent) {
      setIsEditing(false);
      onSave(id, editedTitle, editedContent, status);
      console.log("After handleSave - note.js", id);
    } else {
      console.error("Note ID, title, or content is undefined");
    }
  };

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
          <button className="save-btn" onClick={(id) => handleSave(id)}>
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
          <button className="del-btn" onClick={() => handleDelete(id)}>
            <FaTrash />
          </button>
          <button className="check-btn" onClick={() => handleCheck(id, status)}>
            <FaCheck />
          </button>
        </>
      )}
    </div>
  );
}

export default Note;
