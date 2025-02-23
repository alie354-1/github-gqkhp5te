
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';

interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo';
  category: string;
  due_date: string;
}

export default function CreateTask() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([
    {
      title: 'New Task',
      description: '',
      priority: 'medium',
      status: 'todo',
      category: 'general',
      due_date: new Date().toISOString().split('T')[0]
    }
  ]);

  const { standupEntry } = location.state || {};

  const saveTasks = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert(tasks.map(task => ({
          ...task,
          user_id: user?.id,
          standup_entry_id: standupEntry?.id
        })));

      if (error) throw error;
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addNewTask = () => {
    setTasks([...tasks, {
      title: 'New Task',
      description: '',
      priority: 'medium',
      status: 'todo',
      category: 'general',
      due_date: new Date().toISOString().split('T')[0]
    }]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <button
          onClick={addNewTask}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Task
        </button>
      </div>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index] = { ...task, title: e.target.value };
                  setTasks(newTasks);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={task.description}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index] = { ...task, description: e.target.value };
                  setTasks(newTasks);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => {
                    const newTasks = [...tasks];
                    newTasks[index] = { ...task, priority: e.target.value as 'low' | 'medium' | 'high' };
                    setTasks(newTasks);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={task.due_date}
                  onChange={(e) => {
                    const newTasks = [...tasks];
                    newTasks[index] = { ...task, due_date: e.target.value };
                    setTasks(newTasks);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={saveTasks}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Tasks
        </button>
      </div>
    </div>
  );
}
