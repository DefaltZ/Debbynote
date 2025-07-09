// Auto-increment bullet handler
export function handleBulletKeyDown(e, value, setValue) {
  if (e.key === 'Enter') {
    const textarea = e.target;
    const cursorPos = textarea.selectionStart;
    const lines = value.split('\n');
    let currentLineIndex = 0;
    let charCount = 0;
    
    // Find current line
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPos) {
        currentLineIndex = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline
    }
    
    const currentLine = lines[currentLineIndex];
    
    // Check if current line is a list item
    const bulletMatch = currentLine.match(/^(\s*)([-*+]\s+)(.+)$/);
    const numberedMatch = currentLine.match(/^(\s*)(\d+\.\s+)(.+)$/);
    
    if (bulletMatch || numberedMatch) {
      e.preventDefault();
      
      const match = bulletMatch || numberedMatch;
      const indent = match[1];
      const bullet = match[2];
      const content = match[3];
      
      // If line is empty (just bullet), remove it and don't add new bullet
      if (content.trim() === '') {
        const newLines = [...lines];
        newLines.splice(currentLineIndex, 1);
        const newValue = newLines.join('\n');
        setValue(newValue);
        
        // Set cursor to the position where the line was removed
        setTimeout(() => {
          const newPos = charCount - currentLine.length - 1;
          textarea.setSelectionRange(newPos, newPos);
          textarea.focus();
        }, 0);
        return;
      }
      
      // Insert new bullet line
      let newBullet;
      if (bulletMatch) {
        // For unordered lists, use same bullet type
        newBullet = bullet;
      } else {
        // For ordered lists, increment the number
        const number = parseInt(bullet);
        newBullet = `${number + 1}. `;
      }
      
      const newLine = indent + newBullet;
      const newLines = [...lines];
      newLines.splice(currentLineIndex + 1, 0, newLine);
      const newValue = newLines.join('\n');
      setValue(newValue);
      
      // Set cursor to the end of the new bullet line
      setTimeout(() => {
        const newPos = charCount + currentLine.length + 1 + newLine.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
      }, 0);
    }
  }
} 