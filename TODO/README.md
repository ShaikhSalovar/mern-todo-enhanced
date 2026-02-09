# MERN Todo App with Authentication

A full-stack Todo application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring complete user authentication, task management, and a modern dark-themed UI.

## Live Demo

- **Frontend**: [https://shaikhsalovar.github.io/mern-todo-enhanced](https://shaikhsalovar.github.io/mern-todo-enhanced)
- **Backend API**: [https://mern-todo-enhanced.onrender.com](https://mern-todo-enhanced.onrender.com)

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
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/ShaikhSalovar/mern-todo-app.git
cd mern-todo-app/TODO
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd todo_backend

# Install dependencies
npm install
```

Create a `.env` file in the `todo_backend` directory with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/TODO
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

> **Note**: For production, use a strong random string for `JWT_SECRET` and a MongoDB Atlas connection string for `MONGO_URI`.

Start the backend server:

```bash
npm start
# Server will run on http://localhost:5000
```

### Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend folder (from project root)
cd TODO/todo_frontend

# Install dependencies
npm install

# Start the development server
npm start
# App will open at http://localhost:3000
```

### Step 4: Verify Installation

1. Open your browser to `http://localhost:3000`
2. You should see the login page
3. Click "Create one" to register a new account
4. After registration, login and start adding todos

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

## Report Understanding (Code-Level)

This section explains the code flow for the dashboard statistics feature, showing how data flows from the backend to the frontend UI.

### Statistics Data Flow

#### 1. Backend: Statistics Calculation (`server.js`)

The backend calculates statistics using MongoDB aggregation queries:

```javascript
// server.js - GET /get endpoint
app.get('/get', auth, async (req, res) => {
    const filter = { userId: req.userId };

    // Parallel queries for performance
    const [todos, total, pending, inProgress, completed] = await Promise.all([
        TodoModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        TodoModel.countDocuments(filter),
        TodoModel.countDocuments({ ...filter, status: 'pending' }),
        TodoModel.countDocuments({ ...filter, status: 'in-progress' }),
        TodoModel.countDocuments({ ...filter, status: 'completed' })
    ]);

    res.json({
        todos,
        totalPages: Math.ceil(total / limitNum),
        stats: { total, pending, inProgress, completed }
    });
});
```

**Key Points:**
- Uses `Promise.all()` for parallel database queries (faster than sequential)
- Counts are filtered by `userId` to show only the logged-in user's data
- Returns `stats` object alongside paginated todos

#### 2. Frontend: Data Fetching (`Home.js`)

The Home page component fetches and manages statistics state:

```javascript
// Home.js - State and fetching
const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

const fetchTodos = async (statusFilter, pageNum, search = '') => {
    const data = await todoApi.getTodos(statusFilter, pageNum, limit, search);
    setTodos(data.todos);
    setTotalPages(data.totalPages);
    setStats(data.stats);  // Stats are extracted from API response
};

// Stats are passed to StatsBar component
<StatsBar stats={stats} />
```

#### 3. Frontend: Statistics Display (`StatsBar.js`)

The StatsBar component renders the statistics UI:

```javascript
// StatsBar.js - Rendering statistics
const StatsBar = ({ stats }) => {
    return (
        <div className='stats-container'>
            <div className='stat-item total'>
                <span className='stat-number'>{stats.total}</span>
                <span className='stat-label'>Total</span>
            </div>
            <div className='stat-item pending'>
                <span className='stat-number'>{stats.pending}</span>
                <span className='stat-label'>Pending</span>
            </div>
            <div className='stat-item in-progress'>
                <span className='stat-number'>{stats.inProgress}</span>
                <span className='stat-label'>In Progress</span>
            </div>
            <div className='stat-item completed'>
                <span className='stat-number'>{stats.completed}</span>
                <span className='stat-label'>Completed</span>
            </div>
        </div>
    );
};
```

### Data Flow Diagram

```
┌─────────────────┐    HTTP GET /get    ┌─────────────────┐
│   React App     │ ─────────────────►  │  Express API    │
│   (Home.js)     │                     │  (server.js)    │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         │                              ┌────────▼────────┐
         │                              │    MongoDB      │
         │                              │  countDocuments │
         │                              └────────┬────────┘
         │                                       │
         │    { stats: { total, pending, ... }}  │
         │ ◄─────────────────────────────────────┘
         │
┌────────▼────────┐
│   StatsBar      │
│   Component     │
│  (renders UI)   │
└─────────────────┘
```

## New Feature Documentation

*This section is reserved for documenting new features as they are added to the application.*

### Planned Features
- [ ] Due date for tasks
- [ ] Task categories/tags
- [ ] Email notifications
- [ ] Dark/Light theme toggle
- [ ] Export tasks to CSV
- [ ] Collaborative todos (shared lists)

### Recently Added Features

| Feature | Version | Description |
|---------|---------|-------------|
| JWT Authentication | v1.0 | Secure user authentication system |
| Task Statistics | v1.0 | Real-time dashboard showing task counts |
| Server-side Pagination | v1.0 | Efficient loading of large task lists |
| Search & Filter | v1.0 | Find tasks quickly by name or status |

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
│   │   ├── index.html           # HTML template with SPA redirect handler
│   │   └── 404.html             # GitHub Pages SPA redirect
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
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment
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

## Deployment

### GitHub Pages (Frontend)

The frontend is automatically deployed to GitHub Pages using GitHub Actions.

#### Automatic Deployment (Recommended)

1. **Push to main branch** - The deployment workflow triggers automatically:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

3. **Monitor deployment**:
   - Go to Actions tab to see workflow status
   - Frontend URL: `https://<username>.github.io/mern-todo-enhanced`

#### Manual Deployment

```bash
cd TODO/todo_frontend

# Build for production
npm run build

# Deploy using gh-pages (if configured)
npm run deploy
```

### Render (Backend)

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your GitHub repository**

3. **Configure the service**:
   - **Name**: `mern-todo-enhanced` (or your preferred name)
   - **Root Directory**: `TODO/todo_backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add environment variables**:
   | Variable | Value |
   |----------|-------|
   | `PORT` | `5000` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A strong random string (min 32 chars) |
   | `NODE_ENV` | `production` |

5. **Deploy** and note your backend URL (e.g., `https://mern-todo-enhanced.onrender.com`)

### MongoDB Atlas

1. **Create a free cluster** at [MongoDB Atlas](https://www.mongodb.com/atlas)

2. **Create a database user** with read/write permissions

3. **Get your connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/TODO?retryWrites=true&w=majority
   ```

4. **Whitelist IP addresses**:
   - For development: Your IP
   - For Render: `0.0.0.0/0` (allow all)

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

- GitHub: [@ShaikhSalovar](https://github.com/ShaikhSalovar)
- Email: salovarshaikh@gmail.com

## Acknowledgments

- React.js Documentation
- Express.js Documentation
- MongoDB Documentation
- JWT.io for JWT implementation guidance
