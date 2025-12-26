# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.production` file in `client/` directory:

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_DEVELOPMENT=false
```

**Important:** 
- Never commit `.env` files to version control
- Use your hosting platform's environment variable settings
- Ensure `REACT_APP_DEVELOPMENT=false` in production

### 2. Build Optimization

```bash
# Create optimized production build
cd client
npm run build
```

The build folder contains optimized production files:
- Minified JavaScript and CSS
- Optimized images
- Code splitting
- Tree shaking

### 3. Server Configuration

#### Environment Variables (server/.env)

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-secure-jwt-secret
PORT=5000
```

#### Security Checklist

- [x] Helmet.js configured for security headers
- [x] CORS properly configured for production domains
- [x] Rate limiting enabled (100 requests per 15 minutes)
- [x] Body parser size limits (10mb)
- [x] JWT authentication for admin routes
- [x] Input validation on all routes
- [x] Error handling middleware

### 4. Database

- [x] Export production database: `npm run export-db`
- [x] Backup database regularly
- [x] Use MongoDB Atlas or secure MongoDB instance
- [x] Enable MongoDB authentication
- [x] Use connection string with credentials

### 5. File Storage

- [x] Ensure `server/public/images/` and `server/public/cv/` directories exist
- [x] Set proper file permissions
- [x] Consider using cloud storage (AWS S3, Cloudinary) for production
- [x] Implement file size limits on uploads

### 6. Performance Optimizations

#### Client-Side
- [x] Code splitting implemented (React Router)
- [x] Lazy loading for images (`loading="lazy"`)
- [x] React.memo for expensive components
- [x] Error boundaries for error handling
- [x] Optimized bundle size

#### Server-Side
- [x] Compression middleware (consider adding gzip)
- [x] Static file serving optimized
- [x] Database query optimization
- [x] Rate limiting to prevent abuse

### 7. SEO & Meta Tags

- [x] Meta tags in `index.html`
- [x] Open Graph tags for social sharing
- [x] Twitter Card tags
- [x] Proper page titles
- [x] Semantic HTML structure

### 8. Monitoring & Logging

**Recommended:**
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Set up uptime monitoring
- Log important events

**Current:**
- `console.error` for error logging (can be replaced with service)
- Error boundaries catch React errors
- API error handling in place

### 9. Security Headers

Already configured via Helmet.js:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content-Security-Policy (consider adding)

### 10. CORS Configuration

Ensure `CLIENT_URL` in server `.env` includes:
- Production frontend URL
- Any subdomains
- Protocol (https://)

Example:
```env
CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com
```

## Deployment Steps

### Frontend (Client)

1. **Build the application:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy build folder:**
   - Upload `build/` folder contents to your hosting
   - Configure server to serve `index.html` for all routes (SPA routing)

3. **Set environment variables** on hosting platform

### Backend (Server)

1. **Install dependencies:**
   ```bash
   cd server
   npm install --production
   ```

2. **Set environment variables** in `.env` file

3. **Start server:**
   ```bash
   npm start
   ```

4. **Use PM2 or similar for process management:**
   ```bash
   pm2 start src/index.js --name portfolio-api
   pm2 save
   pm2 startup
   ```

## Post-Deployment

### 1. Verify Functionality
- [ ] Test all API endpoints
- [ ] Test admin login
- [ ] Test file uploads
- [ ] Test contact form
- [ ] Test CV download
- [ ] Test on mobile devices

### 2. Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test page load times
- [ ] Verify image optimization

### 3. Security Testing
- [ ] Test rate limiting
- [ ] Verify CORS configuration
- [ ] Test authentication
- [ ] Check for exposed secrets

### 4. Monitoring Setup
- [ ] Set up error tracking
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Monitor API response times

## Production Optimizations to Consider

### 1. Image Optimization
- Implement WebP format with fallbacks
- Use responsive images with `srcset`
- Consider CDN for image delivery
- Compress images before upload

### 2. Caching Strategy
- Implement service worker for offline support
- Cache API responses where appropriate
- Set proper cache headers on static files
- Use CDN for static assets

### 3. Code Splitting
- Already implemented via React Router
- Consider route-based code splitting
- Lazy load admin dashboard (large component)

### 4. Bundle Analysis
```bash
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### 5. Database Indexing
- Ensure indexes on frequently queried fields
- Monitor slow queries
- Optimize database schema

## Environment-Specific Notes

### Development
- `REACT_APP_DEVELOPMENT=true` enables protection features
- Higher rate limits (1000 requests)
- More verbose error messages
- CORS allows all origins

### Production
- `REACT_APP_DEVELOPMENT=false` disables protection features
- Lower rate limits (100 requests)
- Minimal error exposure
- CORS restricted to allowed origins
- Error boundaries show user-friendly messages

## Troubleshooting

### Common Issues

1. **API calls failing:**
   - Check `REACT_APP_API_URL` is set correctly
   - Verify CORS configuration
   - Check network/firewall settings

2. **Images not loading:**
   - Verify image paths are correct
   - Check file permissions
   - Ensure images are uploaded to server

3. **Build fails:**
   - Check for console errors
   - Verify all dependencies installed
   - Check Node.js version compatibility

4. **Database connection issues:**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB is accessible
   - Verify network/firewall settings

## Additional Recommendations

1. **Use HTTPS** - Essential for production
2. **Set up SSL certificate** - Let's Encrypt (free)
3. **Enable compression** - Gzip/Brotli compression
4. **Use CDN** - For static assets and images
5. **Database backups** - Regular automated backups
6. **Monitoring** - Set up application monitoring
7. **Logging** - Centralized logging solution
8. **Analytics** - Google Analytics or similar

