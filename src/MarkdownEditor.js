import React, { useState, useRef, useEffect } from 'react';
import { getMarkdownHtml } from './utils/markdownParser';
import { handleBulletKeyDown } from './utils/bulletHandler';
import './styles.css';

function MarkdownEditor({ markdown, onChange }) {
  const [editorWidth, setEditorWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-increment bullet handler
  const onKeyDown = (e) => {
    handleBulletKeyDown(e, markdown, onChange);
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
  const html = getMarkdownHtml(markdown);

  return (
      <div 
        ref={containerRef}
        className="markdown-editor-container"
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
            value={markdown}
            onChange={e => onChange(e.target.value)}
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
  );
}

export default MarkdownEditor; 