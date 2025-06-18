import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './styles.css';

// Preprocess markdown to handle custom syntax
function preprocessMarkdown(md) {
  return md
    .split('\n')
    .map(line => {
      if (line.startsWith('!a ')) {
        // Argument higlight
        return `<span class="md-highlight-red">${line.slice(3)}</span>`;

      } else if (line.startsWith('!r')) {
        // rebuttal highlight
        return `<span class="md-highlight-green">${line.slice(3)}</span>`;

        //worldbuilding highlight
      } else if (line.startsWith('!wb')) {
        return `<span class="md-highlight-blue">${line.slice(3)}</span>`;

        //other key piece of information highlight
      } else if (line.startsWith('!info')) {
        return `<span class="md-highlight-yellow">${line.slice(5)}</span>`;
      }
      return line;
    })
    .join('\n');
}

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');

  // Preprocess, then parse markdown
  const processed = preprocessMarkdown(markdown);
  const html = DOMPurify.sanitize(marked.parse(processed));

  return (
    <div className="markdown-editor-container">
      <textarea
        className="markdown-input"
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
        placeholder={
          'Type markdown here...\n' +
          'use !a to highlight an argument, !r to highlight a rebuttal, !wb to highlight a worldbuilding piece, !info to highlight a key piece of information' +
          'Example:\n!r This is red.\n!g This is green.'
        }
      />
      <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default MarkdownEditor; 