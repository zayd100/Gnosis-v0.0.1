import React, { useState } from 'react';
import { Activity, Search, Filter, Calendar, User, Target, Phone, Mail, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const ActivityLogPage = ({ activities, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getActivityIcon = (type) => {
    switch(type) {
      case 'lead_assigned': return <Target className="text-purple-600" size={20} />;
      case 'lead_status_changed': return <Activity className="text-blue-600" size={20} />;
      case 'message_sent': return <Mail className="text-green-600" size={20} />;
      case 'call_scheduled': return <Phone className="text-orange-600" size={20} />;
      case 'call_completed': return <CheckCircle className="text-green-600" size={20} />;
      case 'deal_closed': return <CheckCircle className="text-emerald-600" size={20} />;
      case 'deal_lost': return <XCircle className="text-red-600" size={20} />;
      case 'note_added': return <FileText className="text-gray-600" size={20} />;
      case 'user_login': return <User className="text-indigo-600" size={20} />;
      default: return <Activity className="text-gray-600" size={20} />;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'lead_assigned': return 'bg-purple-50 border-purple-200';
      case 'lead_status_changed': return 'bg-blue-50 border-blue-200';
      case 'message_sent': return 'bg-green-50 border-green-200';
      case 'call_scheduled': return 'bg-orange-50 border-orange-200';
      case 'call_completed': return 'bg-green-50 border-green-200';
      case 'deal_closed': return 'bg-emerald-50 border-emerald-200';
      case 'deal_lost': return 'bg-red-50 border-red-200';
      case 'note_added': return 'bg-gray-50 border-gray-200';
      case 'user_login': return 'bg-indigo-50 border-indigo-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatActivityText = (activity) => {
    const userName = activity.user?.name || 'System';
    const leadName = activity.lead?.name || 'Unknown';
    
    switch(activity.type) {
      case 'lead_assigned':
        return `${userName} was assigned lead: ${leadName}`;
      case 'lead_status_changed':
        return `${userName} changed ${leadName}'s status to ${activity.metadata?.newStatus || 'updated'}`;
      case 'message_sent':
        return `${userName} sent a message to ${leadName}`;
      case 'call_scheduled':
        return `${userName} scheduled a call with ${leadName}`;
      case 'call_completed':
        return `${userName} completed call with ${leadName}`;
      case 'deal_closed':
        return `${userName} closed deal with ${leadName} - $${activity.metadata?.value || 'N/A'}`;
      case 'deal_lost':
        return `${userName} marked ${leadName} as lost`;
      case 'note_added':
        return `${userName} added a note to ${leadName}`;
      case 'user_login':
        return `${userName} logged in`;
      default:
        return `${userName} performed an action`;
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredActivities = activities
    .filter(a => filterType === 'all' || a.type === filterType)
    .filter(a => {
      if (!searchTerm) return true;
      const text = formatActivityText(a).toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'lead_assigned', label: 'Lead Assignments' },
    { value: 'lead_status_changed', label: 'Status Changes' },
    { value: 'message_sent', label: 'Messages' },
    { value: 'call_scheduled', label: 'Calls Scheduled' },
    { value: 'deal_closed', label: 'Deals Closed' },
    { value: 'user_login', label: 'User Logins' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Activity Log
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredActivities.length} activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          {activityTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Activity Timeline */}
      <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border`}>
        <div className="p-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className={`p-4 rounded-xl border-2 ${getActivityColor(activity.type)} hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatActivityText(activity)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          activity.type.includes('closed') || activity.type.includes('completed') 
                            ? 'bg-green-100 text-green-700'
                            : activity.type.includes('lost')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {activity.type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Today</span>
            <Activity className="text-purple-600" size={20} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activities.filter(a => {
              const today = new Date();
              const activityDate = new Date(a.createdAt);
              return activityDate.toDateString() === today.toDateString();
            }).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Activities today</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Leads Assigned</span>
            <Target className="text-blue-600" size={20} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activities.filter(a => a.type === 'lead_assigned').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total assignments</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Deals Closed</span>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activities.filter(a => a.type === 'deal_closed').length}
          </p>
          <p className="text-xs text-green-600 mt-1">Successful closes</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Messages</span>
            <Mail className="text-orange-600" size={20} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activities.filter(a => a.type === 'message_sent').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Messages sent</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;