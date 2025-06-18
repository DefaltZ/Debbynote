import React from 'react';
import MarkdownEditor from './MarkdownEditor';

function App() {
  return (
    <div className="app" style={{ minHeight: '100vh', height: '100vh', background: '#fff', display: 'flex' }}>
      <MarkdownEditor />
    </div>
  );
}

export default App; 