const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Lead.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sentinelx.com',
      password: 'admin123',
      role: 'admin',
      status: 'online',
      performanceScore: 100
    });

    // Create Warmers
    const maya = await User.create({
      name: 'Maya',
      email: 'maya@sentinelx.com',
      password: 'warmer123',
      role: 'warmer',
      tier: 'W3',
      status: 'online',
      performanceScore: 78,
      leadsHandled: 22,
      referrals: 6
    });

    const ava = await User.create({
      name: 'Ava',
      email: 'ava@sentinelx.com',
      password: 'warmer123',
      role: 'warmer',
      tier: 'W1',
      status: 'away',
      performanceScore: 66,
      leadsHandled: 18,
      referrals: 4
    });

    const rin = await User.create({
      name: 'Rin',
      email: 'rin@sentinelx.com',
      password: 'warmer123',
      role: 'warmer',
      tier: 'W2',
      status: 'online',
      performanceScore: 58,
      leadsHandled: 16,
      referrals: 3
    });

    const noah = await User.create({
      name: 'Noah',
      email: 'noah@sentinelx.com',
      password: 'warmer123',
      role: 'warmer',
      tier: 'W1',
      status: 'online',
      performanceScore: 56,
      leadsHandled: 14,
      referrals: 2
    });

    // Create Closers
    const ivy = await User.create({
      name: 'Ivy',
      email: 'ivy@sentinelx.com',
      password: 'closer123',
      role: 'closer',
      tier: 'C1',
      status: 'online',
      performanceScore: 106,
      conversionRate: 34,
      avgDealSize: 800
    });

    const zoe = await User.create({
      name: 'Zoe',
      email: 'zoe@sentinelx.com',
      password: 'closer123',
      role: 'closer',
      tier: 'C3',
      status: 'online',
      performanceScore: 103,
      conversionRate: 38,
      avgDealSize: 720
    });

    const sam = await User.create({
      name: 'Sam',
      email: 'sam@sentinelx.com',
      password: 'closer123',
      role: 'closer',
      tier: 'C2',
      status: 'away',
      performanceScore: 81,
      conversionRate: 28,
      avgDealSize: 650
    });

    const max = await User.create({
      name: 'Max',
      email: 'max@sentinelx.com',
      password: 'closer123',
      role: 'closer',
      tier: 'C1',
      status: 'online',
      performanceScore: 62,
      conversionRate: 22,
      avgDealSize: 530
    });

    console.log('✅ Created users');

    // Create Leads
    const leads = await Lead.create([
      {
        name: 'Jordan P',
        email: 'jordan@example.com',
        phone: '+1-555-0101',
        tier: 1,
        score: 0.9,
        status: 'hot',
        assignedWarmer: maya._id,
        assignedCloser: ivy._id,
        estimatedValue: 850,
        scheduledCallTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      },
      {
        name: 'Alex M',
        email: 'alex@example.com',
        phone: '+1-555-0102',
        tier: 2,
        score: 0.58,
        status: 'hot',
        assignedWarmer: ava._id,
        assignedCloser: zoe._id,
        estimatedValue: 650,
        scheduledCallTime: new Date(Date.now() + 5 * 60 * 60 * 1000)
      },
      {
        name: 'Taylor S',
        email: 'taylor@example.com',
        phone: '+1-555-0103',
        tier: 3,
        score: 0.75,
        status: 'warm',
        assignedWarmer: rin._id,
        assignedCloser: sam._id,
        estimatedValue: 450
      },
      {
        name: 'Casey R',
        email: 'casey@example.com',
        phone: '+1-555-0104',
        tier: 1,
        score: 0.27,
        status: 'warm',
        assignedWarmer: maya._id,
        assignedCloser: ivy._id,
        estimatedValue: 920
      },
      {
        name: 'Sam Q',
        email: 'samq@example.com',
        phone: '+1-555-0105',
        tier: 2,
        score: 0.65,
        status: 'contacted',
        assignedWarmer: noah._id,
        assignedCloser: ivy._id,
        estimatedValue: 1200,
        stage: 'negotiation',
        probability: '75%'
      },
      {
        name: 'Morgan T',
        email: 'morgan@example.com',
        phone: '+1-555-0106',
        tier: 3,
        score: 0.55,
        status: 'contacted',
        assignedWarmer: ava._id,
        assignedCloser: zoe._id,
        estimatedValue: 800,
        stage: 'demo',
        probability: '60%'
      },
      {
        name: 'Riley K',
        email: 'riley@example.com',
        phone: '+1-555-0107',
        tier: 2,
        score: 0.48,
        status: 'contacted',
        assignedWarmer: maya._id,
        assignedCloser: sam._id,
        estimatedValue: 950,
        stage: 'proposal',
        probability: '45%'
      },
      {
        name: 'Charlie B',
        email: 'charlie@example.com',
        tier: 1,
        score: 0.82,
        status: 'cold'
      },
      {
        name: 'Dana L',
        email: 'dana@example.com',
        tier: 3,
        score: 0.35,
        status: 'cold'
      },
      {
        name: 'Jessie W',
        email: 'jessie@example.com',
        tier: 2,
        score: 0.71,
        status: 'cold'
      }
    ]);

    console.log('✅ Created leads');

    // Create Tasks
    await Task.create([
      {
        title: 'Follow up with Jordan P',
        priority: 'high',
        status: 'pending',
        assignee: maya._id,
        dueDate: 'Today',
        createdBy: admin._id,
        relatedLead: leads[0]._id
      },
      {
        title: 'Send proposal to Alex M',
        priority: 'high',
        status: 'pending',
        assignee: ivy._id,
        dueDate: 'Today',
        createdBy: admin._id,
        relatedLead: leads[1]._id
      },
      {
        title: 'Review warmer scripts',
        priority: 'medium',
        status: 'in_progress',
        assignee: admin._id,
        dueDate: 'Tomorrow',
        createdBy: admin._id
      },
      {
        title: 'Update CRM data',
        priority: 'low',
        status: 'pending',
        assignee: zoe._id,
        dueDate: 'Friday',
        createdBy: admin._id
      },
      {
        title: 'Prepare demo for Taylor S',
        priority: 'medium',
        status: 'completed',
        assignee: sam._id,
        dueDate: 'Yesterday',
        createdBy: admin._id,
        relatedLead: leads[2]._id
      }
    ]);

    console.log('✅ Created tasks');

    // Create Activities
    await Activity.create([
      {
        type: 'lead_assigned',
        user: maya._id,
        target: 'Jordan P',
        details: 'Lead assigned to warmer',
        relatedLead: leads[0]._id
      },
      {
        type: 'call_scheduled',
        user: ivy._id,
        target: 'Alex M',
        details: 'Call scheduled for 3:30 PM',
        relatedLead: leads[1]._id
      },
      {
        type: 'deal_closed',
        user: zoe._id,
        target: 'Taylor S',
        details: 'Deal closed won - $850',
        relatedLead: leads[2]._id
      },
      {
        type: 'lead_responded',
        target: 'Casey R',
        details: 'Lead responded to message',
        relatedLead: leads[3]._id
      },
      {
        type: 'lead_assigned',
        user: ava._id,
        target: 'Sam Q',
        details: 'Lead assigned to warmer',
        relatedLead: leads[4]._id
      },
      {
        type: 'call_completed',
        user: ivy._id,
        target: 'Morgan T',
        details: 'Demo call completed',
        relatedLead: leads[5]._id
      },
      {
        type: 'lead_marked_hot',
        user: maya._id,
        target: 'Riley K',
        details: 'Lead marked as hot',
        relatedLead: leads[6]._id
      },
      {
        type: 'user_login',
        user: admin._id,
        target: 'Admin User',
        details: 'User logged in'
      }
    ]);

    console.log('✅ Created activities');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('-----------------------------------');
    console.log('Admin:');
    console.log('  Email: admin@sentinelx.com');
    console.log('  Password: admin123\n');
    console.log('Warmer (Maya):');
    console.log('  Email: maya@sentinelx.com');
    console.log('  Password: warmer123\n');
    console.log('Closer (Ivy):');
    console.log('  Email: ivy@sentinelx.com');
    console.log('  Password: closer123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();