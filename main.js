const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

// Handle save file
ipcMain.handle('save-file', async (event, { content, activeNote }) => {
  const notesDir = path.join(app.getPath('home'), '.debbynotes');

  // If we are editing an existing note, overwrite it directly.
  if (activeNote) {
    const filePath = path.join(notesDir, activeNote);
    try {
      await fs.promises.writeFile(filePath, content, 'utf8');
      console.log(`File overwritten successfully: ${filePath}`);
      return { success: true, fileName: activeNote };
    } catch (error) {
      console.error(`Error overwriting file ${activeNote}:`, error);
      return { success: false, error: error.message };
    }
  } 
  // If it's a new note, show the save dialog.
  else {
    const win = BrowserWindow.getFocusedWindow();
    const { filePath, canceled } = await dialog.showSaveDialog(win, {
      title: 'Save New Note',
      defaultPath: path.join(notesDir, 'untitled.md'),
      filters: [{ name: 'Markdown Files', extensions: ['md'] }],
      properties: ['createDirectory']
    });

    if (canceled || !filePath) {
  
      return { success: false, canceled: true };
    }

    try {
      await fs.promises.writeFile(filePath, content, 'utf8');
      const fileName = path.basename(filePath);
      console.log(`File saved successfully: ${filePath}`);
      return { success: true, fileName: fileName };
    } catch (error) {
      console.error('Error saving new file:', error);
      return { success: false, error: error.message };
    }
  }
});

// Handle get-notes
ipcMain.handle('get-notes', async () => {
  const notesDir = path.join(app.getPath('home'), '.debbynotes');
  try {
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir);
    }
    const files = await fs.promises.readdir(notesDir);
    // Filter for markdown files and return
    return files.filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error('Error getting notes:', error);
    return []; // Return empty array on error
  }
});

// Handle open-note
ipcMain.handle('open-note', async (event, noteName) => {
  const notesDir = path.join(app.getPath('home'), '.debbynotes');
  const filePath = path.join(notesDir, noteName);
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error opening note ${noteName}:`, error);
    return null; // Return null on error
  }
});

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'src/assets/icons/debbynote.png'), // Use .png for cross-platform window icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false // Don't show until ready
  });

  // Load the app
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  try {
    if (process.platform === 'darwin') {
      app.dock.setIcon(path.join(__dirname, 'src/assets/icons/debbynote.icns'));
    } else {
      app.setAppUserModelId('com.debbynote.app');
    }
  } catch (error) {
    console.error('Error setting dock icon:', error);
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
