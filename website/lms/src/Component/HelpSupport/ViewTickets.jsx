import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, Paperclip, MoreVertical, CheckCheck, MessageCircle } from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;

const TicketChatPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/userticket/${ticketId}`, {
        withCredentials: true
      });
      setTicket(res.data.data);
      console.log("Ticket loaded:", res.data.data);
    } catch (err) {
      console.error("Error fetching ticket:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && !sending) {
      try {
        setSending(true);
        await axios.post(
          `${API_BASE}/userticket/${ticketId}/message`,
          { message: newMessage.trim() },
          { withCredentials: true }
        );
        setNewMessage('');
        if (textareaRef.current) {
          textareaRef.current.style.height = '48px';
        }
        fetchTicket();
      } catch (err) {
        console.error("Failed to send message:", err.response?.data || err.message);
      } finally {
        setSending(false);
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = '48px';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-700 font-medium text-sm sm:text-base">Loading ticket...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!ticket) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Ticket Not Found</h2>
          <p className="text-slate-600 mb-6 text-sm sm:text-base">The ticket you're looking for doesn't exist</p>
          <Link
            to="/user/tickets"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition font-medium shadow-lg text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-emerald-200/60 sticky top-0 z-10 safe-area-top">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link
                to="/user/tickets"
                className="p-2 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl transition-colors flex-shrink-0"
                aria-label="Back to tickets"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 truncate">
                  {ticket.subject || "Support Ticket"}
                </h1>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${
                      ticket.status === "open"
                        ? "bg-blue-100 text-blue-700"
                        : ticket.status === "in-progress"
                        ? "bg-amber-100 text-amber-700"
                        : ticket.status === "solved"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-slate-300 hidden xs:inline">•</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wide hidden xs:inline-block ${
                      ticket.priority === "urgent"
                        ? "bg-rose-100 text-rose-700"
                        : ticket.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : ticket.priority === "medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {ticket.priority || "Medium"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <button 
              className="p-2 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl transition-colors flex-shrink-0"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
          {(!ticket.messages || ticket.messages.length === 0) ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[400px] px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <Send className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 text-center">No messages yet</h3>
              <p className="text-slate-500 text-center text-sm sm:text-base max-w-xs sm:max-w-sm">
                Start the conversation by sending your first message below
              </p>
            </div>
          ) : (
            ticket.messages.map((msg, i) => {
              const senderRole = msg.sender_role || msg.sender?.role || "user";
              const isAdminMessage = ['admin', 'institution'].includes(senderRole);
              const showDateDivider = i === 0 ||
                new Date(ticket.messages[i - 1]?.createdAt).toDateString() !==
                new Date(msg.createdAt).toDateString();

              return (
                <React.Fragment key={msg._id || i}>
                  {/* Date Divider */}
                  {showDateDivider && (
                    <div className="flex justify-center my-4 sm:my-6 md:my-8">
                      <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/60 backdrop-blur-sm text-[10px] sm:text-xs font-medium text-slate-600 rounded-full border border-emerald-200/60 shadow-sm">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`flex items-end gap-2 sm:gap-3 ${isAdminMessage ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm shadow-lg flex-shrink-0 ${
                        isAdminMessage
                          ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white"
                          : senderRole === "student"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                          : senderRole === "instructor"
                          ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                          : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                      }`}
                    >
                      {isAdminMessage
                        ? "AD"
                        : msg.sender?.name?.[0]?.toUpperCase() ||
                          senderRole.charAt(0).toUpperCase() ||
                          "U"}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[65%] ${isAdminMessage ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
                          isAdminMessage
                            ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-br-md"
                            : "bg-white text-slate-800 border border-slate-200/60 rounded-bl-md"
                        }`}
                      >
                        {/* Sender Name */}
                        <div
                          className={`text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1 ${
                            isAdminMessage ? "text-emerald-100" : "text-slate-500"
                          }`}
                        >
                          {isAdminMessage
                            ? "Support"
                            : senderRole === "student"
                            ? `${msg.sender?.name || "Student"}`
                            : senderRole === "instructor"
                            ? `${msg.sender?.name || "Instructor"}`
                            : msg.sender?.name || "User"}
                        </div>
                        {/* Message Text */}
                        <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <div className={`flex items-center gap-1 mt-1 px-1 ${isAdminMessage ? "flex-row-reverse" : "flex-row"}`}>
                        <span className="text-[10px] sm:text-xs text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        {isAdminMessage && (
                          <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-emerald-200/60 safe-area-bottom">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex items-end gap-2 sm:gap-3">
            {/* Attachment Button - Hidden on very small screens */}
            <button 
              className="hidden sm:flex p-2.5 sm:p-3 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl transition-colors text-slate-500"
              disabled
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-slate-800 placeholder-slate-400 text-sm sm:text-base transition-all"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-2.5 sm:p-3 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:from-emerald-800 active:to-teal-900 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Send message"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Helper Text - Hidden on mobile */}
          <p className="hidden sm:block text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 ml-0 sm:ml-14">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketChatPage;