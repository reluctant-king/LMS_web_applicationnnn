import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaSearch,
  FaTrash,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 5;

  const getStudents = async (page = 1) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
        {
          params: { page, limit: itemsPerPage, search },
        }
      );

      setStudents(res.data.students || []);
      setCurrentPage(res.data.page || page);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalStudents || 0);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getStudents(1);
  }, [search]);

  const handleExportPDF = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
      { params: { page: 1, limit: 1000, search } }
    );

    const data = res.data.students || [];

    const doc = new jsPDF();
    doc.text("Student List", 14, 15);

    const rows = data.map((s) => [
      s.name || "-",
      s.email || "-",
      s.courseEnrolled || "-",
      s.batch?.batchName || "-",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Course", "Batch"]],
      body: rows,
      startY: 20,
    });

    doc.save("students.pdf");
  };

  const handlePrint = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
      { params: { page: 1, limit: 1000, search } }
    );

    const data = res.data.students || [];

    let table = `
      <table border="1" style="width:100%;border-collapse:collapse">
      <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Course</th>
        <th>Batch</th>
      </tr>
      </thead><tbody>
    `;

    data.forEach((s) => {
      table += `
        <tr>
          <td>${s.name || "-"}</td>
          <td>${s.email || "-"}</td>
          <td>${s.courseEnrolled || "-"}</td>
          <td>${s.batch?.batchName || "-"}</td>
        </tr>
      `;
    });

    table += "</tbody></table>";

    const win = window.open("", "", "width=900,height=700");
    win.document.write(`<h2>Students</h2>${table}`);
    win.document.close();
    win.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-3xl text-blue-600" />
          <h2 className="text-3xl font-bold">Student Management</h2>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center gap-4 flex-wrap">

          <div className="relative w-80">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded w-full"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Export PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Print
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1">
              <FaPlus /> Add Student
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Course", "Batch", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-sm font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-6 py-3">{s.name}</td>
                    <td className="px-6 py-3">{s.email}</td>
                    <td className="px-6 py-3">{s.courseEnrolled}</td>
                    <td className="px-6 py-3">{s.batch?.batchName}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <FaEdit className="cursor-pointer text-green-600" />
                      <FaTrash className="cursor-pointer text-red-600" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between p-4 border-t">
              <div>Page {currentPage} of {totalPages}</div>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => getStudents(currentPage - 1)}
                  className="px-3 py-1 border rounded"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => getStudents(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => getStudents(currentPage + 1)}
                  className="px-3 py-1 border rounded"
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

export default ViewStudents;
