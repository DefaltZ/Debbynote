import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Toolbar from './components/Toolbar';
import './styles.css';

// Enable soft breaks (single newline = <br>)
marked.setOptions({ breaks: true });

// Helper: map token to class
const tokenToClass = {
  '!a': 'md-highlight-red',
  '!r': 'md-highlight-green',
  '!wb': 'md-highlight-blue',
  '!info': 'md-highlight-yellow',
};

// Parse textarea value into blocks for custom rendering
function parseBlocks(text) {
  // Split into blocks by double newlines (hard break)
  const rawBlocks = text.split(/\n{2,}/);
  const blocks = [];

  rawBlocks.forEach(rawBlock => {
    // Only match valid highlight tokens at the start of the block
    const match = rawBlock.match(/^(!a|!r|!wb|!info)\s([\s\S]*)$/i);
    if (match) {
      blocks.push({
        type: 'highlight',
        token: match[1],
        content: match[2],
      });
    } else if (rawBlock.trim() === '') {
      blocks.push({ type: 'empty' });
    } else {
      blocks.push({ type: 'normal', content: rawBlock });
    }
  });
  return blocks;
}

function renderBlocks(blocks) {
  return blocks
    .map(block => {
      if (block.type === 'empty') {
        return '<br/>';
      } else if (block.type === 'highlight') {
        const cls = tokenToClass[block.token] || 'md-highlight-red';
        // Parse as markdown (block), then wrap in highlight span
        const html = marked.parse(block.content);
        return `<span class="${cls}">${html}</span>`;
      } else {
        // Normal block, parse as markdown (block)
        return marked.parse(block.content);
      }
    })
    .join('');
}

function MarkdownEditor() {
  const [value, setValue] = useState('');
  const [editorWidth, setEditorWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Formatting handler
  const handleFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);
    let newText = '';
    let cursorOffset = 0;
    if (type === 'bold') {
      newText = before + `**${selected || ''}**` + after;
      cursorOffset = selected ? 4 : 6;
    } else if (type === 'italic') {
      newText = before + `*${selected || ''}*` + after;
      cursorOffset = selected ? 2 : 7;
    } else if (type === 'strike') {
      newText = before + `~~${selected || ''}~~` + after;
      cursorOffset = selected ? 4 : 9;
    }
    setValue(newText);
    setTimeout(() => {
      if (selected) {
        textarea.selectionStart = start;
        textarea.selectionEnd = end + cursorOffset;
      } else {
        textarea.selectionStart = textarea.selectionEnd = start + cursorOffset / 2;
      }
      textarea.focus();
    }, 0);
  };

  // Save handler
  const handleSave = async () => {
    try {
      if (!window.electronAPI) {
        console.error('Electron API not available');
        alert('Save functionality not available in this environment');
        return;
      }

      const success = await window.electronAPI.saveFile(value);
      if (success) {
        console.log('File saved successfully');
      } else {
        console.log('Save was cancelled or failed');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file: ' + error.message);
    }
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

  // Preprocess, then parse markdown
  const blocks = parseBlocks(value);
  const html = DOMPurify.sanitize(renderBlocks(blocks));

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
            ref={textareaRef}
            style={{ 
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none'
            }}
            placeholder={
              'Type markdown here...\n' +
              'Start a line with !r, !a, !wb, or !info for highlights.\n' +
              'Enter or Shift+Enter for soft break, double Enter for hard break.'
            }
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