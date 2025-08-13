import React, { useState } from 'react';
import { Upload, User, Menu, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import { uploadToLimeAPI } from '../api';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('detect');
  const { user } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    lime_image: string;
    label: string;
    confidence: number;
    explanation: string;
    message: string;
  } | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setResult(null);
      const res = await uploadToLimeAPI(file);
      setResult({
        lime_image: res.lime_image,
        label: res.label,
        confidence: res.confidence,
        explanation: res.explanation,
        message: res.message,
      });
    } catch (error) {
      console.error('LIME API upload failed', error);
      setResult({
        lime_image: '',
        label: '',
        confidence: 0,
        explanation: '',
        message: '❌ Error during LIME API processing.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* Mobile Sidebar */}
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
      <div className="md:ml-64 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
            >
              <User className="h-5 w-5" />
              <span>View Profile</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {['detect', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab === 'detect' ? 'Deepfake Detection' : 'AI Assistant'}
              </button>
            ))}
          </div>

          {/* Detection Tab */}
          {activeTab === 'detect' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Upload Video for Deepfake Analysis
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Supported formats: MP4, MOV, AVI | Max size: 100MB
                </p>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 transition hover:border-indigo-500">
                  <input
                    type="file"
                    id="file-upload"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        handleUpload(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Click or drag file to upload
                    </span>
                  </label>
                </div>

                {/* Loading Spinner */}
                {uploading && (
                  <div className="mt-6 flex justify-center items-center gap-2 text-indigo-600 font-semibold">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Analyzing video...
                  </div>
                )}

                {/* Result Section */}
                {result && (
                  <div className="mt-8 text-center">
                    <h3
                      className={`text-lg font-medium mb-4 ${
                        result.message.includes('Error')
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {result.message}
                    </h3>

                    {result.lime_image && (
                      <img
                        src={`data:image/png;base64,${result.lime_image}`}
                        alt="LIME Explanation"
                        className="mx-auto rounded-lg shadow-lg max-w-2xl w-full border border-gray-300 dark:border-gray-700"
                      />
                    )}

                    {result.label && (
                      <div className="mt-6 text-left max-w-2xl mx-auto space-y-3 text-gray-800 dark:text-gray-200">
                        <p>
                          <strong>Prediction:</strong>{' '}
                          <span className="font-semibold">{result.label}</span>
                        </p>
                        <p>
                          <strong>Confidence:</strong>{' '}
                          {(result.confidence * 100).toFixed(2)}%
                        </p>
                        <p>
                          <strong>Explanation:</strong>{' '}
                          {result.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <Chatbot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
