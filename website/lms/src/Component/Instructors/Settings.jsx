import React, { useState, useContext, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  Camera,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { AllCourseDetail } from '../AllCourseContext/Context';
import axios from 'axios';

const SettingsPage = () => {
  const { user } = useContext(AllCourseDetail);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    expertise: '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    newEnrollments: true,
    quizSubmissions: true,
    systemUpdates: false,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
        expertise: user.expertise || '',
      });
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/update-profile`,
        profileData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long!');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle Notification Update
  const handleNotificationUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/update-notifications`,
        notifications,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Notification preferences updated!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update notification preferences');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle Privacy Update
  const handlePrivacyUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/update-privacy`,
        privacy,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Privacy settings updated!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update privacy settings');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Get User Initials
  const getUserInitials = () => {
    if (user?.firstname && user?.lastname) {
      return (user.firstname.charAt(0) + user.lastname.charAt(0)).toUpperCase();
    }
    return 'U';
  };

  // Get Avatar Gradient
  const getAvatarGradient = () => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
    ];
    const displayName = user?.firstname || 'User';
    const index = displayName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', name: 'Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
            <p className="text-green-800 font-medium text-sm sm:text-base">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
            <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-2 sm:p-4 lg:sticky lg:top-4">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base whitespace-nowrap shrink-0 lg:w-full ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline lg:inline">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Profile Information</h2>
                  
                  {/* Avatar Section */}
                  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative group">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg`}>
                        {getUserInitials()}
                      </div>
                      <button className="absolute inset-0 bg-black bg-opacity-50 rounded-xl sm:rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {user?.firstname} {user?.lastname}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 capitalize">{user?.role}</p>
                      <button className="mt-2 text-indigo-600 text-xs sm:text-sm font-semibold hover:underline">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.firstname}
                            onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.lastname}
                            onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter email"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expertise (Instructors only) */}
                    {user?.role === 'instructor' && (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                          Expertise
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.expertise}
                            onChange={(e) => setProfileData({ ...profileData, expertise: e.target.value })}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., UI/UX Design, Web Development"
                          />
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-2 sm:pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Security Settings</h2>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                      <p className="mt-1.5 sm:mt-2 text-xs text-gray-500">Password must be at least 6 characters long</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2 sm:pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                      >
                        <Lock className="w-4 h-4" />
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>

                  {/* Two-Factor Authentication */}
                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Two-Factor Authentication</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Enable 2FA</p>
                        <p className="text-xs sm:text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Notifications</p>
                        <p className="text-xs sm:text-sm text-gray-600">Receive email updates about your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {/* Course Updates */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Course Updates</p>
                        <p className="text-xs sm:text-sm text-gray-600">Get notified about course changes and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.courseUpdates}
                          onChange={(e) => setNotifications({ ...notifications, courseUpdates: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {/* New Enrollments (Instructors) */}
                    {user?.role === 'instructor' && (
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">New Enrollments</p>
                          <p className="text-xs sm:text-sm text-gray-600">Notification when students enroll in your courses</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={notifications.newEnrollments}
                            onChange={(e) => setNotifications({ ...notifications, newEnrollments: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    )}

                    {/* Quiz Submissions */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Quiz Submissions</p>
                        <p className="text-xs sm:text-sm text-gray-600">Alerts for quiz completions and results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.quizSubmissions}
                          onChange={(e) => setNotifications({ ...notifications, quizSubmissions: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {/* System Updates */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">System Updates</p>
                        <p className="text-xs sm:text-sm text-gray-600">Important platform updates and announcements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={notifications.systemUpdates}
                          onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 sm:pt-6">
                    <button
                      onClick={handleNotificationUpdate}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Profile Visibility
                      </label>
                      <div className="space-y-2 sm:space-y-3">
                        <label className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="public"
                            checked={privacy.profileVisibility === 'public'}
                            onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Public</p>
                            <p className="text-xs sm:text-sm text-gray-600">Anyone can view your profile</p>
                          </div>
                        </label>
                        <label className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="students"
                            checked={privacy.profileVisibility === 'students'}
                            onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Students Only</p>
                            <p className="text-xs sm:text-sm text-gray-600">Only enrolled students can see your profile</p>
                          </div>
                        </label>
                        <label className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="private"
                            checked={privacy.profileVisibility === 'private'}
                            onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Private</p>
                            <p className="text-xs sm:text-sm text-gray-600">Only you can view your profile</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Contact Information
                      </label>
                      <div className="space-y-2 sm:space-y-3">
                        <label className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Show Email Address</p>
                            <p className="text-xs sm:text-sm text-gray-600">Display your email on your profile</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy.showEmail}
                            onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 shrink-0"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Show Phone Number</p>
                            <p className="text-xs sm:text-sm text-gray-600">Display your phone on your profile</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy.showPhone}
                            onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 shrink-0"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Data & Account */}
                    <div className="pt-4 sm:pt-6 border-t border-gray-200">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Data & Account</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <button className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl text-left hover:bg-gray-100 transition-colors">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Download Your Data</p>
                          <p className="text-xs sm:text-sm text-gray-600">Request a copy of your personal data</p>
                        </button>
                        <button className="w-full p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl text-left hover:bg-red-100 transition-colors group">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-red-600 text-sm sm:text-base">Delete Account</p>
                              <p className="text-xs sm:text-sm text-red-600">Permanently delete your account and all data</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 sm:pt-6">
                      <button
                        onClick={handlePrivacyUpdate}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;