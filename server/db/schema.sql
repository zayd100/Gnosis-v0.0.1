-- ============================================================================
-- SENTINELX DATABASE SCHEMA
-- ============================================================================
-- Purpose: Complete PostgreSQL schema for SentinelX AI-Powered Lead Routing Platform
-- 
-- Business Logic:
-- - Admins can see everything (warmers + closers + all leads)
-- - Warmers can ONLY see their assigned leads (assigned_warmer_id = their user.id)
-- - Closers can ONLY see their assigned calls (assigned_closer_id = their user.id)
-- - Warmers and closers NEVER see each other's work
-- 
-- Key Tables:
-- 1. users - All platform users (admin, warmer, closer roles)
-- 2. leads - Incoming leads from integrations (GoHighLevel, HubSpot)
-- 3. assignments - Tracks warmer-closer pairs per lead (AI routing history)
-- 4. calls - Scheduled calls between closers and leads (created by warmers)
-- 5. messages - Conversation history between warmers and leads
-- 6. message_templates - Reusable message templates for warmers
-- ============================================================================

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS message_templates CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores all platform users: admins, warmers, closers
-- 
-- Fields:
-- - id: Auto-incrementing primary key
-- - email: Unique login email
-- - password_hash: bcrypt hashed password (NEVER store plain passwords)
-- - name: Display name
-- - role: 'admin' | 'warmer' | 'closer' (enforced by CHECK constraint)
-- - tier: Performance tier (W1/W3/W5 for warmers, C1/C3 for closers, NULL for admins)
-- - performance_score: Calculated metric (warmers: response rate, closers: conversion rate)
-- - status: Current availability ('active', 'away', 'offline')
-- - created_at: Account creation timestamp
-- - updated_at: Last modification timestamp
-- ============================================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'warmer', 'closer')),
  tier VARCHAR(10),
  performance_score DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster role-based queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================
-- Stores all incoming leads from integrations (GoHighLevel, HubSpot, Zapier)
-- 
-- Fields:
-- - id: Auto-incrementing primary key
-- - name: Lead's full name
-- - email: Lead's email (unique)
-- - tier: Lead value tier (1=high value, 2=medium, 3=low)
-- - engagement_score: AI-calculated score (0.00 to 1.00) based on behavior
-- - status: Lead temperature ('new', 'hot', 'warm', 'cold')
-- - assigned_warmer_id: Which warmer is engaging this lead (FK to users)
-- - assigned_closer_id: Which closer will close this lead (FK to users)
-- - created_at: When lead entered system
-- - updated_at: Last modification (status change, assignment, etc.)
-- 
-- Business Rules:
-- - Warmers can ONLY query WHERE assigned_warmer_id = their user.id
-- - Closers can ONLY see leads that have scheduled calls (via calls table)
-- - Admins can see all leads with no restrictions
-- ============================================================================
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  engagement_score DECIMAL(3,2) DEFAULT 0.00 CHECK (engagement_score >= 0 AND engagement_score <= 1),
  status VARCHAR(20) DEFAULT 'new',
  assigned_warmer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_closer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_tier ON leads(tier);
CREATE INDEX idx_leads_warmer ON leads(assigned_warmer_id);
CREATE INDEX idx_leads_closer ON leads(assigned_closer_id);

-- ============================================================================
-- ASSIGNMENTS TABLE
-- ============================================================================
-- Tracks AI-powered warmer-closer pairing history
-- 
-- Purpose: When AI assigns a lead, it creates a record here showing:
-- - Which lead was assigned
-- - Which warmer got it
-- - Which closer is pre-paired for when lead is ready
-- - How confident the AI was in this pairing (0.00 to 1.00)
-- 
-- This table is used for:
-- 1. Admin analytics (see AI assignment patterns)
-- 2. Performance tracking (which pairs convert best)
-- 3. Historical audit trail (who was assigned what and when)
-- ============================================================================
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  warmer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  closer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1)
);

-- Index for analytics queries
CREATE INDEX idx_assignments_lead ON assignments(lead_id);
CREATE INDEX idx_assignments_warmer ON assignments(warmer_id);
CREATE INDEX idx_assignments_closer ON assignments(closer_id);

-- ============================================================================
-- CALLS TABLE
-- ============================================================================
-- Stores scheduled calls between closers and leads
-- 
-- Workflow:
-- 1. Warmer engages lead via messages
-- 2. When lead is ready, warmer schedules call by creating record here
-- 3. Closer sees this in their "Scheduled Calls" dashboard
-- 4. Closer takes call and updates status to 'completed' / 'closed_won' / 'closed_lost'
-- 
-- Fields:
-- - id: Auto-incrementing primary key
-- - lead_id: Which lead this call is for (FK to leads)
-- - warmer_id: Which warmer scheduled it (for credit attribution)
-- - closer_id: Which closer will take the call
-- - scheduled_time: When the call is scheduled
-- - estimated_value: Predicted deal size (used for prioritization)
-- - status: 'scheduled' | 'completed' | 'closed_won' | 'closed_lost'
-- - notes: Closer's notes after call (strategy, objections, next steps)
-- - created_at: When call was scheduled
-- - updated_at: Last modification (status change, notes added)
-- 
-- Business Rules:
-- - Closers can ONLY query WHERE closer_id = their user.id
-- - Warmers CANNOT see what happens after scheduling (no outcome visibility)
-- ============================================================================
CREATE TABLE calls (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  warmer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  closer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  scheduled_time TIMESTAMP NOT NULL,
  estimated_value DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for dashboard queries
CREATE INDEX idx_calls_closer ON calls(closer_id);
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_scheduled_time ON calls(scheduled_time);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
-- Stores conversation history between warmers and leads
-- 
-- Purpose:
-- - Warmers can see full message history for their assigned leads
-- - Used for context when engaging leads
-- - Analytics: response times, engagement patterns
-- 
-- Fields:
-- - id: Auto-incrementing primary key
-- - lead_id: Which lead this message is about (FK to leads)
-- - warmer_id: Which warmer sent/received this message
-- - message: The actual message content
-- - sender: 'warmer' or 'lead' (who sent this message)
-- - sent_at: When message was sent
-- 
-- Business Rules:
-- - Warmers can ONLY query WHERE warmer_id = their user.id
-- - Closers CANNOT see message history (workflow separation)
-- ============================================================================
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  warmer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('warmer', 'lead')),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for conversation retrieval
CREATE INDEX idx_messages_lead ON messages(lead_id);
CREATE INDEX idx_messages_warmer ON messages(warmer_id);

-- ============================================================================
-- MESSAGE_TEMPLATES TABLE
-- ============================================================================
-- Stores reusable message templates for warmers
-- 
-- Purpose:
-- - Warmers can create/save templates for common scenarios
-- - Faster messaging with proven scripts
-- - Templates can be shared (warmer_id = NULL for global templates)
-- 
-- Fields:
-- - id: Auto-incrementing primary key
-- - warmer_id: Which warmer owns this template (NULL = global template)
-- - title: Template name (e.g., "Initial Outreach", "Follow-up #2")
-- - content: The actual message template
-- - created_at: When template was created
-- ============================================================================
CREATE TABLE message_templates (
  id SERIAL PRIMARY KEY,
  warmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for template retrieval
CREATE INDEX idx_templates_warmer ON message_templates(warmer_id);

-- ============================================================================
-- AUTOMATIC TIMESTAMP UPDATE FUNCTION
-- ============================================================================
-- Purpose: Automatically update 'updated_at' column when any row is modified
-- Usage: Applied to users, leads, calls tables via triggers below
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to auto-update timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Run this file: psql -U postgres -d sentinelx -f db/schema.sql
-- 2. Run seed.sql to populate with sample data
-- 3. Start backend server
-- ============================================================================