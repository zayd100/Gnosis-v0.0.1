import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leadsAPI, analyticsAPI } from '../api';
import { 
  Phone, Calendar, DollarSign, LogOut, TrendingUp, 
  CheckCircle, XCircle, Clock, Target, Award, Users 
} from 'lucide-react';

const CloserDashboard = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('calls'); // calls, pipeline

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        leadsAPI.getAll(), // Gets only assigned leads for closers
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

  const scheduledCalls = leads.filter(l => l.status === 'scheduled');
  const pipelineLeads = leads.filter(l => 
    ['contacted', 'qualified', 'demo', 'proposal', 'negotiation'].includes(l.stage)
  );

  const handleCloseWon = async () => {
    if (!selectedCall) return;

    const dealValue = prompt('Enter deal value ($):');
    if (!dealValue) return;

    try {
      await leadsAPI.update(selectedCall._id, {
        status: 'closed_won',
        estimatedValue: parseInt(dealValue)
      });

      if (callNotes.trim()) {
        await leadsAPI.addNote(selectedCall._id, { text: callNotes });
      }

      alert('Deal closed successfully! 🎉');
      setCallNotes('');
      setSelectedCall(null);
      fetchData();
    } catch (error) {
      console.error('Error closing deal:', error);
      alert('Failed to close deal');
    }
  };

  const handleCloseLost = async () => {
    if (!selectedCall) return;

    const reason = prompt('Reason for lost deal:');
    if (!reason) return;

    try {
      await leadsAPI.update(selectedCall._id, {
        status: 'closed_lost'
      });

      await leadsAPI.addNote(selectedCall._id, { 
        text: `Lost: ${reason}` 
      });

      alert('Deal marked as lost');
      setCallNotes('');
      setSelectedCall(null);
      fetchData();
    } catch (error) {
      console.error('Error marking as lost:', error);
      alert('Failed to update deal');
    }
  };

  const handleReschedule = async () => {
    if (!selectedCall) return;

    const newTime = prompt('Enter new call time:');
    if (!newTime) return;

    try {
      await leadsAPI.update(selectedCall._id, {
        scheduledCallTime: new Date() // In production, parse newTime properly
      });

      alert('Call rescheduled!');
      fetchData();
    } catch (error) {
      console.error('Error rescheduling:', error);
      alert('Failed to reschedule');
    }
  };

  const handleMoveStage = async (leadId, newStage) => {
    try {
      await leadsAPI.update(leadId, { stage: newStage });
      alert(`Moved to ${newStage} stage`);
      fetchData();
    } catch (error) {
      console.error('Error moving stage:', error);
      alert('Failed to update stage');
    }
  };

  const getTierBadge = (tier) => {
    const colors = {
      1: 'bg-purple-100 text-purple-700 border-purple-200',
      2: 'bg-blue-100 text-blue-700 border-blue-200',
      3: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[tier] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Closer Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView('calls')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'calls'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scheduled Calls
            </button>
            <button
              onClick={() => setView('pipeline')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'pipeline'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pipeline
            </button>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Scheduled Calls</span>
              <Calendar className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{scheduledCalls.length}</p>
            <p className="text-xs text-blue-600 mt-1">{scheduledCalls.filter(c => c.scheduledCallTime).length} today</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {analytics?.performance?.conversionRate || user?.conversionRate || 34}%
            </p>
            <p className="text-xs text-green-600 mt-1">↑ 6% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pipeline Value</span>
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${(analytics?.performance?.pipelineValue || 28000).toLocaleString()}
            </p>
            <p className="text-xs text-purple-600 mt-1">{pipelineLeads.length} active deals</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Deal Size</span>
              <Award className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${user?.avgDealSize || 820}
            </p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>

        {/* Main Content */}
        {view === 'calls' ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Scheduled Calls List */}
            <div className="col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Scheduled Calls</h2>
              <div className="space-y-3">
                {scheduledCalls.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No scheduled calls</p>
                ) : (
                  scheduledCalls.map(call => (
                    <div
                      key={call._id}
                      onClick={() => setSelectedCall(call)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCall?._id === call._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50 to-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Phone className="text-blue-600" size={20} />
                          <span className="font-bold text-gray-900">{call.name}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getTierBadge(call.tier)}`}>
                            Tier {call.tier}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-purple-700">
                          ${call.estimatedValue || 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Warmer: {call.assignedWarmer?.name || 'N/A'}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock size={14} />
                          {call.scheduledCallTime 
                            ? new Date(call.scheduledCallTime).toLocaleString()
                            : 'Time TBD'
                          }
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Call Details */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {selectedCall ? 'Call Details' : 'Select a Call'}
              </h2>

              {selectedCall ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <h3 className="font-bold text-gray-900 mb-2">{selectedCall.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Email: {selectedCall.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Phone: {selectedCall.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Warmer: {selectedCall.assignedWarmer?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Est. Value: ${selectedCall.estimatedValue || 'TBD'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call Notes
                    </label>
                    <textarea
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Add notes about the call..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCloseWon}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark as Closed Won
                    </button>
                    <button
                      onClick={handleCloseLost}
                      className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Mark as Closed Lost
                    </button>
                    <button
                      onClick={handleReschedule}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-medium rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} />
                      Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <p>Click on a call to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Pipeline View
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Active Pipeline</h2>
            <div className="grid grid-cols-5 gap-4">
              {['contacted', 'qualified', 'demo', 'proposal', 'negotiation'].map(stage => {
                const stageLeads = pipelineLeads.filter(l => l.stage === stage);
                return (
                  <div key={stage} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 capitalize">
                      {stage}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {stageLeads.length} deals
                    </p>
                    <div className="space-y-2">
                      {stageLeads.map(lead => (
                        <div
                          key={lead._id}
                          className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <p className="font-medium text-gray-900 text-sm mb-1">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            ${lead.estimatedValue || 'TBD'}
                          </p>
                          <div className="flex gap-1">
                            {stage !== 'negotiation' && (
                              <button
                                onClick={() => {
                                  const stages = ['contacted', 'qualified', 'demo', 'proposal', 'negotiation'];
                                  const currentIndex = stages.indexOf(stage);
                                  handleMoveStage(lead._id, stages[currentIndex + 1]);
                                }}
                                className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                              >
                                Move →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloserDashboard;