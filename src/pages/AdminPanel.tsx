import React, { useState } from 'react';
import { useAuthStore } from '../lib/store';
import { 
  Settings,
  Users,
  MessageSquare,
  Slack,
  Bot,
  CloudCog,
  Key,
  Shield
} from 'lucide-react';
import AppCredentialsSettings from '../components/admin/AppCredentialsSettings';
import FeatureFlagsSettings from '../components/admin/FeatureFlagsSettings';
import UserManagement from '../components/admin/UserManagement';
import OpenAISettings from '../components/admin/OpenAISettings';

export default function AdminPanel() {
  const { profile } = useAuthStore();
  const [activeSection, setActiveSection] = useState('users');
  
  if (profile?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">You need superadmin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'users', name: 'Users', icon: Users },
    { id: 'openai', name: 'OpenAI Settings', icon: Bot },
    { id: 'credentials', name: 'App Credentials', icon: Key },
    { id: 'feature-flags', name: 'Feature Flags', icon: Settings }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Panel
          </h1>

          <div className="flex space-x-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  activeSection === section.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <section.icon className="h-5 w-5 mr-2" />
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeSection === 'users' && <UserManagement />}
          {activeSection === 'openai' && <OpenAISettings />}
          {activeSection === 'credentials' && <AppCredentialsSettings />}
          {activeSection === 'feature-flags' && <FeatureFlagsSettings />}
        </div>
      </div>
    </div>
  );
}