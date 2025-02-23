import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ChevronDown, PenSquare, Trash2, Info, RotateCw, Book, LightbulbIcon } from 'lucide-react';

interface Task {
  title: string;
  description: string;
  type: string;
  category?: string;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  estimated_time?: string;
}

export default function TaskCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([
    {
      title: "Improve Task Description",
      description: "Provide more detailed descriptions of your tasks, challenges, and goals in your standup updates to communicate your progress and needs more effectively",
      type: "Process Improvement",
      priority: "high",
      due_date: "2023-02-23",
      estimated_time: "1h"
    },
    {
      title: "Break Down Large Tasks",
      description: "Break down your tasks into smaller, more manageable steps to reduce overwhelm and increase productivity",
      type: "Planning",
      priority: "medium",
      due_date: "2023-02-23",
      estimated_time: "2h"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTask = (task: Task) => {
    setSelectedTasks([...selectedTasks, task]);
  };

  const handleRemoveTask = (index: number) => {
    setSelectedTasks(selectedTasks.filter((_, i) => i !== index));
  };

  const handleRegenerateTasks = async () => {
    setIsLoading(true);
    // Implement task regeneration logic
    console.log("Regenerating tasks...");
    setTimeout(() => setIsLoading(false), 2000); // Simulate loading time
  };

  const handleSaveTasks = async () => {
    // Implement save tasks logic
    console.log("Saving tasks...", selectedTasks);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-gray-700">Generating tasks...</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create Tasks</h1>
        <button
          onClick={handleSaveTasks}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          + Save Tasks
        </button>
      </div>

      {selectedTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Tasks</h2>
          <div className="space-y-4">
            {selectedTasks.map((task, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow border hover:border-indigo-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        Type: {task.type} • Due: {task.due_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    <button onClick={() => handleRemoveTask(index)}>
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                    <button className="visible"> {/* Added class for visibility */}
                      <PenSquare className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI-Generated Task Suggestions</h2>
          <button
            onClick={handleRegenerateTasks}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Regenerate
          </button>
        </div>

        <div className="space-y-4">
          {suggestedTasks.map((task, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow border hover:border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                  <h3 className="font-medium">{task.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleAddTask(task)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{task.description}</p>

              <div className="text-sm text-gray-500 mb-4">
                Type: {task.type} • Category: {task.category} • Estimated: {task.estimated_time} • Due: {task.due_date}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LightbulbIcon className="h-4 w-4 mr-2" />
                    Implementation Tips
                  </div>
                  <div className="pl-6">
                    <ul className="list-disc text-sm text-gray-600">
                      <li>Use task tracking tools to keep track of your work</li>
                      <li>Consider using the SMART goal framework when setting tasks</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Book className="h-4 w-4 mr-2" />
                    Helpful Resources
                  </div>
                  <div className="pl-6">
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                      How to Give an Effective Stand-up Update
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}