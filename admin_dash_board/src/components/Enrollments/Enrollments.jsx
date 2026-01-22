import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilePdf, FaPrint } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// const API_BASE = "https://lms-web-application-backend-e6yj.onrender.com/api/v1";

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch payment details and map to enrollment structure
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_payment_details`);
      const data = res.data?.paymentDetails || [];

      console.log("Raw API Response:", data); // Debug log

      // Map payments to enrollment structure (flattened for table display)
      const mappedEnrollments = data.map((item) => ({
        enrollmentId: item._id || item.id || "N/A",
        courseTitle: item.courseName || item.course_name || item.courseTitle || "N/A",
        studentId: item.studentId || item.student_id || item.userId || "N/A",
        studentName: item.studentName || item.student_name || item.userName || item.name || "N/A",
        email: item.userEmail || item.email || item.student_email || "N/A",
        date: item.date || item.created_at || item.enrollment_date || new Date().toISOString(),
        status: item.status || "Active",
        amount: item.amount || item.price || 0,
      }));

      console.log("Mapped Enrollments:", mappedEnrollments); // Debug log
      setEnrollments(mappedEnrollments);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Filtered enrollments based on search
  const filteredEnrollments = enrollments.filter((e) => {
    const name = e.studentName?.toLowerCase() || "";
    const email = e.email?.toLowerCase() || "";
    const course = e.courseTitle?.toLowerCase() || "";
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query) || course.includes(query);
  });

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const currentRecords = filteredEnrollments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Export PDF
  const handleExportPDF = () => {
    if (!filteredEnrollments.length) return alert("No enrollments to export");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Enrollments List", 14, 15);
    doc.setFontSize(11);

    const tableColumns = ["Sl No.", "Course", "Student/User", "Email", "Enrollment ID", "Date", "Status"];
    const tableRows = filteredEnrollments.map((e, i) => [
      i + 1,
      e.courseTitle || "N/A",
      e.studentName || "N/A",
      e.email || "N/A",
      e.enrollmentId || "N/A",
      e.date ? new Date(e.date).toLocaleDateString() : "N/A",
      e.status || "Active",
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
      theme: "grid",
    });

    doc.save("Enrollments_List.pdf");
  };

  // Print table
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    const tableRows = filteredEnrollments
      .map(
        (e, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${e.courseTitle || "N/A"}</td>
          <td>${e.studentName || "N/A"}</td>
          <td>${e.email || "N/A"}</td>
          <td>${e.enrollmentId || "N/A"}</td>
          <td>${e.date ? new Date(e.date).toLocaleDateString() : "N/A"}</td>
          <td>${e.status || "Active"}</td>
        </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Enrollments List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            tbody tr:hover { background-color: #f0fdf4; }
          </style>
        </head>
        <body>
          <h2>Enrollments List</h2>
          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Course</th>
                <th>Student/User</th>
                <th>Email</th>
                <th>Enrollment ID</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl">
            <FaPlus className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Enrollments Management</h2>
            <p className="text-gray-600">Manage and monitor all course enrollments</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search by student, email, or course..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleExportPDF} className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl flex items-center gap-2 hover:from-red-600 hover:to-pink-600 transition shadow-lg">
              <FaFilePdf /> Export PDF
            </button>
            <button onClick={handlePrint} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center gap-2 hover:from-blue-600 hover:to-indigo-600 transition shadow-lg">
              <FaPrint /> Print
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 transition">
              <FaPlus /> Add Enrollment
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Enrollments</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sl No.</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student/User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Enrollment ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                        <span>Loading enrollments...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentRecords.length ? (
                  currentRecords.map((enrollment, i) => (
                    <tr key={enrollment.enrollmentId} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enrollment.courseTitle || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.studentName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enrollment.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {enrollment.enrollmentId ? enrollment.enrollmentId.slice(0, 12) + "..." : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enrollment.date ? new Date(enrollment.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          enrollment.status?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}>
                          {enrollment.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <FaEdit />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <FaSearch className="text-4xl text-gray-300" />
                        <span>No enrollments found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({filteredEnrollments.length} total enrollments)
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  disabled={currentPage === 1}
                  onClick={goPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
                        : "border border-gray-300 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={goNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentsPage;