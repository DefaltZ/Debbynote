import React from 'react';

export default function Sidebar({ notes, onNoteSelect, isVisible }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ul>
          {notes.map((note) => (
            <li key={note} onClick={() => onNoteSelect(note)}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 