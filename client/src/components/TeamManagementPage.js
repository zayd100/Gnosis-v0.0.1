import React from 'react';
import { Edit2, Trash2, UserPlus, Award, Clock } from 'lucide-react';

const TeamManagementPage = ({ teamMembers, darkMode, getTierBadge }) => {
  const handleEditMember = (member) => {
    alert(`Edit ${member.name} - Feature coming soon!`);
    // In production: Open modal with form to edit user details
  };

  const handleDeleteMember = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      alert('Delete functionality - connect to API');
      // In production: call usersAPI.delete(member._id)
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const warmers = teamMembers.filter(m => m.role === 'warmer');
  const closers = teamMembers.filter(m => m.role === 'closer');

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600 mt-1">
            {teamMembers.filter(m => m.role !== 'admin').length} team members • 
            {teamMembers.filter(m => m.status === 'online').length} online
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
          <UserPlus size={18} />
          Add Team Member
        </button>
      </div>

      {/* Warmers Section */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Warmers ({warmers.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {warmers.map(member => (
            <div key={member._id} className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl relative">
                    {member.name[0]}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tier</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTierBadge(member.tier)}`}>
                    {member.tier || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Performance</span>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-purple-600" />
                    <span className="font-bold text-purple-600">{member.performanceScore}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Leads/Day</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.leadsHandled}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Referrals</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.referrals || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === 'online' ? 'bg-green-100 text-green-700' :
                    member.status === 'away' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMember(member)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closers Section */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Closers ({closers.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {closers.map(member => (
            <div key={member._id} className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl relative">
                    {member.name[0]}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tier</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTierBadge(member.tier)}`}>
                    {member.tier || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Performance</span>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-blue-600" />
                    <span className="font-bold text-blue-600">{member.performanceScore}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Close Rate</span>
                  <span className="text-indigo-600 font-semibold">
                    {member.conversionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Avg Deal</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${member.avgDealSize}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === 'online' ? 'bg-green-100 text-green-700' :
                    member.status === 'away' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMember(member)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagementPage;