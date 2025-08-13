import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import axios from '../api';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/user');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('phone', profile.phone || '');
    formData.append('location', profile.location || '');
    formData.append('bio', profile.bio || '');
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      const response = await axios.post('/user/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(response.data.user);
      alert('Profile updated!');
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile.');
    }
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="relative h-32 sm:h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
                <div className="relative">
                  <img
                    src={
                      avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : profile.avatar?.startsWith('/')
                          ? `http://localhost:8000${profile.avatar}`
                          : profile.avatar || 'https://via.placeholder.com/150'
                    }
                    alt={profile.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover"
                  />
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700"
                    >
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setAvatarFile(file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                  {profile.name}
                </h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Personal Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Personal Information
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center border dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 bg-white dark:bg-gray-700">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
                        <input
                          type="text"
                          value={profile.name}
                          disabled={!isEditing}
                          className="flex-1 focus:outline-none bg-transparent text-gray-900 dark:text-white disabled:text-gray-400 text-sm sm:text-base"
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="flex items-center border dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 bg-white dark:bg-gray-700">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
                        <input
                          type="email"
                          value={profile.email}
                          disabled={!isEditing}
                          className="flex-1 focus:outline-none bg-transparent text-gray-900 dark:text-white disabled:text-gray-400 text-sm sm:text-base"
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <div className="flex items-center border dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 bg-white dark:bg-gray-700">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
                        <input
                          type="tel"
                          value={profile.phone || ''}
                          disabled={!isEditing}
                          className="flex-1 focus:outline-none bg-transparent text-gray-900 dark:text-white disabled:text-gray-400 text-sm sm:text-base"
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Additional Information
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <div className="flex items-center border dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 bg-white dark:bg-gray-700">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
                        <input
                          type="text"
                          value={profile.location || ''}
                          disabled={!isEditing}
                          className="flex-1 focus:outline-none bg-transparent text-gray-900 dark:text-white disabled:text-gray-400 text-sm sm:text-base"
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio || ''}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full border dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:text-gray-400 text-sm sm:text-base"
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 sm:mt-8 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 flex-1 sm:flex-none"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarFile(null);
                      }}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex-1 sm:flex-none"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;