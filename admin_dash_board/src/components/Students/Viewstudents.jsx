import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaTrashAlt,
  FaSearch,
  FaFilePdf,
  FaPrint,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Edit from "../TableActions/Edit";

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
            Delete Student
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this student?
            This action cannot be undone.
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

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [deleteClick, setDeleteClick] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const studentFields = [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Full Name",
      required: true,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Email",
      required: true,
    },
    {
      label: "Phone",
      name: "phone",
      type: "text",
      placeholder: "Phone",
    },
    {
      label: "Age",
      name: "age",
      type: "number",
      placeholder: "Age",
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: ["Male", "Female", "Other"],
      placeholder: "Select Gender",
    },
    {
      label: "Profile Image",
      name: "profileImage",
      type: "file",
    },
    {
      label: "Course Enrolled",
      name: "courseEnrolled",
      type: "text",
      placeholder: "Course Enrolled",
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
      placeholder: "Address",
      rows: 3,
    },
  ];

  const studentUpdateInput = {
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    profileImage: null,
    address: "",
    batch: "",
  };

  const getStudents = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
          {
            params: {
              page,
              limit: itemsPerPage,
              search: search.trim() || undefined,
            },
          }
        );

        const data = res.data;
        setStudents(data.students || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(
          data.totalStudents ?? data.total ?? 0
        );
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    },
    [search, itemsPerPage]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      getStudents(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    getStudents(1);
  }, []);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    getStudents(page);
  };

  const getRowNumber = (index) =>
    (currentPage - 1) * itemsPerPage + index + 1;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleEdit = (studentId) => {
    setEditId(studentId);
    setShowEditPopup(true);
  };

  const handleEditSuccess = () => {
    setShowEditPopup(false);
    setEditId("");
    getStudents(currentPage);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteClick(true);
  };

  const closeDeleteModal = useCallback(() => {
    setDeleteClick(false);
    setDeleteId(null);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/delete_student/${deleteId}`
      );

      const remaining = students.length - 1;
      const targetPage =
        remaining === 0 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      setCurrentPage(targetPage);
      await getStudents(targetPage);
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  const handleExportPDF = async () => {
    if (students.length === 0) return;

    let allStudents = students;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
        {
          params: {
            page: 1,
            limit: 9999,
            search: search.trim() || undefined,
          },
        }
      );
      allStudents = res.data.students || students;
    } catch {
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("Student Report", 14, 22);

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
    doc.text(`Total Students: ${allStudents.length}`, 14, 36);

    const tableData = allStudents.map((s, i) => [
      i + 1,
      s.name || "-",
      s.email || "-",
      s.courseEnrolled || "-",
      s.batch?.batchName || "-",
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["#", "Name", "Email", "Course", "Batch"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
      },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save("students-report.pdf");
  };

  const handlePrint = () => {
    if (students.length === 0) return;

    const rows = students
      .map(
        (s, i) => `
        <tr>
          <td>${getRowNumber(i)}</td>
          <td>${s.name || "-"}</td>
          <td>${s.email || "-"}</td>
          <td>${s.courseEnrolled || "-"}</td>
          <td>${s.batch?.batchName || "-"}</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Students List</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 30px;
              color: #1f2937;
            }
            h2 { color: #2563eb; margin-bottom: 4px; }
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
              background: #2563eb;
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
          <h2>Student List</h2>
          <p class="meta">
            Printed: ${new Date().toLocaleString()}
          </p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Batch</th>
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
      {showEditPopup && (
        <Edit
          field={studentFields}
          setShowEditPopup={setShowEditPopup}
          updateInput={studentUpdateInput}
          id={editId}
          onSuccess={handleEditSuccess}
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
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Student Management
            </h2>
            <p className="text-gray-600">
              Manage and monitor all students
            </p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6
                        flex flex-col md:flex-row gap-4
                        items-center justify-between"
        >
          <div className="relative w-full md:w-96">
            <FaSearch
              className="absolute left-4 top-1/2
                           -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300
                         rounded-xl focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:border-transparent
                         transition"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="bg-gradient-to-br from-blue-50 to-indigo-50
                            px-4 py-2 rounded-xl border border-blue-200"
            >
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalItems}
              </p>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={students.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500
                         hover:from-red-600 hover:to-pink-600 text-white
                         font-semibold rounded-xl shadow-lg transition
                         transform hover:scale-105 flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100"
            >
              <FaFilePdf /> Export PDF
            </button>

            <button
              onClick={handlePrint}
              disabled={students.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-green-500
                         to-emerald-500 hover:from-green-600
                         hover:to-emerald-600 text-white font-semibold
                         rounded-xl shadow-lg transition transform
                         hover:scale-105 flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100"
            >
              <FaPrint /> Print
            </button>

            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600
                         to-indigo-600 hover:from-blue-700
                         hover:to-indigo-700 text-white font-semibold
                         rounded-xl shadow-lg transition transform
                         hover:scale-105 flex items-center gap-2"
            >
              <FaPlus /> Add Students
            </button>
          </div>
        </div>

        <div
          id="student-table-section"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">
              All Students
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Name", "Email", "Course", "Batch"].map(
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
                        Loading students…
                      </span>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 bg-gray-100 rounded-full
                                        flex items-center justify-center"
                        >
                          <FaUsers className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          {search.trim()
                            ? "No students match your search"
                            : "No students found"}
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
                  students.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {getRowNumber(index)}
                      </td>
                      <td className="px-6 py-4">
                        {student.name}
                      </td>
                      <td className="px-6 py-4">
                        {student.email}
                      </td>
                      <td className="px-6 py-4">
                        {student.courseEnrolled || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {student.batch?.batchName || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(student._id)}
                            className="bg-green-50 hover:bg-green-100
                                       text-green-600 p-2 rounded-lg
                                       transition inline-flex items-center"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal(student._id)
                            }
                            className="bg-red-50 hover:bg-red-100
                                       text-red-600 p-2 rounded-lg
                                       transition inline-flex items-center"
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
                  {Math.min(
                    currentPage * itemsPerPage,
                    totalItems
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{totalItems}</span>{" "}
                students
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
                      font-medium transition ${
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

export default ViewStudents;