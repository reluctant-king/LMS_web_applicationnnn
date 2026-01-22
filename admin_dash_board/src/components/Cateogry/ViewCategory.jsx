import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaEdit, FaTrash, FaSearch, FaLayerGroup, FaPlus, FaFilePdf, FaPrint } from 'react-icons/fa';
import Delete from '../TableActions/Delete';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import PaginationButton from '../PaginationButton/PaginationButton';
import Edit from '../TableActions/Edit';

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteClick, setDeleteClick] = useState(false);
  const deleteCont = "Are you sure that you delete category";
  const [showEditPopop, setShowEditPopup] = useState(false)
  let [currentPage, setCurrentPage] = useState(1)
  let [itemPerPage, setitemPerPage] = useState(6)
  let indexOfLastProduct = currentPage * itemPerPage
  let indexOfFirstnumber = indexOfLastProduct - itemPerPage

  const categoryFields = [
    { label: "Category Title", name: "title", type: "text", placeholder: "Category Title", required: true },
    { label: "Category Description", name: "desc", type: "textarea", placeholder: "Category Description", rows: 4 },
    { label: "Category Image", name: "image", type: "file", accept: "image/*" },
  ]
  const getCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_All_categories`);
      setCategories(res.data.allCoursecategory || []);

    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    getCategories()
  }, [search]);

  let categoriess = categories.slice(indexOfFirstnumber, indexOfLastProduct)


  const handleDelete = () => setDeleteClick(true);
  const clearFilters = () => setSearch("");

  // Export PDF
  const handleExportPDF = async () => {
    const allCategories = await getAllCategories();
    if (!allCategories.length) return alert("No categories to export");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Course Categories", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumn = ["#", "Category", "Description"];
    const tableRows = allCategories.map((cat, index) => [
      index + 1,
      cat.title,
      cat.description
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Course_Categories.pdf");
  };

 
  const handlePrint = async () => {
    const allCategories = await getAllCategories();
    if (!allCategories.length) return alert("No categories to print");

    let printTable = `
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Description</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
    `;

    allCategories.forEach((cat, index) => {
      printTable += `
        <tr>
          <td>${index + 1}</td>
          <td>${cat.title}</td>
          <td>${cat.description}</td>
          <td><img src="${cat.image && cat.image.length > 0 ? cat.image[0] : 'https://via.placeholder.com/80'}" width="80" height="60" /></td>
        </tr>
      `;
    });

    printTable += `</tbody></table>`;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Course Categories</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            img { border-radius: 8px; }
          </style>
        </head>
        <body>
          <h2>Course Categories</h2>
          ${printTable}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {deleteClick && <Delete setDeleteClick={setDeleteClick} deleteCont={deleteCont} />}
      {showEditPopop && <Edit field={categoryFields} setShowEditPopup={setShowEditPopup} />}
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaLayerGroup className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Category Management</h2>
            <p className="text-gray-600">Manage and organize all course categories</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search categories..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={clearFilters} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">Clear Filters</button>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
            </div>

            <button onClick={handleExportPDF} className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl flex items-center gap-2">
              <FaFilePdf /> Export PDF
            </button>

            <button onClick={handlePrint} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2">
              <FaPrint /> Print
            </button>
            <Link to="/add_course_cateogry">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2">
                <FaPlus /> Add Category
              </button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div id="category-table-section" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Course Categories</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {categoriess.length > 0 ? (
                  categoriess.map((e, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-all">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <FaLayerGroup className="text-white text-sm" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">{e.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md line-clamp-2">{e.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={e.image && e.image.length > 0 ? e.image[0] : 'https://via.placeholder.com/80'}
                          alt={e.title}
                          className="w-30 h-20 rounded-xl object-cover border-2 border-blue-200 shadow-md transition-transform group-hover:scale-105"
                          onError={(event) => { event.target.src = 'https://via.placeholder.com/80'; }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                        <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition transform hover:scale-105" onClick={() => setShowEditPopup(true)}><FaEdit /></button>
                        <button onClick={handleDelete} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition transform hover:scale-105"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


        </div>
        <PaginationButton items={categories} itemPerPage={itemPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />

      </div>
    </div>
  );
};

export default ViewCategory;
