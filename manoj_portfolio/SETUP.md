# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## Quick Start

1. **Install all dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Create admin user**
   ```bash
   cd server
   npm run create-admin admin admin@example.com yourpassword
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:3000/admin/login

## Default Admin Credentials
After running the create-admin script:
- Username: admin (or your custom username)
- Email: admin@example.com (or your custom email)
- Password: yourpassword (or your custom password)

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running locally, or
- Update MONGODB_URI in server/.env with your MongoDB Atlas connection string

### Port Already in Use
- Change PORT in server/.env to a different port (e.g., 5001)
- Update CLIENT_URL accordingly

### CORS Errors
- Make sure CLIENT_URL in server/.env matches your frontend URL
- Default: http://localhost:3000

## Next Steps
1. Add your portfolio projects via the admin dashboard
2. Customize the content in client/src/components/
3. Update colors in client/tailwind.config.js
4. Add your social media links in Header.jsx and Footer.jsx

