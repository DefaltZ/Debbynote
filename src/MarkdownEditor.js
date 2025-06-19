import React, { useState, useRef } from 'react';
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
  const textareaRef = useRef(null);

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

  // Preprocess, then parse markdown
  const blocks = parseBlocks(value);
  const html = DOMPurify.sanitize(renderBlocks(blocks));

  return (
    <div className="markdown-editor-container" style={{ flexDirection: 'column', padding: 0 }}>
      <Toolbar onFormat={handleFormat} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <textarea
          className="markdown-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          ref={textareaRef}
          placeholder={
            'Type markdown here...\n' +
            'Start a line with !r, !a, !wb, or !info for highlights.\n' +
            'Enter or Shift+Enter for soft break, double Enter for hard break.'
          }
        />
        <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export default MarkdownEditor; 