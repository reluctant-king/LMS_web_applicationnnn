import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Upload, Ticket, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HelpTickets = () => {
  const navigate = useNavigate();
  const preset_key = "arsmfwi7";
  const cloud_name = "dnqlt6cit";

  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    attachment: null,
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch user tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/getusertickets`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (data.success) setTickets(data.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    }; 
    fetchTickets();
  }, [token]);

  // ✅ Handle ticket submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let attachmentUrl = "";

      // ✅ 1. Upload to Cloudinary (if file selected)
      if (form.attachment) {
        const formData = new FormData();
        formData.append("file", form.attachment);
        formData.append("upload_preset", preset_key);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
          formData
        );

        attachmentUrl = uploadRes.data.secure_url;
      }

      // ✅ 2. Send ticket data to backend
      const payload = {
        subject: form.subject,
        category: form.category,
        priority: form.priority,
        message: form.description,
        attachment: attachmentUrl, // ✅ Cloudinary link
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/createticket`,
        payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
      );

      if (res.data.success) {
        toast.success("Ticket created successfully!");
        setShowModal(false);
        setForm({
          subject: "",
          category: "",
          priority: "",
          description: "",
          attachment: null,
        });
        setTickets((prev) => [res.data.data, ...prev]);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Ticket Error:", error);
      toast.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI helper functions
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      solved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-gray-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 py-8 sm:py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                Help & Support
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base">
                Track and manage your support tickets
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-emerald-600 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 
                         rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200 
                         shadow-lg hover:shadow-xl flex items-center space-x-2 
                         text-sm sm:text-base w-full sm:w-auto justify-center
                         active:scale-95"
            >
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Raise a Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Open</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {(tickets || []).filter(t => t?.status === "open").length}
                </p>
              </div>
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {(tickets || []).filter(t => t?.status === "in-progress").length}
                </p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Resolved</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {(tickets || []).filter(t => t?.status === "solved").length}
                </p>
              </div>
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {(tickets || []).length}
                </p>
              </div>
              <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Tickets</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {(tickets || []).filter(Boolean).length > 0 ? (
              (tickets || []).filter(Boolean).map((ticket) => (
                <div
                  key={ticket?._id || Math.random()}
                  className="p-4 sm:p-5 md:p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg 
                                        flex items-center justify-center">
                          <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 
                                       line-clamp-1">
                          {ticket?.subject || "Untitled Ticket"}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                          {ticket?.message || "No message provided"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <span
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${getStatusColor(
                              ticket?.status || "open"
                            )}`}
                          >
                            {(ticket?.status || "open")
                              .charAt(0)
                              .toUpperCase() +
                              (ticket?.status || "open").slice(1).replace("-", " ")}
                          </span>
                          <span className="text-gray-500">
                            <span className="hidden sm:inline">Category: </span>
                            <span className="font-medium text-gray-700">
                              {ticket?.category || "N/A"}
                            </span>
                          </span>
                          <span
                            className={`font-medium ${getPriorityColor(
                              ticket?.priority || "medium"
                            )}`}
                          >
                            <span className="hidden sm:inline">Priority: </span>
                            {(ticket?.priority || "medium")
                              .charAt(0)
                              .toUpperCase() +
                              (ticket?.priority || "medium").slice(1)}
                          </span>
                          <span className="text-gray-500">
                            {ticket?.createdAt
                              ? new Date(ticket.createdAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/help_tickets/${ticket._id}`}
                      className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 
                                 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white 
                                 rounded-lg font-medium transition-colors duration-200 
                                 text-sm w-full sm:w-auto active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>View Chat</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 
                                bg-gray-100 rounded-full mb-3 sm:mb-4">
                  <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-base sm:text-lg mb-1 sm:mb-2">No tickets found</p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Create your first support ticket to get help
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 
                        sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl max-w-2xl w-full 
                          h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 
                            py-3 sm:py-4 flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Raise a Support Ticket
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 
                           p-1 active:scale-90"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                             border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                             border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing</option>
                  <option value="general">General Query</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                             border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                             border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Attachment
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center 
                                space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 
                                    bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg 
                                    cursor-pointer transition-colors duration-200 text-sm 
                                    w-full sm:w-auto justify-center active:scale-95">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      onChange={(e) =>
                        setForm({ ...form, attachment: e.target.files[0] })
                      }
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                  </label>
                  {form.attachment && (
                    <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px]">
                      {form.attachment.name}
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
                  Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse 
                              sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 
                             rounded-lg hover:bg-gray-50 transition-colors duration-200 
                             font-medium text-sm sm:text-base w-full sm:w-auto active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 
                             text-white rounded-lg transition-colors duration-200 font-medium 
                             disabled:opacity-60 text-sm sm:text-base w-full sm:w-auto 
                             active:scale-95"
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpTickets;