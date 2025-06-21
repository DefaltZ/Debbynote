import React from 'react';

export default function Sidebar({ notes, onNoteSelect, onToggle, isCollapsed }) {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={onToggle} className="sidebar-toggle">
        {isCollapsed ? '>' : '<'}
      </button>
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