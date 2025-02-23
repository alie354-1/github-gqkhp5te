import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, RotateCw, Brain, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import { generateTasks } from '../../lib/openai';
import TaskList from './TaskList';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  task_type: string;
  estimated_hours: number;
  due_date: string;
  implementation_tips: string[];
  potential_challenges: string[];
  success_metrics: string[];
  resources: {
    title: string;
    url: string;
    type: string;
    description: string;
  }[];
  learning_resources: {
    title: string;
    url: string;
    type: string;
    platform: string;
    description: string;
  }[];
  tools: {
    name: string;
    url: string;
    category: string;
    description: string;
  }[];
  user_id: string;
}

interface TaskCreationProps {
  isCompanyView?: boolean;
}

interface SimpleTask {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  task_type: string;
  estimated_hours: number;
  due_date: string;
  user_id: string;
}


export default function TaskCreation({ isCompanyView = false }: TaskCreationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [simpleTask, setSimpleTask] = useState<Partial<SimpleTask>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    category: 'personal',
    task_type: 'task',
    estimated_hours: 1,
    due_date: new Date().toISOString().split('T')[0]
  });


  useEffect(() => {
    if (location.state?.standupEntry) {
      generateTaskSuggestions();
    } else {
      navigate('/dashboard');
    }
  }, []);

  // Get next business day
  const getNextBusinessDay = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    // Keep adding days until we get a business day (Mon-Fri)
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }

    return date.toISOString().split('T')[0];
  };

  const generateTaskSuggestions = async () => {
    if (!user || !location.state?.standupEntry) return;
    setIsGenerating(true);
    setError('');

    try {
      const { tasks } = await generateTasks(location.state.standupEntry, user.id);

      // Set next business day as due date and flatten the structure
      const categorizedTasks = tasks.map(task => ({
        ...task,
        due_date: getNextBusinessDay(),
        category: isCompanyView ? 'company' : 'personal',
        implementation_tips: task.implementation_tips || [],
        potential_challenges: task.potential_challenges || [],
        success_metrics: task.success_metrics || [],
        resources: task.resources || [],
        learning_resources: task.learning_resources || [],
        tools: task.tools || [],
        user_id: user.id
      }));

      setSuggestedTasks(categorizedTasks);
    } catch (error: any) {
      console.error('Error generating tasks:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTask = (task: Task) => {
    setSelectedTasks([...selectedTasks, task]);
    setSuggestedTasks(suggestedTasks.filter(t => t.id !== task.id));
  };

  const handleRemoveTask = (task: Task) => {
    setSelectedTasks(selectedTasks.filter(t => t.id !== task.id));
    setSuggestedTasks([...suggestedTasks, task]);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const taskList = selectedTasks.find(t => t.id === taskId) ? selectedTasks : suggestedTasks;
    const updatedTasks = taskList.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );

    if (selectedTasks.find(t => t.id === taskId)) {
      setSelectedTasks(updatedTasks);
    } else {
      setSuggestedTasks(updatedTasks);
    }
  };

  const handleSaveTasks = async () => {
    if (!user || selectedTasks.length === 0) return;
    setIsSubmitting(true);
    setError('');

    try {
      // Get latest standup entry
      const { data: latestStandup } = await supabase
        .from('standup_entries')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!latestStandup) {
        throw new Error('No standup entry found. Please create a daily update first.');
      }

      // Create tasks
      const { error: tasksError } = await supabase
        .from('standup_tasks')
        .insert(
          selectedTasks.map(task => ({
            standup_entry_id: latestStandup.id,
            ...task,
            assigned_to: user.id
          }))
        );

      if (tasksError) throw tasksError;

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving tasks:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimpleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    console.log('Submitting task:', simpleTask);
    console.log('Current user:', user);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const taskData = {
        title: simpleTask.title,
        description: simpleTask.description || '',
        priority: simpleTask.priority || 'medium',
        status: simpleTask.status || 'pending',
        category: simpleTask.category || 'personal',
        task_type: simpleTask.task_type || 'task',
        estimated_hours: simpleTask.estimated_hours || 1,
        due_date: simpleTask.due_date || new Date().toISOString().split('T')[0],
        user_id: user.id,
        assigned_to: user.id,
        created_at: new Date().toISOString()
      };

      console.log('Creating task:', taskData);

      const { data: createdTask, error: taskError } = await supabase
        .from('tasks')
        .insert(taskData)
        .select('*')
        .single();

      if (taskError) {
        console.error('Task creation error:', taskError);
        console.error('Task creation error details:', taskError.details, taskError.hint, taskError.message);
        throw taskError;
      }

      console.log('Task created:', createdTask);
      setIsCreating(false);
      // Reset form
      setSimpleTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        category: 'personal',
        task_type: 'task',
        estimated_hours: 1,
        due_date: new Date().toISOString().split('T')[0]
      });

      // Navigate back to dashboard after successful task creation
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating task:', error);
      setError(error.message);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimpleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSimpleTask({
      ...simpleTask,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create Tasks</h1>
        <button
          onClick={handleSaveTasks}
          disabled={isSubmitting || selectedTasks.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Save Tasks
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-8 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="space-y-6">
        {/* Selected Tasks */}
        {selectedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Tasks</h2>
            <TaskList
              tasks={selectedTasks}
              onRemoveTask={handleRemoveTask}
              onUpdateTask={handleUpdateTask}
            />
          </div>
        )}

        {/* Suggested Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">AI-Generated Task Suggestions</h2>
            <button
              onClick={generateTaskSuggestions}
              disabled={isGenerating}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </button>
          </div>

          {isGenerating ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Generating task suggestions...</p>
            </div>
          ) : suggestedTasks.length > 0 ? (
            <TaskList
              tasks={suggestedTasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              suggestedTasks={true}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <Brain className="h-8 w-8 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No task suggestions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Click the regenerate button to get new task suggestions
              </p>
            </div>
          )}
        </div>
        {/* Simple Task Creation */}
        {isCreating ? (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSimpleTaskSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={simpleTask.title || ''}
                    onChange={handleSimpleTaskChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    value={simpleTask.description || ''}
                    onChange={handleSimpleTaskChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      name="priority"
                      id="priority"
                      value={simpleTask.priority || 'medium'}
                      onChange={handleSimpleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                    <input
                      type="number"
                      name="estimated_hours"
                      id="estimated_hours"
                      min="0"
                      step="0.5"
                      value={simpleTask.estimated_hours || 1}
                      onChange={handleSimpleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    id="due_date"
                    value={simpleTask.due_date || new Date().toISOString().split('T')[0]}
                    onChange={handleSimpleTaskChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </button>
        )}
      </div>
    </div>
  );
}