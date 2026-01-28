import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FaCheckCircle, FaClock, FaDownload, FaTimes } from 'react-icons/fa'
import { AllCourseDetail } from '../AllCourseContext/Context';
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";


const UserSubmittedAssignments = ({ setClickUserAssignment }) => {
    const { user } = useContext(AllCourseDetail);
    console.log(user._id)
    const [loading, setLoadintg] = useState(false)
    const [assignment, setAssigment] = useState([])
    const [allAssignment, setAllAssignment] = useState([])

    const [scoreForm, setScoreForm] = useState({
        score: "",
        comment: ""
    })

    const getAllSubmittedAssignment = async () => {
        try {
            setLoadintg(true)
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_user_submitted_assignment`)
            let allAssignmentRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_assignments`)
            console.log(res)
            console.log(allAssignmentRes)
            setAllAssignment(allAssignmentRes.data.assignment)

            if (res.data.success) {
                const filterAssignment = res.data.userAssignment.filter((a) => {
                    let parsed

                    try {
                        if (typeof a.assignmentName === "string" && a.assignmentName.trim().startsWith("{")) {
                            parsed = JSON.parse(a.assignmentName);
                        } else {
                            parsed = {
                                title: a.instructorId,
                                instructorId: a.instructorId

                            };
                            console.log(parsed)
                        }
                    } catch (error) {
                        console.error("Invalid JSON in assignmentName:", a.assignmentName);

                        parsed = {
                            title: a.assignmentName,
                            instructorId: a.instructorId
                        };
                    }
                    return (
                        parsed?.instructorId?.toString() ===
                        user?._id?.toString()
                    );
                })
                setAssigment(filterAssignment)


            }




        } catch (error) {
            console.error("Error fetching submitted assignments:", error);
            const message =
                error.response?.data?.message ||
                error.message || "Something went wrong while fetching submitted assignments.";
            toast.error(message)
        } finally {
            setLoadintg(false)

        }
    }

    useEffect(() => {
        getAllSubmittedAssignment()
    }, [])

    const handleDownload = async (file) => {
        const fileName = file.split("\\").pop();
        console.log(fileName)
        window.open(`${import.meta.env.VITE_API_URL}/api/v1/download_assignment/${fileName}`, "_blank")

    }

    const handleForm = (e) => {
        setScoreForm({ ...scoreForm, [e.target.name]: e.target.value });
    }
    console.log(scoreForm)

    const handleSubmitScore = async (id) => {
        try {

            let payload = {
                score: scoreForm.score,
                comment: scoreForm.comment
            }
            let res = await axios.put(`${import.meta.env.VITE_API_URL}api/v1/update_score/${id}`, payload)
            console.log(res)
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: res.data.message,
                    text: res.data.message || "successfully created assignment.",
                    showConfirmButton: false,
                    timer: 1800,
                });
            }
        } catch (error) {

        } finally {
            setClickUserAssignment(false)
        }
    }
    const parseAssignmentName = (assignmentName) => {
        if (!assignmentName) {
            return { title: "Untitled Assignment" };
        }

        if (typeof assignmentName === "string" && assignmentName.trim().startsWith("{")) {
            try {
                return JSON.parse(assignmentName);
            } catch (error) {
                console.error("Failed to parse JSON:", assignmentName);
                return { title: assignmentName };
            }
        }
        return { title: assignmentName };
    }



    console.log(allAssignment)
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
                <ToastContainer />
                
                {/* HEADER */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl z-10 flex-shrink-0">
                    <div className="flex justify-between items-center gap-3">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
                            <FaCheckCircle className="text-white text-base sm:text-lg lg:text-xl flex-shrink-0" />
                            <span className="truncate">Submitted Assignments</span>
                        </h2>

                        <button
                            onClick={() => setClickUserAssignment(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0"
                        >
                            <FaTimes size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-16 sm:py-20">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : assignment && assignment.length > 0 ? (
                        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                            {assignment.map((a, i) => {
                                const parsed = parseAssignmentName(a.assignmentName);
                                const submittedDate = a.submittedAt.split("T")[0];
                                console.log(submittedDate)
                                const currentAssignment = allAssignment.find((s) => s.title === parsed.title)
                                console.log(currentAssignment)
                                const dueDate = currentAssignment?.deadline || "N/A";
                                const isLate = submittedDate > dueDate;
                                return (
                                    <div
                                        key={i}
                                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border-l-4 border-green-500"
                                    >
                                        {/* Mobile: Download button at top */}
                                        <div className="flex justify-between items-start mb-3 sm:mb-0">
                                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                                    {parsed?.title}
                                                </h4>
                                            </div>
                                            
                                            {/* Download Button - Always visible */}
                                            <button 
                                                className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-sm flex-shrink-0 ml-2"
                                                onClick={() => handleDownload(a.assignmentFile)}
                                            >
                                                <FaDownload size={12} className="sm:w-3.5 sm:h-3.5" />
                                                <span className="hidden xs:inline">Download</span>
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            {/* LEFT SECTION */}
                                            <div className="flex-1">
                                                <p className="text-gray-600 text-xs sm:text-sm mb-2">
                                                    Course: Python for Data Science
                                                </p>

                                                {/* Date Info */}
                                                <div className="flex flex-col xs:flex-row xs:flex-wrap items-start xs:items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
                                                    <p className="text-gray-500">
                                                        <span className="font-medium">Submitted:</span> {submittedDate}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        <span className="font-medium">Due:</span> {dueDate}
                                                    </p>
                                                    
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                        isLate 
                                                            ? "bg-red-100 text-red-600" 
                                                            : "bg-green-100 text-green-600"
                                                    }`}>
                                                        {isLate ? "Late" : "On Time"}
                                                    </span>
                                                </div>

                                                {/* Form Section */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    {/* SCORE FIELD */}
                                                    <div>
                                                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                                                            Score
                                                        </label>
                                                        <input
                                                            name='score'
                                                            onChange={handleForm}
                                                            type="number"
                                                            placeholder="Enter score"
                                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
                                                        />
                                                    </div>

                                                    {/* FEEDBACK FIELD */}
                                                    <div className="sm:col-span-2">
                                                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                                                            Feedback
                                                        </label>
                                                        <textarea
                                                            name='comment'
                                                            onChange={handleForm}
                                                            placeholder="Write feedback for the student..."
                                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm resize-none"
                                                            rows={2}
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                {/* SUBMIT BUTTON */}
                                                <button 
                                                    className="mt-3 sm:mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base"
                                                    onClick={() => handleSubmitScore(a._id)}
                                                >
                                                    Submit Grade
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaCheckCircle className="text-2xl sm:text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">
                                No Submissions Yet
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base text-center max-w-sm">
                                When students submit their assignments, they will appear here for you to review and grade.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserSubmittedAssignments