import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import { handleFormat } from './utils/formatHandler';
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
    try {
      const result = await window.electronAPI.saveFile({ content: markdown, activeNote });

      if (result?.canceled) {
        console.log('Save cancelled by user');
        return;
      }

      if (!result?.success) {
        console.error('Save failed', result?.error || 'Unknown error');
        return;
      }

      const savedName = result.fileName || activeNote || 'untitled.md';
      console.log('File saved successfully in npm console:', savedName);

      setActiveNote(savedName);
      setNotes(prevNotes => {
        if (!Array.isArray(prevNotes) || !prevNotes.length) {
          return [savedName];
        }

        const renamed = prevNotes.map(note =>
          note === 'untitled' ? savedName : note
        );

        if (!renamed.includes(savedName)) {
          renamed.push(savedName);
        }

        return renamed;
      });

      const fetchedNotes = await window.electronAPI.getNotes();
      if (Array.isArray(fetchedNotes)) {
        setNotes(fetchedNotes);
      }
    } catch (error) {
      console.error('Error during save operation:', error);
    }
  };

  const onToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNoteSelect = async (noteName) => {
    // Special handling for 'untitled' - don't load from disk, just clear the editor
    if (noteName === 'untitled') {
      setMarkdown('');
      setActiveNote('untitled');
      return;
    }
    
    const content = await window.electronAPI.openNote(noteName);
    if (content !== null) {
      setMarkdown(content);
      setActiveNote(noteName); // Set the selected note as active
    }
  };

  return (
    <div className="App">
      <div className="app-layout">
        <Sidebar 
          notes={notes}
          onNoteSelect={handleNoteSelect}
          isVisible={isSidebarVisible}
          setMarkdown={setMarkdown}
          setActiveNote={setActiveNote}
          setNotes={setNotes}
        />
        <div className="main-content-area">
          <Toolbar 
            onFormat={onFormat} 
            onSave={onSave}
            onToggleDarkMode={onToggleDarkMode}
            isDarkMode={isDarkMode}
          />
          <MarkdownEditor 
            markdown={markdown} 
            onChange={setMarkdown} 
          />
        </div>
      </div>
    </div>
  );
}

export default App; 