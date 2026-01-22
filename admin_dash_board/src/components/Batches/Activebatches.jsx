import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaChalkboardTeacher,
  FaPlus,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ActiveBatches = () => {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  // Fetch paginated batches for table
  const getBatches = async (page = 1) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/view_all_batches`,
        {
          params: { batchName: search, page, limit: itemsPerPage },
        }
      );
      setBatches(res.data.data || []);
      setCurrentPage(res.data.page || page);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // Fetch all batches for PDF/Print
  const getAllBatches = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/view_all_batches`,
        {
          params: { batchName: search, page: 1, limit: 1000 }, // fetch all
        }
      );
      return res.data.data || [];
    } catch (error) {
      console.error("Error fetching all batches:", error);
      return [];
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getBatches(1);
  }, [search]);

  // Export PDF
  const handleExportPDF = async () => {
    const allBatches = await getAllBatches();
    if (!allBatches.length) {
      alert("No batches to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Batches List", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumn = [
      "#",
      "Batch Name",
      "Code",
      "Course",
      "Instructor",
      "Mode",
      "Seats",
      "Status",
      "Dates",
    ];

    const tableRows = allBatches.map((b, index) => [
      index + 1,
      b.batchName,
      b.batchCode,
      b.course?.title || "-",
      b.instructor?.name || "-",
      b.mode,
      b.maxSeats,
      b.status,
      `${new Date(b.startDate).toLocaleDateString()} - ${new Date(
        b.endDate
      ).toLocaleDateString()}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Batches_List.pdf");
  };

  // Print
  const handlePrint = async () => {
    const allBatches = await getAllBatches();
    if (!allBatches.length) {
      alert("No batches to print");
      return;
    }

    let printTable = `
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>#</th>
            <th>Batch Name</th>
            <th>Code</th>
            <th>Course</th>
            <th>Instructor</th>
            <th>Mode</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Dates</th>
          </tr>
        </thead>
        <tbody>
    `;

    allBatches.forEach((b, index) => {
      printTable += `
        <tr>
          <td>${index + 1}</td>
          <td>${b.batchName}</td>
          <td>${b.batchCode}</td>
          <td>${b.course?.title || "-"}</td>
          <td>${b.instructor?.name || "-"}</td>
          <td>${b.mode}</td>
          <td>${b.maxSeats}</td>
          <td>${b.status}</td>
          <td>${new Date(b.startDate).toLocaleDateString()} - ${new Date(
        b.endDate
      ).toLocaleDateString()}</td>
        </tr>
      `;
    });

    printTable += `</tbody></table>`;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Batches List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Batches List</h2>
          ${printTable}
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
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaChalkboardTeacher className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Batch Management</h2>
            <p className="text-gray-600">Manage and monitor all batches</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search by batch name..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl flex items-center gap-2"
            >
              <FaFilePdf /> Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center gap-2">
              <FaPlus /> Add Batch
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Batches</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Batch Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Instructor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Mode</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Seats</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.length > 0 ? (
                  batches.map((batch, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">{batch.batchName}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.batchCode}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.course?.title || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.instructor?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.mode}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.maxSeats}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.status}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-600">{batch.description?.slice(0, 40)}...</td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"><FaEdit /></button>
                        <button className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500">No batches found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200 mt-2">
              <p className="text-sm text-gray-600">Showing page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => getBatches(currentPage - 1)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-white"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => getBatches(i + 1)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${currentPage === i + 1 ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"} hover:bg-white`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => getBatches(currentPage + 1)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-white"
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

export default ActiveBatches;
