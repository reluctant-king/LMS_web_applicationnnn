import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaSearch, FaFilePdf, FaPrint, FaUsers, FaPlus, FaEdit } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Edit from "../TableActions/Edit";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("")
  const [showEditPopop, setShowEditPopup] = useState(false)
  const [deleteClick, setDeleteClick] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const deleteCont = "Are you sure you want to delete this student?";
  const studentFields = [
    { label: "Name", name: "name", type: "text", placeholder: "Full Name", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "Email", required: true },
    { label: "Phone", name: "phone", type: "text", placeholder: "Phone" },
    { label: "Age", name: "age", type: "number", placeholder: "Age" },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"], placeholder: "Select Gender" },
    { label: "Profile Image", name: "profileImage", type: "file" },
    { label: "Course Enrolled", name: "courseEnrolled", type: "text", placeholder: "Course Enrolled" },
    { label: "Address", name: "address", type: "textarea", placeholder: "Address", rows: 3 },

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
  }

  const getStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_students`);
      setStudents(res.data.students || []);
      console.log(res)

    } catch (err) {
      console.error("Error fetching students:", err);

    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    getStudents(1);
  }, [search]);


  const handleEdit = (id) => {
    setId(id)
    console.log(id)
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {showEditPopop && <Edit
        field={studentFields}
        setShowEditPopup={setShowEditPopup}
        updateInput={studentUpdateInput}
        id={id}
      />}
      <div className="w-full max-w-7xl mx-auto">

        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Student Management</h2>
            <p className="text-gray-600">Manage and monitor all students</p>
          </div>
        </div>


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
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>

            <button

              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaFilePdf /> Export PDF
            </button>

            <button

              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2">
              <FaPlus /> Add Students
            </button>
          </div>
        </div>


        <div id="student-table-section" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Students</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-600">Loading students...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No students found</td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student._id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">{student.courseEnrolled}</td>
                      <td className="px-6 py-4">{student.batch?.batchName || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => { setDeleteId(student._id); setDeleteClick(true); }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                        >
                          <FaTrashAlt />
                        </button>

                        <button
                          onClick={() => {
                            setShowEditPopup(true);
                            handleEdit(student._id);
                          }}
                          className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ViewStudents;
