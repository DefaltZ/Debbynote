import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import Toolbar from './components/Toolbar';
import './styles.css';

function App() {
  const [markdown, setMarkdown] = useState('# Welcome to DebbyNote\n\nStart typing your notes here...\n\n## Features\n- **Bold text** with toolbar\n- *Italic text* with toolbar\n- ~~Strikethrough~~ with toolbar\n- Custom highlights: !r red, !g green, !b blue, !y yellow\n- Resizable editor and preview panes\n- Dark mode toggle\n\n!r This is a red highlight block\n!g This is a green highlight block\n!b This is a blue highlight block\n!y This is a yellow highlight block');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleFormat = (format) => {
    const textarea = document.querySelector('.markdown-input');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'strike':
        formattedText = `~~${selectedText}~~`;
        break;
      default:
        return;
    }

    const newMarkdown = markdown.substring(0, start) + formattedText + markdown.substring(end);
    setMarkdown(newMarkdown);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + selectedText.length);
    }, 0);
  };

  const handleSave = async () => {
    try {
      const result = await window.electronAPI.saveFile(markdown);
      if (result.success) {
        console.log('File saved successfully:', result.filePath);
      } else {
        console.error('Failed to save file:', result.error);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="App">
      <Toolbar 
        onFormat={handleFormat} 
        onSave={handleSave}
        onToggleDarkMode={handleToggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <MarkdownEditor 
        markdown={markdown} 
        onChange={setMarkdown} 
      />
    </div>
  );
}

export default App; 