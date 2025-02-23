import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';

interface FeatureFlag {
  enabled: boolean;
  visible: boolean;
}

interface FeatureFlags {
  [key: string]: FeatureFlag;
}

const defaultFeatureFlags: FeatureFlags = {
  ideaHub: { enabled: true, visible: true },
  community: { enabled: true, visible: true },
  messages: { enabled: true, visible: true },
  directory: { enabled: true, visible: true },
  library: { enabled: true, visible: true },
  marketplace: { enabled: true, visible: true },
  legalHub: { enabled: true, visible: true },
  devHub: { enabled: true, visible: true },
  utilities: { enabled: true, visible: true },
  financeHub: { enabled: true, visible: true },
  adminPanel: { enabled: true, visible: true }
};

const featureLabels: { [key: string]: string } = {
  ideaHub: 'Idea Hub',
  community: 'Community',
  messages: 'Messages',
  directory: 'Directory',
  library: 'Resource Library',
  marketplace: 'Marketplace',
  legalHub: 'Legal Hub',
  devHub: 'Dev Hub',
  utilities: 'Utilities',
  financeHub: 'Finance Hub',
  adminPanel: 'Admin Panel'
};

export default function FeatureFlagsSettings() {
  const { setFeatureFlags } = useAuthStore();
  const [flags, setFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'feature_flags')
        .single();

      if (error) throw error;

      const loadedFlags = data?.value || defaultFeatureFlags;
      setFlags(loadedFlags);
      setFeatureFlags(loadedFlags);
    } catch (error: any) {
      console.error('Error loading feature flags:', error);
      setError('Failed to load feature flags');
      setFlags(defaultFeatureFlags);
      setFeatureFlags(defaultFeatureFlags);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlag = (key: string, type: 'enabled' | 'visible') => {
    const newFlags = {
      ...flags,
      [key]: {
        ...flags[key],
        [type]: !flags[key][type]
      }
    };
    setFlags(newFlags);
    setFeatureFlags(newFlags);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'feature_flags',
          value: flags,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setSuccess('Feature flags updated successfully!');
    } catch (error: any) {
      console.error('Error saving feature flags:', error);
      setError('Failed to save feature flags');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Navigation Features
        </h3>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(flags).map(([key, flag]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">{featureLabels[key]}</h5>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleFlag(key, 'visible')}
                className="p-2 rounded-md hover:bg-gray-200"
                title={flag.visible ? 'Hide from navigation' : 'Show in navigation'}
              >
                {flag.visible ? (
                  <Eye className="h-5 w-5 text-gray-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div className="flex items-center">
                <button
                  onClick={() => toggleFlag(key, 'enabled')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    flag.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      flag.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}