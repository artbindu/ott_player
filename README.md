# OTT Media Player

A custom media player built with vanilla HTML, CSS, and JavaScript. Features a modern dark theme with comprehensive media controls including playback speed, volume control, fullscreen mode, and picture-in-picture support.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ott_player

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm start
# or
npm run build:dev
```

This will start a local server at `http://localhost:54321`

## 🏗️ Build System

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm run build:dev` | Start development server |
| `npm run build:prod` | Build and serve production version |
| `npm run clean` | Remove build directory |
| `npm test` | Run tests (placeholder) |

### Build Process

The build process includes:
- ✅ HTML file copying
- ✅ CSS minification (clean-css-cli)
- ✅ JavaScript minification (uglify-js)
- ✅ Asset optimization
- ✅ Favicon and sample video copying
- ✅ Build validation

### Manual Build
```bash
# Create production build
npm run build

# Build output will be in ./dist/
ls -la dist/
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Automatic Deployment**
   - Push to `main` or `master` branch
   - GitHub Actions will automatically build and deploy
   - Site will be available at: `https://yourusername.github.io/repository-name/`

### Netlify

1. **Set up Netlify**
   - Create Netlify account
   - Install Netlify CLI: `npm install -g netlify-cli`

2. **Configure Secrets**
   - Go to repository Settings → Secrets and variables → Actions
   - Add `NETLIFY_AUTH_TOKEN` (from Netlify dashboard)
   - Add `NETLIFY_SITE_ID` (from Netlify site settings)

3. **Deploy**
   - Push to `main` or `master` branch
   - GitHub Actions will automatically deploy to Netlify

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy using various platforms:
# Surge.sh
npm install -g surge
surge dist/ your-domain.surge.sh

# Vercel
npm install -g vercel
vercel --prod

# Or upload the 'dist' folder to any web server
```

## 📁 Project Structure

```
ott_player/
├── .github/workflows/
│   └── ci-cd.yml          # GitHub Actions workflow
├── data/
│   └── sample.mp4         # Sample video file
├── script/
│   └── media.js           # Media player JavaScript
├── style/
│   └── media.css          # Media player styles
├── dist/                  # Build output (generated)
├── build.js               # Build script
├── deploy-config.json     # Deployment configurations
├── package.json           # Project dependencies and scripts
├── index.html             # Main HTML file
└── README.md              # This file
```

## 🎮 Features

- **Modern UI**: Dark theme with gradient header
- **File Upload**: Support for local video files
- **URL Streaming**: Play videos from web URLs
- **Playback Controls**:
  - Play/Pause
  - Skip forward/backward
  - Volume control
  - Playback speed adjustment
  - Fullscreen mode
  - Picture-in-Picture mode
- **Video Effects**:
  - Cinema mode
  - Vivid mode
  - Black & White
  - Night mode
- **Trim Feature**: Select and play specific video segments
- **Auto-loop**: Loop selected segments
- **Responsive Design**: Works on desktop and mobile

## 🔧 Configuration

### Video Sources
- **Local Files**: Use the file input to select local video files
- **Web URLs**: Paste video URLs in the URL input field
- **Sample Video**: Default sample video is included in `data/sample.mp4`

### Customization
- **Colors**: Modify CSS custom properties in `style/media.css`
- **Controls**: Add/remove controls in `index.html`
- **Functionality**: Extend features in `script/media.js`

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clean build directory
npm run clean
npm run build
```

### Deployment Issues
- Ensure all files are committed to git
- Check GitHub Actions logs for errors
- Verify deployment secrets are correctly set

### Video Playback Issues
- Check browser console for errors
- Ensure video format is supported (MP4 recommended)
- Check CORS settings for external URLs

## 📄 License

ISC License - see LICENSE file for details.

## 👤 Author

**Biswasindhu Mandal**
- GitHub: [@artbindu](https://github.com/artbindu)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test the build: `npm run build`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review GitHub Actions logs for deployment issues
