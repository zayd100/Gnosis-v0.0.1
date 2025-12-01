import React, { useState } from 'react';

const WarmerDashboard = () => {
  const [currentPage, setCurrentPage] = useState('leads');
  const [selectedLead, setSelectedLead] = useState(null);
  const [messageText, setMessageText] = useState('');
const [leadStatuses, setLeadStatuses] = useState({
  'Jordan P': 'hot',
  'Alex M': 'hot',
  'Taylor S': 'warm',
  'Casey R': 'warm'
});

const [stats, setStats] = useState({
  hot: 42,
  warm: 128,
  cold: 77
});
  // Mock data | change to utilis then change to the db. || Post writing the schema obviously. But in order for this to occur we have to make sure that we are getting enough users for feedback
  const leads = [
    { id: 1, name: 'Jordan P', status: 'Hot', intent: '--', responseSpeed: '--' },
    { id: 2, name: 'Alex M', status: 'Warm', intent: '--', responseSpeed: '--' },
    { id: 3, name: 'Taylor S', status: 'Cold', intent: '--', responseSpeed: '--' },
    { id: 4, name: 'Casey R', status: 'Hot', intent: '--', responseSpeed: '--' },
    { id: 5, name: 'Sam Q', status: 'Warm', intent: '--', responseSpeed: '--' }
  ];

  const conversation = [
    { sender: 'User', text: 'I want to learn more' },
    { sender: 'You', text: 'Great — when can you hop on a call?' }
  ];

  const templates = [
    "Hey there, thanks for reaching out — I can jump on a quick call to show you how this works. What time works for you?",
    "I saw you're interested in [product]. Let me know when you're free for a quick demo!",
    "Thanks for your interest! Can we schedule a 15-min call to discuss your needs?"
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hot': return 'text-orange-500';
      case 'Warm': return 'text-emerald-500';
      case 'Cold': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  const renderLeadsPage = () => (
    <div className="grid grid-cols-3 gap-8 h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Leads</h2>
        <div className="space-y-3">
          {leads.map(lead => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLead?.id === lead.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{lead.name}</span>
                <span className={`text-sm font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedLead ? selectedLead.name : 'Select a lead'}
          </h2>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Schedule Closer Call
            </button>
            <button className="px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
              Mark Hot
            </button>
          </div>
        </div>

        {selectedLead ? (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                Hey there, thanks for reaching out — I can jump on a quick call to show you how this works. What time works for you?
              </p>
            </div>

            <div className="mb-6">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="3"
              />
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Send
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Intent: --</h3>
                <p className="text-sm text-gray-600">Response speed: --</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {conversation.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-semibold text-gray-900">{msg.sender}:</span>
                      <span className="text-gray-700 ml-1">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Click on a lead to view details</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderScriptsPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Message Templates</h2>
          <div className="space-y-3">
            {templates.map((template, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 mb-3">{template}</p>
                <button className="text-xs text-purple-600 font-medium hover:text-purple-700">
                  Use Template
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors">
            + Add New Template
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Training Resources</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-1">Warm Lead Techniques</h3>
              <p className="text-sm text-gray-600 mb-2">Best practices for engaging warm leads</p>
              <button className="text-xs text-blue-600 font-medium hover:text-blue-700">
                View Resource →
              </button>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-1">Objection Handling</h3>
              <p className="text-sm text-gray-600 mb-2">How to overcome common objections</p>
              <button className="text-xs text-green-600 font-medium hover:text-green-700">
                View Resource →
              </button>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-1">Call Scripts</h3>
              <p className="text-sm text-gray-600 mb-2">Proven scripts for scheduling calls</p>
              <button className="text-xs text-purple-600 font-medium hover:text-purple-700">
                View Resource →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Video Training</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="w-full h-32 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-8 border-l-purple-600 border-y-6 border-y-transparent ml-1"></div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Training Video {i}</h3>
              <p className="text-xs text-gray-500 mt-1">12:34</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOnboardingPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SentinelX</h2>
          <p className="text-gray-600">Complete these steps to get started as a warmer</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-6 bg-green-50 rounded-lg border-2 border-green-500">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Account Setup</h3>
              <p className="text-sm text-gray-600">Your account has been created and verified</p>
            </div>
            <span className="text-sm font-medium text-green-600">Complete</span>
          </div>

          <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-500">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Watch Training Videos</h3>
              <p className="text-sm text-gray-600 mb-3">Learn the fundamentals of lead warming</p>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Start Training
              </button>
            </div>
            <span className="text-sm font-medium text-blue-600">In Progress</span>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-300">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Review Scripts</h3>
              <p className="text-sm text-gray-600">Familiarize yourself with message templates</p>
            </div>
            <span className="text-sm font-medium text-gray-500">Pending</span>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-300">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Practice Session</h3>
              <p className="text-sm text-gray-600">Complete a mock conversation with a practice lead</p>
            </div>
            <span className="text-sm font-medium text-gray-500">Pending</span>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-300">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white font-bold">
              5
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Go Live</h3>
              <p className="text-sm text-gray-600">Start engaging with real leads</p>
            </div>
            <span className="text-sm font-medium text-gray-500">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );

const renderPerformancePage = () => {
  const totalLeads = stats.hot + stats.warm + stats.cold;

  const handleStatusChange = (leadName, newStatus) => {
    const oldStatus = leadStatuses[leadName];
    if (oldStatus === newStatus) return;

    setLeadStatuses(prev => ({
      ...prev,
      [leadName]: newStatus
    }));

    setStats(prev => ({
      ...prev,
      [oldStatus]: prev[oldStatus] - 1,
      [newStatus]: prev[newStatus] + 1
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hot":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "warm":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "cold":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Leads Contacted</p>
          <p className="text-3xl font-bold text-gray-900">247</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Response Rate</p>
          <p className="text-3xl font-bold text-gray-900">68%</p>
          <p className="text-xs text-green-600 mt-2">↑ 5% from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Hot Leads</p>
          <p className="text-3xl font-bold text-gray-900">{stats.hot}</p>
          <p className="text-xs text-red-600 mt-2">↓ 3% from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Calls Scheduled</p>
          <p className="text-3xl font-bold text-gray-900">31</p>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last week</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Activity</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 72, 58, 81, 69, 75, 88].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-purple-500 rounded-t" style={{ height: `${height}%` }}></div>
                <span className="text-xs text-gray-600">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Status Breakdown</h2>
          <div className="space-y-4 mt-8">
            {/* Hot */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Hot Leads</span>
                <span className="font-semibold text-gray-900">
                  {stats.hot} ({Math.round((stats.hot / totalLeads) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full"
                  style={{ width: `${(stats.hot / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Warm */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Warm Leads</span>
                <span className="font-semibold text-gray-900">
                  {stats.warm} ({Math.round((stats.warm / totalLeads) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{ width: `${(stats.warm / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Cold */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Cold Leads</span>
                <span className="font-semibold text-gray-900">
                  {stats.cold} ({Math.round((stats.cold / totalLeads) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-400 h-3 rounded-full"
                  style={{ width: `${(stats.cold / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { lead: "Jordan P", action: "Scheduled call", time: "5 min ago", color: "green" },
            { lead: "Alex M", action: "Marked as hot", time: "23 min ago", color: "orange" },
            { lead: "Taylor S", action: "Sent follow-up", time: "1 hour ago", color: "blue" },
            { lead: "Casey R", action: "Received response", time: "2 hours ago", color: "purple" }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                <div>
                  <p className="font-semibold text-gray-900">{activity.lead}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={leadStatuses[activity.lead] || "warm"}
                  onChange={(e) => handleStatusChange(activity.lead, e.target.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer ${getStatusColor(
                    leadStatuses[activity.lead] || "warm"
                  )}`}
                >
                  <option value="hot">🔥 Hot</option>
                  <option value="warm">✨ Warm</option>
                  <option value="cold">❄️ Cold</option>
                </select>

                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

  const renderSettingsPage = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input type="text" defaultValue="Warmer User" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" defaultValue="warmer@sentinelx.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            { label: 'New lead assignments', checked: true },
            { label: 'Lead responses', checked: true },
            { label: 'Performance reports', checked: false },
            { label: 'Training updates', checked: true }
          ].map((setting, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{setting.label}</span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-colors cursor-pointer"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Work Schedule</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Hours</label>
            <div className="flex gap-3">
              <input type="time" defaultValue="09:00" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
              <span className="flex items-center text-gray-500">to</span>
              <input type="time" defaultValue="17:00" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>EST (UTC-5)</option>
              <option>CST (UTC-6)</option>
              <option>MST (UTC-7)</option>
              <option>PST (UTC-8)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
              SX
            </div>
            <span className="font-bold text-xl text-gray-900">SentinelX</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button 
            onClick={() => setCurrentPage('leads')}
            className={`w-full text-left block px-4 py-3 rounded-lg font-medium mb-1 ${
              currentPage === 'leads' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Home / Leads
          </button>
          <button 
            onClick={() => setCurrentPage('scripts')}
            className={`w-full text-left block px-4 py-3 rounded-lg font-medium mb-1 ${
              currentPage === 'scripts' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Scripts & Training
          </button>
          <button 
            onClick={() => setCurrentPage('onboarding')}
            className={`w-full text-left block px-4 py-3 rounded-lg font-medium mb-1 ${
              currentPage === 'onboarding' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Onboarding
          </button>
          <button 
            onClick={() => setCurrentPage('performance')}
            className={`w-full text-left block px-4 py-3 rounded-lg font-medium mb-1 ${
              currentPage === 'performance' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Performance
          </button>
          <button 
            onClick={() => setCurrentPage('settings')}
            className={`w-full text-left block px-4 py-3 rounded-lg font-medium ${
              currentPage === 'settings' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentPage === 'leads' && 'Warmer Dashboard'}
            {currentPage === 'scripts' && 'Scripts & Training'}
            {currentPage === 'onboarding' && 'Onboarding'}
            {currentPage === 'performance' && 'Performance Analytics'}
            {currentPage === 'settings' && 'Settings'}
          </h1>
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium">
              <option>Warmer</option>
            </select>
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          {currentPage === 'leads' && renderLeadsPage()}
          {currentPage === 'scripts' && renderScriptsPage()}
          {currentPage === 'onboarding' && renderOnboardingPage()}
          {currentPage === 'performance' && renderPerformancePage()}
          {currentPage === 'settings' && renderSettingsPage()}
        </div>
      </div>
    </div>
  );
};
export default WarmerDashboard;