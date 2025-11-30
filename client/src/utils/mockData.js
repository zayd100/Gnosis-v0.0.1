//Below is all the mock data which will be replaced by actual data. this one is just so that the UI could be in order.
//I am 


// Admin Dashboard Data
export const mockLeadQueue = [
  { id: 1, tier: 1, score: 0.9, email: 'lead1@example.com', tier_label: 'W1', status: 'hot' },
  { id: 2, tier: 1, score: 0.58, email: 'lead2@example.com', tier_label: 'W5', status: 'hot' },
  { id: 3, tier: 3, score: 0.75, email: 'lead3@example.com', tier_label: 'W1', status: 'warm' },
  { id: 4, tier: 2, score: 0.27, email: 'lexzad4@example.com', tier_label: 'W1', status: 'hot' }
];

export const mockTopWarmers = [
  { name: 'Maya', score: 78, leads: 22, referrals: 6 },
  { name: 'Ava', score: 66, leads: 18, referrals: 4 },
  { name: 'Rin', score: 58, leads: 16, referrals: 3 },
  { name: 'Noah', score: 56, leads: 14, referrals: 2 },
  { name: 'Leo', score: 43, leads: 11, referrals: 1 }
];

export const mockTopClosers = [
  { name: 'Ivy', score: 106, conv: '34%', avg: 800 },
  { name: 'Zoe', score: 103, conv: '38%', avg: 720 },
  { name: 'Sam', score: 81, conv: '28%', avg: 650 },
  { name: 'Max', score: 62, conv: '22%', avg: 530 }
];

export const mockAutoAssignments = [
  { lead: 7, tier: 3, score: 0.94, warmer: 'Maya (W3)', closer: 'Ivy (C1)' },
  { lead: 3, tier: 3, score: 0.75, warmer: 'Ava (W1)', closer: 'Zoe (C3)' },
  { lead: 17, tier: 2, score: 0.82, warmer: 'Maya (W3)', closer: 'Ivy (C1)' },
  { lead: 5, tier: 2, score: 0.58, warmer: 'Ava (W1)', closer: 'Zoe (C3)' },
  { lead: 11, tier: 2, score: 0.47, warmer: 'Maya (W3)', closer: 'Ivy (C1)' },
  { lead: 6, tier: 2, score: 0.4, warmer: 'Ava (W1)', closer: 'Zoe (C3)' }
];

export const mockMRRData = [
  { day: 'D-6', value: 40000 },
  { day: 'D-5', value: 55000 },
  { day: 'D-4', value: 62000 },
  { day: 'D-3', value: 72000 },
  { day: 'D-2', value: 85000 },
  { day: 'D-1', value: 92000 },
  { day: 'Today', value: 5000 }
];

export const mockTeamMembers = [
  { id: 1, name: 'Maya', role: 'Warmer', tier: 'W3', score: 78, status: 'online', leads: 22 },
  { id: 2, name: 'Ivy', role: 'Closer', tier: 'C1', score: 106, status: 'online', conv: '34%' },
  { id: 3, name: 'Ava', role: 'Warmer', tier: 'W1', score: 66, status: 'away', leads: 18 },
  { id: 4, name: 'Zoe', role: 'Closer', tier: 'C3', score: 103, status: 'online', conv: '38%' },
];

export const mockIntegrations = [
  { name: 'GoHighLevel', connected: true, lastSync: '2 min ago' },
  { name: 'HubSpot', connected: true, lastSync: '5 min ago' },
  { name: 'Zapier', connected: false, lastSync: 'Never' },
  { name: 'Slack', connected: true, lastSync: '1 hour ago' },
];

// Warmer Dashboard Data
export const mockWarmerLeads = [
  { id: 1, name: 'Jordan P', status: 'Hot', intent: '--', responseSpeed: '--' },
  { id: 2, name: 'Alex M', status: 'Warm', intent: '--', responseSpeed: '--' },
  { id: 3, name: 'Taylor S', status: 'Cold', intent: '--', responseSpeed: '--' },
  { id: 4, name: 'Casey R', status: 'Hot', intent: '--', responseSpeed: '--' },
  { id: 5, name: 'Sam Q', status: 'Warm', intent: '--', responseSpeed: '--' }
];

export const mockMessageTemplates = [
  "Hey there, thanks for reaching out — I can jump on a quick call to show you how this works. What time works for you?",
  "I saw you're interested in [product]. Let me know when you're free for a quick demo!",
  "Thanks for your interest! Can we schedule a 15-min call to discuss your needs?"
];

// Closer Dashboard Data
export const mockScheduledCalls = [
  { id: 1, lead: 'Jordan P', warmer: 'Maya', time: 'Today 2:00 PM', tier: 1, value: '$850', status: 'scheduled' },
  { id: 2, lead: 'Alex M', warmer: 'Ava', time: 'Today 3:30 PM', tier: 2, value: '$650', status: 'scheduled' },
  { id: 3, lead: 'Taylor S', warmer: 'Rin', time: 'Tomorrow 10:00 AM', tier: 3, value: '$450', status: 'scheduled' },
  { id: 4, lead: 'Casey R', warmer: 'Maya', time: 'Tomorrow 2:00 PM', tier: 1, value: '$920', status: 'scheduled' }
];

export const mockActivePipeline = [
  { id: 1, lead: 'Sam Q', stage: 'Negotiation', value: '$1,200', probability: '75%', warmer: 'Noah' },
  { id: 2, lead: 'Morgan T', stage: 'Demo Completed', value: '$800', probability: '60%', warmer: 'Ava' },
  { id: 3, lead: 'Riley K', stage: 'Proposal Sent', value: '$950', probability: '45%', warmer: 'Maya' }
];

export const mockActivities = [
  { id: 1, type: 'lead_assigned', user: 'Maya', target: 'Jordan P', details: 'Lead assigned to warmer', time: '5 min ago', icon: 'Users' },
  { id: 2, type: 'call_scheduled', user: 'Ivy', target: 'Alex M', details: 'Call scheduled for 3:30 PM', time: '12 min ago', icon: 'Clock' },
  { id: 3, type: 'deal_closed', user: 'Zoe', target: 'Taylor S', details: 'Deal closed won - $850', time: '23 min ago', icon: 'CheckCircle' },
  { id: 4, type: 'lead_responded', user: 'System', target: 'Casey R', details: 'Lead responded to message', time: '45 min ago', icon: 'Activity' },
  { id: 5, type: 'lead_assigned', user: 'Ava', target: 'Sam Q', details: 'Lead assigned to warmer', time: '1 hour ago', icon: 'Users' },
  { id: 6, type: 'call_completed', user: 'Ivy', target: 'Morgan T', details: 'Demo call completed', time: '2 hours ago', icon: 'CheckCircle' },
  { id: 7, type: 'lead_marked_hot', user: 'Maya', target: 'Riley K', details: 'Lead marked as hot', time: '3 hours ago', icon: 'AlertCircle' },
  { id: 8, type: 'deal_closed', user: 'Sam', target: 'Jamie L', details: 'Deal closed won - $720', time: '4 hours ago', icon: 'CheckCircle' }
];

export const mockTasks = [
  { id: 1, title: 'Follow up with Jordan P', priority: 'high', status: 'pending', dueDate: 'Today', assignee: 'Maya' },
  { id: 2, title: 'Send proposal to Alex M', priority: 'high', status: 'pending', dueDate: 'Today', assignee: 'Ivy' },
  { id: 3, title: 'Review warmer scripts', priority: 'medium', status: 'in_progress', dueDate: 'Tomorrow', assignee: 'Admin' },
  { id: 4, title: 'Update CRM data', priority: 'low', status: 'pending', dueDate: 'Friday', assignee: 'Zoe' },
  { id: 5, title: 'Prepare demo for Taylor S', priority: 'medium', status: 'completed', dueDate: 'Yesterday', assignee: 'Sam' }
];