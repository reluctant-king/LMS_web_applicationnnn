import React, { useState, useEffect, useContext } from 'react';
import { BsBellFill } from 'react-icons/bs';
import { MdClose, MdDownloadDone, MdAssignment, MdAnnouncement, MdGrade, MdInfo } from 'react-icons/md';
import { FaTrash, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { AllCourseDetail } from '../AllCourseContext/Context';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AllCourseDetail);
  const [notId, setNottId] = useState("");

  const getAllNoticication = async () => {
    try {
      setLoading(true);
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/all_notification`);
      console.log(res);

      const assignmentNot = res.data.notification.filter(
        (n) => n.type === "assignment" || n.type === "asignment"
      );

      const submittingAssiNot = res.data.notification.filter(
        (n) => n.type === "submitting assignment"
      );

      const currentusernoti = assignmentNot.filter(
        (a) => a.userId?.toString() === user?._id?.toString()
      );
      const currentInstruNot = submittingAssiNot.filter(
        (a) => a.userId?.toString() === user?._id?.toString()
      );
      console.log("currentUserNotification", currentusernoti);
      setNotifications([...currentusernoti, ...currentInstruNot]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getAllNoticication();
    }
  }, [user]);

  console.log(notifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'assignment':
        return 'bg-gradient-to-r from-blue-50 to-blue-100/50';
      case 'announcement':
        return 'bg-gradient-to-r from-purple-50 to-purple-100/50';
      case 'grade':
        return 'bg-gradient-to-r from-green-50 to-green-100/50';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100/50';
    }
  };

  const getIcon = (type) => {
    const iconClass = "w-5 h-5 sm:w-6 sm:h-6";
    switch (type) {
      case 'assignment':
        return <MdAssignment className={`${iconClass} text-blue-600`} />;
      case 'announcement':
        return <MdAnnouncement className={`${iconClass} text-purple-600`} />;
      case 'grade':
        return <MdGrade className={`${iconClass} text-green-600`} />;
      case 'submitting assignment':
        return <MdDownloadDone className={`${iconClass} text-green-600`} />;
      default:
        return <MdInfo className={`${iconClass} text-gray-600`} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const onTimeDelete = () => {
    notifications.filter((n) => n._id !== notId);
  };

  const confirmDelete = async (id) => {
    setNottId(id);
    try {
      let res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/delete_notification/${id}`);
      if (res.data.success) {
        onTimeDelete();
        toast.success("Notification deleted");
        getAllNoticication();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 sm:py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 border border-white/20">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <BsBellFill className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center animate-pulse shadow-lg ring-2 sm:ring-4 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Notifications
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">
                  Stay updated with your latest alerts
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="shrink-0 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-xs sm:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">Mark all as read</span>
                <span className="sm:hidden">Read all</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-5">
          {loading ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-10 sm:p-16 text-center border border-white/20">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4 sm:mb-6"></div>
                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl"></div>
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-lg">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-10 sm:p-16 text-center border border-white/20">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <BsBellFill className="relative w-14 h-14 sm:w-20 sm:h-20 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">No notifications</h3>
              <p className="text-gray-500 text-sm sm:text-lg">You're all caught up! 🎉</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`group bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 border border-white/20 overflow-hidden ${
                  !notif.isRead ? 'ring-2 ring-indigo-300/50' : ''
                }`}
              >
                <div className={`p-4 sm:p-5 md:p-7 ${getNotificationStyle(notif.type)}`}>
                  <div className="flex items-start gap-3 sm:gap-5">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/50 rounded-lg sm:rounded-xl blur-md"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-md">
                          {getIcon(notif.type)}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title Row */}
                      <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <span className="truncate">{notif.title}</span>
                          {!notif.isRead && (
                            <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-indigo-600"></span>
                            </span>
                          )}
                        </h3>
                        <button
                          onClick={() => confirmDelete(notif._id)}
                          className="text-gray-400 hover:text-red-500 transition-all duration-300 flex-shrink-0 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transform hover:scale-110"
                        >
                          <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Message */}
                      <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-3 sm:line-clamp-none">
                        {notif.message}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          {notif.data && notif.data.courseName && (
                            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm border border-gray-200/50">
                              <span className="mr-1 sm:mr-2">📚</span>
                              <span className="truncate max-w-[120px] sm:max-w-none">{notif.data.courseName}</span>
                            </span>
                          )}
                          {notif.createdAt && (
                            <span className="text-gray-500 text-xs sm:text-sm font-medium">
                              {formatTimestamp(notif.createdAt)}
                            </span>
                          )}
                        </div>

                        {!notif.isRead && (
                          <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all self-start sm:self-auto">
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 max-w-sm sm:max-w-md w-full text-center border border-white/20 transform animate-scaleIn">
            {/* Icon */}
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto border-4 border-red-100 shadow-lg">
                <FaExclamationCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
              Delete Notification?
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold border-2 border-gray-200 hover:bg-gray-200 transition-all shadow-sm hover:shadow-md transform hover:scale-105 text-sm sm:text-base"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  confirmDelete(notId);
                  setShowModal(false);
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Notification;