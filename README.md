# SentinelX - Lead Distribution & Team Collaboration Platform

A multi-role SaaS platform for intelligent lead routing and sales team management.

## Features

- **Role-Based Dashboards**: Admin, Warmer, and Closer views
- **AI Lead Routing**: Intelligent assignment based on tier, score, and team performance
- **Real-Time Updates**: Live activity tracking and notifications
- **Performance Analytics**: Comprehensive metrics and leaderboards
- **Task Management**: Organized workflow for team collaboration
- **Integration Ready**: API endpoints for CRM and automation tools

##  Project Structure..

```
sentinelx/
├── backend/          # Node.js + Express + MongoDB
├── frontend/         # React + Tailwind CSS
└── README.md
```

##  Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- Tailwind CSS
- Recharts for analytics
- Lucide React for icons
- Axios for API calls

##  Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sentinelx
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

##  Default Login Credentials

After running the seed script, use these credentials:

**Admin:**
- Email: admin@sentinelx.com
- Password: admin123

**Warmer:**
- Email: maya@sentinelx.com
- Password: warmer123

**Closer:**
- Email: ivy@sentinelx.com
- Password: closer123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Leads
- `GET /api/leads` - Get all leads (with filters)
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/assign` - Auto-assign leads

### Users (Team Management)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Activities
- `GET /api/activities` - Get activity log
- `POST /api/activities` - Create activity

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/performance` - Performance metrics
- `GET /api/analytics/leaderboard` - Top performers

##  Role Permissions

### Admin
- Full access to all features
- Manage team members
- Configure AI routing
- View all analytics
- Manage integrations

### Warmer
- View assigned leads
- Send messages
- Mark leads as hot/warm/cold
- Schedule closer calls
- View personal performance

### Closer
- View scheduled calls
- Manage pipeline
- Close deals
- View personal metrics

##  Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Seeding Database
```bash
cd backend
npm run seed
```

##  Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `NODE_ENV` - Environment (development/production)

### Frontend
- `REACT_APP_API_URL` - Backend API URL

##  Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from main branch
3. Ensure MongoDB Atlas is configured

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set `REACT_APP_API_URL` to production backend URL
3. Deploy

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

##  License

This project is licensed under the MIT License.

##  Known Issues

- Dark mode preference not persisted across sessions (coming soon)
- Real-time WebSocket updates not yet implemented
- Integration webhooks in development

## Support

For issues and questions, please open a GitHub issue..

---
