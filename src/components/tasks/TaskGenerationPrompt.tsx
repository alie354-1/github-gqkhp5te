interface TaskGenerationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  standupEntry: StandupEntry;
  isSuperAdmin?: boolean;
  generateDebugTasks?: () => void;
}

// Assume StandupEntry and other necessary components are defined elsewhere

const TaskGenerationPrompt: React.FC<TaskGenerationPromptProps> = ({
  isOpen,
  onClose,
  standupEntry,
  isSuperAdmin,
  generateDebugTasks,
}) => {
  // Assume other code is present here

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        {/* Assume other code is present here */}
        <div className="mt-4 flex justify-between">
          {isSuperAdmin && (
            <button
              onClick={generateDebugTasks}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug Generate Tasks
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Assume the Bug component and other necessary components are defined elsewhere

export default TaskGenerationPrompt;