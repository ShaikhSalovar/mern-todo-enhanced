# MERN Todo App with Authentication

A full-stack Todo application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring complete user authentication, task management, and a modern dark-themed UI.

## Features

### Authentication System
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes
- Profile management
- Password change functionality

### Task Management
- Create, read, update, delete tasks
- Task status management (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Search functionality
- Filter by status
- Server-side pagination
- Task statistics dashboard

### User Experience
- Modern dark theme UI
- Responsive design
- Real-time updates
- Password strength indicator
- Form validation
- Loading states
- Error handling

## Technology Stack

### Frontend
- React.js 18
- React Router DOM v6
- Axios
- React Icons
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- dotenv
- cors

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-todo-app.git
cd mern-todo-app/TODO
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd todo_backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# - Set MONGO_URI to your MongoDB connection string
# - Set JWT_SECRET to a strong random string
```

**Backend .env Configuration:**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/TODO
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

```bash
# Start the backend server
npm start

# Server will run on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend folder
cd todo_frontend

# Install dependencies
npm install

# Create environment file (optional for local dev)
cp .env.example .env

# Start the frontend development server
npm start

# App will open at http://localhost:3000
```

## Usage Guide

### Registration
1. Navigate to the Register page (`/register`)
2. Enter your full name (minimum 3 characters)
3. Enter a valid email address
4. Create a password (minimum 8 characters)
5. Confirm your password
6. Click "Create Account"

### Login
1. Navigate to the Login page (`/login`)
2. Enter your registered email
3. Enter your password
4. Click "Login"
5. You'll be redirected to the Dashboard

### Dashboard
- **Create Task**: Enter task name, select priority and status, click "ADD"
- **Search**: Use the search bar to filter tasks
- **Filter**: Click filter buttons to view tasks by status
- **Edit Task**: Click the pencil icon to edit
- **Change Status**: Use the dropdown to change task status
- **Delete Task**: Click the trash icon to delete

### Profile Management
1. Click on your avatar or "Profile" in the navbar
2. Update your personal information
3. Change your password if needed
4. Click "Update Profile" to save changes

## Project Structure

```
TODO/
├── todo_backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── Todo.js              # Todo schema
│   │   └── User.js              # User schema with bcrypt
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── server.js                # Express server entry point
│
├── todo_frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateTodo/
│   │   │   ├── FilterButtons/
│   │   │   ├── Navbar/
│   │   │   ├── Pagination/
│   │   │   ├── ProtectedRoute/
│   │   │   ├── SearchBar/
│   │   │   ├── StatsBar/
│   │   │   ├── TodoItem/
│   │   │   └── TodoList/
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication state management
│   │   ├── pages/
│   │   │   ├── Home.js          # Dashboard page
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Profile.js       # Profile page
│   │   │   └── Register.js      # Registration page
│   │   ├── services/
│   │   │   ├── authApi.js       # Auth API calls
│   │   │   └── todoApi.js       # Todo API calls
│   │   ├── styles/
│   │   │   ├── Auth.css         # Auth pages styling
│   │   │   └── Profile.css      # Profile page styling
│   │   ├── App.js               # Main app with routing
│   │   └── App.css              # Global styles
│   └── package.json
│
├── .gitignore
├── README.md
├── API_DOCUMENTATION.md
└── DEPLOYMENT.md
```

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

### Quick Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/profile | Get user profile | Yes |
| PUT | /api/auth/profile | Update profile | Yes |
| PUT | /api/auth/change-password | Change password | Yes |
| POST | /add | Create todo | Yes |
| GET | /get | Get todos | Yes |
| PUT | /status/:id | Update status | Yes |
| PUT | /update/:id | Update todo | Yes |
| DELETE | /delete/:id | Delete todo | Yes |

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication with 7-day expiry
- **Protected Routes**: Backend routes verify JWT tokens
- **User Isolation**: Users can only access their own todos
- **Input Validation**: Both frontend and backend validation
- **Environment Variables**: Sensitive data stored in .env files

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Register Page
![Register Page](screenshots/register.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Profile Page
![Profile Page](screenshots/profile.png)

*Note: Add your screenshots to a `screenshots` folder*

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Set build command: `cd todo_frontend && npm run build`
3. Set output directory: `todo_frontend/build`
4. Add environment variable: `REACT_APP_API_URL`

**Backend (Render)**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory: `TODO/todo_backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Salovar Shaikh**

- GitHub: [@shaikhsalovar](https://github.com/shaikhsalovar)
- Email: salovarshaikh@gmail.com

## Acknowledgments

- React.js Documentation
- Express.js Documentation
- MongoDB Documentation
- JWT.io for JWT implementation guidance
