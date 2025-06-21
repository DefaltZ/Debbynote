const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

// Handle save file
ipcMain.handle('save-file', async (event, content) => {
  const win = BrowserWindow.getFocusedWindow();
  const {filePath, canceled} = await dialog.showSaveDialog(win, {
    title: 'Save Markdown File',
    defaultPath: path.join(process.env.HOME || process.env.USERPROFILE, 'debbynotes', 'untitled.md'),
    filters: [
      { name: 'Markdown Files', extensions: ['md'] }
    ],
    properties: ['createDirectory']
  });

  if (canceled || !filePath) return false;
  
  try {
    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write the file
    await fs.promises.writeFile(filePath, content, 'utf8');
    console.log('File saved successfully:', filePath);
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
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
