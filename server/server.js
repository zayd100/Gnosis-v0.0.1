// ============================================================================
// SENTINELX BACKEND - MAIN SERVER FILE
// ============================================================================
// Purpose: Express.js server entry point for SentinelX platform
//
// What this file does:
// 1. Initializes Express app
// 2. Sets up middleware (CORS, JSON parsing)
// 3. Mounts API routes (/api/auth, /api/admin, /api/warmer, /api/closer)
// 4. Connects to PostgreSQL database
// 5. Starts HTTP server on specified port
//
// Architecture:
// - RESTful API design
// - JWT-based authentication
// - Role-based access control (RBAC)
// - PostgreSQL for data persistence
//
// Environment Variables Required (in .env):
// - PORT: Server port (default 5000)
// - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: PostgreSQL credentials
// - JWT_SECRET: Secret key for signing JWT tokens
// - FRONTEND_URL: Frontend URL for CORS
// ============================================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// DATABASE CONNECTION
// ============================================================================
// PostgreSQL connection pool
// Reuses connections instead of creating new ones for each query (performance)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sentinelx',
  max: 20, // Maximum number of connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Make pool available to all route handlers via app.locals
app.locals.db = pool;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// CORS Configuration
// Allows frontend (React app) to make requests to backend from different origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON Body Parser
// Automatically parses incoming JSON request bodies
app.use(express.json());

// URL-encoded Body Parser (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware (for development)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// JWT AUTHENTICATION MIDDLEWARE
// ============================================================================
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

// Middleware to verify JWT token and attach user to req.user
const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Attach user info to request object
    req.user = decoded; // { id, email, role, tier }
    next();
  });
};

// Middleware to check if user has required role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `This endpoint requires one of these roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const bcrypt = require('bcryptjs');

// Hash password with bcrypt (for registration)
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password with hash (for login)
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      tier: user.tier 
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ============================================================================
// API ROUTES - AUTHENTICATION
// ============================================================================

// POST /api/auth/login - User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return token and user info (without password hash)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tier: user.tier,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register - User registration (for testing, later make admin-only)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, tier } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' });
    }

    if (!['admin', 'warmer', 'closer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be: admin, warmer, or closer' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, tier, status) 
       VALUES ($1, $2, $3, $4, $5, 'active') 
       RETURNING id, email, name, role, tier, status`,
      [email, passwordHash, name, role, tier]
    );

    const newUser = result.rows[0];

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/auth/me - Get current user from token
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, tier, status FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============================================================================
// API ROUTES - ADMIN (requires role='admin')
// ============================================================================

// GET /api/admin/leads - Get all leads in queue
app.get('/api/admin/leads', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.*,
        w.name as warmer_name,
        w.tier as warmer_tier,
        c.name as closer_name,
        c.tier as closer_tier
      FROM leads l
      LEFT JOIN users w ON l.assigned_warmer_id = w.id
      LEFT JOIN users c ON l.assigned_closer_id = c.id
      ORDER BY l.created_at DESC
    `);

    res.json({ leads: result.rows });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /api/admin/leads - Create new lead
app.post('/api/admin/leads', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, tier, engagement_score, status } = req.body;

    if (!name || !email || !tier) {
      return res.status(400).json({ error: 'Name, email, and tier are required' });
    }

    const result = await pool.query(
      `INSERT INTO leads (name, email, tier, engagement_score, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, tier, engagement_score || 0, status || 'new']
    );

    res.status(201).json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT /api/admin/leads/:id - Update lead
app.put('/api/admin/leads/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tier, engagement_score } = req.body;

    const result = await pool.query(
      `UPDATE leads 
       SET status = COALESCE($1, status),
           tier = COALESCE($2, tier),
           engagement_score = COALESCE($3, engagement_score),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [status, tier, engagement_score, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// POST /api/admin/assign - Manually assign lead to warmer-closer pair
app.post('/api/admin/assign', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { lead_id, warmer_id, closer_id, ai_confidence } = req.body;

    if (!lead_id || !warmer_id || !closer_id) {
      return res.status(400).json({ error: 'lead_id, warmer_id, and closer_id are required' });
    }

    // Update lead assignment
    await pool.query(
      `UPDATE leads 
       SET assigned_warmer_id = $1, assigned_closer_id = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [warmer_id, closer_id, lead_id]
    );

    // Create assignment record
    const result = await pool.query(
      `INSERT INTO assignments (lead_id, warmer_id, closer_id, ai_confidence)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [lead_id, warmer_id, closer_id, ai_confidence || 0.8]
    );

    res.json({ assignment: result.rows[0] });
  } catch (error) {
    console.error('Assign lead error:', error);
    res.status(500).json({ error: 'Failed to assign lead' });
  }
});

// GET /api/admin/warmers - Get all warmers with stats
app.get('/api/admin/warmers', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.tier,
        u.performance_score,
        u.status,
        COUNT(DISTINCT l.id) as total_leads,
        COUNT(DISTINCT CASE WHEN l.status = 'hot' THEN l.id END) as hot_leads,
        COUNT(DISTINCT c.id) as calls_scheduled
      FROM users u
      LEFT JOIN leads l ON l.assigned_warmer_id = u.id
      LEFT JOIN calls c ON c.warmer_id = u.id
      WHERE u.role = 'warmer'
      GROUP BY u.id
      ORDER BY u.performance_score DESC
    `);

    res.json({ warmers: result.rows });
  } catch (error) {
    console.error('Get warmers error:', error);
    res.status(500).json({ error: 'Failed to fetch warmers' });
  }
});

// GET /api/admin/closers - Get all closers with stats
app.get('/api/admin/closers', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.tier,
        u.performance_score,
        u.status,
        COUNT(DISTINCT c.id) as total_calls,
        COUNT(DISTINCT CASE WHEN c.status = 'closed_won' THEN c.id END) as won_deals,
        COUNT(DISTINCT CASE WHEN c.status = 'closed_lost' THEN c.id END) as lost_deals,
        ROUND(AVG(c.estimated_value), 2) as avg_deal_value
      FROM users u
      LEFT JOIN calls c ON c.closer_id = u.id
      WHERE u.role = 'closer'
      GROUP BY u.id
      ORDER BY u.performance_score DESC
    `);

    res.json({ closers: result.rows });
  } catch (error) {
    console.error('Get closers error:', error);
    res.status(500).json({ error: 'Failed to fetch closers' });
  }
});

// GET /api/admin/team - Get all users
app.get('/api/admin/team', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, name, role, tier, performance_score, status, created_at
      FROM users
      ORDER BY role, performance_score DESC
    `);

    res.json({ team: result.rows });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// GET /api/admin/analytics/mrr - Get MRR trend data (mock for now)
app.get('/api/admin/analytics/mrr', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    // For now, return mock data
    // In production, this would calculate from actual closed deals
    const mrrData = [
      { day: 'D-6', value: 40000 },
      { day: 'D-5', value: 55000 },
      { day: 'D-4', value: 62000 },
      { day: 'D-3', value: 72000 },
      { day: 'D-2', value: 85000 },
      { day: 'D-1', value: 92000 },
      { day: 'Today', value: 95000 }
    ];

    res.json({ mrr: mrrData });
  } catch (error) {
    console.error('Get MRR error:', error);
    res.status(500).json({ error: 'Failed to fetch MRR data' });
  }
});

// ============================================================================
// API ROUTES - WARMER (requires role='warmer')
// ============================================================================

// GET /api/warmer/leads - Get MY assigned leads only
app.get('/api/warmer/leads', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.*,
        c.name as closer_name,
        c.tier as closer_tier
      FROM leads l
      LEFT JOIN users c ON l.assigned_closer_id = c.id
      WHERE l.assigned_warmer_id = $1
      ORDER BY l.status DESC, l.engagement_score DESC
    `, [req.user.id]);

    res.json({ leads: result.rows });
  } catch (error) {
    console.error('Get warmer leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/warmer/leads/:id/messages - Get message history for specific lead
app.get('/api/warmer/leads/:id/messages', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const { id } = req.params;

    // Verify this lead belongs to this warmer
    const leadCheck = await pool.query(
      'SELECT id FROM leads WHERE id = $1 AND assigned_warmer_id = $2',
      [id, req.user.id]
    );

    if (leadCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this lead' });
    }

    const result = await pool.query(`
      SELECT * FROM messages
      WHERE lead_id = $1
      ORDER BY sent_at ASC
    `, [id]);

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/warmer/leads/:id/message - Send message to lead
app.post('/api/warmer/leads/:id/message', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sender } = req.body;

    if (!message || !sender) {
      return res.status(400).json({ error: 'message and sender are required' });
    }

    // Verify this lead belongs to this warmer
    const leadCheck = await pool.query(
      'SELECT id FROM leads WHERE id = $1 AND assigned_warmer_id = $2',
      [id, req.user.id]
    );

    if (leadCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this lead' });
    }

    const result = await pool.query(
      `INSERT INTO messages (lead_id, warmer_id, message, sender)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, req.user.id, message, sender]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PUT /api/warmer/leads/:id/status - Update lead status (hot/warm/cold)
app.put('/api/warmer/leads/:id/status', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['hot', 'warm', 'cold'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: hot, warm, or cold' });
    }

    const result = await pool.query(
      `UPDATE leads 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND assigned_warmer_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found or access denied' });
    }

    res.json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// POST /api/warmer/leads/:id/schedule-call - Schedule call for closer
app.post('/api/warmer/leads/:id/schedule-call', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduled_time, estimated_value } = req.body;

    if (!scheduled_time) {
      return res.status(400).json({ error: 'scheduled_time is required' });
    }

    // Get lead info to find assigned closer
    const leadResult = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND assigned_warmer_id = $2',
      [id, req.user.id]
    );

    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found or access denied' });
    }

    const lead = leadResult.rows[0];

    if (!lead.assigned_closer_id) {
      return res.status(400).json({ error: 'Lead does not have an assigned closer' });
    }

    // Create call
    const result = await pool.query(
      `INSERT INTO calls (lead_id, warmer_id, closer_id, scheduled_time, estimated_value, status)
       VALUES ($1, $2, $3, $4, $5, 'scheduled')
       RETURNING *`,
      [id, req.user.id, lead.assigned_closer_id, scheduled_time, estimated_value || 0]
    );

    // Update lead status to hot
    await pool.query(
      'UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['hot', id]
    );

    res.status(201).json({ call: result.rows[0] });
  } catch (error) {
    console.error('Schedule call error:', error);
    res.status(500).json({ error: 'Failed to schedule call' });
  }
});

// GET /api/warmer/performance - Get MY performance stats
app.get('/api/warmer/performance', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT l.id) as total_leads,
        COUNT(DISTINCT CASE WHEN l.status = 'hot' THEN l.id END) as hot_leads,
        COUNT(DISTINCT CASE WHEN l.status = 'warm' THEN l.id END) as warm_leads,
        COUNT(DISTINCT CASE WHEN l.status = 'cold' THEN l.id END) as cold_leads,
        COUNT(DISTINCT c.id) as calls_scheduled,
        COUNT(DISTINCT m.id) as messages_sent
      FROM users u
      LEFT JOIN leads l ON l.assigned_warmer_id = u.id
      LEFT JOIN calls c ON c.warmer_id = u.id
      LEFT JOIN messages m ON m.warmer_id = u.id AND m.sender = 'warmer'
      WHERE u.id = $1
      GROUP BY u.id
    `, [req.user.id]);

    res.json({ performance: result.rows[0] || {} });
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

// GET /api/warmer/templates - Get MY message templates
app.get('/api/warmer/templates', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM message_templates
      WHERE warmer_id = $1 OR warmer_id IS NULL
      ORDER BY created_at DESC
    `, [req.user.id]);

    res.json({ templates: result.rows });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// POST /api/warmer/templates - Create new message template
app.post('/api/warmer/templates', authenticateToken, requireRole('warmer'), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO message_templates (warmer_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, title, content]
    );

    res.status(201).json({ template: result.rows[0] });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// ============================================================================
// API ROUTES - CLOSER (requires role='closer')
// ============================================================================

// GET /api/closer/calls - Get MY scheduled calls
app.get('/api/closer/calls', authenticateToken, requireRole('closer'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        l.name as lead_name,
        l.email as lead_email,
        l.tier as lead_tier,
        w.name as warmer_name
      FROM calls c
      JOIN leads l ON c.lead_id = l.id
      LEFT JOIN users w ON c.warmer_id = w.id
      WHERE c.closer_id = $1
      ORDER BY c.scheduled_time ASC
    `, [req.user.id]);

    res.json({ calls: result.rows });
  } catch (error) {
    console.error('Get calls error:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

// PUT /api/closer/calls/:id/status - Update call outcome
app.put('/api/closer/calls/:id/status', authenticateToken, requireRole('closer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['scheduled', 'completed', 'closed_won', 'closed_lost'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE calls 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND closer_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Call not found or access denied' });
    }

    res.json({ call: result.rows[0] });
  } catch (error) {
    console.error('Update call status error:', error);
    res.status(500).json({ error: 'Failed to update call status' });
  }
});

// PUT /api/closer/calls/:id/notes - Add/update notes
app.put('/api/closer/calls/:id/notes', authenticateToken, requireRole('closer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      `UPDATE calls 
       SET notes = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND closer_id = $3
       RETURNING *`,
      [notes, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Call not found or access denied' });
    }

    res.json({ call: result.rows[0] });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// GET /api/closer/pipeline - Get MY active deals
app.get('/api/closer/pipeline', authenticateToken, requireRole('closer'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        l.name as lead_name,
        l.email as lead_email,
        l.tier as lead_tier,
        w.name as warmer_name
      FROM calls c
      JOIN leads l ON c.lead_id = l.id
      LEFT JOIN users w ON c.warmer_id = w.id
      WHERE c.closer_id = $1 
        AND c.status IN ('completed', 'scheduled')
      ORDER BY c.scheduled_time DESC
    `, [req.user.id]);

    res.json({ pipeline: result.rows });
  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({ error: 'Failed to fetch pipeline' });
  }
});

// GET /api/closer/performance - Get MY performance stats
app.get('/api/closer/performance', authenticateToken, requireRole('closer'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCTc.id) as total_calls,
        COUNT(DISTINCT CASE WHEN c.status = 'closed_won' THEN c.id END) as won_deals,
        COUNT(DISTINCT CASE WHEN c.status = 'closed_lost' THEN c.id END) as lost_deals,
        COUNT(DISTINCT CASE WHEN c.status = 'scheduled' THEN c.id END) as scheduled_calls,
        ROUND(AVG(c.estimated_value), 2) as avg_deal_value,
        SUM(CASE WHEN c.status = 'closed_won' THEN c.estimated_value ELSE 0 END) as total_revenue
      FROM calls c
      WHERE c.closer_id = $1
    `, [req.user.id]);

    res.json({ performance: result.rows[0] || {} });
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SentinelX API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================================================
// 404 HANDLER
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================
const startServer = async () => {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await testConnection();

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║                                                        ║');
      console.log('║           🚀  SENTINELX API SERVER STARTED  🚀         ║');
      console.log('║                                                        ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('🔐 AUTH ENDPOINTS:');
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   GET    /api/auth/me`);
      console.log('');
      console.log('👑 ADMIN ENDPOINTS:');
      console.log(`   GET    /api/admin/leads`);
      console.log(`   POST   /api/admin/leads`);
      console.log(`   POST   /api/admin/assign`);
      console.log(`   GET    /api/admin/warmers`);
      console.log(`   GET    /api/admin/closers`);
      console.log(`   GET    /api/admin/team`);
      console.log('');
      console.log('🔥 WARMER ENDPOINTS:');
      console.log(`   GET    /api/warmer/leads`);
      console.log(`   GET    /api/warmer/leads/:id/messages`);
      console.log(`   POST   /api/warmer/leads/:id/message`);
      console.log(`   PUT    /api/warmer/leads/:id/status`);
      console.log(`   POST   /api/warmer/leads/:id/schedule-call`);
      console.log('');
      console.log('📞 CLOSER ENDPOINTS:');
      console.log(`   GET    /api/closer/calls`);
      console.log(`   PUT    /api/closer/calls/:id/status`);
      console.log(`   GET    /api/closer/pipeline`);
      console.log('');
      console.log('Press Ctrl+C to stop the server');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});

module.exports = app;
