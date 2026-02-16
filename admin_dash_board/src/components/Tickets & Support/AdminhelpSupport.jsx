import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiMessageSquare,
  FiChevronDown,
  FiSend,
  FiUser,
  FiCalendar,
  FiTag,
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

// const API_BASE = "https://lms-web-application-backend-e6yj.onrender.com/api/v1";

const normalizePriority = (p) => String(p || "").toLowerCase();
const formatPriority = (p) => {
  const v = normalizePriority(p);
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : "Medium";
};
const displayName = (u) => {
  if (!u) return ;
  const full = [u.firstname, u.lastname].filter(Boolean).join(" ").trim();
  return u.name || full ;
};

const AdminHelpSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(null);
  const [ticketThread, setTicketThread] = useState(null);

useEffect(() => {
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        page: 1,
        limit: 10,
        status: filterStatus,
        priority: filterPriority,
      };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin`, { 
        params, 
        withCredentials: true,
      });
      setTickets(res.data.data || []);
    } catch (err) {
      console.error("Error fetching admin tickets:", err.response?.data || err.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };
  fetchTickets();
}, [searchQuery, filterStatus, filterPriority]);


const fetchTicketThread = async (ticketId) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/ticket/${ticketId}`, {
      withCredentials: true
    });
    setTicketThread(res.data.data);
  } catch (e) {
    console.error("Fetch ticket thread error:", e.response?.data || e.message);
    setTicketThread(null);
  }
};

const handleStatusChange = async (ticketId, newStatus) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/v1/ticket/${ticketId}/status`, 
      { status: newStatus }, 
      { withCredentials: true }
    );
    setTickets((ts) => ts.map(t => t._id === ticketId ? { ...t, status: newStatus } : t));
    if (selectedTicket === ticketId) fetchTicketThread(ticketId);
  } catch (err) {
    console.error("Update status error:", err.response?.data || err.message);
    alert("Failed to update status.");
  }
};

const handleSendReply = async (ticketId) => {
  if (replyMessage.trim()) {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/ticket/${ticketId}/message`,
        { message: replyMessage.trim() },  
        { withCredentials: true }         
      );
      setReplyMessage('');
      setShowReplyBox(null);
      fetchTicketThread(ticketId);
    } catch (err) {
      console.error("Reply send error:", err.response?.data || err.message);
      alert("Failed to send message. Please check your login session.");
    }
  }
};

  const displayTickets = tickets.filter(ticket => {
    const statusOk = filterStatus === "all" ? ticket.status !== "closed" : ticket.status === filterStatus;
    const priorityOk = filterPriority === "all" || normalizePriority(ticket.priority) === normalizePriority(filterPriority);
    return statusOk && priorityOk;
  });

  const getStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
      case 'open': return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300 shadow-sm';
      case 'in-progress': return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-300 shadow-sm';
      case 'solved': return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-300 shadow-sm';
      case 'closed': return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-300 shadow-sm';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 shadow-sm';
    }
  };

  const getPriorityColor = (priority) => {
    switch (normalizePriority(priority)) {
      case 'urgent': return 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-300 shadow-sm';
      case 'high': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300 shadow-sm';
      case 'medium': return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-300 shadow-sm';
      case 'low': return 'bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 border-sky-300 shadow-sm';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 shadow-sm';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2">Support Ticket Management</h1>
          <p className="text-emerald-50">Admin dashboard to manage and respond to support tickets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <FiAlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <FiTrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{tickets.filter(t => String(t.status).toLowerCase() === 'open').length}</div>
            <div className="text-sm text-gray-600">Open Tickets</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <FiBarChart2 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{tickets.filter(t => String(t.status).toLowerCase() === 'in-progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <FiTrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {tickets.filter(t => ['high','urgent'].includes(normalizePriority(t.priority))).length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg">
                <FiUser className="w-6 h-6 text-emerald-600" />
              </div>
              <FiBarChart2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{tickets.length}</div>
            <div className="text-sm text-gray-600">Total Tickets</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by ticket ID or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 hover:border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <FiFilter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-emerald-500 transition-colors" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full lg:w-auto pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-white appearance-none cursor-pointer hover:border-gray-300 font-medium"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="solved">Solved</option>
                <option value="closed">Closed</option>
              </select>
              <FiChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative group">
              <FiTag className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-emerald-500 transition-colors" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full lg:w-auto pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-white appearance-none cursor-pointer hover:border-gray-300 font-medium"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <FiChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {displayTickets.length === 0 ? (
            <div className="p-8 sm:p-12 md:p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-5">
                <FiMessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No tickets found</h3>
              <p className="text-gray-600 text-base sm:text-lg">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider">Ticket ID</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider">Subject</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider hidden md:table-cell">User</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider">Priority</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider hidden lg:table-cell">Created On</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-gray-700 font-bold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayTickets.map((ticket) => (
                    <React.Fragment key={ticket._id}>
                      <tr className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200">
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-800 font-mono text-xs sm:text-sm font-bold">
                          {ticket.ticketId || `#${ticket._id.slice(-6)}`}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-800 text-xs sm:text-sm font-semibold">{ticket.subject}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-700 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <FiUser className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-medium text-xs sm:text-sm">{displayName(ticket.user)}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
                          <span className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 ${getPriorityColor(ticket.priority)}`}>
                            {formatPriority(ticket.priority)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border-2 text-xs sm:text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(ticket.status)}`}
                          >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="solved">Solved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-600 text-xs sm:text-sm font-medium hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-center">
                          <button
                            onClick={() => {
                              setSelectedTicket(selectedTicket === ticket._id ? null : ticket._id);
                              fetchTicketThread(ticket._id);
                            }}
                            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm"
                          >
                            <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{selectedTicket === ticket._id ? "Hide" : "View"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Ticket Thread */}
                      {selectedTicket === ticket._id && ticketThread && (
                        <tr className="bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 border-t-2 border-emerald-200">
                          <td colSpan="7" className="p-4 sm:p-6 md:p-8">
                            <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl mx-auto">
                              {/* Description */}
                              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 border-l-4 border-blue-500">
                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                  <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                  <h4 className="text-base sm:text-lg font-bold text-gray-800">Original Message</h4>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">{ticketThread.message}</p>
                              </div>

                              {/* Conversation History */}
                              <div>
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                  </div>
                                  <h4 className="text-base sm:text-lg font-bold text-gray-800">Conversation Thread</h4>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                {ticketThread.messages && ticketThread.messages.map((msg, idx) => {
                                  const senderRole = msg.sender_role || msg.sender?.role || "user";
                                  const name = displayName(msg.sender);
                                  
                                  return (
                                    <div key={idx} className={`p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-md border-l-4 transition-all duration-200 hover:shadow-lg ${
                                      ['admin','institution'].includes(senderRole)
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500"
                                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500"
                                    }`}>
                                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                                          ['admin','institution'].includes(senderRole)
                                            ? "bg-gradient-to-br from-emerald-400 to-teal-400"
                                            : senderRole === 'student' ? "bg-gradient-to-br from-blue-400 to-blue-500"
                                            : "bg-gradient-to-br from-purple-400 to-purple-500"
                                        }`}>
                                          <FiUsers className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm sm:text-base">{name}</span>
                                        <span className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-bold shadow-sm">
                                          {senderRole === 'student' ? 'Student' : 
                                          senderRole === 'instructor' ? 'Instructor' : 
                                          senderRole.charAt(0).toUpperCase() + senderRole.slice(1)}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 leading-relaxed ml-8 sm:ml-11 text-xs sm:text-sm md:text-base">
                                        {msg.message}
                                      </p>
                                    </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Reply Box */}
                              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 border-2 border-emerald-200">
                                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                  Send Response
                                </h4>
                                {showReplyBox === ticket._id ? (
                                  <div className="space-y-3 sm:space-y-4">
                                    <textarea
                                      value={replyMessage}
                                      onChange={(e) => setReplyMessage(e.target.value)}
                                      placeholder="Type your response here..."
                                      rows={4}
                                      className="w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm md:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 resize-none"
                                    />
                                    <div className="flex gap-2 sm:gap-3">
                                      <button
                                        onClick={() => handleSendReply(ticket._id)}
                                        className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-bold shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
                                      >
                                        <Send className="w-3 h-3 sm:w-4 sm:h-4" /> Send Response
                                      </button>
                                      <button
                                        onClick={() => { setShowReplyBox(null); setReplyMessage(''); }}
                                        className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-semibold text-xs sm:text-sm md:text-base"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setShowReplyBox(ticket._id)}
                                    className="flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
                                  >
                                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" /> Reply to Ticket
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHelpSupport;