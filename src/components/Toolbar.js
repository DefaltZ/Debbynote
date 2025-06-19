import React from 'react';
import '../styles.css';

export default function Toolbar({ onFormat, onSave }) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn" title="Bold" onMouseDown={e => { e.preventDefault(); onFormat('bold'); }}>
        {/* Material UI Bold SVG (bold letter B) */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.6 10.79C16.44 10.13 17 9.13 17 8C17 6.34 15.66 5 14 5H7V19H15C16.66 19 18 17.66 18 16C18 14.87 17.44 13.87 16.6 13.21C17.45 12.56 18 11.57 18 10.5C18 9.43 17.45 8.44 16.6 7.79ZM9 7H14C14.55 7 15 7.45 15 8C15 8.55 14.55 9 14 9H9V7ZM15 17H9V15H15C15.55 15 16 15.45 16 16C16 16.55 15.55 17 15 17Z" fill="currentColor"/>
        </svg>
      </button>
      <button className="toolbar-btn" title="Italic" onMouseDown={e => { e.preventDefault(); onFormat('italic'); }}>
        {/* Material UI Italic SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4V7H12.21L8.79 17H6V20H14V17H11.79L15.21 7H18V4H10Z" fill="currentColor"/>
        </svg>
      </button>
      <button className="toolbar-btn" title="Strikethrough" onMouseDown={e => { e.preventDefault(); onFormat('strike'); }}>
        {/* Material UI Strikethrough SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 19V21H19V19H5ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM19 5V7H5V5H19Z" fill="currentColor"/>
        </svg>
      </button>
      <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 0.5rem' }}></div>
      <button id="saveFile" className="toolbar-btn" title="Save File" onClick={onSave}>
        {/* Material UI Save SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
}