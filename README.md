# Portfolio Website - MERN Stack

A clean, responsive, and high-performance portfolio website built with the MERN stack (MongoDB, Express, React, Node.js). This project features a modern UI/UX design with an admin dashboard for managing portfolio projects and contact messages.

## 🚀 Features

### Frontend
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional design with smooth animations using Framer Motion
- **Components**:
  - Header with navigation
  - Hero section with introduction
  - About section with skill progress bars
  - Services section with interactive cards
  - Portfolio section with filterable project grid
  - Contact form
  - Footer with social links

### Backend
- **RESTful API**: Complete API for projects, messages, and admin authentication
- **Security**: JWT authentication, bcrypt password hashing, Helmet, CORS, rate limiting
- **Database**: MongoDB with Mongoose ODM
- **Admin Dashboard**: Protected admin panel for managing projects and viewing messages

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Framer Motion
- Axios
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- Nodemailer (optional, for email notifications)
- Express Validator
- Helmet
- CORS
- Express Rate Limit

## 📁 Project Structure

```
manoj_portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── index.js        # Entry point
│   ├── public/             # Static files
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app configuration
│   │   └── index.js        # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd manoj_portfolio
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env.example` file to `.env` in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```

   Then edit the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/portfolio
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/portfolio

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d

   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@gmail.com

   # CORS Configuration
   CLIENT_URL=http://localhost:3000
   ```

4. **Set up MongoDB**

   - For local MongoDB: Make sure MongoDB is running on your machine
   - For MongoDB Atlas: Update the `MONGODB_URI` in `.env` with your Atlas connection string

5. **Create admin user**

   **Option 1: Using the create-admin script (Recommended)**
   ```bash
   cd server
   npm run create-admin [username] [email] [password]
   # Example: npm run create-admin admin admin@example.com mypassword123
   ```

   **Option 2: Using the API**
   After starting the server, you can create an admin user by making a POST request to `/api/admin/register`:
   ```bash
   curl -X POST http://localhost:5000/api/admin/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@example.com",
       "password": "your_secure_password"
     }'
   ```

### Running the Application

#### Development Mode

**Option 1: Run client and server separately**

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

**Option 2: Run both concurrently (from root)**

```bash
npm run dev
```

#### Production Mode

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:3000/admin/login

## 📚 API Endpoints

### Public Endpoints

- `GET /api/projects` - Get all projects (optional query: `?category=UI/UX`)
- `GET /api/projects/:id` - Get single project
- `POST /api/contact` - Send contact message

### Protected Endpoints (Admin Only)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin user
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/contact` - Get all messages
- `PUT /api/contact/:id/read` - Mark message as read
- `DELETE /api/contact/:id` - Delete message

## 🔐 Admin Dashboard

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Manage projects:
   - Add new projects
   - Edit existing projects
   - Delete projects
4. View and manage contact messages:
   - View all messages
   - Mark messages as read
   - Delete messages

## 🎨 Customization

### Colors

Edit `client/tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      accent: {
        // Your accent colors
      }
    }
  }
}
```

### Content

- Update component content in `client/src/components/`
- Modify skill progress bars in `About.jsx`
- Update services in `Services.jsx`
- Add/remove social media links in `Hero.jsx` and `Footer.jsx`

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `build` folder to your hosting platform

3. Set environment variables:
   - `REACT_APP_API_URL`: Your backend API URL

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables in your hosting platform
2. Update `CLIENT_URL` to your frontend URL
3. Deploy the server

### Database

- Use MongoDB Atlas for cloud database
- Update `MONGODB_URI` in production environment variables

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using the MERN stack
