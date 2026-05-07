# Arogyavahini - Project Index

Welcome to Arogyavahini, a fully self-contained emergency medical response system built with modern web technologies.

## Where to Start?

Choose based on your needs:

### I Want to Start Coding Immediately
**Read:** [QUICKSTART.md](./QUICKSTART.md)
- 5-minute setup guide
- Essential commands
- Basic troubleshooting
- Get running in minutes

### I Want to Understand the Project
**Read:** [README.md](./README.md)
- Project overview and features
- Complete setup instructions
- Technology stack details
- Available scripts and commands
- Development workflow
- Contribution guidelines

### I Want to Deploy the Application
**Read:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- Step-by-step deployment guides for 9+ platforms
- Platform-specific configuration
- Environment variable setup
- Docker containerization
- Traditional server setup
- Troubleshooting guide
- Best practices

### I Want Technical Details
**Read:** [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)
- Complete refactoring documentation
- Architecture and design overview
- All changes made
- Validation and testing results
- Backward compatibility notes
- Benefits and rationale

## Project Structure

```
arogyavahini/
├── src/
│   ├── pages/                  # Page components
│   │   ├── LandingPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── HospitalListingsPage.tsx
│   │   ├── HospitalDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── DriverDashboard.tsx
│   │   ├── TrackingPage.tsx
│   │   └── LoginPages.tsx
│   ├── components/             # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── SimulatedGridMap.tsx
│   ├── context/                # React context (state management)
│   │   ├── SimulationContext.tsx
│   │   └── UIContext.tsx
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.ts             # Vite build configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── package.json               # Dependencies and scripts
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Multi-platform deployment guide
├── QUICKSTART.md              # Quick start guide
├── REFACTORING_SUMMARY.md     # Technical refactoring details
└── PROJECT_INDEX.md           # This file
```

## Key Features

- **Ambulance Booking**: Request emergency ambulances with real-time ETA and distance calculation
- **Hospital Network**: Browse hospitals with capacity, specializations, and emergency readiness
- **Driver Dashboard**: Manage ambulance operations and route optimization
- **Admin Portal**: System status monitoring and resource management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Simulation**: Built-in demo data for testing without external APIs

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 6 |
| **Language** | TypeScript 5.8 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Maps** | Leaflet + React-Leaflet |
| **Runtime** | Node.js 18+ |

## Quick Commands

```bash
# Development
npm install              # Install dependencies
npm run dev            # Start dev server (http://localhost:3000)

# Production
npm run build          # Build for production
npm run preview        # Preview production build locally

# Maintenance
npm run lint           # Check TypeScript types
npm run clean          # Remove build artifacts
```

## File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build tool configuration |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `package.json` | Dependencies, scripts, and metadata |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore patterns |
| `index.html` | HTML entry point |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `QUICKSTART.md` | 5-minute setup guide |
| `DEPLOYMENT.md` | Multi-platform deployment guide |
| `REFACTORING_SUMMARY.md` | Technical implementation details |
| `PROJECT_INDEX.md` | This file - navigation and overview |

### Source Code

| Folder | Purpose |
|--------|---------|
| `src/pages/` | Full page components |
| `src/components/` | Reusable UI components |
| `src/context/` | React context providers for state management |
| `src/index.css` | Global styles and CSS variables |
| `src/main.tsx` | Application entry point |
| `src/App.tsx` | Root component with routing |

## Getting Started

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd arogyavahini
npm install
```

### Step 2: Start Development
```bash
npm run dev
# Open http://localhost:3000
```

### Step 3: Make Changes
Edit files in `src/` and see changes instantly with HMR.

### Step 4: Build for Production
```bash
npm run build
# Deploy dist/ folder to hosting provider
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting options.

## Development Workflow

1. **Code**: Edit TypeScript/React files in `src/`
2. **Test**: Use npm run dev to test locally
3. **Build**: Run npm run build to create production bundle
4. **Deploy**: Upload dist/ folder to hosting
5. **Monitor**: Check application in production

## Platform Deployment Options

The application can be deployed to:

- **Cloud Platforms**: Vercel, Netlify, Heroku, AWS, Google Cloud, DigitalOcean, Railway, Render
- **Containers**: Docker, Kubernetes, OpenShift
- **Static Hosting**: AWS S3 + CloudFront, Cloudflare Pages, Bunny CDN
- **Servers**: Traditional Node.js, Nginx, Apache, IIS
- **Serverless**: AWS Lambda, Google Cloud Functions, Azure Functions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for each platform.

## Documentation Guide

### For Users
Start with [README.md](./README.md) for general information and [QUICKSTART.md](./QUICKSTART.md) to get running.

### For Developers
Check [README.md](./README.md) for setup and [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for technical details.

### For DevOps/Deployment
Use [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific deployment instructions.

### For Architects
Review [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for architecture decisions and [README.md](./README.md) for technology choices.

## Key Highlights

✓ **Platform Independent** - No vendor lock-in, deploy anywhere
✓ **Open Source** - Uses only standard, community-supported libraries
✓ **Self-Contained** - Single Page Application (SPA), no backend required
✓ **Type Safe** - Full TypeScript support throughout
✓ **Modern Stack** - Latest versions of React, Vite, and Tailwind CSS
✓ **Production Ready** - Fully tested and optimized
✓ **Well Documented** - Comprehensive guides for all scenarios
✓ **Responsive Design** - Works on all devices and screen sizes

## Environment Setup

Optional environment variables in `.env.local`:

```env
GEMINI_API_KEY=your_api_key          # Optional: For AI features
VITE_PORT=3000                       # Development port
VITE_APP_URL=http://localhost:3000  # Application URL
```

For more details, see `.env.example` and [QUICKSTART.md](./QUICKSTART.md).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

Production build stats:
- **Total Bundle**: 646.48 KB uncompressed (193.61 KB gzipped)
- **CSS**: 94.02 KB uncompressed (18.83 KB gzipped)
- **HTML**: 0.43 KB uncompressed (0.29 KB gzipped)

## Troubleshooting

### Common Issues

**Port 3000 is already in use:**
```bash
npm run dev -- --port 3001
```

**Module not found errors:**
```bash
npm install
npm run lint
```

**Build fails:**
```bash
npm run clean
npm install
npm run build
```

For more help, see [QUICKSTART.md](./QUICKSTART.md) or platform-specific sections in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Next Steps

1. **Understand**: Read [README.md](./README.md)
2. **Set Up**: Follow [QUICKSTART.md](./QUICKSTART.md)
3. **Develop**: Make changes in `src/` with `npm run dev`
4. **Deploy**: Use [DEPLOYMENT.md](./DEPLOYMENT.md) for your platform
5. **Monitor**: Track application performance in production

## Support & Resources

- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org

## License

MIT License - See LICENSE file for details

---

**Last Updated**: May 7, 2024
**Version**: 1.0.0
**Status**: Production Ready

Start with [QUICKSTART.md](./QUICKSTART.md) to begin!
