import React, { useState } from "react";
import axios from "axios";

const SendAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("all");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/announcementscreate`, {
        title,
        message,
        recipients,
      });
      if (res.data.success) {
        setStatus("Announcement sent successfully!");
        setTitle("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to send announcement");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50">
      <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-white border-opacity-30 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
            Send Announcement
          </h1>
          <p className="text-gray-500">Broadcast important updates to users</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow grid gap-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition resize-none"
            />

            <select
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            >
              <option value="all">All Users</option>
              <option value="students">Students</option>
              <option value="instructors">Instructors</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center"
          >
            Send Announcement
          </button>
          {status && <p className="mt-2 text-green-600 font-medium text-center">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default SendAnnouncement;
