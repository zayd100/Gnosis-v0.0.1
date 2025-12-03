import React, { useState, useEffect } from 'react';
import { analyticsAPI, leadsAPI, usersAPI } from '../api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Award, Activity } from 'lucide-react';

const AnalyticsPage = ({ darkMode }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [mrrData, setMrrData] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ topWarmers: [], topClosers: [] });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, mrrRes, leaderboardRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getMRR(),
        usersAPI.getLeaderboard()
      ]);

      setAnalytics(analyticsRes.data.data);
      setMrrData(mrrRes.data.data);
      setLeaderboard(leaderboardRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prepare data for charts
  const leadStatusData = [
    { name: 'Hot', value: analytics?.leads?.hot || 0, color: '#f97316' },
    { name: 'Warm', value: analytics?.leads?.warm || 0, color: '#eab308' },
    { name: 'Cold', value: analytics?.leads?.cold || 0, color: '#3b82f6' },
    { name: 'Contacted', value: analytics?.leads?.contacted || 0, color: '#10b981' }
  ];

  const teamPerformanceData = leaderboard.topWarmers.slice(0, 5).map(w => ({
    name: w.name,
    score: w.performanceScore,
    leads: w.leadsHandled
  }));

  const closerPerformanceData = leaderboard.topClosers.slice(0, 5).map(c => ({
    name: c.name,
    score: c.performanceScore,
    conversion: c.conversionRate
  }));

  const COLORS = ['#f97316', '#eab308', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Users className="text-purple-600" size={24} />}
          title="Total Leads"
          value={analytics?.leads?.total || 0}
          change="+12%"
          positive={true}
          darkMode={darkMode}
        />
        <MetricCard
          icon={<TrendingUp className="text-green-600" size={24} />}
          title="Conversion Rate"
          value="34%"
          change="+6%"
          positive={true}
          darkMode={darkMode}
        />
        <MetricCard
          icon={<DollarSign className="text-blue-600" size={24} />}
          title="Monthly Revenue"
          value={`$${(analytics?.revenue?.mrr || 0).toLocaleString()}`}
          change="+18%"
          positive={true}
          darkMode={darkMode}
        />
        <MetricCard
          icon={<Target className="text-orange-600" size={24} />}
          title="Hot Leads"
          value={analytics?.leads?.hot || 0}
          change="-3%"
          positive={false}
          darkMode={darkMode}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Trend */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            MRR Trend (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mrrData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#fff', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Status Distribution */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Lead Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {leadStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warmer Performance */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Warmer Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#fff', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="score" fill="#8b5cf6" name="Performance Score" />
              <Bar dataKey="leads" fill="#06b6d4" name="Leads Handled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Closer Performance */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Closer Conversion Rates
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={closerPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#fff', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="score" fill="#10b981" name="Performance Score" />
              <Bar dataKey="conversion" fill="#f59e0b" name="Conversion %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Team Size</h3>
            <Users className="text-purple-600" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total Warmers</span>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics?.team?.warmers?.total || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total Closers</span>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics?.team?.closers?.total || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-500">Currently Online</span>
              <span className="text-xl font-bold text-green-600">
                {(analytics?.team?.warmers?.online || 0) + (analytics?.team?.closers?.online || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pipeline Health</h3>
            <Activity className="text-blue-600" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Scheduled Calls</span>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics?.leads?.scheduled || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Unassigned Leads</span>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics?.leads?.unassigned || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-500">Closed This Month</span>
              <span className="text-xl font-bold text-green-600">
                {analytics?.leads?.closed || 0}
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Performers</h3>
            <Award className="text-yellow-600" size={24} />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Best Warmer</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {leaderboard.topWarmers[0]?.name || 'N/A'}
              </p>
              <p className="text-sm text-purple-600">
                Score: {leaderboard.topWarmers[0]?.performanceScore || 0}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Best Closer</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {leaderboard.topClosers[0]?.name || 'N/A'}
              </p>
              <p className="text-sm text-green-600">
                Conv: {leaderboard.topClosers[0]?.conversionRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ icon, title, value, change, positive, darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500">{title}</span>
      {icon}
    </div>
    <p className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </p>
    <p className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
      {change} from last month
    </p>
  </div>
);

export default AnalyticsPage;