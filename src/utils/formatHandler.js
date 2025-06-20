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
  }
  
  setValue(newText);
  
  // Set cursor position after formatting
  setTimeout(() => {
    if (selected) {
      textarea.selectionStart = start;
      textarea.selectionEnd = end + cursorOffset;
    } else {
      textarea.selectionStart = textarea.selectionEnd = start + cursorOffset / 2;
    }
    textarea.focus();
  }, 0);
} 