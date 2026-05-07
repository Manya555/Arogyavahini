# Quick Start Guide - Arogyavahini

Get Arogyavahini running in 5 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

## Local Development

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd arogyavahini

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Make Changes

Edit files in `src/` folder. The browser will automatically refresh as you code (HMR - Hot Module Replacement).

## Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder contains all static files ready for deployment.

## Project Structure

```
src/
├── pages/              # Page components
├── components/         # Reusable components
├── context/            # React context (state management)
├── App.tsx            # Main app with routing
├── main.tsx           # Entry point
└── index.css          # Global styles

index.html             # HTML template
vite.config.ts         # Build configuration
tailwind.config.ts     # Tailwind CSS configuration
package.json           # Dependencies
```

## Key Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Check TypeScript types
npm run clean      # Remove build artifacts
```

## Features

- Ambulance booking with real-time ETA
- Hospital listings with capacity information
- Admin dashboard for system monitoring
- Responsive mobile design
- Real-time location tracking simulation

## Configuration

### Environment Variables

Create `.env.local`:
```env
GEMINI_API_KEY=your_optional_api_key
VITE_PORT=3000
VITE_APP_URL=http://localhost:3000
```

Optional: Get GEMINI_API_KEY from https://ai.google.dev

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on deploying to:
- Vercel, Netlify, Heroku
- AWS, Google Cloud, DigitalOcean
- Docker, traditional servers
- Any Node.js hosting provider

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

### Clear Cache and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run lint  # Check for type errors
```

### Build Issues
```bash
npm run clean  # Remove dist folder
npm run build  # Rebuild
```

## Technologies

- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Leaflet** - Maps

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Need Help?

- Read [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Check source code in `src/` folder
- Review [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for technical details

## Next Steps

1. ✓ Run `npm install`
2. ✓ Run `npm run dev`
3. ✓ Open http://localhost:3000
4. ✓ Start developing!

Happy coding!
