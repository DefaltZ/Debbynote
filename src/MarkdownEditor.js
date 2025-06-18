import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
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
          'Enter or Shift+Enter for soft break, double Enter for hard break.'
        }
      />
      <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default MarkdownEditor; 