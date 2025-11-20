import React from 'react';
import { handleNewNote as createNewNote } from '../utils/handleNewNote';

export default function Sidebar({ notes, onNoteSelect, isVisible, setMarkdown, setActiveNote, setNotes }) {
  if (!isVisible) {
    return null;
  }

  const handleNewNote = () => {
    createNewNote(setMarkdown, setActiveNote, setNotes, notes);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <svg 
          className="new-note-btn" 
          onClick={handleNewNote} 
          title="Create New Note"
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* File Add SVG */}
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM12 12V14H10V16H12V18H14V16H16V14H14V12H12Z" fill="currentColor"/>
        </svg>
      </div>
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
