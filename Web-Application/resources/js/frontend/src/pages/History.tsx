import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Trash2, Menu, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import axios from '../api';

interface HistoryItem {
  id: number;
  filename: string;
  prediction: string;
  confidence: number;
  created_at: string;
  file_path: string;
}

function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'authentic' | 'deepfake'>('all');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/results');
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          filename: item.filename || 'Unknown',
          prediction: String(item.prediction || '').toUpperCase(),
          confidence: Number(item.confidence) || 0,
          created_at: item.created_at || new Date().toISOString(),
          file_path: item.file_path || ''
        }));

        setHistoryItems(formattedData);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        setDeletingId(id);
        await axios.delete(`/results/${id}`);
        setHistoryItems(prevItems => prevItems.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting report:', err);
        alert('Failed to delete report. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

const handleDownload = async (id: number, filename: string) => {
  try {
    const response = await axios.get(`/results/${id}/download`, {
      responseType: 'blob',
      params: {
        type: 'pdf'
      }
    });

    const contentType = response.headers['content-type'];
    if (!contentType.includes('application/pdf')) {
      throw new Error('Received non-PDF file');
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    const pdfFilename = filename.replace(/\.[^/.]+$/, '') + '.pdf';
    link.href = url;
    link.setAttribute('download', pdfFilename);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (err) {
    console.error('Download error:', err);
    alert('Failed to download PDF report. Please try again.');
  }
};

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'authentic' && (item.prediction === 'REAL' || item.prediction === 'AUTHENTIC')) ||
      (selectedFilter === 'deepfake' && (item.prediction === 'FAKE' || item.prediction === 'DEEPFAKE'));
    return matchesSearch && matchesFilter;
  });

  const formatPredictionDisplay = (prediction: string) => {
    switch(prediction) {
      case 'REAL':
      case 'AUTHENTIC':
        return 'Authentic';
      case 'FAKE':
      case 'DEEPFAKE':
        return 'Deepfake';
      default:
        return 'Unknown';
    }
  };

  const getPredictionStyleClass = (prediction: string) => {
    return prediction === 'REAL' || prediction === 'AUTHENTIC' ? 'REAL' : 'FAKE';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white md:ml-64 p-8">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold">Analysis History</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
              View and manage your previous detection results
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'authentic' | 'deepfake')}
                  className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="all">All Results</option>
                  <option value="authentic">Authentic Only</option>
                  <option value="deepfake">Deepfake Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-gray-500 dark:text-gray-300 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                  Loading results...
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="p-6 text-gray-500 dark:text-gray-300 text-center">
                  {historyItems.length === 0 
                    ? 'No analysis results found.' 
                    : 'No results match your current filter.'}
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {filteredHistory.map((item) => (
                      <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {item.filename}
                            </h3>
                            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-300">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getPredictionStyleClass(item.prediction) === 'REAL'
                                ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                                : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                            }`}
                          >
                            {formatPredictionDisplay(item.prediction)}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  getPredictionStyleClass(item.prediction) === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${item.confidence * 100}%` }}
                              />
                            </div>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                              {(item.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleDownload(item.id, item.filename)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500"
                              title="Download"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                              title="Delete"
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <span className="inline-block h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <table className="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">File</th>
                        <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Result</th>
                        <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Confidence</th>
                        <th className="px-4 py-3 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.filename}
                          </td>
                          <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getPredictionStyleClass(item.prediction) === 'REAL'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                                  : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                              }`}
                            >
                              {formatPredictionDisplay(item.prediction)}
                            </span>
                          </td>
                          <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    getPredictionStyleClass(item.prediction) === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.confidence * 100}%` }}
                                />
                              </div>
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                                {(item.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleDownload(item.id, item.filename)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500 p-1"
                                title="Download"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500 p-1"
                                title="Delete"
                                disabled={deletingId === item.id}
                              >
                                {deletingId === item.id ? (
                                  <span className="inline-block h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;