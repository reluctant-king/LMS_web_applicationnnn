import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// const API_BASE = "https://lms-web-application-backend-e6yj.onrender.com/api/v1";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipients: "all",
  });

  const itemsPerPage = 5;

  const fetchAnnouncements = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/allannouncements`, {
        params: { page, limit: itemsPerPage, search },
      });
      setAnnouncements(res.data.data || []);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [search, currentPage]);

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setFormData(
      data
        ? { title: data.title, message: data.message, recipients: data.recipients }
        : { title: "", message: "", recipients: "all" }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.message.trim()) {
        alert("Please fill in all required fields.");
        return;
      }

      if (editData) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/announcements/${editData._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/announcementscreate`, formData);
      }

      handleCloseModal();
      fetchAnnouncements(currentPage);
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/announcements/${id}`);
      fetchAnnouncements(currentPage);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleExportPDF = () => {
    if (!announcements.length) return alert("No announcements to export.");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Announcements List", 14, 15);
    doc.setFontSize(11);

    const columns = ["#", "Title", "Message", "Recipients Count", "Date"];
    const rows = announcements.map((a, i) => [
      i + 1,
      a.title,
      a.message,
      a.recipients.length,
      new Date(a.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save("Announcements_List.pdf");
  };

  // Print
  const handlePrint = () => {
    const tableRows = announcements
      .map(
        (a, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${a.title}</td>
          <td>${a.message}</td>
          <td>${a.recipients.length}</td>
          <td>${new Date(a.createdAt).toLocaleDateString()}</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Announcements List</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Announcements List</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Message</th>
                <th>Recipients Count</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl">
            <FaPlus className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Announcements Management</h2>
            <p className="text-gray-600">Create, edit, and manage announcements</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search by title or message..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl flex items-center gap-2 hover:from-red-600 hover:to-pink-600 shadow-lg"
            >
              <FaFilePdf /> Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center gap-2 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2"
            >
              <FaPlus /> Add Announcement
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Announcements</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Title", "Message", "Recipients", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Loading announcements...
                    </td>
                  </tr>
                ) : announcements.length ? (
                  announcements.map((a, i) => (
                    <tr key={a._id} className="hover:bg-green-50 transition">
                      <td className="px-6 py-3 text-sm">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-800">{a.title}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{a.message}</td>
                      <td className="px-6 py-3 text-sm">{a.recipients.length}</td>
                      <td className="px-6 py-3 text-sm">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleOpenModal(a)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(a._id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50 border-t">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === i + 1
                        ? "bg-green-500 text-white"
                        : "border text-gray-700 hover:bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {editData ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="instructors">Instructors</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                >
                  {editData ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
