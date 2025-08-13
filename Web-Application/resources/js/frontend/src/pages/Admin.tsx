import React, { useState, useEffect } from 'react';
import { Users, Shield, Search, Edit, Trash2, Eye, Calendar, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import laravelApi from '../api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  avatar?: string;
}

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  created_at: string;
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
}

interface HistoryItem {
  id: number;
  filename: string;
  prediction: string;
  confidence: number;
  created_at: string;
  pdf_path: string;
}

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userHistory, setUserHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const getAvatarUrl = (user: { name: string; avatar?: string }) => {
    if (!user.avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    }
    
    if (user.avatar.startsWith('http')) {
      return user.avatar;
    }
    
    if (user.avatar.startsWith('/storage')) {
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${user.avatar}`;
    }
    
    return user.avatar;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminResponse, usersResponse] = await Promise.all([
          laravelApi.get('/admin/me'),
          laravelApi.get('/admin/users')
        ]);
        
        const adminData = {
          ...adminResponse.data,
          avatar: adminResponse.data.avatar 
            ? getAvatarUrl(adminResponse.data)
            : undefined
        };
        
        const usersData = Array.isArray(usersResponse.data?.data || usersResponse.data) 
          ? (usersResponse.data?.data || usersResponse.data).map((user: User) => ({
              ...user,
              role: user.role || 'user',
              avatar: user.avatar ? getAvatarUrl(user) : undefined
            }))
          : [];
        
        setAdminProfile(adminData);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    setActionLoading(prev => ({...prev, [userId]: true}));
    try {
      await laravelApi.patch(
        `/admin/users/${userId}/role`,
        { role: newRole }
      );
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(prev => ({...prev, [userId]: false}));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setActionLoading(prev => ({...prev, [userId]: true}));
    try {
      await laravelApi.delete(`/admin/users/${userId}`);
      
      setUsers(users.filter(user => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(prev => ({...prev, [userId]: false}));
    }
  };

  const fetchUserHistory = async (userId: number) => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const response = await laravelApi.get(`/admin/users/${userId}/history`);
      
      // Handle both response structures
      const historyData = response.data.history || response.data;
      
      const formattedData = Array.isArray(historyData) 
        ? historyData.map((item: any) => ({
            id: item.id,
            filename: item.filename || 'Unknown',
            prediction: String(item.prediction || '').toUpperCase(),
            confidence: Number(item.confidence) || 0,
            created_at: item.created_at || new Date().toISOString(),
            pdf_path: item.pdf_path || ''
          }))
        : [];
      
      setUserHistory(formattedData);
    } catch (err: any) {
      console.error('Error fetching user history:', err);
      setHistoryError(err.response?.data?.message || 'Failed to load user history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    await fetchUserHistory(user.id);
  };

  const handleDownload = async (resultId: number, filename: string) => {
    if (!selectedUser) return;
    
    try {
      setDownloadingId(resultId);
      const response = await laravelApi.get(
        `/admin/users/${selectedUser.id}/results/${resultId}/download`,
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const pdfFilename = `report_${filename}_${resultId}.pdf`;
      link.href = url;
      link.setAttribute('download', pdfFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
      setHistoryError(err.response?.data?.message || 'Failed to download report');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    return (
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  const tabs: Tab[] = [
    { id: 'users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <Sidebar />
      </div>

      <div className="md:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage users and their permissions</p>
          </div>

          {adminProfile && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={getAvatarUrl(adminProfile)}
                  alt={adminProfile.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile.name)}&background=random`;
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{adminProfile.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{adminProfile.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    <Shield className="h-3 w-3 mr-1" />
                    {adminProfile.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <tr key={`user-${user.id}-${user.email}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      src={getAvatarUrl(user)}
                                      alt={user.name}
                                      className="h-10 w-10 rounded-full mr-3"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                                      }}
                                    />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(
                                      user.id, 
                                      e.target.value as 'admin' | 'user'
                                    )}
                                    disabled={actionLoading[user.id]}
                                    className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                                      user.role === 'admin'
                                        ? 'bg-purple-50 text-purple-800 ring-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:ring-purple-700'
                                        : 'bg-blue-50 text-blue-800 ring-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-700'
                                    } ${actionLoading[user.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(user.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <button 
                                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                      onClick={() => handleViewUser(user)}
                                      disabled={actionLoading[user.id]}
                                    >
                                      <Eye className="h-5 w-5" />
                                    </button>
                                    <button 
                                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                      disabled={actionLoading[user.id]}
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button 
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                      onClick={() => handleDeleteUser(user.id)}
                                      disabled={actionLoading[user.id]}
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Analysis History for {selectedUser.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : historyError ? (
                <div className="text-red-500 dark:text-red-400 text-center py-4">
                  {historyError}
                </div>
              ) : userHistory.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No analysis history found for this user.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {userHistory.map((item) => (
                      <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white truncate">
                              {item.filename}
                            </h5>
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
                          <button 
                            onClick={() => handleDownload(item.id, item.filename)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500"
                            title="Download"
                            disabled={downloadingId === item.id}
                          >
                            {downloadingId === item.id ? (
                              <span className="inline-block h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <table className="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">File</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Result</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Confidence</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {userHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.filename}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleDownload(item.id, item.filename)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                              title="Download"
                              disabled={downloadingId === item.id}
                            >
                              {downloadingId === item.id ? (
                                <span className="inline-block h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <Download className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;