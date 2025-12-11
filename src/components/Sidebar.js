import React from 'react';

export default function Sidebar({ notes, onNoteSelect, isVisible, setMarkdown, setActiveNote, setNotes }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ul>
          {notes.map((note) => (
            <li key={note} onClick={() => onNoteSelect(note)} className="note-item">
              <svg 
                className="file-icon" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
              <span className="file-name">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
