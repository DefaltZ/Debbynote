// Formatting handler
export function handleFormat(type, value, setValue) {
  const textarea = document.querySelector('.markdown-input');
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
  } else if (type === 'underline') {
    newText = before + `<u>${selected || ''}</u>` + after;
    cursorOffset = selected ? 7 : 11;
  } else if (type === 'separator') {
    // Insert a horizontal rule separator
    newText = before + '\n\n---\n\n' + after;
    cursorOffset = 7; // Position cursor after the separator
  }
  
  setValue(newText);
  
  // Set cursor position after formatting
  setTimeout(() => {
    if (type === 'separator') {
      // For separator, position cursor after the separator
      textarea.setSelectionRange(start + 7, start + 7);
    } else if (selected) {
      textarea.selectionStart = start;
      textarea.selectionEnd = end + cursorOffset;
    } else {
      textarea.selectionStart = textarea.selectionEnd = start + cursorOffset / 2;
    }
    textarea.focus();
  }, 0);
} 