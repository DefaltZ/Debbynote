import React, { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('debbynote-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('debbynote-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote = {
        id: Date.now(),
        content: currentNote,
        timestamp: new Date().toLocaleString(),
        title: currentNote.split('\n')[0].substring(0, 50) + (currentNote.split('\n')[0].length > 50 ? '...' : '')
      };
      setNotes([newNote, ...notes]);
      setCurrentNote('');
      setSelectedNote(newNote);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  const updateNote = (id, content) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, content, title: content.split('\n')[0].substring(0, 50) + (content.split('\n')[0].length > 50 ? '...' : '') }
        : note
    ));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>📝 DebbyNote</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <div className="new-note-section">
            <textarea
              placeholder="Write a new note..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              className="new-note-input"
              rows="3"
            />
            <button onClick={addNote} className="add-note-btn">
              Add Note
            </button>
          </div>

          <div className="notes-list">
            <h3>Notes ({filteredNotes.length})</h3>
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="note-title">{note.title}</div>
                <div className="note-timestamp">{note.timestamp}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="note-editor">
          {selectedNote ? (
            <div className="editor-content">
              <div className="editor-header">
                <h3>Editing Note</h3>
                <span className="note-date">{selectedNote.timestamp}</span>
              </div>
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, e.target.value)}
                className="note-textarea"
                placeholder="Start writing your note..."
              />
            </div>
          ) : (
            <div className="empty-state">
              <h2>Welcome to DebbyNote! 📝</h2>
              <p>Select a note from the sidebar or create a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 