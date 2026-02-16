import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrashAlt,
  FaSearch,
  FaFilePdf,
  FaPrint,
  FaUsers,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Delete from "../TableActions/Delete";
import Edit from "../TableActions/Edit";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [deleteClick, setDeleteClick] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const deleteCont = "Are you sure you want to delete this student?";

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

  // Fetch students (paginated + search)
const getStudents = async (page = 1) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
      {
        params: { page, limit: itemsPerPage, search },
      }
    );

    // Backend currently returns: { success, students }
    const rawList = res.data.data || res.data.students || [];

    // Detect if backend already does pagination (future-proof)
    const hasServerPagination =
      res.data.page !== undefined ||
      res.data.totalPages !== undefined ||
      res.data.totalItems !== undefined;

    if (hasServerPagination) {
      // ✅ Use server pagination if it exists
      const list = rawList;

      const totalItems =
        typeof res.data.totalItems === "number"
          ? res.data.totalItems
          : list.length;

      const totalPages =
        typeof res.data.totalPages === "number"
          ? res.data.totalPages
          : Math.max(1, Math.ceil(totalItems / itemsPerPage));

      setStudents(list);
      setCurrentPage(res.data.page || page);
      setTotalItems(totalItems);
      setTotalPages(totalPages);
    } else {
      // ✅ Fallback: client-side search + pagination on full list

      // 1) Filter by search
      const searchLower = search.toLowerCase();
      const filtered = searchLower
        ? rawList.filter((s) => {
            const combined = `${s.name || ""} ${s.email || ""} ${
              s.courseEnrolled || ""
            }`.toLowerCase();
            return combined.includes(searchLower);
          })
        : rawList;

      // 2) Compute totals
      const totalItems = filtered.length;
      const totalPages = Math.max(
        1,
        Math.ceil(totalItems / itemsPerPage)
      );

      // 3) Slice for current page
      const startIndex = (page - 1) * itemsPerPage;
      const paginated = filtered.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      // 4) Set state
      setStudents(paginated);
      setCurrentPage(page);
      setTotalItems(totalItems);
      setTotalPages(totalPages);
    }
  } catch (err) {
    console.error("Error fetching students:", err);
  } finally {
    setLoading(false);
  }
};

  // Fetch whenever search changes
  useEffect(() => {
    setCurrentPage(1);
    getStudents(1);
  }, [search]);

  const handleEdit = (id) => {
    setEditId(id);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteClick(true);
  };

  const onTimeDelete = () => {
    setStudents((prev) => prev.filter((s) => s._id !== deleteId));
  };

  // For Export / Print we fetch a large list
  const getAllStudentsForExport = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/view_students`,
        {
          params: { page: 1, limit: 1000, search },
        }
      );
      return res.data.data || res.data.students || [];
    } catch (err) {
      console.error("Error fetching all students:", err);
      return [];
    }
  };

  const handleExportPDF = async () => {
    const allStudents = await getAllStudentsForExport();
    if (!allStudents.length) return alert("No students to export");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student List", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumn = ["Name", "Email", "Phone", "Course", "Batch"];
    const tableRows = allStudents.map((student) => [
      student.name || "-",
      student.email || "-",
      student.phone || "-",
      student.courseEnrolled || "-",
      student.batch?.batchName || "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Student_List.pdf");
  };

  const handlePrint = async () => {
    const allStudents = await getAllStudentsForExport();
    if (!allStudents.length) return alert("No students to print");

    let printTable = `
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Batch</th>
          </tr>
        </thead>
        <tbody>
    `;

    allStudents.forEach((student, index) => {
      printTable += `
        <tr>
          <td>${index + 1}</td>
          <td>${student.name || "-"}</td>
          <td>${student.email || "-"}</td>
          <td>${student.phone || "-"}</td>
          <td>${student.courseEnrolled || "-"}</td>
          <td>${student.batch?.batchName || "-"}</td>
        </tr>
      `;
    });

    printTable += `</tbody></table>`;

    const printWindow = window.open("", "", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Student List</h2>
          ${printTable}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {deleteClick && (
        <Delete
          setDeleteClick={setDeleteClick}
          deleteCont={deleteCont}
          id={deleteId}
          api_end_point={`${import.meta.env.VITE_API_URL}/api/v1/get_student`} // adjust if your delete route differs
          onTimeDelete={onTimeDelete}
        />
      )}

      {showEditPopup && (
        <Edit
          field={studentFields}
          setShowEditPopup={setShowEditPopup}
          updateInput={studentUpdateInput}
          id={editId}
        />
      )}

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Student Management
            </h2>
            <p className="text-gray-600">Manage and monitor all students</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            </div>

            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaFilePdf /> Export PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>

            <button
              type="button"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaPlus /> Add Students
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div
          id="student-table-section"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Students</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-600"
                    >
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr
                      key={student._id || index}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">
                        {student.courseEnrolled || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {student.batch?.batchName || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleDeleteClick(student._id || student.id)
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                          >
                            <FaTrashAlt />
                          </button>
                          <button
                            onClick={() =>
                              handleEdit(student._id || student.id)
                            }
                            className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => getStudents(currentPage - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => getStudents(i + 1)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border-gray-300 text-gray-700"
                      } hover:bg-white transition`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => getStudents(currentPage + 1)}
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
    </div>
  );
};

export default ViewStudents;