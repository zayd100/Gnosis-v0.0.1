import React, { useState } from 'react';
import { mockLeadQueue, mockTopWarmers, mockTopClosers } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Moon,
  Sun,
  Users,
  BarChart3,
  Plug,
  Settings as SettingsIcon,
  Zap,
  ChevronRight,
  Check,
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [autoAssign, setAutoAssign] = useState(true);
  const [prioritizeHighTier, setPrioritizeHighTier] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // === remove from each page || transfer in utils.===
  // change all the mockdata here to the utils so i know what i am talking about. This should know about what they are really on about
  const leadQueue = [
    { id: 1, tier: 1, score: 0.9, email: 'lead1@example.com', tier_label: 'W1', status: 'hot' },
    { id: 2, tier: 1, score: 0.58, email: 'lead2@example.com', tier_label: 'W5', status: 'hot' },
    { id: 3, tier: 3, score: 0.75, email: 'lead3@example.com', tier_label: 'W1', status: 'warm' },
    { id: 4, tier: 2, score: 0.27, email: 'lead4@example.com', tier_label: 'W1', status: 'hot' }
  ];

  const topWarmers = [
    { name: 'Maya', score: 78, leads: 22, referrals: 6 },
    { name: 'Ava', score: 66, leads: 18, referrals: 4 },
    { name: 'Rin', score: 58, leads: 16, referrals: 3 },
    { name: 'Noah', score: 56, leads: 14, referrals: 2 },
    { name: 'Leo', score: 43, leads: 11, referrals: 1 }
  ];

  const topClosers = [
    { name: 'Ivy', score: 106, conv: '34%', avg: 800 },
    { name: 'Zoe', score: 103, conv: '38%', avg: 720 },
    { name: 'Sam', score: 81, conv: '28%', avg: 650 },
    { name: 'Max', score: 62, conv: '22%', avg: 530 }
  ];

  const autoAssignments = [
    { lead: 7, tier: 3, score: 0.94, warmer: 'Maya (W3)', closer: 'Ivy (C1)' },
    { lead: 3, tier: 3, score: 0.75, warmer: 'Ava (W1)', closer: 'Zoe (C3)' },
    { lead: 17, tier: 2, score: 0.82, warmer: 'Maya (W3)', closer: 'Ivy (C1)' },
    { lead: 5, tier: 2, score: 0.58, warmer: 'Ava (W1)', closer: 'Zoe (C3)' },
    { lead: 11, tier: 2, score: 0.47, warmer: 'Maya (W3)', closer: 'Ivy (C1)' },
    { lead: 6, tier: 2, score: 0.4, warmer: 'Ava (W1)', closer: 'Zoe (C3)' }
  ];

  const mrrData = [
    { day: 'D-6', value: 40000 },
    { day: 'D-5', value: 55000 },
    { day: 'D-4', value: 62000 },
    { day: 'D-3', value: 72000 },
    { day: 'D-2', value: 85000 },
    { day: 'D-1', value: 92000 },
    { day: 'Today', value: 5000 }
  ];

  const teamMembers = [
    { id: 1, name: 'Maya', role: 'Warmer', tier: 'W3', score: 78, status: 'online', leads: 22 },
    { id: 2, name: 'Ivy', role: 'Closer', tier: 'C1', score: 106, status: 'online', conv: '34%' },
    { id: 3, name: 'Ava', role: 'Warmer', tier: 'W1', score: 66, status: 'away', leads: 18 },
    { id: 4, name: 'Zoe', role: 'Closer', tier: 'C3', score: 103, status: 'online', conv: '38%' },
  ];
  

  const integrations = [
    { name: 'GoHighLevel', connected: true, lastSync: '2 min ago' },
    { name: 'HubSpot', connected: true, lastSync: '5 min ago' },
    { name: 'Zapier', connected: false, lastSync: 'Never' },
    { name: 'Slack', connected: true, lastSync: '1 hour ago' },
  ];

  const getTierBadge = (tier) => {
    const map = {
      1: 'bg-purple-100 text-purple-700 border-purple-200',
      2: 'bg-blue-100 text-blue-700 border-blue-200',
      3: 'bg-green-100 text-green-700 border-green-200',
      W1: 'bg-purple-100 text-purple-700 border-purple-200',
      W3: 'bg-purple-100 text-purple-700 border-purple-200',
      C1: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      C3: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return map[tier] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusDot = (status) => {
    const colors = { hot: 'bg-orange-500', warm: 'bg-yellow-500', cold: 'bg-blue-400' };
    return colors[status] || 'bg-gray-400';
  };

  // === SIDEBAR ===
  const Sidebar = () => (
    <div className={`w-64 border-r ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} flex flex-col shadow-lg`}>
      <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            SX
          </div>
          <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>SentinelX</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { page: 'dashboard', label: 'AI Lead Router', icon: Zap },
          { page: 'team', label: 'Team Management', icon: Users },
          { page: 'analytics', label: 'Analytics', icon: BarChart3 },
          { page: 'integrations', label: 'Integrations', icon: Plug },
          { page: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentPage === page
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-sm'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
            {currentPage === page && <ChevronRight className="ml-auto" size={18} />}
          </button>
        ))}
      </nav>
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500"></div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@sentinelx.ai</p>
          </div>
        </div>
      </div>
    </div>
  );

  // === HEADER ===
  const Header = () => (
    <div className={`border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} px-8 py-5 flex items-center justify-between shadow-sm`}>
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentPage === 'dashboard' && 'AI Lead Routing Dashboard'}
          {currentPage === 'team' && 'Team Management'}
          {currentPage === 'analytics' && 'Analytics & Reports'}
          {currentPage === 'integrations' && 'Integrations'}
          {currentPage === 'settings' && 'Settings'}
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
          {currentPage === 'dashboard' && 'Auto-pair warmers & closers • Leaderboards • Live assignment'}
          {currentPage === 'team' && 'Manage roles, tiers, performance and availability'}
          {currentPage === 'analytics' && 'Deep insights into pipeline and revenue'}
          {currentPage === 'integrations' && 'Connect your tools and automate workflows'}
          {currentPage === 'settings' && 'Configure AI behavior and preferences'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {currentPage === 'dashboard' && (
          <>
            <div className={`${darkMode ? 'bg-gradient-to-r from-green-900 to-emerald-900 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'} border px-4 py-2 rounded-xl`}>
              <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Estimated MRR: $4,680</span>
            </div>
            <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );

  // === FULL DASHBOARD PAGE (Your Original Beautiful One) ===
  const DashboardPage = () => (
    <div className="grid grid-cols-12 gap-6">
      {/* Lead Queue */}
      <div className={`col-span-4 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lead Queue</h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Incoming leads awaiting AI assignment</p>
          </div>
        </div>
        <div className="space-y-3">
          {leadQueue.map(lead => (
            <div key={lead.id} className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-purple-300'} p-4 rounded-xl border transition-all`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lead {lead.id}</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getTierBadge(lead.tier)}`}>
                    Tier {lead.tier}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(lead.status)}`}></div>
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lead.tier_label} - C1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score: {lead.score}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} truncate max-w-[150px]`}>{lead.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Column */}
      <div className="col-span-5 space-y-6">
        {/* Controls */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Controls</h2>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'} rounded-xl border`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={prioritizeHighTier} onChange={e => setPrioritizeHighTier(e.target.checked)} className="w-5 h-5 text-purple-600 rounded" />
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Prioritize High-Tier</span>
              </div>
            </div>
            <div className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'} rounded-xl border`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={autoAssign} onChange={e => setAutoAssign(e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto Assign</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-md">
                Run AI Assignment
              </button>
              <button className={`flex-1 px-4 py-3 ${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500' : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400'} font-medium rounded-xl transition-all`}>
                Simulate Close
              </button>
            </div>
          </div>
        </div>

        {/* MRR Trend */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>MRR Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mrrData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '12px' }} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Auto Pairing Preview */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Auto Pairing Preview</h2>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Preview of what AI will assign</p>
          <div className="space-y-2">
            {autoAssignments.slice(0, 4).map((a, i) => (
              <div key={i} className={`grid grid-cols-5 gap-3 p-3 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'} rounded-xl border text-xs`}>
                <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lead {a.lead}</div>
                <div className={`px-2 py-1 rounded-lg font-semibold border text-center ${getTierBadge(a.tier)}`}>{a.tier}</div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>{a.score}</div>
                <div className="text-purple-700 font-medium">{a.warmer}</div>
                <div className="text-indigo-700 font-medium">{a.closer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Leaderboards */}
      <div className="col-span-3 space-y-6">
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Top Warmers</h2>
          <div className="space-y-3">
            {topWarmers.map((w, i) => (
              <div key={i} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'} rounded-xl border`}>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{w.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score: {w.score}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{w.leads} leads/day</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Referrals: {w.referrals}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Top Closers</h2>
          <div className="space-y-3">
            {topClosers.map((c, i) => (
              <div key={i} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-cyan-900 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} rounded-xl border`}>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score: {c.score}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Conv: {c.conv}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Avg Deal: ${c.avg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // === OTHER PAGES (Team, Integrations, Settings) ===
  const TeamManagementPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {teamMembers.map(m => (
        <div key={m.id} className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">{m.name[0]}</div>
              <div>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.name}</h3>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${m.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-gray-500">Tier</span><span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTierBadge(m.tier)}`}>{m.tier}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">Score</span><span className="font-bold text-purple-600">{m.score}</span></div>
            {m.leads && <div className="flex justify-between"><span className="text-sm text-gray-500">Leads/day</span><span>{m.leads}</span></div>}
            {m.conv && <div className="flex justify-between"><span className="text-sm text-gray-500">Close Rate</span><span className="text-indigo-600">{m.conv}</span></div>}
          </div>
          <button className="mt-5 w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium">
            Edit Member
          </button>
        </div>
      ))}
    </div>
  );

  const IntegrationsPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {integrations.map((int) => (
          <div key={int.name} className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gray-200 border-2 border-dashed rounded-xl"></div>
              <div>
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{int.name}</h4>
                <p className="text-sm text-gray-500">Last sync: {int.lastSync}</p>
              </div>
            </div>
            {int.connected ? (
              <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                <Check size={16} /> Connected
              </span>
            ) : (
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-medium">
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="max-w-3xl space-y-8">
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-8`}>
        <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Routing Rules</h3>
        <div className="space-y-6">
          <label className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto-assign leads</p>
              <p className="text-sm text-gray-500">Immediately route new leads to best warmer + closer</p>
            </div>
            <input type="checkbox" checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} className="w-6 h-6 text-purple-600 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Prioritize high-tier leads</p>
              <p className="text-sm text-gray-500">Give Tier 1 leads to top performers first</p>
            </div>
            <input type="checkbox" checked={prioritizeHighTier} onChange={(e) => setPrioritizeHighTier(e.target.checked)} className="w-6 h-6 text-purple-600 rounded" />
          </label>
        </div>
      </div>
    </div>
  );

  const AnalyticsPage = () => (
    <div className="text-center py-32 text-3xl text-gray-500">Analytics coming soon</div>
  );

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-8">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'team' && <TeamManagementPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'integrations' && <IntegrationsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;