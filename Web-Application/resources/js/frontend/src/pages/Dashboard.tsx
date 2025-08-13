import React, { useState } from 'react';
import { Upload, User, Menu, Shield, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import Sidebar from '../components/Sidebar';
import AnalysisLoader from '../components/AnalysisLoader';
import ResultsDisplay from '../components/ResultsDisplay';
import useAuth from '../hooks/useAuth';
import {
  uploadToLimeAPI,
  uploadMedia,
  saveResults,
} from '../api';

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('detect');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      if (!user) throw new Error('User not authenticated');

      setUploading(true);
      setResult(null);
      setProgress(0);

      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        throw new Error('Unsupported file type');
      }

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 10 + 5));
      }, 500);

      const storageResponse = await uploadMedia(file, user.name);

      const analysisResult = await uploadToLimeAPI(file);

      clearInterval(progressInterval);
      setProgress(100);

      const savedResult = await saveResults({
        filename: storageResponse.filename,
        prediction: analysisResult.label,
        confidence: analysisResult.confidence,
        frames: analysisResult.frames || 0,
        processing_time: analysisResult.processing_time || 0,
        lime_image: analysisResult.lime_image,
      });

      const transformedResult = {
        prediction: analysisResult.label.toUpperCase() === 'REAL' ? 'Real' : 'Fake',
        confidence: analysisResult.confidence,
        limeImage: analysisResult.lime_image
          ? `data:image/png;base64,${analysisResult.lime_image}`
          : undefined,
        explanation:
          analysisResult.explanation ||
          `The model analyzed the ${
            isVideo ? 'video' : 'image'
          } and predicted this content is ${analysisResult.label} with ${(analysisResult.confidence * 100).toFixed(1)}% confidence.`,
        framesAnalyzed: analysisResult.frames || 0,
        processingTime: analysisResult.processing_time || 0,
        pdfUrl: savedResult.data?.pdf_url,
      };

      setResult(transformedResult);
      setShowResults(true);
    } catch (error) {
      console.error('Upload failed', error);
      setResult({
        prediction: 'Error',
        confidence: 0,
        limeImage: undefined,
        explanation: 'An error occurred during processing. Please try again.',
        framesAnalyzed: 0,
        processingTime: 0,
      });
      setShowResults(true);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setShowResults(false);
    setSelectedFile(null);
  };

  if (uploading && selectedFile) {
    return <AnalysisLoader fileName={selectedFile.name} />;
  }

  if (showResults && result) {
    return <ResultsDisplay result={result} onClose={resetAnalysis} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <Sidebar />
      </div>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
        </button>
      </div>

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

          {activeTab === 'detect' && (
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

                <div className="relative z-10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group">
                      <Shield className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      FauxShield AI
                    </h2>
                  </div>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Advanced deepfake detection powered by neural analysis
                  </p>

                  <div className="relative max-w-2xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8">
                      <input
                        type="file"
                        id="file-upload"
                        accept="video/*,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            handleUpload(file);
                          }
                        }}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-cyan-400/20 rounded-full">
                            <Upload className="w-8 h-8 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              Upload Image or Video for Analysis
                            </h3>
                            <p className="text-gray-400 mb-4">
                              Drag and drop or click to select a media file
                            </p>
                          </div>
                        </div>
                      </label>

                      {uploading && (
                        <div className="mt-8 space-y-4">
                          <div className="flex justify-center items-center gap-2 text-indigo-600 font-semibold">
                            <Brain className="animate-pulse h-5 w-5" />
                            Analyzing content with AI...
                          </div>
                          <div className="max-w-md mx-auto">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2 text-center">
                              Processing frames and analyzing patterns...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
