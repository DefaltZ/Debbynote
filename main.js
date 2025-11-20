const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;
let guideWindow = null;

//create a menu template
const isMac = process.platform === 'darwin';
const template = [
  ...(isMac ? [{
    //debbynote app name menu
    label: app.name,
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'},
    ]
  }] : []),
  // file menu
  {
    label: 'File',
    submenu: [
      {role: 'close'},
      {role: 'quit'},
    ]
  },
  // edit menu
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ]
  },
  // view menu
  {
    label: 'View',
    submenu: [
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'toggleDevTools' },
      { role: 'forcereload' },
    ]
  },
  // window menu
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  // help menu
  {
    label: 'Help',
    submenu: [
      { role: 'about' },
      { label: 'Syntax guide', click: () => {
        createGuideWindow();
      }},
    ]
  }
]

// Initialize the menu
Menu.setApplicationMenu(Menu.buildFromTemplate(template));

// Handle save file
ipcMain.handle('save-file', async (event, { content, activeNote }) => {
  const notesDir = path.join(app.getPath('home'), '.debbynotes');

  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  const win = BrowserWindow.getFocusedWindow();
  const suggestedName = activeNote && activeNote !== 'untitled' ? activeNote : 'untitled.md';

  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: 'Save Note',
    defaultPath: path.join(notesDir, suggestedName.endsWith('.md') ? suggestedName : `${suggestedName}.md`),
    filters: [{ name: 'Markdown Files', extensions: ['md'] }],
    properties: ['createDirectory', 'showOverwriteConfirmation']
  });

  if (canceled || !filePath) {
    console.log('Save cancelled by user');
    return { success: false, canceled: true };
  }

  const finalPath = path.extname(filePath).toLowerCase() === '.md' ? filePath : `${filePath}.md`;

  try {
    await fs.promises.writeFile(finalPath, content, 'utf8');
    const fileName = path.basename(finalPath);
    console.log(`File saved successfully in npm console: ${finalPath}`);
    return { success: true, fileName };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
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

function createGuideWindow() {
  if (guideWindow) {
    guideWindow.focus();
    return;
  }

  guideWindow = new BrowserWindow({
    width: 800,
    height: 700,
    icon: path.join(__dirname, 'src/assets/icons/debbynote.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  guideWindow.setMenu(null);
  guideWindow.loadFile(path.join(__dirname, 'src/guideWindow.html'));
  
  guideWindow.on('closed', () => {
    guideWindow = null;
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
