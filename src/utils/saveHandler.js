// Save handler
export async function handleSave(value) {
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
} 