import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leadsAPI, analyticsAPI } from '../api';
import { 
  Flame, Zap, Snowflake, Send, Calendar, LogOut, 
  TrendingUp, MessageSquare, Clock, CheckCircle 
} from 'lucide-react';

const WarmerDashboard = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, hot, warm, cold

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        leadsAPI.getAll(), // Gets only assigned leads for warmers
        analyticsAPI.getDashboard()
      ]);
      setLeads(leadsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedLead) return;

    try {
      await leadsAPI.addMessage(selectedLead._id, { text: messageText });
      setMessageText('');
      
      // Update local state
      const updatedLead = { ...selectedLead };
      updatedLead.messages = [...(updatedLead.messages || []), {
        sender: 'user',
        text: messageText,
        createdAt: new Date()
      }];
      setSelectedLead(updatedLead);
      
      alert('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleMarkStatus = async (status) => {
    if (!selectedLead) return;

    try {
      await leadsAPI.update(selectedLead._id, { status });
      
      // Update local state
      setSelectedLead({ ...selectedLead, status });
      setLeads(leads.map(l => l._id === selectedLead._id ? { ...l, status } : l));
      
      alert(`Lead marked as ${status}!`);
      fetchData(); // Refresh to update stats
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead status');
    }
  };

  const handleScheduleCall = async () => {
    if (!selectedLead) return;

    const callTime = prompt('Enter call time (e.g., "Today 2:00 PM"):');
    if (!callTime) return;

    try {
      await leadsAPI.update(selectedLead._id, { 
        status: 'scheduled',
        scheduledCallTime: new Date() // In production, parse the callTime properly
      });
      
      alert('Call scheduled successfully!');
      fetchData();
    } catch (error) {
      console.error('Error scheduling call:', error);
      alert('Failed to schedule call');
    }
  };

  const getFilteredLeads = () => {
    if (filter === 'all') return leads;
    return leads.filter(l => l.status === filter);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'hot': return <Flame className="text-orange-500" size={20} />;
      case 'warm': return <Zap className="text-yellow-500" size={20} />;
      case 'cold': return <Snowflake className="text-blue-400" size={20} />;
      default: return <MessageSquare className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'hot': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'warm': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your leads...</p>
        </div>
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warmer Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">My Leads</span>
              <MessageSquare className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total assigned</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Hot Leads</span>
              <Flame className="text-orange-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {analytics?.leads?.hot || 0}
            </p>
            <p className="text-xs text-green-600 mt-1">Ready to close</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Response Rate</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">68%</p>
            <p className="text-xs text-green-600 mt-1">↑ 5% from last week</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Calls Scheduled</span>
              <Calendar className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {leads.filter(l => l.status === 'scheduled').length}
            </p>
            <p className="text-xs text-blue-600 mt-1">This week</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Leads</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All ({leads.length})</option>
                <option value="hot">Hot ({leads.filter(l => l.status === 'hot').length})</option>
                <option value="warm">Warm ({leads.filter(l => l.status === 'warm').length})</option>
                <option value="cold">Cold ({leads.filter(l => l.status === 'cold').length})</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredLeads.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No leads yet</p>
              ) : (
                filteredLeads.map(lead => (
                  <div
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedLead?._id === lead._id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50 to-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(lead.status)}
                        <span className="font-bold text-gray-900">{lead.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{lead.email}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Score: {lead.score}</span>
                      <span className="text-xs text-gray-500">Tier {lead.tier}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lead Details & Messaging */}
          <div className="col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            {!selectedLead ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Select a lead to start messaging</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Lead Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedLead.name}</h3>
                    <p className="text-sm text-gray-600">{selectedLead.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedLead.status)}
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>

                {/* Lead Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Tier</p>
                    <p className="text-lg font-bold text-gray-900">Tier {selectedLead.tier}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Score</p>
                    <p className="text-lg font-bold text-gray-900">{selectedLead.score}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Value</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${selectedLead.estimatedValue || '---'}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => handleMarkStatus('hot')}
                    className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Flame size={18} />
                    Mark Hot
                  </button>
                  <button
                    onClick={() => handleMarkStatus('warm')}
                    className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Zap size={18} />
                    Mark Warm
                  </button>
                  <button
                    onClick={handleScheduleCall}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    Schedule Call
                  </button>
                </div>

                {/* Message History */}
                <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto max-h-[250px]">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Conversation</h4>
                  {!selectedLead.messages || selectedLead.messages.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No messages yet. Start the conversation!</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedLead.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-purple-100 ml-8'
                              : 'bg-white mr-8'
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">
                            {msg.sender === 'user' ? 'You' : selectedLead.name}:
                          </p>
                          <p className="text-sm text-gray-700">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={18} />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarmerDashboard;