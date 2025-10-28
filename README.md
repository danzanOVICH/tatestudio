# TateStudio - AI Tool Portal

A comprehensive portal for AI video generation and creative tools.

## Features

- 🎨 Image & Design Generation (Adobe Firefly, Midjourney)
- 🎬 Video Generation & Editing (Veo2, Veo3, Runway, Symphony)
- 🎵 Audio & Music Generation (SUNO AI, ElevenLabs)
- 🤖 AI Assistants (Google Gemini)

## Deployment

### Local Development
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

### Production Deployment

This site is configured for deployment on:
- **Netlify** (using netlify.toml)
- **Vercel** (using vercel.json)
- **GitHub Pages** (static files)

### Custom Domain Setup

To deploy at `tatestudio.ddam.ai`:

1. **DNS Configuration**: Point your domain to your hosting provider
2. **SSL Certificate**: Automatically handled by most providers
3. **Custom Domain**: Configure in your hosting dashboard

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
├── netlify.toml        # Netlify deployment config
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## Usage

Click any tool button to open the respective AI tool in a new tab. Use the search bar to quickly find specific tools.