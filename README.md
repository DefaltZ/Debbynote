# 📝 DebbyNote

A beautiful, modern note-taking application built with Electron and React.

## Features

- ✨ **Modern UI**: Clean, responsive design with beautiful gradients and animations
- 📝 **Note Management**: Create, edit, and delete notes with ease
- 🔍 **Search**: Quickly find notes by title or content
- 💾 **Auto-save**: Notes are automatically saved to localStorage
- 📱 **Responsive**: Works great on different screen sizes
- ⚡ **Fast**: Built with modern web technologies for optimal performance

## Screenshots

The app features a clean, modern interface with:
- A sidebar for note creation and management
- A main editor area for writing and editing notes
- Search functionality to find notes quickly
- Beautiful gradients and smooth animations

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
├── src/                    # React source code
│   ├── App.js             # Main React component
│   ├── index.js           # React entry point
│   ├── index.html         # HTML template
│   └── styles.css         # CSS styles
├── dist/                  # Built files (generated)
├── main.js               # Electron main process
├── preload.js            # Electron preload script
├── webpack.config.js     # Webpack configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Available Scripts

- `npm start` - Start the Electron app
- `npm run dev` - Start development mode with hot reloading
- `npm run build` - Build the React app for production
- `npm run watch` - Build and watch for changes

## Technology Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **Webpack** - Module bundler
- **Babel** - JavaScript compiler
- **CSS3** - Styling with modern features

## Features in Detail

### Note Management
- Create new notes with a simple textarea
- Edit existing notes in real-time
- Delete notes with a single click
- Auto-save functionality prevents data loss

### Search
- Search through all notes by title or content
- Real-time filtering as you type
- Case-insensitive search

### User Interface
- Modern gradient backgrounds
- Smooth hover animations
- Responsive design for different screen sizes
- Clean typography and spacing

### Data Persistence
- Notes are saved to localStorage
- Data persists between app sessions
- No external database required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with Electron and React
- Icons from emoji
- Beautiful gradients and modern design patterns 