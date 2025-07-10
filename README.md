<div align="center">
  <img width=200 src="https://github.com/user-attachments/assets/6b723571-28f6-434c-9149-18b70cddf9b7">
</div>
<div align="center">
  <h1>Debbynote</h1>
</div>

<div align="center">
  Debbynote is a modern yet simple extended markdown editor to assist debators and adjudicators with notetaking for Asian, British Parliamentary and Conventional debates. <b>A Text editor built for debators by debators</b>✨
</div>

## 🔍 Features

- ✨ **Modern but simple UI**: Clean dead simple UI and design to keep distractions low
- 🚀 **Better notetaking**: Extended markdown syntax without the need to leave your keyboard to help you take speedy notes
- 📝 **Note Management**: Create, edit, and manage notes with ease
- 🔐 **Dark theme**: Great Dark theme colors, future suite of custom themes will be added
- 📖 **split editor**: To let you have better control of your syntax and your preview, with resizable preview window 

<br>

## ❓ How to use the extended syntax:

There is seperate extended markdown syntax tokens for Asian and British Parliamentary Debate highlightings as well general debate highlighting tokens, all of which are at maximum no longer than two characters followed by a prefix "!" to facilitate speedy notetaking.

### General tokens
- type `!a` before a line to **highlight it in red**, meant for **Argument highlighting**
- type `!r` before a line to **highlight it in green** meant for **rebuttal highlighting**
- type `!wb` before a line to **highlight it in blue**, meant for highlighting **worldbuilding constructives**
- type `!info` before a line to **highlight it in yellow**, meant to highlight additional important information in a debate

Debate format specific tokens are not prefixes before a sentence, but rather start a colored block container for the specific speaker position, the best practice is to newline after typing the Format specific token (does not apply to genral tokens) and take further notes, as shown in [screenshots](screenshots)

### Asian Parliamentary debate tokens:
- type `!pm` to create a block for Prime Minister
- type `!lo` to create a block for the Leader of Opposition 
- type `!dpm` to create a block for the Deputy Prime Minister
- type `!dlo` to create a block for the Deputy Leader of Opposition
- type `!gw` to create a block for the Government whip
- type `!ow` to create a block for the Opposition whip

## British Parliamentary debate tokens:
- type `!og1` to create a block for the Opening Government 1st speaker (Prime Minister)
- type `!og2` to create a block for the Opening Government 2nd speaker (Deputy Prime Minister)
- type `!oo1` to create a block for the Opening Opposition 1st speaker (Leader of Opposition)
- type `!oo2` to create a block for the Oppening Opposition 2nd speaker (Deputy Leader of Opposition)
- type `!cg1` to create a block for the Closing Government 1st speaker (Member of Government)
- type `!cg2` to create a block for the Closing Government 2nd speaker (Government whip)
- type `!co1` to create a block for the Closing Opposition 1st speaker (Member of Closing)
- type `!co2` to create a block for the Closing Opposition 2nd speaker (Opp whip)

## 📸 Screenshots

### White mode
<img width="1000" alt="SCR-20250710-dmxy" src="https://github.com/user-attachments/assets/065c57af-424b-4183-b4f0-fb0b3dd67f36" />

### Dark mode
<img width="1351" alt="SCR-20250710-dobq" src="https://github.com/user-attachments/assets/cdfef1e3-a1ff-4d87-860d-e0a6d5d640b8" />

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd debbynote
```

2. Install dependencies:
```bash
npm install
```

3. Build the React app:
```bash
npm run build
```

4. Start the Electron app:
```bash
npm start
```

### Development

For development with hot reloading:

```bash
npm run dev
```

This will start both the Electron app and webpack in watch mode.

## Project Structure

```
debbynote/
├── LICENSE
├── main.js                         #main entry file for the electron.js app
├── package-lock.json              
├── package.json                    #contains all the installed libraries and npm scripts
├── preload.js                      #exposes selected Node/electron APIs to the main renderer process for security between backend and frontend
├── README.md                       #this file
├── src
│   ├── App.js                      #contains state management and file operations logic, keybinds and component structure
│   ├── assets                      #assets folder
│   │   └── icons
│   │       ├── debbynote.icns
│   │       └── debbynote.png
│   ├── components                  
│   │   ├── Sidebar.js              #react component file for the sidebar
│   │   └── Toolbar.js              #react component file for the toolbar
│   ├── guideWindow.html            #html file for "Syntax guide" in the help menu option
│   ├── index.html                  #root index.html file
│   ├── index.js                    #root react.js file that renders the <App> component
│   ├── MarkdownEditor.js           #contains UI logic, text input, imports editor logic from utils, markdown to html rendering logic etc.
│   ├── styles.css                  #root css file, also the global css file
│   └── utils
│       ├── bulletHandler.js        #auto-bulleting logic
│       ├── formatHandler.js        #how the toolbar buttons will work
│       ├── markdownParser.js       #all the extended markdown tokens logic is here
│       └── saveHandler.js          #file save and open handling
└── webpack.config.js
```

## Technology Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **Webpack** - Module bundler
- **Babel** - JavaScript compiler
- **CSS3** - Styling with modern features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under MIT.
