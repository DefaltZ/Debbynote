import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import Toolbar from './components/Toolbar';
import { handleFormat } from './utils/formatHandler';
import { handleSave } from './utils/saveHandler';
import './styles.css';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const onFormat = (type) => {
    handleFormat(type, markdown, setMarkdown);
  };

  const onSave = async () => {
    await handleSave(markdown);
  };

  const onToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="App">
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
  );
}

export default App; 