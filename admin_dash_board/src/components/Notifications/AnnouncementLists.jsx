import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilePdf,
  FaPrint,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaBullhorn,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400
                     hover:text-gray-600 transition"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Delete Announcement
          </h3>
          <p className="text-gray-600 mb-6">
            This announcement will be permanently removed. This
            action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300
                         text-gray-700 rounded-xl font-semibold
                         hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500
                         to-pink-500 hover:from-red-600 hover:to-pink-600
                         text-white font-semibold rounded-xl shadow-lg
                         transition flex items-center justify-center gap-2
                         disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <FaTrash /> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormModal = ({ isOpen, onClose, onSave, editData, saving }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipients: "all",
  });
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(
        editData
          ? {
              title: editData.title || "",
              message: editData.message || "",
              recipients: editData.recipients || "all",
            }
          : { title: "", message: "", recipients: "all" }
      );
      setErrors({});

      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, editData]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, saving, onClose]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.message.trim())
      newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!saving ? onClose : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">        <div
          className="bg-gradient-to-r from-green-500 to-teal-500
                        px-6 py-4 flex items-center justify-between"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {editData ? <FaEdit /> : <FaPlus />}
            {editData ? "Edit Announcement" : "Create Announcement"}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-white/80 hover:text-white transition"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6 space-y-5">          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Announcement title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={`w-full border rounded-xl px-4 py-3
                focus:ring-2 focus:ring-green-500 focus:border-transparent
                transition ${
                  errors.title
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write your announcement message..."
              rows={4}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message)
                  setErrors({ ...errors, message: "" });
              }}
              className={`w-full border rounded-xl px-4 py-3
                focus:ring-2 focus:ring-green-500 focus:border-transparent
                transition resize-none ${
                  errors.message
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Recipients
            </label>
            <select
              value={formData.recipients}
              onChange={(e) =>
                setFormData({ ...formData, recipients: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3
                         focus:ring-2 focus:ring-green-500
                         focus:border-transparent transition"
            >
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
              <option value="instructors">Instructors Only</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 rounded-xl
                       text-gray-600 font-medium hover:bg-gray-100
                       transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r
                       from-green-500 to-teal-500 hover:from-green-600
                       hover:to-teal-600 text-white font-semibold
                       shadow-md transition flex items-center gap-2
                       disabled:opacity-70"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                {editData ? "Updating…" : "Creating…"}
              </>
            ) : (
              <>
                <FaCheckCircle />
                {editData ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const RecipientBadge = ({ value }) => {
  const config = {
    all: {
      label: "All Users",
      classes: "bg-blue-100 text-blue-700 border-blue-200",
    },
    students: {
      label: "Students",
      classes: "bg-purple-100 text-purple-700 border-purple-200",
    },
    instructors: {
      label: "Instructors",
      classes: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const key =
    typeof value === "string" ? value : Array.isArray(value) ? "all" : "all";

  const { label, classes } = config[key] || config.all;

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-semibold
                     rounded-full border ${classes}`}
    >
      {typeof value === "string"
        ? label
        : `${value?.length || 0} recipients`}
    </span>
  );
};

const formatRecipients = (value) => {
  if (typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  if (Array.isArray(value)) {
    return `${value.length} recipients`;
  }
  return "-";
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAnnouncements = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/allannouncements`,
          {
            params: {
              page,
              limit: itemsPerPage,
              search: search.trim() || undefined,
            },
          }
        );

        setAnnouncements(res.data.data || []);
        setCurrentPage(res.data.page || page);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(
          res.data.totalCount ?? res.data.total ?? res.data.data?.length ?? 0
        );
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    },
    [search, itemsPerPage]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAnnouncements(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    fetchAnnouncements(page);
  };

  useEffect(() => {
    fetchAnnouncements(1);
  }, []);

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditData(null);
  }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editData) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/announcements/${editData._id}`,
          formData
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/announcementscreate`,
          formData
        );
      }

      handleCloseModal();

      const targetPage = editData ? currentPage : 1;
      if (targetPage !== currentPage) setCurrentPage(targetPage);
      fetchAnnouncements(targetPage);
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/announcements/${deleteId}`
      );

      const remaining = announcements.length - 1;
      const targetPage =
        remaining === 0 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      if (targetPage !== currentPage) setCurrentPage(targetPage);
      fetchAnnouncements(targetPage);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  const handleExportPDF = async () => {
    if (announcements.length === 0) return;

    let allData = announcements;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/allannouncements`,
        {
          params: {
            page: 1,
            limit: 9999,
            search: search.trim() || undefined,
          },
        }
      );
      allData = res.data.data || announcements;
    } catch {
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text("Announcements Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      14,
      30
    );
    doc.text(`Total: ${allData.length} announcements`, 14, 36);

    const rows = allData.map((a, i) => [
      i + 1,
      a.title || "-",
      a.message?.length > 60
        ? a.message.substring(0, 60) + "…"
        : a.message || "-",
      formatRecipients(a.recipients),
      a.createdAt
        ? new Date(a.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-",
    ]);

    autoTable(doc, {
      head: [["#", "Title", "Message", "Recipients", "Date"]],
      body: rows,
      startY: 42,
      theme: "striped",
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        2: { cellWidth: 70 },
        3: { halign: "center" },
        4: { halign: "center" },
      },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save("announcements-report.pdf");
  };

  const handlePrint = () => {
    if (announcements.length === 0) return;

    const rows = announcements
      .map(
        (a, i) => `
        <tr>
          <td>${(currentPage - 1) * itemsPerPage + i + 1}</td>
          <td><strong>${a.title || "-"}</strong></td>
          <td>${a.message || "-"}</td>
          <td style="text-align:center">${formatRecipients(a.recipients)}</td>
          <td>${
            a.createdAt
              ? new Date(a.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"
          }</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Announcements</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 30px;
              color: #1f2937;
            }
            h2 { color: #10b981; margin-bottom: 4px; }
            .meta {
              color: #6b7280;
              font-size: 13px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th {
              background: #10b981;
              color: white;
              padding: 12px 16px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
            }
            td {
              padding: 10px 16px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }
            tr:nth-child(even) { background: #f9fafb; }
            @media print { body { padding: 15px; } }
          </style>
        </head>
        <body>
          <h2>Announcements Report</h2>
          <p class="meta">Printed: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Message</th>
                <th>Recipients</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const getRowNumber = (index) =>
    (currentPage - 1) * itemsPerPage + index + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editData={editData}
        saving={saving}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <div className="max-w-7xl mx-auto">        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl">
            <FaBullhorn className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Announcements Management
            </h2>
            <p className="text-gray-600">
              Create, edit, and manage announcements
            </p>
          </div>
        </div>
        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6
                        flex flex-col md:flex-row items-center
                        justify-between gap-4"
        >
          <div className="relative w-full md:w-96">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2
                           text-gray-400"
            />
            <input
              type="text"
              value={search}
              placeholder="Search by title or message..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300
                         rounded-xl focus:outline-none focus:ring-2
                         focus:ring-green-500 focus:border-transparent
                         transition"
            />
          </div>

          <div className="flex gap-3 flex-wrap items-center justify-center">            <div
              className="bg-gradient-to-br from-green-50 to-teal-50
                            px-4 py-2 rounded-xl border border-green-200"
            >
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-green-600">
                {totalCount}
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={announcements.length === 0}
              className="px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500
                         text-white rounded-xl flex items-center gap-2
                         hover:from-red-600 hover:to-pink-600 shadow-lg
                         transition transform hover:scale-105
                         font-semibold disabled:opacity-50
                         disabled:cursor-not-allowed
                         disabled:hover:scale-100"
            >
              <FaFilePdf /> Export PDF
            </button>
            <button
              onClick={handlePrint}
              disabled={announcements.length === 0}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500
                         text-white rounded-xl flex items-center gap-2
                         hover:from-blue-600 hover:to-indigo-600 shadow-lg
                         transition transform hover:scale-105
                         font-semibold disabled:opacity-50
                         disabled:cursor-not-allowed
                         disabled:hover:scale-100"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500
                         hover:from-green-600 hover:to-teal-600 text-white
                         font-semibold rounded-xl shadow-lg flex items-center
                         gap-2 transition transform hover:scale-105"
            >
              <FaPlus /> Add Announcement
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">
              All Announcements
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "#",
                    "Title",
                    "Message",
                    "Recipients",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-bold
                                 text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                  <th
                    className="px-6 py-4 text-center text-xs font-bold
                               text-gray-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-gray-500"
                    >
                      <FaSpinner
                        className="animate-spin inline-block mr-2
                                     text-green-500 text-xl"
                      />
                      <span className="text-lg">
                        Loading announcements…
                      </span>
                    </td>
                  </tr>
                ) : announcements.length > 0 ? (
                  announcements.map((a, i) => (
                    <tr
                      key={a._id}
                      className="hover:bg-green-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {getRowNumber(i)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {a.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <p className="line-clamp-2">{a.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <RecipientBadge value={a.recipients} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>
                          {new Date(a.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(a)}
                            className="bg-blue-50 hover:bg-blue-100
                                       text-blue-600 p-2.5 rounded-lg
                                       transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => openDeleteModal(a._id)}
                            className="bg-red-50 hover:bg-red-100
                                       text-red-600 p-2.5 rounded-lg
                                       transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 bg-gray-100 rounded-full
                                        flex items-center justify-center"
                        >
                          <FaBullhorn className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          {search.trim()
                            ? "No announcements match your search"
                            : "No announcements yet"}
                        </p>
                        {search.trim() ? (
                          <button
                            onClick={() => setSearch("")}
                            className="text-green-500 hover:text-green-700
                                       text-sm font-medium underline"
                          >
                            Clear search
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenModal()}
                            className="text-green-500 hover:text-green-700
                                       text-sm font-medium underline"
                          >
                            Create your first announcement
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!loading && totalPages > 1 && (
            <div
              className="bg-gradient-to-r from-gray-50 to-gray-100
                            px-6 py-4 flex flex-col sm:flex-row
                            justify-between items-center border-t
                            border-gray-200 gap-3"
            >
              <span className="text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
                {totalCount > 0 && (
                  <span className="ml-1">
                    ({totalCount} total)
                  </span>
                )}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg
                             text-sm font-medium text-gray-700
                             hover:bg-white transition
                             disabled:opacity-40 disabled:cursor-not-allowed
                             flex items-center gap-1"
                >
                  <FaChevronLeft size={11} /> Prev
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3.5 py-2 border rounded-lg text-sm
                      font-medium transition ${
                        currentPage === page
                          ? "bg-green-500 text-white border-green-500 shadow-md"
                          : "border-gray-300 text-gray-700 hover:bg-white"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg
                             text-sm font-medium text-gray-700
                             hover:bg-white transition
                             disabled:opacity-40 disabled:cursor-not-allowed
                             flex items-center gap-1"
                >
                  Next <FaChevronRight size={11} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;