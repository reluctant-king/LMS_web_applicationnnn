import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FaTimes, FaUpload, FaCalendarAlt, FaClock, FaBook, FaUsers, FaStar, FaCheckCircle } from 'react-icons/fa';
import Swal from "sweetalert2";
import { AllCourseDetail } from '../AllCourseContext/Context';

const UploadAssignment = ({ setClickCreateAssignment, clickCreateAssignMent, course, students }) => {
    console.log(students)
    console.log(course)
    
    const { user } = useContext(AllCourseDetail);

    const [assignmentMode, setAssignmentMode] = useState('all');
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);

    const [inputs, setInputs] = useState({
        course: "",
        title: '',
        description: '',
        dueDate: '',
        totalMarks: '',
        file: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            setInputs((prev) => ({
                ...prev, [name]: files[0]
            }));
        } else {
            setInputs((prev) => ({
                ...prev, [name]: value
            }));
        }
    };

    const getAllPayment = async () => {
        try {
            setLoading(true)
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_payment_details`)
            console.log(res)
            setPayments(res.data.paymentDetails)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllPayment()
    }, [])

    const handleStudentSelection = (sid) => {
        setSelectedStudents((pre) => {
            if (pre.includes(sid)) {
                return pre.filter((id) => id !== sid)
            } else {
                return [...pre, sid]
            }
        })
    }

    const handleSelectAll = () => {
        if (selectedStudents.length === enrolledStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(enrolledStudents.map((s) => s.studentId))
        }
    }

    console.log(selectedStudents)

    useEffect(() => {
        let takeCourse
        if (inputs.course && payments?.length && students?.length) {
            takeCourse = typeof inputs.course === "string"
                ? JSON.parse(inputs.course)
                : inputs.course;
            let coursePurchassedUsers = payments?.filter((p) => p.courseId?.toString() === takeCourse.id?.toString())
            console.log(coursePurchassedUsers)
            let takeUserId = coursePurchassedUsers.map((c) => c.userId)
            setEnrolledStudents(coursePurchassedUsers)
        }
    }, [inputs.course, payments, students])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (assignmentMode === 'selected' && selectedStudents.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Students Selected',
                text: 'Please select at least one student or choose "All Enrolled Students"'
            });
            return;
        }
        try {
            let payload = {
                instructorId: user?._id,
                title: inputs.title,
                course: inputs.course,
                description: inputs.description,
                deadline: inputs.dueDate,
                maxMarks: inputs.totalMarks,
                selectedStudents: assignmentMode === 'selected' ? selectedStudents : null
            }

            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_assignment`, payload)
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: res.data.message,
                    text: res.data.message || "successfully created assignment.",
                    showConfirmButton: false,
                    timer: 1800,
                });
            }
            setClickCreateAssignment(false)
            console.log(res)
        } catch (error) {
            console.error(error)
        }
    };

    console.log(inputs)

    if (!clickCreateAssignMent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-xl transition-all font-bold"
                >
                    Open Assignment Upload
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl z-10">
                    <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-full flex-shrink-0">
                                <FaUpload className="w-4 h-4 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Upload Assignment</h2>
                                <p className="text-blue-100 text-xs sm:text-sm">Enter assignment details below</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setClickCreateAssignment(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                        
                        {/* Assignment Info Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm space-y-3 sm:space-y-4">
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2 sm:mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                                Assignment Information
                            </h3>

                            {/* Course Select */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    <span className="flex items-center gap-1.5 sm:gap-2">
                                        <FaUsers className="text-indigo-600 text-sm" />
                                        Course *
                                    </span>
                                </label>
                                <select
                                    name="course"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 sm:focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                >
                                    <option>Select course</option>
                                    {course && course.map((c, i) => (
                                        <option key={i} value={JSON.stringify({ id: c._id, name: c.title })}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title Input */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Assignment Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter assignment title"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
                                />
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Enter assignment description and instructions"
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition resize-none"
                                />
                            </div>
                        </div>

                        {/* Schedule & Details Section */}
                        <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm space-y-3 sm:space-y-4">
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2 sm:mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-indigo-600 to-pink-600 rounded-full"></span>
                                Schedule & Details
                            </h3>

                            {/* Due Date & Total Marks */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        <span className="flex items-center gap-1.5 sm:gap-2">
                                            <FaCalendarAlt className="text-indigo-600 text-xs sm:text-sm" />
                                            Due Date *
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 sm:focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        <span className="flex items-center gap-1.5 sm:gap-2">
                                            <FaStar className="text-indigo-600 text-xs sm:text-sm" />
                                            Total Marks *
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        name="totalMarks"
                                        placeholder="Enter total marks"
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base focus:ring-2 sm:focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    <span className="flex items-center gap-1.5 sm:gap-2">
                                        <FaUpload className="text-indigo-600 text-xs sm:text-sm" />
                                        Upload File (Optional)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            {/* Assign To Section */}
                            {inputs.course && (
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2 sm:mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-green-600 to-blue-600 rounded-full"></span>
                                        Assign To
                                    </h3>

                                    {/* Radio Options */}
                                    <div className="space-y-2 sm:space-y-3">
                                        <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition">
                                            <input
                                                type="radio"
                                                name="assignmentMode"
                                                value="all"
                                                checked={assignmentMode === 'all'}
                                                onChange={(e) => setAssignmentMode(e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
                                            />
                                            <span className="font-medium text-gray-700 text-xs sm:text-sm md:text-base">All Enrolled Students</span>
                                        </label>

                                        <label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition">
                                            <input
                                                type="radio"
                                                name="assignmentMode"
                                                value="selected"
                                                checked={assignmentMode === 'selected'}
                                                onChange={(e) => setAssignmentMode(e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
                                            />
                                            <span className="font-medium text-gray-700 text-xs sm:text-sm md:text-base">Selected Students</span>
                                        </label>
                                    </div>

                                    {/* Student Selection List */}
                                    {assignmentMode === 'selected' && (
                                        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                                            {enrolledStudents.length > 0 ? (
                                                <>
                                                    <div className="flex flex-row justify-between items-center gap-2 mb-2">
                                                        <span className="text-xs sm:text-sm font-semibold text-gray-600">
                                                            {selectedStudents.length} of {enrolledStudents.length} selected
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={handleSelectAll}
                                                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            {selectedStudents.length === enrolledStudents.length ? 'Deselect All' : 'Select All'}
                                                        </button>
                                                    </div>
                                                    <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-1.5 sm:space-y-2 p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200">
                                                        {enrolledStudents.map((s) => (
                                                            <label
                                                                key={s.userId}
                                                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedStudents.includes(s.userId)}
                                                                    onChange={() => handleStudentSelection(s.userId)}
                                                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded flex-shrink-0"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-gray-800 text-xs sm:text-sm truncate">{s.studentName}</div>
                                                                    <div className="text-gray-500 text-[10px] sm:text-xs truncate">{s.userEmail}</div>
                                                                </div>
                                                                {selectedStudents.includes(s.userId) && (
                                                                    <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                                                                )}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                                                    No enrolled students found for this course
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Form Actions - FIXED BUTTONS */}
                        <div className="pt-2">
                            {/* Mobile: Stacked buttons */}
                            <div className="flex flex-col gap-2 sm:hidden">
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
                                >
                                    <FaUpload className="w-4 h-4" />
                                    Upload Assignment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setClickCreateAssignment(false)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
                                >
                                    <FaTimes className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>

                            {/* Desktop: Side by side buttons */}
                            <div className="hidden sm:flex sm:flex-row sm:justify-end sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setClickCreateAssignment(false)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium text-sm md:text-base"
                                >
                                    <FaTimes className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                                >
                                    <FaUpload className="w-4 h-4 md:w-5 md:h-5" />
                                    Upload Assignment
                                </button>
                            </div>
                        </div>

                    </div>
                </form>

            </div>
        </div>
    )
}

export default UploadAssignment