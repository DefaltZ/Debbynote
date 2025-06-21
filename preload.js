const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: send a message to the main process
  sendMessage: (message) => ipcRenderer.send('message', message),
  
  // Example: receive a message from the main process
  onMessage: (callback) => ipcRenderer.on('message', callback),
  
  // Example: get app version
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Example: open file dialog
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  
  // Example: save file dialog
  saveFile: (data) => ipcRenderer.invoke('save-file', data),

  // New backend functionality
  getNotes: () => ipcRenderer.invoke('get-notes'),
  openNote: (noteName) => ipcRenderer.invoke('open-note', noteName)
}); 