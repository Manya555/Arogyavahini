# Deployment Guide - Arogyavahini

This guide covers deploying the Arogyavahini application to various hosting platforms and environments.

## Table of Contents

1. [General Requirements](#general-requirements)
2. [Heroku](#heroku)
3. [Vercel](#vercel)
4. [Netlify](#netlify)
5. [AWS](#aws-elastic-beanstalk)
6. [Google Cloud](#google-cloud-app-engine)
7. [DigitalOcean App Platform](#digitalocean-app-platform)
8. [Docker](#docker)
9. [Traditional Node.js Server](#traditional-nodejs-server)
10. [Environment Variables](#environment-variables-across-platforms)

---

## General Requirements

All deployments require:
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (or yarn/pnpm)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Start Command**: `npm run preview` or serve with a static file server

The application is a self-contained SPA (Single Page Application) - no backend server is required.

---

## Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Create a Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables** (if needed):
   ```bash
   heroku config:set GEMINI_API_KEY=your_key_here
   heroku config:set VITE_APP_URL=https://your-app-name.herokuapp.com
   ```

3. **Create Procfile**:
   ```bash
   echo "web: npm run preview -- --host 0.0.0.0 --port \$PORT" > Procfile
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

### Procfile (Alternative - Using Express Server)

For better control, create a simple Node.js server:

Create `server.js`:
```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Update `Procfile`:
```
web: npm run build && node server.js
```

---

## Vercel

### Prerequisites
- Vercel account
- Vercel CLI or GitHub connected

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to connect your project. Vercel automatically detects:
- Build command: `npm run build`
- Output directory: `dist`

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Vercel auto-detects build settings
4. Set environment variables in Vercel dashboard
5. Deploy

### vercel.json Configuration (Optional)

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key"
  },
  "routes": [
    {
      "src": "^/(?!api/).*",
      "dest": "/index.html"
    }
  ]
}
```

---

## Netlify

### Prerequisites
- Netlify account
- Netlify CLI (optional)

### Option 1: Using Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy
```

### Option 2: GitHub Integration

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in dashboard
5. Deploy

### netlify.toml Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## AWS Elastic Beanstalk

### Prerequisites
- AWS account
- AWS EB CLI installed
- IAM permissions

### Steps

1. **Initialize Elastic Beanstalk**:
   ```bash
   eb init -p node.js-18 arogyavahini-app
   ```

2. **Create environment**:
   ```bash
   eb create production
   ```

3. **Set environment variables**:
   ```bash
   eb setenv GEMINI_API_KEY=your_key_here
   eb setenv VITE_APP_URL=https://your-app-domain.elasticbeanstalk.com
   ```

4. **Deploy**:
   ```bash
   eb deploy
   ```

### .ebignore (Optional)

Create `.ebignore` file to exclude files from deployment:
```
node_modules
.git
.env
.env.local
```

---

## Google Cloud App Engine

### Prerequisites
- Google Cloud account
- Google Cloud CLI

### Steps

1. **Initialize App Engine**:
   ```bash
   gcloud app create
   ```

2. **Create app.yaml**:
   ```yaml
   runtime: nodejs18
   
   env: standard
   
   handlers:
   - url: /.*
     static_files: dist/index.html
     upload: dist/index.html
   - url: /(.*)
     static_files: dist/\1
     upload: dist/(.*)
   
   env_variables:
     VITE_APP_URL: "https://your-app-id.appspot.com"
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   gcloud app deploy
   ```

---

## DigitalOcean App Platform

### Prerequisites
- DigitalOcean account

### Steps via Dashboard

1. Create new App
2. Connect GitHub repository
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Configure environment variables
6. Deploy

### Manual Deployment (doctl CLI)

```bash
doctl apps create --spec app.yaml
```

Create `app.yaml`:
```yaml
name: arogyavahini
services:
- name: web
  source_dir: /
  http_port: 3000
  build_command: npm run build
  source:
    type: github
    repo: your-username/arogyavahini
```

---

## Docker

### Dockerfile

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose (With Environment Variables)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - VITE_APP_URL=${VITE_APP_URL}
    env_file:
      - .env.local
```

### Building and Running

```bash
# Build image
docker build -t arogyavahini .

# Run container
docker run -p 3000:3000 arogyavahini

# Or with Docker Compose
docker-compose up
```

### Pushing to Container Registry

**Docker Hub**:
```bash
docker tag arogyavahini your-username/arogyavahini
docker push your-username/arogyavahini
```

**AWS ECR**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker tag arogyavahini your-account.dkr.ecr.us-east-1.amazonaws.com/arogyavahini
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/arogyavahini
```

---

## Traditional Node.js Server

For Ubuntu/CentOS servers with Node.js installed:

### Using PM2 Process Manager

1. **Install PM2**:
   ```bash
   sudo npm install -g pm2
   ```

2. **Build application**:
   ```bash
   npm run build
   ```

3. **Create ecosystem.config.js**:
   ```javascript
   module.exports = {
     apps: [{
       name: 'arogyavahini',
       script: './server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
         VITE_APP_URL: 'https://your-domain.com'
       }
     }]
   };
   ```

4. **Create server.js** (if not exists):
   ```javascript
   import express from 'express';
   import path from 'path';
   import { fileURLToPath } from 'url';

   const __dirname = path.dirname(fileURLToPath(import.meta.url));
   const app = express();

   app.use(express.static(path.join(__dirname, 'dist')));
   
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

5. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.js --name arogyavahini
   pm2 startup
   pm2 save
   ```

### Using Nginx Reverse Proxy

1. **Build app**:
   ```bash
   npm run build
   ```

2. **Start Node server** on port 3000

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable SSL** (Recommended):
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment Variables Across Platforms

### Setting Environment Variables

**Heroku**:
```bash
heroku config:set KEY=value
```

**Vercel**:
Dashboard → Settings → Environment Variables

**Netlify**:
Dashboard → Site Settings → Build & Deploy → Environment

**AWS EB**:
```bash
eb setenv KEY=value
```

**Docker**:
```bash
docker run -e KEY=value image-name
```

**Traditional Server**:
Create `.env` file or set in PM2 config

### Essential Variables

```env
GEMINI_API_KEY=your_gemini_api_key          # Optional: For AI features
VITE_APP_URL=https://your-app-domain.com    # Your app's public URL
NODE_ENV=production                          # Set to production
```

---

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` (need 18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check disk space and build logs

### Routing Issues

- Ensure SPA fallback is configured (all routes → index.html)
- Check web server configuration for rewrites/redirects

### Performance Issues

- Verify build output size: `npm run build` and check `dist/` size
- Enable gzip compression on server
- Use CDN for static assets
- Check for large dependencies using `npm ls --depth=0`

### Environment Variables Not Loading

- Verify variable names match exactly
- Check .env file permissions
- Confirm variables are exported to child processes
- Restart application after changing variables

---

## Best Practices

1. **Always use production builds**: `npm run build`
2. **Set NODE_ENV=production**: Improves performance
3. **Use environment variables**: Never commit secrets
4. **Enable HTTPS/SSL**: Always use HTTPS in production
5. **Monitor application**: Set up logging and error tracking
6. **Regular backups**: Backup database if using one
7. **Keep dependencies updated**: Run `npm audit` regularly

---

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/docs/start/deployment)
- [Node.js Hosting Comparison](https://nodejs.org/en/docs/guides/nodejs-web-application-security/)

For platform-specific issues, refer to official documentation or contact platform support.
