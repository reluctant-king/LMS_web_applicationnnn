import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch, FaBook, FaPlus } from "react-icons/fa";
import Delete from "../TableActions/Delete";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PaginationButton from "../PaginationButton/PaginationButton";
import Edit from "../TableActions/Edit";

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteClick, setDeleteClick] = useState(false);
  const [id, setId] = useState("");
  const deleteCont = "Are you sure you want to delete this course?";
  const [loading, setLoading] = useState(false)
  let [currentPage, setCurrentPage] = useState(1)
  let [itemPerPage, setitemPerPage] = useState(6)
  const [showEditPopop, setShowEditPopup] = useState(false)
  let indexOfLastProduct = currentPage * itemPerPage
  let indexOfFirstnumber = indexOfLastProduct - itemPerPage
  const coursesFields = [

    { label: "Course Title", name: "title", type: "text", placeholder: "Enter course title" },
    { label: "Description", name: "description", type: "textarea", placeholder: "Describe your course" },
    { label: "Category", name: "category", type: "select", options: [], placeholder: "Select category" },
    { label: "Tags", name: "tags", type: "text", placeholder: "Enter tags separated by commas" },
    { label: "Duration", name: "duration", type: "text", placeholder: "e.g., 8 weeks" },
    { label: "Course Image", name: "image", type: "file" },


    { label: "Free Course", name: "isFree", type: "checkbox" },
    { label: "Price", name: "price", type: "number", placeholder: "Enter price" },
    { label: "Discount (%)", name: "discount", type: "number", placeholder: "Enter discount percentage" },
    { label: "Monthly Payment Option", name: "hasMonthlyPayment", type: "checkbox" },
    { label: "Monthly Amount", name: "monthlyAmount", type: "number", placeholder: "Enter monthly amount" },


    { label: "Instructor Name", name: "instrectorName", type: "select", options: [], placeholder: "Select instructor" },
    { label: "Instructor Bio", name: "instrectorBio", type: "textarea", placeholder: "Enter instructor bio" },


    {
      label: "Course Modules", name: "modules", type: "array", subfields: [
        { label: "Module Title", name: "title", type: "text", placeholder: "Module title" }
      ]
    }
  ];

  const courseUpdateInput = {
    title: "",
    description: "",
    price: "",
    isFree: false,
    duration: "",
    category: "",
    tags: "",
    image: null,
    instructor: "",
    instructorName: "",
    instructorBio: "",
    hasMonthlyPayment: false,
    monthlyAmount: "",
  }



  const getCourses = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses?title=${search}&category=${search}`, {
        withCredentials: true
      });
      console.log(res)
      setCourses(res.data.courses);



    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    getCourses();
  }, [search]);

  let showPoroduct = courses.slice(indexOfFirstnumber, indexOfLastProduct)

  const handleDelete = (courseId) => {
    setDeleteClick(true);
    setId(courseId);
  };

  const onTimeDelete = () => {
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };


  const handleExportPDF = async () => {
    const allCourses = await getAllCourses();
    if (!allCourses.length) return alert("No courses to export");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Course List", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumn = ["Course", "Price", "Duration", "Level", "Instructor", "Category"];
    const tableRows = allCourses.map((course) => [
      course.title || "-",
      course.price ? `₹ ${course.price}` : "-",
      course.duration || "-",
      course.level || "-",
      course.instructor?.name || course.instructor || "-",
      course.category?.name || course.category || "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Courses_List.pdf");
  };

  // Print all courses
  const handlePrint = async () => {
    const allCourses = await getAllCourses();
    if (!allCourses.length) return alert("No courses to print");

    let printTable = `
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Course</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Level</th>
            <th>Instructor</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
    `;

    allCourses.forEach((course) => {
      printTable += `
        <tr>
          <td>${course.title || "-"}</td>
          <td>${course.price ? `₹ ${course.price}` : "-"}</td>
          <td>${course.duration || "-"}</td>
          <td>${course.level || "-"}</td>
          <td>${course.instructor?.name || course.instructor || "-"}</td>
          <td>${course.category?.name || course.category || "-"}</td>
        </tr>
      `;
    });

    printTable += `</tbody></table>`;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Course List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Course List</h2>
          ${printTable}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEdit = (id) => {
    setId(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {deleteClick && (
        <Delete
          setDeleteClick={setDeleteClick}
          deleteCont={deleteCont}
          id={id}
          api_end_point={`${import.meta.env.VITE_API_URL}/api/v1/get_course`}
          onTimeDelete={onTimeDelete}
        />
      )}
      {showEditPopop && <Edit
        field={coursesFields}
        updateInput={courseUpdateInput}
        setShowEditPopup={setShowEditPopup}
        id={id}
      />}
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaBook className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Course Management</h2>
            <p className="text-gray-600">Manage all courses and content</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search by title..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-blue-600 text-center p-2">0</p>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 w-44"
            >
              Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 w-44"
            >
              Print
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 w-44"
            >
              <FaPlus /> Add Course
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Courses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showPoroduct && showPoroduct.length > 0 ? (
                  showPoroduct.map((e, i) => (
                    <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {e.title?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{e.title}</p>
                            <p className="text-xs text-gray-500 mt-1" title={e.description}>
                              {truncateText(e.description, 60)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">₹ {e.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{e.duration}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.instructorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full border border-blue-200">{e.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition group"
                            onClick={() => {
                              setShowEditPopup(true);
                              handleEdit(e._id)
                            }}
                          >
                            <FaEdit className="group-hover:scale-110 transition" />
                          </button>
                          <button className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition group" onClick={() => handleDelete(e._id)}>
                            <FaTrash className="group-hover:scale-110 transition" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaBook className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No courses found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


        </div>
        <PaginationButton items={courses} itemPerPage={itemPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>
    </div>
  );
};

export default ViewCourses;
