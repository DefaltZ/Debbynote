import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Enable soft breaks (single newline = <br>)
marked.setOptions({ breaks: true });

// Helper: map token to class
const tokenToClass = {
  '!a': 'md-highlight-red',
  '!r': 'md-highlight-green',
  '!wb': 'md-highlight-blue',
  '!info': 'md-highlight-yellow',
};

// British Parliamentary Debate position mappings
const debatePositions = {
  '!og1': { title: 'Opening Government 1st Speaker', class: 'debate-og1' },
  '!og2': { title: 'Opening Government 2nd Speaker', class: 'debate-og2' },
  '!oo1': { title: 'Opening Opposition 1st Speaker', class: 'debate-oo1' },
  '!oo2': { title: 'Opening Opposition 2nd Speaker', class: 'debate-oo2' },
  '!cg1': { title: 'Closing Government 1st Speaker', class: 'debate-cg1' },
  '!cg2': { title: 'Closing Government 2nd Speaker', class: 'debate-cg2' },
  '!co1': { title: 'Closing Opposition 1st Speaker', class: 'debate-co1' },
  '!co2': { title: 'Closing Opposition 2nd Speaker', class: 'debate-co2' },
  '!pm' : { title: 'Prime Minister', class: 'debate-pm' },
  '!lo' : { title: 'Leader of Opposition', class: 'debate-lo' },
  '!dpm' : { title: 'Deputy Prime Minister', class: 'debate-dpm' },
  '!dlo' : { title: 'Deputy Leader of Opposition', class: 'debate-dlo' },
  '!gw' : { title: 'Government Whip', class: 'debate-gw' },
  '!ow' : { title: 'Opposition Whip', class: 'debate-ow' },
};

// Parse textarea value into blocks for custom rendering
export function parseBlocks(text) {
  // Split into blocks by double newlines (hard break)
  const rawBlocks = text.split(/\n{2,}/);
  const blocks = [];

  rawBlocks.forEach(rawBlock => {
    // Check for debate position tokens first
    const debateMatch = rawBlock.match(/^(!og1|!og2|!oo1|!oo2|!cg1|!cg2|!co1|!co2|!pm|!lo|!dpm|!dlo|!gw|!ow)\s([\s\S]*)$/i);
    if (debateMatch) {
      blocks.push({
        type: 'debate',
        token: debateMatch[1],
        content: debateMatch[2],
      });
    } else {
      // Check for highlight tokens
      const highlightMatch = rawBlock.match(/^(!a|!r|!wb|!info)\s([\s\S]*)$/i);
      if (highlightMatch) {
        blocks.push({
          type: 'highlight',
          token: highlightMatch[1],
          content: highlightMatch[2],
        });
      } else if (rawBlock.trim() === '') {
        blocks.push({ type: 'empty' });
      } else {
        blocks.push({ type: 'normal', content: rawBlock });
      }
    }
  });
  return blocks;
}

export function renderBlocks(blocks) {
  return blocks
    .map(block => {
      if (block.type === 'empty') {
        return '<br/>';
      } else if (block.type === 'highlight') {
        const cls = tokenToClass[block.token] || 'md-highlight-red';
        // Parse as markdown (block), then wrap in highlight span
        const html = marked.parse(block.content);
        return `<span class="${cls}">${html}</span>`;
      } else if (block.type === 'debate') {
        const position = debatePositions[block.token];
        if (position) {
          // Parse content as markdown
          const html = marked.parse(block.content);
          return `<div class="${position.class}"><div class="debate-header">${position.title}</div><div class="debate-content">${html}</div></div>`;
        }
        // Fallback to normal rendering if position not found
        return marked.parse(block.content);
      } else {
        // Normal block, parse as markdown (block)
        return marked.parse(block.content);
      }
    })
    .join('');
}

export function getMarkdownHtml(markdown) {
  try {
    const blocks = parseBlocks(markdown);
    const rawHtml = renderBlocks(blocks);
    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p>Error parsing markdown</p>';
  }
} 