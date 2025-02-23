
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import { Plus } from 'lucide-react';

interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo';
  category: string;
  due_date: string;
  user_id?: string;
}

export default function TaskCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([{
    title: 'New Task',
    description: '',
    priority: 'medium',
    status: 'todo',
    category: 'general',
    due_date: new Date().toISOString().split('T')[0]
  }]);

  const saveTasks = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert(tasks.map(task => ({
          ...task,
          user_id: user?.id
        })));

      if (error) throw error;
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
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
        <h1 className="text-2xl font-semibold">Create Tasks</h1>
        <div className="space-x-4">
          <button
            onClick={addNewTask}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
          <button
            onClick={saveTasks}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save All Tasks
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {tasks.map((task, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={task.description}
                  onChange={(e) => updateTask(index, 'description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={task.priority}
                    onChange={(e) => updateTask(index, 'priority', e.target.value)}
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
                    onChange={(e) => updateTask(index, 'due_date', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
