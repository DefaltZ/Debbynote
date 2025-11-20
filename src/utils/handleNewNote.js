/**
 * Handles creating a new blank note
 * @param {Function} setMarkdown - Function to update the markdown content
 * @param {Function} setActiveNote - Function to set the active note name
 * @param {Function} setNotes - Function to update the notes list
 * @param {Array} notes - Current array of notes
 */
export const handleNewNote = async (setMarkdown, setActiveNote, setNotes, notes) => {
  try {
    // Clear the editor content
    setMarkdown('');
    
    // Set active note to "untitled" (will be updated when saved)
    setActiveNote('untitled');
    
    // Add "untitled" to the notes list if not already present
    if (!notes.includes('untitled')) {
      setNotes([...notes, 'untitled']);
    }
    
    console.log('New note created: untitled');
  } catch (error) {
    console.error('Error creating new note:', error);
  }
};
