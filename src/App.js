import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import { handleFormat } from './utils/formatHandler';
import { handleSave } from './utils/saveHandler';
import './styles.css';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [activeNote, setActiveNote] = useState(null); // Track the active note's filename
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Default to visible

  // Apply dark mode to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Command key (metaKey on macOS)
      if (e.metaKey) {
        // Toggle sidebar with Cmd+B
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setIsSidebarVisible(prev => !prev);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await window.electronAPI.getNotes();
      setNotes(fetchedNotes);
    };
    fetchNotes();
  }, []);

  const onFormat = (type) => {
    handleFormat(type, markdown, setMarkdown);
  };

  const onSave = async () => {
    const result = await window.electronAPI.saveFile({ content: markdown, activeNote });
    if (result.success) {
      // If a new file was saved, update the active note and refresh the list
      if (result.fileName !== activeNote) {
        setActiveNote(result.fileName);
        const fetchedNotes = await window.electronAPI.getNotes();
        setNotes(fetchedNotes);
      }
    }
  };

  const onToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNoteSelect = async (noteName) => {
    const content = await window.electronAPI.openNote(noteName);
    if (content !== null) {
      setMarkdown(content);
      setActiveNote(noteName); // Set the selected note as active
    }
  };

  return (
    <div className="App">
      <Toolbar 
        onFormat={onFormat} 
        onSave={onSave}
        onToggleDarkMode={onToggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <div className="main-container">
        <Sidebar 
          notes={notes}
          onNoteSelect={handleNoteSelect}
          isVisible={isSidebarVisible}
        />
        <MarkdownEditor 
          markdown={markdown} 
          onChange={setMarkdown} 
        />
      </div>
    </div>
  );
}

export default App; 