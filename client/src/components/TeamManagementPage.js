import React, { useState } from 'react';
import { Edit2, Trash2, UserPlus, Award, X } from 'lucide-react';
import { usersAPI } from '../api';

const TeamManagementPage = ({ teamMembers, darkMode, getTierBadge, onDataUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'warmer',
    tier: 'W1',
    status: 'online'
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'warmer',
      tier: 'W1',
      status: 'online'
    });
    setShowAddModal(true);
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '', // Don't show existing password
      role: member.role,
      tier: member.tier || (member.role === 'warmer' ? 'W1' : 'C1'),
      status: member.status
    });
    setShowEditModal(true);
  };

  const handleAddMember = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await usersAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        tier: formData.tier,
        status: formData.status
      });
      
      alert('Team member added successfully!');
      setShowAddModal(false);
      if (onDataUpdate) onDataUpdate(); // Refresh data
    } catch (error) {
      console.error('Error adding member:', error);
      alert(error.response?.data?.message || 'Failed to add team member');
    }
  };

  const handleUpdateMember = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        tier: formData.tier,
        status: formData.status
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      await usersAPI.update(selectedMember._id, updateData);
      
      alert('Team member updated successfully!');
      setShowEditModal(false);
      setSelectedMember(null);
      if (onDataUpdate) onDataUpdate(); // Refresh data
    } catch (error) {
      console.error('Error updating member:', error);
      alert(error.response?.data?.message || 'Failed to update team member');
    }
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await usersAPI.delete(member._id);
      alert('Team member deleted successfully!');
      if (onDataUpdate) onDataUpdate(); // Refresh data
    } catch (error) {
      console.error('Error deleting member:', error);
      alert(error.response?.data?.message || 'Failed to delete team member');
    }
  };

  const warmers = teamMembers.filter(m => m.role === 'warmer');
  const closers = teamMembers.filter(m => m.role === 'closer');

  // Modal Component
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full mx-4`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Team Management
          </h2>
          <p className="text-gray-600 mt-1">
            {teamMembers.filter(m => m.role !== 'admin').length} team members • 
            {teamMembers.filter(m => m.status === 'online').length} online
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
        >
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
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">{member.email}</span>
                </div>
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
                    <span className="font-bold text-purple-600">{member.performanceScore || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Leads/Day</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.leadsHandled || 0}
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
                  onClick={() => handleEditClick(member)}
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
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">{member.email}</span>
                </div>
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
                    <span className="font-bold text-blue-600">{member.performanceScore || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Close Rate</span>
                  <span className="text-indigo-600 font-semibold">
                    {member.conversionRate || 0}%
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
                  onClick={() => handleEditClick(member)}
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

      {/* Add Member Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Add Team Member">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value, tier: e.target.value === 'warmer' ? 'W1' : 'C1'})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="warmer">Warmer</option>
                <option value="closer">Closer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tier *</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({...formData, tier: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {formData.role === 'warmer' ? (
                  <>
                    <option value="W1">W1</option>
                    <option value="W2">W2</option>
                    <option value="W3">W3</option>
                  </>
                ) : (
                  <>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddMember}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium"
            >
              Add Member
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Team Member">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="warmer">Warmer</option>
                <option value="closer">Closer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tier *</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({...formData, tier: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {formData.role === 'warmer' ? (
                  <>
                    <option value="W1">W1</option>
                    <option value="W2">W2</option>
                    <option value="W3">W3</option>
                  </>
                ) : (
                  <>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpdateMember}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium"
            >
              Update Member
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManagementPage;