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
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <ToastContainer />
                {/* HEADER */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 rounded-t-3xl z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FaCheckCircle className="text-white" />
                            Submitted Assignments
                        </h2>

                        <button
                            onClick={() => setClickUserAssignment(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                        >
                            <FaTimes size={22} />
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : <div className="p-6 space-y-4">
                    {assignment && assignment.map((a, i) => {
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
                                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    {/* LEFT SECTION */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-gray-900">
                                                {parsed?.title}
                                            </h4>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-2">
                                            Course: Python for Data Science
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                            <p className="text-gray-500">
                                                Submitted: {submittedDate} </p>

                                            <p className="text-gray-600 text-sm">
                                                Due Date: {dueDate}
                                            </p>
                                            <p className={`font-bold ${isLate ? "text-red-600" : "text-green-600"}`}>
                                                {isLate ? "Late Submission" : "On Time"}
                                            </p>
                                        </div>

                                        {/* SCORE FIELD */}
                                        <div className="mb-3">
                                            <label className="text-sm font-medium text-gray-700">
                                                Score
                                            </label>
                                            <input
                                                name='score'
                                                onChange={handleForm}
                                                type="number"
                                                placeholder="Enter score"
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            />
                                        </div>

                                        {/* FEEDBACK FIELD */}
                                        <div className="mb-3">
                                            <label className="text-sm font-medium text-gray-700">
                                                Feedback
                                            </label>
                                            <textarea
                                                name='comment'
                                                onChange={handleForm}
                                                placeholder="Write feedback for the student..."
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                                                rows={3}
                                            ></textarea>
                                        </div>

                                        {/* SUBMIT BUTTON */}
                                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                                            onClick={() => handleSubmitScore(a._id)}
                                        >
                                            Submit Grade
                                        </button>
                                    </div>

                                    {/* DOWNLOAD BUTTON */}
                                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
                                        onClick={() => handleDownload(a.assignmentFile)}>
                                        <FaDownload size={14} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                }

            </div>
        </div>
    )
}

export default UserSubmittedAssignments



