import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import { getMarkdownHtml } from './utils/markdownParser';
import { handleBulletKeyDown } from './utils/bulletHandler';
import { handleFormat } from './utils/formatHandler';
import { handleSave } from './utils/saveHandler';
import './styles.css';

function MarkdownEditor() {
  const [value, setValue] = useState('');
  const [editorWidth, setEditorWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Formatting handler
  const onFormat = (type) => {
    handleFormat(type, value, setValue);
  };

  // Save handler
  const onSave = async () => {
    await handleSave(value);
  };

  // Auto-increment bullet handler
  const onKeyDown = (e) => {
    handleBulletKeyDown(e, value, setValue);
  };

  // Resize handlers
  const startResize = (e) => {
    console.log('Resize started');
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const doResize = (e) => {
    if (!isResizing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedWidth = Math.max(25, Math.min(75, newWidth));
    
    console.log('Resizing...', clampedWidth);
    setEditorWidth(clampedWidth);
  };

  const stopResize = () => {
    console.log('Resize stopped');
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Event listeners
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => doResize(e);
      const handleMouseUp = () => stopResize();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Get markdown HTML
  const html = getMarkdownHtml(value);

  return (
    <div className="markdown-editor-container" style={{ flexDirection: 'column', padding: 0 }}>
      <div 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          flex: 1, 
          minHeight: 0,
          position: 'relative',
          width: '100%'
        }}
      >
        <div style={{ 
          width: `${editorWidth}%`,
          minWidth: '200px',
          maxWidth: '75%'
        }}>
          <textarea
            className="markdown-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            ref={textareaRef}
            style={{ 
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none'
            }}
            
          />
        </div>
        
        <div 
          style={{
            width: '8px',
            background: '#ddd',
            cursor: 'col-resize',
            position: 'relative',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          onMouseDown={startResize}
        >
          <div style={{
            width: '2px',
            height: '50px',
            background: '#999',
            borderRadius: '1px'
          }} />
        </div>
        
        <div style={{ 
          width: `${100 - editorWidth}%`,
          minWidth: '200px',
          maxWidth: '75%'
        }}>
          <div 
            className="markdown-preview" 
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ 
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MarkdownEditor; 