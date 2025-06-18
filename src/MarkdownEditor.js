import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './styles.css';

// Helper: map token to class
const tokenToClass = {
  '!a': 'md-highlight-red',
  '!r': 'md-highlight-green',
  '!wb': 'md-highlight-blue',
  '!info': 'md-highlight-yellow',
};

// Parse textarea value into blocks for custom rendering
function parseBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentBlock = null;

  lines.forEach((line, idx) => {
    // Only match valid highlight tokens at the start of the line
    const match = line.match(/^(!a|!r|!wb|!info)\s(.*)$/i);
    if (match) {
      // Start a new highlight block
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        type: 'highlight',
        token: match[1],
        lines: [match[2]],
      };
    } else if (line.trim() === '') {
      // Empty line: end current block
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'empty' });
    } else {
      if (currentBlock && currentBlock.type === 'highlight') {
        currentBlock.lines.push(line);
      } else {
        if (!currentBlock) {
          currentBlock = { type: 'normal', lines: [] };
        }
        currentBlock.lines.push(line);
      }
    }
  });
  if (currentBlock) blocks.push(currentBlock);
  return blocks;
}

function renderBlocks(blocks) {
  return blocks
    .map(block => {
      if (block.type === 'empty') {
        return '<br/>';
      } else if (block.type === 'highlight') {
        const cls = tokenToClass[block.token] || 'md-highlight-red';
        // Join lines with <br/>
        const content = block.lines.map(l => l.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('<br/>');
        return `<span class="${cls}">${content}</span>`;
      } else {
        // Normal block, parse as markdown
        const content = block.lines.join('\n');
        return marked.parseInline(content);
      }
    })
    .join('');
}

function MarkdownEditor() {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Preprocess, then parse markdown
  const blocks = parseBlocks(value);
  const html = DOMPurify.sanitize(renderBlocks(blocks));

  return (
    <div className="markdown-editor-container">
      <textarea
        className="markdown-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        ref={textareaRef}
        placeholder={
          'Type markdown here...\n' +
          'Start a line with !r, !a, !wb, or !info for highlights.\n' +
          'Shift+Enter for soft break, Enter for hard break.'
        }
      />
      <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default MarkdownEditor; 