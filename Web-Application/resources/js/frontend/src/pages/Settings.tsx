import React, { useState } from 'react';
import { Bell, Lock, Eye, EyeOff, Shield, Globe, Moon, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactorAuth: true,
    language: 'en',
    apiKey: 'sk-fauxshield-2025-xxxxxxxxxxxx',
    confidenceThreshold: 80,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <Sidebar />
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage your account preferences and configurations
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Notifications</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    label: 'Email Notifications',
                    desc: 'Receive analysis results via email',
                    icon: <Bell className="h-5 w-5 text-gray-400" />,
                    key: 'emailNotifications',
                  },
                  {
                    label: 'Push Notifications',
                    desc: 'Get instant alerts in your browser',
                    icon: <Bell className="h-5 w-5 text-gray-400" />,
                    key: 'pushNotifications',
                  },
                ].map(({ label, desc, icon, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {icon}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{label}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[key as keyof typeof settings] as boolean}
                        onChange={(e) => handleSettingChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Security</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Two-Factor Authentication</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">API Key</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Your secret API key for integrations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.apiKey}
                      readOnly
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-mono w-full sm:w-auto"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Preferences</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Language</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p>
                    </div>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="px-2 sm:px-3 py-1 sm:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Moon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Dark Mode</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Toggle dark mode theme</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Confidence Threshold</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Minimum confidence level for detections</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={settings.confidenceThreshold}
                      onChange={(e) =>
                        handleSettingChange('confidenceThreshold', parseInt(e.target.value))
                      }
                      className="w-full sm:w-32"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 min-w-[40px] text-right">
                      {settings.confidenceThreshold}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;