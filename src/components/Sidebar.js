import React, { useState, useRef, useEffect } from 'react';

export default function Sidebar({ notes, onNoteSelect, isVisible, setMarkdown, setActiveNote, setNotes, width, onWidthChange }) {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const MIN_WIDTH = 100;
  const MAX_WIDTH = 400;

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + diff));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onWidthChange]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={sidebarRef}
      className="sidebar" 
      style={{ width: `${width}px` }}
    >
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
      <div 
        className="sidebar-resize-handle"
        onMouseDown={startResize}
      />
    </div>
  );
}
