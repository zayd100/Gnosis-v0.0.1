import React, { useState } from 'react';
import { Plus, Calendar, User, Flag, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { tasksAPI } from '../api';

const TasksPage = ({ tasks, darkMode, onDataUpdate, teamMembers }) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: ''
  });

  const handleCreateTask = async () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    try {
      // Prepare data - remove empty fields
      const taskData = { ...newTask };
      if (!taskData.assignee || taskData.assignee === '') {
        delete taskData.assignee;
      }
      if (!taskData.dueDate || taskData.dueDate === '') {
        delete taskData.dueDate;
      }
      if (!taskData.description || taskData.description === '') {
        delete taskData.description;
      }

      await tasksAPI.create(taskData);
      alert('Task created successfully!');
      setShowNewTaskForm(false);
      setNewTask({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' });
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.response?.data?.message || 'Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <Flag className="text-red-500" size={16} />;
      case 'medium': return <Flag className="text-yellow-500" size={16} />;
      case 'low': return <Flag className="text-green-500" size={16} />;
      default: return <Flag className="text-gray-500" size={16} />;
    }
  };

  // Get assignee name
  const getAssigneeName = (task) => {
    if (!task.assignee) return 'Unassigned';
    if (typeof task.assignee === 'string') return task.assignee;
    return task.assignee.name || 'Unknown';
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Filter team members (exclude admins)
  const availableMembers = teamMembers ? teamMembers.filter(m => m.role !== 'admin') : [];

  const TaskCard = ({ task }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border-2 p-4 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {task.title}
        </h4>
        {getPriorityIcon(task.priority)}
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-gray-400" />
          <span className="text-gray-600">{getAssigneeName(task)}</span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-gray-600">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
        {task.status === 'pending' && (
          <button
            onClick={() => handleMoveTask(task._id, 'in_progress')}
            className="flex-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
          >
            Start
          </button>
        )}
        {task.status === 'in_progress' && (
          <>
            <button
              onClick={() => handleMoveTask(task._id, 'pending')}
              className="flex-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
            >
              Back
            </button>
            <button
              onClick={() => handleMoveTask(task._id, 'completed')}
              className="flex-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium"
            >
              Complete
            </button>
          </>
        )}
        {task.status === 'completed' && (
          <button
            onClick={() => handleMoveTask(task._id, 'in_progress')}
            className="flex-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Task Management
          </h2>
          <p className="text-gray-600 mt-1">
            {tasks.length} total • {pendingTasks.length} pending • {inProgressTasks.length} in progress
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {showNewTaskForm && (
        <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Task
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add task details..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Unassigned</option>
                  {availableMembers.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pending */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-gray-500" size={20} />
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pending
            </h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-blue-500" size={20} />
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              In Progress
            </h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        </div>

        {/* Completed */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-500" size={20} />
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Completed
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;