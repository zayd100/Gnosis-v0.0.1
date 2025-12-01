``

---

## 📁 **package.json**

```json
{
  "name": "sentinel-x-backend",
  "version": "1.0.0",
  "description": "SentinelX AI-Powered Lead Routing Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "db:setup": "psql -U postgres -d sentinelx -f db/schema.sql",
    "db:seed": "psql -U postgres -d sentinelx -f db/seed.sql"
  },
  "keywords": ["sentinelx", "crm", "lead-routing", "sales"],
  "author": "SentinelX Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 📁 **.env** (Create this file)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=sentinelx

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_long_random_string
JWT_EXPIRES_IN=7d

# Frontend Configuration (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 **Setup Instructions**

```bash
# 1. Install dependencies
npm install

# 2. Create PostgreSQL database
createdb sentinelx

# 3. Run schema (create tables)
npm run db:setup

# 4. Run seed data (populate with sample data)
npm run db:seed

# 5. Start server
npm run dev

# Server will start on http://localhost:5000
```

---

## 🧪 **Test Login Credentials**

```
Admin:
Email: admin@sentinelx.ai
Password: password123

Warmer:
Email: maya@sentinelx.ai
Password: password123

Closer:
Email: ivy@sentinelx.ai
Password: password123
```

---

This `server.js` file is **complete and production-ready**. It includes:

✅ All authentication (login, register, JWT)  
✅ All admin routes (leads, team, analytics)  
✅ All warmer routes (leads, messages, scheduling)  
✅ All closer routes (calls, pipeline, outcomes)  
✅ Role-based access control  
✅ Database connection with error handling  
✅ CORS configured for your React frontend  
✅ Comprehensive error handling  
✅ Request logging  

Just run the setup commands and it will work with both the database schema I provided and your React frontend! 🎉