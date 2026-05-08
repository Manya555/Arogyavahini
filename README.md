# Arogyavahini - Emergency Medical Response System

A modern, self-contained React application for managing emergency medical responses and ambulance services.

## Overview

Arogyavahini is a fully open-source emergency response management system built with:
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Professional icon library
- **Framer Motion** - Smooth animations
- **Leaflet & React-Leaflet** - Interactive maps


The application requires no external platform dependencies and can be deployed on any standard Node.js hosting environment.

## Getting Started

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd arogyavahini
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local if you need optional features like Gemini API
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── pages/          # Page components
├── components/     # Reusable UI components
├── context/        # React context providers
├── App.tsx         # Main app component with routing
├── main.tsx        # Entry point
└── index.css       # Global styles

index.html          # HTML template
vite.config.ts      # Vite configuration
tsconfig.json       # TypeScript configuration
tailwind.config.ts  # Tailwind configuration
```

## Features

- **Ambulance Booking**: Request nearby ambulances with real-time ETA
- **Hospital Management**: Browse and view hospital details, capacity, and specializations
- **Admin Dashboard**: Monitor system status and manage resources
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Simulation**: Built-in simulation context for demo data

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here    # Optional: For AI features
VITE_PORT=3000                       # Development server port
VITE_APP_URL=http://localhost:3000  # Application base URL
```

### Vite Configuration

The `vite.config.ts` is standardized for universal deployment:
- HMR (Hot Module Replacement) is enabled for development
- Build output is optimized with terser minification
- Asset handling is configured for static deployment

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions for:
- Heroku
- Vercel
- Netlify
- AWS
- Docker
- Traditional Node.js servers

## Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run clean` - Remove dist directory
- `npm run lint` - Run TypeScript type checking

## Technology Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| UI Framework | React 19 |
| Build Tool | Vite 6 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Maps | Leaflet + React-Leaflet |
| Language | TypeScript |

## Development

### Adding Dependencies

```bash
npm install <package-name>
```

All dependencies are standard open-source libraries with no platform lock-in.

### Code Style

The project uses TypeScript for type safety. Run type checking:

```bash
npm run lint
```

## Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- All dependencies are open-source
- No platform-specific code or external service dependencies are added

## License

MIT

## Support

For issues, questions, or contributions, please open a GitHub issue or submit a pull request.
