
import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCw, AlertCircle, Check, Layers, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import type { FeatureFlags } from '../../lib/store';

interface FeatureGroup {
  name: string;
  description: string;
  features: {
    key: keyof FeatureFlags;
    name: string;
    description: string;
  }[];
}

const defaultFeatureFlags: FeatureFlags = {
  ideaHub: { enabled: true, visible: true },
  community: { enabled: true, visible: true },
  messages: { enabled: true, visible: true },
  directory: { enabled: true, visible: true },
  library: { enabled: false, visible: false },
  marketplace: { enabled: false, visible: false },
  legalHub: { enabled: false, visible: false },
  devHub: { enabled: false, visible: false },
  utilities: { enabled: false, visible: false },
  financeHub: { enabled: false, visible: false },
  adminPanel: { enabled: true, visible: true },
  aiCofounder: { enabled: true, visible: true },
  marketResearch: { enabled: true, visible: true },
  pitchDeck: { enabled: true, visible: true },
  documentStore: { enabled: true, visible: true },
  teamManagement: { enabled: true, visible: true }
};

const featureGroups: FeatureGroup[] = [
  {
    name: 'Navigation',
    description: 'Control visibility of navigation items',
    features: [
      { key: 'ideaHub', name: 'Idea Hub', description: 'AI-powered idea exploration and validation' },
      { key: 'community', name: 'Community', description: 'Community engagement and networking' },
      { key: 'messages', name: 'Messages', description: 'Direct messaging system' },
      { key: 'directory', name: 'Directory', description: 'User and company directory' },
      { key: 'library', name: 'Resource Library', description: 'Knowledge base and resources' },
      { key: 'marketplace', name: 'Marketplace', description: 'Service provider marketplace' },
      { key: 'legalHub', name: 'Legal Hub', description: 'Legal templates and guidance' },
      { key: 'devHub', name: 'Dev Hub', description: 'Development tools and resources' },
      { key: 'utilities', name: 'Utilities', description: 'Helper tools and utilities' },
      { key: 'financeHub', name: 'Finance Hub', description: 'Financial tools and tracking' },
      { key: 'adminPanel', name: 'Admin Panel', description: 'Administrative controls' }
    ]
  },
  {
    name: 'Components',
    description: 'Control visibility of specific components',
    features: [
      { key: 'aiCofounder', name: 'AI Co-founder', description: 'AI-powered guidance and feedback' },
      { key: 'marketResearch', name: 'Market Research', description: 'Market analysis tools' },
      { key: 'pitchDeck', name: 'Pitch Deck', description: 'Pitch deck builder' },
      { key: 'documentStore', name: 'Document Store', description: 'Document management' },
      { key: 'teamManagement', name: 'Team Management', description: 'Team collaboration tools' }
    ]
  }
];

export default function FeatureFlagsSettings() {
  const { setFeatureFlags } = useAuthStore();
  const [flags, setFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(featureGroups[0].name);

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'feature_flags')
        .single();

      if (error) throw error;

      const savedFlags = data?.value || {};
      const mergedFlags = Object.keys(defaultFeatureFlags).reduce((acc, key) => ({
        ...acc,
        [key]: {
          ...defaultFeatureFlags[key as keyof FeatureFlags],
          ...(savedFlags[key] || {})
        }
      }), {} as FeatureFlags);
      
      setFlags(mergedFlags);
      setFeatureFlags(mergedFlags);
    } catch (error: any) {
      console.error('Error loading feature flags:', error);
      setError('Failed to load feature flags');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlag = (key: keyof FeatureFlags, type: 'enabled' | 'visible') => {
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
      const { error: updateError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'feature_flags',
          value: flags,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;
      setSuccess('Feature flags updated successfully!');
    } catch (error: any) {
      console.error('Error saving feature flags:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Feature Management
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadFeatureFlags}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <RotateCw className="h-5 w-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {featureGroups.map((group) => {
          const isActive = activeTab === group.name;
          return (
            <div key={group.name} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab(group.name)}
                className={`w-full flex items-center justify-between p-4 text-left ${
                  isActive ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{group.name}</h4>
                    <p className="text-sm text-gray-500">{group.description}</p>
                  </div>
                </div>
              </button>

              <div className={`${isActive ? 'block' : 'hidden'} border-t`}>
                <div className="space-y-4 p-4">
                  {group.features.map((feature) => {
                    const featureState = flags[feature.key];
                    return (
                      <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">{feature.name}</h5>
                          <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleFlag(feature.key, 'visible')}
                            className="p-1 rounded-full hover:bg-gray-200"
                            title={featureState.visible ? 'Hide from navigation' : 'Show in navigation'}
                          >
                            {featureState.visible ? (
                              <Eye className="h-5 w-5 text-gray-600" />
                            ) : (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            )}
                          </button>

                          <button
                            onClick={() => toggleFlag(feature.key, 'enabled')}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              featureState.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                featureState.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
