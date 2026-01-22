import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from "react-icons/fa";
import {
  User,
  BookOpen,
  Award,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Settings,
  HelpCircle,
  Grid,
  Users,
  MessageSquare,
  FileText,
  Plus
} from 'lucide-react';
import Logout from '../LogoutModal/Logout';
import { AllCourseDetail } from '../AllCourseContext/Context';
import axios from 'axios';

const Header = () => {
  const { user } = useContext(AllCourseDetail);
  const [notifications, setNotifications] = useState("");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isLogout, setLogout] = useState(false);


  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const getProfileRoute = () => {
    return user?.role === 'instructor' ? '/instructor_page' : '/user_page';
  };

  const unreadCount = 10

  const fetchNotifications = async () => {
    // FIX 1: Guard clause - Stop if user ID is missing
    if (!user || !user._id) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/get_notification/${user._id}`,
        { withCredentials: true } // FIX 2: Send cookies/credentials to avoid 401 errors
      );
      
      console.log(res.data.count);

      if (res.data.success) {
        setNotifications(res.data.count);
      }
    } catch (err) {
      console.error("Notification Error:", err);
    }
  };

  useEffect(() => {
    // FIX 3: Only run fetch if user._id actually exists
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const getUserDisplayName = () => {
    if (!user) return 'User';

    const possibleName = user.name || user.username || user.fullName || user.firstName;

    if (possibleName) {
      return possibleName;
    }

    if (user.email) {
      const emailName = `${user.firstname} ${user.lastname}`.split('@')[0];
      return emailName
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    return 'User';
  };


  const getUserInitials = () => {
    const displayName = getUserDisplayName();

    if (displayName === 'User') return 'U';

    const words = displayName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  const getMainNavigation = () => {
    const commonNav = [
      { name: 'Home', path: '/', show: true },
      { name: 'About', path: '/about', show: true },
    ];

    if (!user) {
      return [
        ...commonNav,
        { name: 'Courses', path: '/allcourses', show: true },
        { name: 'Quiz', path: '/quizzes', show: true },
        { name: 'Contact', path: '/contact', show: true },
      ];
    }

    if (user.role === 'instructor') {
      return [
        ...commonNav,
        { name: 'My Courses', path: '/my_courses', show: true },
        { name: 'Contact', path: '/contact', show: true },
      ];
    } else {
      return [
        ...commonNav,
        { name: 'Browse Courses', path: '/allcourses', show: true },
        { name: 'My Learning', path: '/user_page', show: true },
        { name: 'Quiz', path: '/quizzes', show: true },
        { name: 'Contact', path: '/contact', show: true },
      ];
    }
  };

  console.log(notifications)

  const getDropdownItems = () => {
    if (!user) {
      return [
        { name: 'Categories', path: '/cateogeries', icon: <Grid className="w-4 h-4" />, color: 'blue' },
        { name: 'Mentors', path: '/mentors', icon: <Users className="w-4 h-4" />, color: 'green' },
        { name: 'Testimonials', path: '/testimonials', icon: <MessageSquare className="w-4 h-4" />, color: 'purple' },
      ];
    }

    if (user.role === 'instructor') {
      return [
        { name: 'Create Course', path: '/create_course', icon: <Plus className="w-4 h-4" />, color: 'blue' },
        { name: 'Quiz Manager', path: '/instructor_quiz_manager', icon: <FileText className="w-4 h-4" />, color: 'orange' },
        { name: 'Help & Support', path: '/help', icon: <HelpCircle className="w-4 h-4" />, color: 'green' },
      ];
    } else {
      return [
        { name: 'Categories', path: '/cateogeries', icon: <Grid className="w-4 h-4" />, color: 'blue' },
        { name: 'Mentors', path: '/mentors', icon: <Users className="w-4 h-4" />, color: 'green' },
        { name: 'Testimonials', path: '/testimonials', icon: <MessageSquare className="w-4 h-4" />, color: 'purple' },
        { name: 'Help & Support', path: '/help', icon: <HelpCircle className="w-4 h-4" />, color: 'orange' },
      ];
    }
  };

  const getProfileMenuItems = () => {
    if (!user) return [];

    if (user.role === 'instructor') {
      return [
        { name: 'Dashboard', path: '/instructor_page', icon: <LayoutDashboard className="w-4 h-4" />, color: 'blue' },
        { name: 'My Courses', path: '/my_courses', icon: <BookOpen className="w-4 h-4" />, color: 'green' },
        { name: 'Settings', path: '/settings_page', icon: <Settings className="w-4 h-4" />, color: 'gray' },
      ];
    } else {
      return [
        { name: 'My Profile', path: '/user_page', icon: <User className="w-4 h-4" />, color: 'blue' },
        { name: 'My Courses', path: '/user_page', icon: <BookOpen className="w-4 h-4" />, color: 'green' },
        { name: 'Certificates', path: '/certificates', icon: <Award className="w-4 h-4" />, color: 'yellow' },
        { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" />, color: 'gray' },
      ];
    }
  };

  const mainNavigation = getMainNavigation();
  const dropdownItems = getDropdownItems();
  const profileMenuItems = getProfileMenuItems();

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      gray: 'bg-gray-100 text-gray-600',
    };
    return colors[color] || colors.blue;
  };

  const getAvatarGradient = () => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
    ];
    const displayName = getUserDisplayName();
    const index = displayName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const getRoleDisplay = () => {
    if (!user?.role) return 'Student';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <header className="bg-white shadow-md relative">
      {isLogout && <Logout setLogout={setLogout} />}

      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
          <img

            className='w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain'
            src="https://askproject.net/studdy/wp-content/uploads/sites/43/2021/12/logo_Asset-7.png"
            alt="Logo"
          />
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          {mainNavigation.map((item, index) => (
            item.show && (
              <Link
                key={index}
                to={item.path}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-indigo-50"
              >
                {item.name}
              </Link>
            )
          ))}

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 flex items-center space-x-2"
            >
              <span>{user?.role === 'instructor' ? 'Tools' : 'Explore'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-3">
                  <div className="grid gap-2">
                    {dropdownItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all group border border-transparent hover:border-indigo-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className={`w-10 h-10 rounded-lg ${getColorClasses(item.color)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Click to explore</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>


        <div className='hidden lg:flex items-center space-x-6'>
          {user ? (
            <>

              <Link to="/notification" className="relative group">
                <div className="p-3 bg-gray-100 hover:bg-indigo-100 rounded-xl transition-all">
                  <FaBell size={20} className="text-gray-700 group-hover:text-indigo-600" />
                  {/* {notifications > 0 && ( */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {notifications }
                    </span>
                  {/* )} */}
                </div>
              </Link>

              {user.role === 'instructor' && (
                <Link
                  to="create_course"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
                >
                  + Create Course
                </Link>
              )}


              <div className="relative">
                <button
                  className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-gray-100 transition-all"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {getUserInitials()}
                  </div>

                  {/* User Name & Role */}
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {getRoleDisplay()}
                    </p>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openProfile ? 'rotate-180' : ''}`} />
                </button>

                {openProfile && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenProfile(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

                      <div className="p-6 bg-gradient-to-br from-gray-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-lg truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-indigo-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700 capitalize">
                                {getRoleDisplay()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3">
                        <div className="space-y-2">
                          {profileMenuItems.map((item, index) => (
                            <Link
                              key={index}
                              to={item.path}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                              onClick={() => setOpenProfile(false)}
                            >
                              <div className={`w-9 h-9 rounded-lg ${getColorClasses(item.color)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {item.icon}
                              </div>
                              <span className="font-medium text-gray-700">{item.name}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setLogout(true);
                              setOpenProfile(false);
                            }}
                            className='flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all group'
                          >
                            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors border border-indigo-600"
              >
                Sign In
              </Link>
              <Link
                to="/sign_up"
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-700 focus:outline-none ml-2 text-2xl"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col p-4 space-y-2">
            {/* User Info Card - Mobile */}
            {user && (
              <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-full border border-indigo-200">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700 capitalize">{getRoleDisplay()}</span>
                    </div>
                  </div>
                  <Link
                    to="/notification"
                    className="relative p-2 bg-white rounded-lg shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaBell className="text-gray-700" size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            {mainNavigation.map((item, index) => (
              item.show && (
                <Link
                  key={index}
                  to={item.path}
                  className="px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}

            {/* Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex justify-between items-center w-full px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium'
              >
                <span>{user?.role === 'instructor' ? 'Tools' : 'Explore'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="grid grid-cols-1 gap-2 mt-2 pl-2">
                  {dropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={`w-9 h-9 rounded-lg ${getColorClasses(item.color)} flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* User Actions */}
            {user ? (
              <>
                {user.role === 'instructor' && (
                  <Link
                    to="/create_course"
                    className="mt-2 w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 font-semibold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    + Create Course
                  </Link>
                )}

                <Link
                  to={getProfileRoute()}
                  className="w-full bg-indigo-50 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-100 font-semibold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {user.role === 'instructor' ? 'Dashboard' : 'My Profile'}
                </Link>

                <button
                  onClick={() => {
                    setLogout(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mt-2 w-full bg-indigo-50 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-100 font-semibold text-center border border-indigo-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign_up"
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;