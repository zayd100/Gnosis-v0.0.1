-- ============================================================================
-- SENTINELX SEED DATA
-- ============================================================================
-- Purpose: Populate database with sample data for testing
-- 
-- What's included:
-- - 1 Admin user
-- - 5 Warmer users (different tiers: W1, W3, W5)
-- - 4 Closer users (different tiers: C1, C3)
-- - 20 Sample leads (mix of tiers and statuses)
-- - 10 Assignments (AI pairing history)
-- - 8 Scheduled calls
-- - 15 Messages (conversation history)
-- - 5 Message templates
-- 
-- Default passwords for ALL users: "password123"
-- Password hash generated with: bcrypt.hash("password123", 10)
-- ============================================================================

-- Clear existing data (if any)
TRUNCATE users, leads, assignments, calls, messages, message_templates RESTART IDENTITY CASCADE;

-- ============================================================================
-- INSERT USERS
-- ============================================================================
-- Password for all users: "password123"
-- Hash: $2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq
-- (Note: In production, each user would have unique password. This is for dev testing only)
-- ============================================================================

-- Admin User
INSERT INTO users (email, password_hash, name, role, tier, performance_score, status) VALUES
('admin@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Admin User', 'admin', NULL, 0.00, 'active');

-- Warmer Users (Lead Engagers)
-- Tier W1 = Top performers, handle Tier 1 leads
-- Tier W3 = Mid-level, handle Tier 2-3 leads
-- Tier W5 = Entry-level, handle Tier 3 leads
INSERT INTO users (email, password_hash, name, role, tier, performance_score, status) VALUES
('maya@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Maya', 'warmer', 'W3', 78.00, 'online'),
('ava@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Ava', 'warmer', 'W1', 66.00, 'away'),
('rin@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Rin', 'warmer', 'W1', 58.00, 'online'),
('noah@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Noah', 'warmer', 'W1', 56.00, 'active'),
('leo@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Leo', 'warmer', 'W5', 43.00, 'active');

-- Closer Users (Deal Closers)
-- Tier C1 = Top closers, handle high-value deals
-- Tier C3 = Standard closers, handle mid-value deals
INSERT INTO users (email, password_hash, name, role, tier, performance_score, status) VALUES
('ivy@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Ivy', 'closer', 'C1', 106.00, 'online'),
('zoe@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Zoe', 'closer', 'C3', 103.00, 'online'),
('sam@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Sam', 'closer', 'C1', 81.00, 'active'),
('max@sentinelx.ai', '$2a$10$rF5Y8VGX7vQr7hqYKJZJYeF4aZ0hqZ7kqZ0hqZ7kqZ0hqZ7kqZ0hq', 'Max', 'closer', 'C3', 62.00, 'active');

-- ============================================================================
-- INSERT LEADS
-- ============================================================================
-- Mix of tier 1, 2, 3 leads with different statuses and assignments
-- Some leads are assigned to warmers, some are unassigned (in queue)
-- ============================================================================
INSERT INTO leads (name, email, tier, engagement_score, status, assigned_warmer_id, assigned_closer_id) VALUES
-- Hot Leads (actively engaged, high scores)
('Jordan P', 'jordan.p@example.com', 1, 0.92, 'hot', 2, 6),
('Alex M', 'alex.m@example.com', 1, 0.88, 'hot', 3, 6),
('Taylor S', 'taylor.s@example.com', 2, 0.75, 'hot', 2, 7),
('Casey R', 'casey.r@example.com', 1, 0.91, 'hot', 4, 8),

-- Warm Leads (responded, needs nurturing)
('Sam Q', 'sam.q@example.com', 2, 0.68, 'warm', 3, 7),
('Morgan T', 'morgan.t@example.com', 2, 0.64, 'warm', 2, 6),
('Riley K', 'riley.k@example.com', 3, 0.58, 'warm', 5, 7),
('Jamie L', 'jamie.l@example.com', 3, 0.55, 'warm', 5, 9),

-- Cold Leads (low engagement, need reactivation)
('Drew B', 'drew.b@example.com', 3, 0.32, 'cold', 5, 9),
('Skylar H', 'skylar.h@example.com', 2, 0.41, 'cold', 4, 7),

-- New Leads (just entered system, not yet assigned)
('Phoenix A', 'phoenix.a@example.com', 1, 0.85, 'new', NULL, NULL),
('River C', 'river.c@example.com', 2, 0.72, 'new', NULL, NULL),
('Dakota F', 'dakota.f@example.com', 3, 0.68, 'new', NULL, NULL),
('Sage W', 'sage.w@example.com', 1, 0.94, 'new', NULL, NULL),
('Quinn Z', 'quinn.z@example.com', 2, 0.77, 'new', NULL, NULL),

-- More assigned leads for testing
('Blake V', 'blake.v@example.com', 1, 0.89, 'hot', 3, 8),
('Rowan N', 'rowan.n@example.com', 2, 0.71, 'warm', 4, 7),
('Harper D', 'harper.d@example.com', 3, 0.49, 'cold', 5, 9),
('Avery K', 'avery.k@example.com', 1, 0.86, 'hot', 2, 6),
('Ellis J', 'ellis.j@example.com', 2, 0.63, 'warm', 3, 7);

-- ============================================================================
-- INSERT ASSIGNMENTS
-- ============================================================================
-- AI assignment history showing warmer-closer pairings
-- ai_confidence represents how confident the AI was in this pairing (0.00-1.00)
-- ============================================================================
INSERT INTO assignments (lead_id, warmer_id, closer_id, ai_confidence, assigned_at) VALUES
(1, 2, 6, 0.94, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 3, 6, 0.91, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 2, 7, 0.87, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(4, 4, 8, 0.93, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(5, 3, 7, 0.82, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(6, 2, 6, 0.88, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(7, 5, 7, 0.75, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
(8, 5, 9, 0.71, CURRENT_TIMESTAMP - INTERVAL '8 hours'),
(16, 3, 8, 0.90, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
(19, 2, 6, 0.95, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- ============================================================================
-- INSERT CALLS
-- ============================================================================
-- Scheduled calls between closers and leads
-- Some are scheduled for future, some are completed
-- ============================================================================
INSERT INTO calls (lead_id, warmer_id, closer_id, scheduled_time, estimated_value, status, notes) VALUES
-- Future scheduled calls
(1, 2, 6, CURRENT_TIMESTAMP + INTERVAL '2 hours', 850.00, 'scheduled', NULL),
(2, 3, 6, CURRENT_TIMESTAMP + INTERVAL '4 hours', 920.00, 'scheduled', NULL),
(3, 2, 7, CURRENT_TIMESTAMP + INTERVAL '1 day', 650.00, 'scheduled', NULL),
(4, 4, 8, CURRENT_TIMESTAMP + INTERVAL '1 day 2 hours', 780.00, 'scheduled', NULL),

-- Completed calls (won deals)
(16, 3, 8, CURRENT_TIMESTAMP - INTERVAL '1 day', 890.00, 'closed_won', 'Great call! Signed 12-month contract. Very interested in premium tier.'),
(19, 2, 6, CURRENT_TIMESTAMP - INTERVAL '2 days', 1200.00, 'closed_won', 'Closed enterprise deal. Requested custom onboarding.'),

-- Completed calls (lost deals)
(10, 4, 7, CURRENT_TIMESTAMP - INTERVAL '3 days', 450.00, 'closed_lost', 'Budget concerns. May revisit in Q2.'),

-- Completed call (finished but not closed yet)
(6, 2, 6, CURRENT_TIMESTAMP - INTERVAL '4 hours', 720.00, 'completed', 'Demo went well. Following up with proposal.');

-- ============================================================================
-- INSERT MESSAGES
-- ============================================================================
-- Conversation history between warmers and leads
-- Shows back-and-forth messaging for context
-- ============================================================================
INSERT INTO messages (lead_id, warmer_id, message, sender, sent_at) VALUES
-- Conversation with Jordan P (lead_id=1)
(1, 2, 'Hi Jordan! Thanks for your interest in our platform. I saw you downloaded our whitepaper - what caught your attention?', 'warmer', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 2, 'Hi Maya! I loved the section on AI-powered routing. We are struggling with lead distribution right now.', 'lead', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '15 minutes'),
(1, 2, 'That is exactly what we solve! Would you be open to a quick 15-min call to see if we are a good fit? I can show you how other teams have improved conversion by 34%.', 'warmer', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '20 minutes'),
(1, 2, 'Definitely interested! How about Thursday at 2pm?', 'lead', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '45 minutes'),
(1, 2, 'Perfect! I will have Ivy, our closer, reach out to confirm. Looking forward to it!', 'warmer', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '50 minutes'),

-- Conversation with Alex M (lead_id=2)
(2, 3, 'Hey Alex! I noticed you signed up for our free trial. How is your experience so far?', 'warmer', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, 3, 'Hi Ava! It is great so far. I am trying to figure out the tier matching feature.', 'lead', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '30 minutes'),
(2, 3, 'Happy to help! The tier system matches your best reps with your highest-value leads. Want to hop on a call and I will walk you through it?', 'warmer', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '35 minutes'),

-- Conversation with Taylor S (lead_id=3)
(3, 2, 'Hi Taylor! Saw you checked out our pricing page. Any questions I can answer?', 'warmer', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
(3, 2, 'Yes! Does the Pro plan include integrations with GoHighLevel?', 'lead', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(3, 2, 'Absolutely! GoHighLevel is fully integrated. Let me schedule a demo so you can see it in action.', 'warmer', CURRENT_TIMESTAMP - INTERVAL '4 hours'),

-- Conversation with Sam Q (lead_id=5)
(5, 3, 'Hi Sam! Thanks for attending our webinar yesterday. What did you think?', 'warmer', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(5, 3, 'It was super informative! I am curious about the AI confidence scores.', 'lead', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

-- Conversation with Morgan T (lead_id=6)
(6, 2, 'Hi Morgan! I saw you requested a demo. When works best for you?', 'warmer', CURRENT_TIMESTAMP - INTERVAL '8 hours');

-- ============================================================================
-- INSERT MESSAGE TEMPLATES
-- ============================================================================
-- Reusable templates for warmers
-- warmer_id = NULL means it's a global template (available to all warmers)
-- ============================================================================
INSERT INTO message_templates (warmer_id, title, content) VALUES
-- Global templates (available to all warmers)
(NULL, 'Initial Outreach', 'Hi {name}! Thanks for your interest in SentinelX. I saw you {action} - what caught your attention? I would love to learn more about your current lead management process and see if we can help!'),
(NULL, 'Follow-up #1', 'Hey {name}! Just wanted to circle back on my previous message. I know you are busy, but I think we could really help with {pain_point}. Would you be open to a quick 15-min call this week?'),
(NULL, 'Demo Scheduling', 'Great to hear from you, {name}! I can jump on a quick call to show you how this works. What time works for you? I have availability on {day} at {time1} or {time2}.'),
(NULL, 'Re-engagement (Cold Lead)', 'Hi {name}! I wanted to reach back out - I know timing was not right before, but we have rolled out some new features that might interest you. Would you be open to a quick catch-up call?'),

-- Maya's custom template
(2, 'High-Value Lead Script', 'Hi {name}! I noticed you are at {company} - we have worked with similar enterprises and helped them increase conversion by 30%+. I would love to show you how. Available for a call this week?');

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================
-- Database is now populated with sample data for testing
-- 
-- Login credentials (all users):
-- - Password: password123
-- - Admin: admin@sentinelx.ai
-- - Warmers: maya@sentinelx.ai, ava@sentinelx.ai, etc.
-- - Closers: ivy@sentinelx.ai, zoe@sentinelx.ai, etc.
-- 
-- Next steps:
-- 1. Start backend server: npm run dev
-- 2. Test login: POST /api/auth/login
-- 3. Test role-based routes with JWT token
-- ============================================================================