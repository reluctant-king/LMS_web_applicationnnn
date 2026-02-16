import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaEye,
  FaTrashAlt,
  FaFilePdf,
  FaPrint,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AnswerDetails from "./AnswerDetails";

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
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
            Delete Submission
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this quiz submission?
            This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300
                         text-gray-700 rounded-xl font-semibold
                         hover:bg-gray-50 transition
                         disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r
                         from-red-500 to-pink-500
                         hover:from-red-600 hover:to-pink-600
                         text-white font-semibold rounded-xl
                         shadow-lg transition flex items-center
                         justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <FaTrashAlt /> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserSubmission = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [deleteClick, setDeleteClick] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAllQuizResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/get_all_user_quiz_answer`
      );
      setResults(res.data.submitQuizz || []);
    } catch (err) {
      console.error("Error fetching quiz results:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllQuizResults();
  }, []);

  const filteredResults = useMemo(() => {
    if (!search.trim()) return results;

    const query = search.toLowerCase().trim();
    return results.filter(
      (r) =>
        r.userName?.toLowerCase().includes(query) ||
        r.email?.toLowerCase().includes(query)
    );
  }, [results, search]);

  const totalItems = filteredResults.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(start, start + itemsPerPage);
  }, [filteredResults, currentPage, itemsPerPage]);

  const getRowNumber = (index) =>
    (currentPage - 1) * itemsPerPage + index + 1;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const safePercentage = (score, total) => {
    if (!total || total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (score, total) => {
    const pct = safePercentage(score, total);
    if (pct === 100) return "text-green-600";
    if (pct >= 70) return "text-blue-600";
    if (pct >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score, total) => {
    const pct = safePercentage(score, total);
    if (pct === 100)
      return "bg-green-100 text-green-700 border-green-200";
    if (pct >= 70)
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (pct >= 40)
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteClick(true);
  };

  const closeDeleteModal = () => {
    setDeleteClick(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/delete_user_quiz_answer/${deleteId}`
      );

      setResults((prev) => prev.filter((r) => r._id !== deleteId));
    } catch (err) {
      console.error("Error deleting submission:", err);
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("Quiz Results Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      14,
      30
    );
    doc.text(`Total Submissions: ${filteredResults.length}`, 14, 36);

    const tableData = filteredResults.map((r, i) => [
      i + 1,
      r.userName || "-",
      r.email || "-",
      `${r.score} / ${r.totalQuestions}`,
      `${safePercentage(r.score, r.totalQuestions)}%`,
      r.submittedAt
        ? new Date(r.submittedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-",
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["#", "Name", "Email", "Score", "%", "Date"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
      },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save("quiz-results.pdf");
  };

  const handlePrint = () => {
    const rows = filteredResults
      .map(
        (r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${r.userName || "-"}</td>
          <td>${r.email || "-"}</td>
          <td style="text-align:center;font-weight:bold;">
            ${r.score} / ${r.totalQuestions}
            (${safePercentage(r.score, r.totalQuestions)}%)
          </td>
          <td>${
            r.submittedAt
              ? new Date(r.submittedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"
          }</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Quiz Results</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 30px;
              color: #1f2937;
            }
            h2 {
              color: #2563eb;
              margin-bottom: 4px;
            }
            .subtitle {
              color: #6b7280;
              font-size: 13px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background: #2563eb;
              color: white;
              padding: 12px 16px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td {
              padding: 10px 16px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }
            tr:nth-child(even) { background: #f9fafb; }
            tr:hover { background: #eff6ff; }
            @media print {
              body { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <h2>Quiz Results Report</h2>
          <p class="subtitle">
            Total: ${filteredResults.length} submissions •
            Printed: ${new Date().toLocaleString()}
          </p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {showModal && selectedResult && (
        <AnswerDetails
          getScoreColor={getScoreColor}
          setShowModal={setShowModal}
          selectedResult={selectedResult}
        />
      )}

      <DeleteModal
        isOpen={deleteClick}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaClipboardList className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Quiz Results
            </h2>
            <p className="text-gray-600">
              View all submitted quiz attempts
            </p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6
                        flex flex-col md:flex-row gap-4
                        justify-between items-center"
        >
          <div className="relative w-full md:w-96">
            <FaSearch
              className="absolute left-4 top-1/2
                           -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              placeholder="Search by name or email..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300
                         rounded-xl focus:outline-none focus:ring-2
                         focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="bg-gradient-to-br from-blue-50 to-indigo-50
                            px-4 py-2 rounded-xl border border-blue-200"
            >
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalItems}
              </p>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={filteredResults.length === 0}
              className="px-5 py-3 bg-gradient-to-r from-red-500
                         to-pink-500 hover:from-red-600 hover:to-pink-600
                         text-white font-semibold rounded-xl shadow-lg
                         transition transform hover:scale-105
                         flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100"
            >
              <FaFilePdf /> Export PDF
            </button>

            <button
              onClick={handlePrint}
              disabled={filteredResults.length === 0}
              className="px-5 py-3 bg-gradient-to-r from-green-500
                         to-emerald-500 hover:from-green-600
                         hover:to-emerald-600 text-white font-semibold
                         rounded-xl shadow-lg transition transform
                         hover:scale-105 flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        <div
          id="quiz-table-section"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">
              All Quiz Submissions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {["No", "User Name", "Email", "Score", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-bold
                                   text-gray-700 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                  <th
                    className="px-6 py-4 text-center text-xs font-bold
                               text-gray-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      <FaSpinner
                        className="animate-spin inline-block mr-2
                                     text-blue-500 text-xl"
                      />
                      <span className="text-lg">
                        Loading quiz results…
                      </span>
                    </td>
                  </tr>
                ) : paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 bg-gray-100 rounded-full
                                        flex items-center justify-center"
                        >
                          <FaClipboardList
                            className="text-gray-400 text-2xl"
                          />
                        </div>
                        <p className="text-gray-500 font-medium">
                          {search.trim()
                            ? "No results match your search"
                            : "No quiz results found"}
                        </p>
                        {search.trim() && (
                          <button
                            onClick={() => setSearch("")}
                            className="text-blue-500 hover:text-blue-700
                                       text-sm font-medium underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((result, i) => (
                    <tr
                      key={result._id || i}
                      className="hover:bg-gradient-to-r hover:from-blue-50
                                 hover:to-indigo-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {getRowNumber(i)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {result.userName}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {result.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-3 py-1 text-sm
                                        font-bold rounded-full border
                                        ${getScoreBadgeColor(
                                          result.score,
                                          result.totalQuestions
                                        )}`}
                          >
                            {result.score} / {result.totalQuestions}
                          </span>
                          <span
                            className={`text-xs font-semibold
                              ${getScoreColor(
                                result.score,
                                result.totalQuestions
                              )}`}
                          >
                            (
                            {safePercentage(
                              result.score,
                              result.totalQuestions
                            )}
                            %)
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {new Date(
                            result.submittedAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(
                            result.submittedAt
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(result)}
                            className="inline-flex items-center gap-1.5
                                       px-3 py-2 bg-blue-50 hover:bg-blue-100
                                       text-blue-600 rounded-lg transition
                                       font-medium text-sm"
                            title="View Details"
                          >
                            <FaEye /> View
                          </button>

                          <button
                            onClick={() => openDeleteModal(result._id)}
                            className="inline-flex items-center gap-1.5
                                       px-3 py-2 bg-red-50 hover:bg-red-100
                                       text-red-600 rounded-lg transition
                                       font-medium text-sm"
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && totalPages > 1 && (
            <div
              className="bg-gradient-to-r from-gray-50 to-gray-100
                            px-6 py-4 flex flex-col sm:flex-row
                            items-center justify-between border-t
                            border-gray-200 gap-3"
            >
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>
                –
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{totalItems}</span>{" "}
                submissions
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="px-3 py-2 border border-gray-300
                             rounded-lg text-sm font-medium
                             text-gray-700 hover:bg-white transition
                             disabled:opacity-40
                             disabled:cursor-not-allowed
                             flex items-center gap-1"
                >
                  <FaChevronLeft size={11} /> Prev
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3.5 py-2 border rounded-lg text-sm
                      font-medium transition
                      ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "border-gray-300 text-gray-700 hover:bg-white"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className="px-3 py-2 border border-gray-300
                             rounded-lg text-sm font-medium
                             text-gray-700 hover:bg-white transition
                             disabled:opacity-40
                             disabled:cursor-not-allowed
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

export default UserSubmission;