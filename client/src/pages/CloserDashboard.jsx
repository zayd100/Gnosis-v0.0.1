import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertCircle, Users, Shield, Activity, Calendar, CheckSquare, 
  XCircle, Plus, Search, Filter, MoreVertical, Edit2, Trash2, UserCheck, UserX, 
  Lock, Unlock, Phone 
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('closers');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              SX
            </div>
            <span className="font-bold text-xl text-gray-900">SentinelX</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setCurrentView('closers')}
            className={`w-full text-left block px-4 py-3 rounded-xl font-medium mb-2 transition-all ${
              currentView === 'closers'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Closers Dashboard
          </button>
          <button
            onClick={() => setCurrentView('activity')}
            className={`w-full text-left block px-4 py-3 rounded-xl font-medium mb-2 transition-all ${
              currentView === 'activity'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Activity Log
          </button>
          <button
            onClick={() => setCurrentView('tasks')}
            className={`w-full text-left block px-4 py-3 rounded-xl font-medium mb-2 transition-all ${
              currentView === 'tasks'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setCurrentView('permissions')}
            className={`w-full text-left block px-4 py-3 rounded-xl font-medium transition-all ${
              currentView === 'permissions'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Role Permissions
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
              DU
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Demo User</p>
              <p className="text-xs text-gray-500">demo@sentinelx.ai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {currentView === 'closers' && <ClosersDashboard />}
        {currentView === 'activity' && <ActivityLog />}
        {currentView === 'tasks' && <TasksPage />}
        {currentView === 'permissions' && <RolePermissions />}
      </div>
    </div>
  );
};

const ClosersDashboard = () => {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [callNotes, setCallNotes] = useState('');

  const scheduledCalls = [
    { id: 1, lead: 'Jordan P', warmer: 'Maya', time: 'Today 2:00 PM', tier: 1, value: '$850', status: 'scheduled' },
    { id: 2, lead: 'Alex M', warmer: 'Ava', time: 'Today 3:30 PM', tier: 2, value: '$650', status: 'scheduled' },
    { id: 3, lead: 'Taylor S', warmer: 'Rin', time: 'Tomorrow 10:00 AM', tier: 3, value: '$450', status: 'scheduled' },
    { id: 4, lead: 'Casey R', warmer: 'Maya', time: 'Tomorrow 2:00 PM', tier: 1, value: '$920', status: 'scheduled' }
  ];

  const activePipeline = [
    { id: 1, lead: 'Sam Q', stage: 'Negotiation', value: '$1,200', probability: '75%', warmer: 'Noah' },
    { id: 2, lead: 'Morgan T', stage: 'Demo Completed', value: '$800', probability: '60%', warmer: 'Ava' },
    { id: 3, lead: 'Riley K', stage: 'Proposal Sent', value: '$950', probability: '45%', warmer: 'Maya' }
  ];

  const getTierBadge = (tier) => {
    const colors = {
      1: 'bg-purple-100 text-purple-700 border-purple-200',
      2: 'bg-blue-100 text-blue-700 border-blue-200',
      3: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[tier] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Closers Dashboard</h1>
        <p className="text-gray-600">Manage your scheduled calls and pipeline</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Scheduled Calls</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-blue-600 mt-2">4 today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900">34%</p>
          <p className="text-xs text-green-600 mt-2">↑ 6% from last month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Pipeline Value</p>
          <p className="text-3xl font-bold text-gray-900">$28K</p>
          <p className="text-xs text-purple-600 mt-2">15 active deals</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Deal Size</p>
          <p className="text-3xl font-bold text-gray-900">$820</p>
          <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Scheduled Calls</h2>
          <div className="space-y-3">
            {scheduledCalls.map(call => (
              <div
                key={call.id}
                onClick={() => setSelectedDeal(call)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedDeal?.id === call.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50 to-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{call.lead}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getTierBadge(call.tier)}`}>
                      Tier {call.tier}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-purple-700">{call.value}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Warmer: {call.warmer}</span>
                  <span className="text-gray-500">{call.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDeal ? 'Call Details' : 'Select a Call'}
          </h2>
          
          {selectedDeal ? (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-2">{selectedDeal.lead}</h3>
                <p className="text-sm text-gray-600 mb-1">Time: {selectedDeal.time}</p>
                <p className="text-sm text-gray-600 mb-1">Warmer: {selectedDeal.warmer}</p>
                <p className="text-sm text-gray-600">Est. Value: {selectedDeal.value}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Notes</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Add notes about the call..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md">
                  Mark as Closed Won
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all">
                  Mark as Closed Lost
                </button>
                <button className="w-full px-4-4 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-medium rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all">
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

      <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Active Pipeline</h2>
        <div className="grid grid-cols-3 gap-4">
          {activePipeline.map(deal => (
            <div key={deal.id} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">{deal.lead}</h3>
              <p className="text-sm text-gray-600 mb-1">Stage: {deal.stage}</p>
              <p className="text-sm text-gray-600 mb-1">Value: {deal.value}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">Warmer: {deal.warmer}</span>
                <span className="text-xs font-semibold text-blue-700">{deal.probability}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const ActivityLog = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activities = [
    { id: 1, type: 'lead_assigned', user: 'Maya', target: 'Jordan P', details: 'Lead assigned to warmer', time: '5 min ago', icon: Users },
    { id: 2, type: 'call_scheduled', user: 'Ivy', target: 'Alex M', details: 'Call scheduled for 3:30 PM', time: '12 min ago', icon: Clock },
    { id: 3, type: 'deal_closed', user: 'Zoe', target: 'Taylor S', details: 'Deal closed won - $850', time: '23 min ago', icon: CheckCircle },
    { id: 4, type: 'lead_responded', user: 'System', target: 'Casey R', details: 'Lead responded to message', time: '45 min ago', icon: Activity },
    { id: 5, type: 'lead_assigned', user: 'Ava', target: 'Sam Q', details: 'Lead assigned to warmer', time: '1 hour ago', icon: Users },
    { id: 6, type: 'call_completed', user: 'Ivy', target: 'Morgan T', details: 'Demo call completed', time: '2 hours ago', icon: CheckCircle },
    { id: 7, type: 'lead_marked_hot', user: 'Maya', target: 'Riley K', details: 'Lead marked as hot', time: '3 hours ago', icon: AlertCircle },
    { id: 8, type: 'deal_closed', user: 'Sam', target: 'Jamie L', details: 'Deal closed won - $720', time: '4 hours ago', icon: CheckCircle }
  ];

  const getActivityColor = (type) => {
    const colors = {
      lead_assigned: 'bg-purple-100 text-purple-700 border-purple-200',
      call_scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      deal_closed: 'bg-green-100 text-green-700 border-green-200',
      lead_responded: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      call_completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      lead_marked_hot: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    if (searchQuery && !activity.target.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
        <p className="text-gray-600">Real-time system activity and events</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by lead name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Activities</option>
            <option value="lead_assigned">Lead Assignments</option>
            <option value="call_scheduled">Calls Scheduled</option>
            <option value="deal_closed">Deals Closed</option>
            <option value="lead_responded">Lead Responses</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="space-y-3">
          {filteredActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-sm ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-gray-900">{activity.user}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{activity.details}</p>
                    <p className="text-xs text-gray-600">Target: {activity.target}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p>No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TasksPage = () => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow up with Jordan P', priority: 'high', status: 'pending', dueDate: 'Today', assignee: 'Maya' },
    { id: 2, title: 'Send proposal to Alex M', priority: 'high', status: 'pending', dueDate: 'Today', assignee: 'Ivy' },
    { id: 3, title: 'Review warmer scripts', priority: 'medium', status: 'in_progress', dueDate: 'Tomorrow', assignee: 'Admin' },
    { id: 4, title: 'Update CRM data', priority: 'low', status: 'pending', dueDate: 'Friday', assignee: 'Zoe' },
    { id: 5, title: 'Prepare demo for Taylor S', priority: 'medium', status: 'completed', dueDate  : 'Yesterday', assignee: 'Sam' }
  ]);

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: tasks.length + 1,
        title: newTask,
        priority: 'medium',
        status: 'pending',
        dueDate: 'Today',
        assignee: 'Unassigned'
      }]);
      setNewTask('');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const TaskItem = ({ task }) => (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => toggleTaskStatus(task.id)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={14} /> {task.dueDate}
              </span>
            </div>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={18} className="text-gray-400" />
        </button>
      </div>
      <div className="ml-8 text-xs text-gray-500">
        Assigned to: <span className="font-medium text-gray-700">{task.assignee}</span>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
        <p className="text-gray-600">Manage your team's tasks and priorities</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2"
          >
            <Plus size={20} /> Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-gray-900">{pendingTasks.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-gray-900">{inProgressTasks.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-gray-900">{completedTasks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-orange-500" size={20} /> Pending
          </h2>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No pending tasks</p>
            ) : (
              pendingTasks.map(task => <TaskItem key={task.id} task={task} />)
            )}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-blue-500" size={20} /> In Progress
          </h2>
          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No tasks in progress</p>
            ) : (
              inProgressTasks.map(task => <TaskItem key={task.id} task={task} />)
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} /> Completed
          </h2>
          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No completed tasks</p>
            ) : (
              completedTasks.map(task => <TaskItem key={task.id} task={task} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RolePermissions = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', color: 'from-red-500 to-rose-600', permissions: { dashboard: true, tasks: true, activity: true, permissions: true, closers: true, editUsers: true, deleteLeads: true } },
    { id: 2, name: 'Closer', color: 'from-purple-500 to-indigo-600', permissions: { dashboard: true, tasks: true, activity: true, permissions: false, closers: true, editUsers: false, deleteLeads: false } },
    { id: 3, name: 'Warmer', color: 'from-blue-500 to-cyan-600', permissions: { dashboard: true, tasks: true, activity: true, permissions: false, closers: false, editUsers: false, deleteLeads: false } },
    { id: 4, name: 'Viewer', color: 'from-gray-400 to-gray-600', permissions: { dashboard: false, tasks: false, activity: true, permissions: false, closers: false, editUsers: false, deleteLeads: false } }
  ]);

  const togglePermission = (roleId, permissionKey) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permissionKey]: !role.permissions[permissionKey] } }
        : role
    ));
  };

  const permissionsConfig = [
    { key: 'dashboard', label: 'View Dashboard', icon: Activity },
    { key: 'tasks', label: 'Manage Tasks', icon: CheckSquare },
    { key: 'activity', label: 'View Activity Log', icon: Clock },
    { key: 'permissions', label: 'Manage Permissions', icon: Shield },
    { key: 'closers', label: 'Access Closers Tools', icon: Phone },
    { key: 'editUsers', label: 'Edit Users', icon: Edit2 },
    { key: 'deleteLeads', label: 'Delete Leads', icon: Trash2 }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Role Permissions</h1>
        <p className="text-gray-600">Manage access levels for different user roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className={`p-6 bg-gradient-to-br ${role.color} text-white`}>
              <h3 className="text-xl font-bold">{role.name}</h3>
              <p className="text-sm opacity-90 mt-1">
                {Object.values(role.permissions).filter(Boolean).length} of {permissionsConfig.length} permissions
              </p>
            </div>

            <div className="p-6 space-y-4">
              {permissionsConfig.map(perm => {
                const Icon = perm.icon;
                const hasPermission = role.permissions[perm.key];
                return (
                  <div
                    key={perm.key}
                    onClick={() => role.name !== 'Admin' && togglePermission(role.id, perm.key)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      hasPermission
                        ? 'bg-green-50 border-green-300 cursor-pointer hover:bg-green-100'
                        : 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100'
                    } ${role.name === 'Admin' ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={hasPermission ? 'text-green-600' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${hasPermission ? 'text-gray-900' : 'text-gray-500'}`}>
                        {perm.label}
                      </span>
                    </div>
                    {hasPermission ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <XCircle size={20} className="text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-amber-600 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-amber-900">Admin permissions are locked</h4>
            <p className="text-sm text-amber-700 mt-1">
              Admin role always has full access and cannot be modified for security reasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;