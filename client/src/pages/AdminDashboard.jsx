import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leadsAPI, usersAPI, analyticsAPI, tasksAPI, activitiesAPI } from '../api';
import { 
  LayoutDashboard, Users, BarChart3, Activity, CheckSquare, 
  Plug, Settings, LogOut, Moon, Sun, DollarSign, Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import all sub-pages
import AnalyticsPage from '../components/AnalyticsPage';
import TeamManagementPage from '../components/TeamManagementPage';
import ActivityLogPage from '../components/ActivityLogPage';
import TasksPage from '../components/TasksPage';
import SettingsPage from '../components/SettingsPage';
import IntegrationsPage from '../components/IntegrationsPage';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for data
  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [mrrData, setMrrData] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ topWarmers: [], topClosers: [] });
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [leadsRes, usersRes, analyticsRes, mrrRes, leaderboardRes, tasksRes, activitiesRes] = await Promise.all([
        leadsAPI.getAll(),
        usersAPI.getAll(),
        analyticsAPI.getDashboard(),
        analyticsAPI.getMRR(),
        usersAPI.getLeaderboard(),
        tasksAPI.getAll(),
        activitiesAPI.getAll()
      ]);

      setLeads(leadsRes.data.data);
      setTeamMembers(usersRes.data.data);
      setAnalytics(analyticsRes.data.data);
      setMrrData(mrrRes.data.data);
      setLeaderboard(leaderboardRes.data.data);
      setTasks(tasksRes.data.data);
      setActivities(activitiesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async (prioritize = false) => {
    try {
      await leadsAPI.autoAssign({ prioritizeHighTier: prioritize });
      alert('Leads assigned successfully!');
      fetchAllData();
    } catch (error) {
      console.error('Error auto-assigning:', error);
      alert('Failed to assign leads');
    }
  };

  const getTierBadge = (tier) => {
    const tiers = {
      'W1': 'bg-purple-100 text-purple-700 border-purple-200',
      'W2': 'bg-blue-100 text-blue-700 border-blue-200',
      'W3': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'C1': 'bg-green-100 text-green-700 border-green-200',
      'C2': 'bg-teal-100 text-teal-700 border-teal-200',
      'C3': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      '1': 'bg-purple-100 text-purple-700 border-purple-200',
      '2': 'bg-blue-100 text-blue-700 border-blue-200',
      '3': 'bg-green-100 text-green-700 border-green-200'
    };
    return tiers[tier] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const menuItems = [
    { id: 'dashboard', label: 'AI Lead Router', icon: <LayoutDashboard size={20} /> },
    { id: 'team', label: 'Team Management', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'activity', label: 'Activity Log', icon: <Activity size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'integrations', label: 'Integrations', icon: <Plug size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard Page Component
  const DashboardPage = () => {
    const unassignedLeads = leads.filter(l => !l.assignedWarmer || !l.assignedCloser);

    return (
      <div className="space-y-6">
        {/* Lead Queue */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Lead Queue ({unassignedLeads.length} unassigned)
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleAutoAssign(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2"
              >
                <Zap size={18} />
                Prioritize High-Tier
              </button>
              <button
                onClick={() => handleAutoAssign(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md flex items-center gap-2"
              >
                <Zap size={18} />
                Auto-Assign All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unassignedLeads.slice(0, 6).map(lead => (
              <div key={lead._id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1">{lead.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{lead.email}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getTierBadge(lead.tier)}`}>
                    Tier {lead.tier}
                  </span>
                  <span className="text-xs text-gray-500">Score: {lead.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MRR Trend Chart */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            MRR Trend (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mrrData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Warmers */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Warmers
            </h3>
            <div className="space-y-3">
              {leaderboard.topWarmers.slice(0, 5).map((warmer, index) => (
                <div key={warmer._id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900">{warmer.name}</p>
                      <p className="text-xs text-gray-600">{warmer.leadsHandled} leads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{warmer.performanceScore}</p>
                    <p className="text-xs text-gray-500">score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Closers */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Closers
            </h3>
            <div className="space-y-3">
              {leaderboard.topClosers.slice(0, 5).map((closer, index) => (
                <div key={closer._id} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900">{closer.name}</p>
                      <p className="text-xs text-gray-600">{closer.conversionRate}% conv.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{closer.performanceScore}</p>
                    <p className="text-xs text-gray-500">score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            SentinelX
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="px-3">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : darkMode
                  ? 'text-gray-400 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-8 py-5 flex items-center justify-between`}>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {menuItems.find(m => m.id === currentPage)?.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium">
              <DollarSign size={18} />
              <span>MRR: ${(analytics?.revenue?.mrr || 0).toLocaleString()}</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {currentPage === 'dashboard' && <DashboardPage />}
{currentPage === 'team' && <TeamManagementPage teamMembers={teamMembers} darkMode={darkMode} getTierBadge={getTierBadge} onDataUpdate={fetchAllData} />}
{currentPage === 'analytics' && <AnalyticsPage darkMode={darkMode} />}
{currentPage === 'activity' && <ActivityLogPage activities={activities} darkMode={darkMode} />}
{currentPage === 'tasks' && <TasksPage tasks={tasks} darkMode={darkMode} onDataUpdate={fetchAllData} teamMembers={teamMembers} />}
{currentPage === 'integrations' && <IntegrationsPage darkMode={darkMode} />}
{currentPage === 'settings' && <SettingsPage darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;