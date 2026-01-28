import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { FaDownload, FaCheckCircle, FaClock, FaTimes, FaFileAlt } from 'react-icons/fa';
import { AllCourseDetail } from '../AllCourseContext/Context';

const SubmittedAssignments = ({ setClickSubmittedAssignment }) => {
    const [loading, setLoading] = useState(false);
    const [assignment, setAssigment] = useState([]);
    const { user } = useContext(AllCourseDetail);

    const getAllSubmittedAssignment = async () => {
        try {
            setLoading(true);
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_user_submitted_assignment`);
            console.log(res);
            let correntUserAssignment = res.data.userAssignment.filter((a) => a.userId === user?._id);
            console.log(correntUserAssignment);
            setAssigment(correntUserAssignment);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllSubmittedAssignment();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">

                {/* HEADER */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl z-10 shrink-0">
                    <div className="flex justify-between items-center gap-3">
                        <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 min-w-0">
                            <FaCheckCircle className="text-white shrink-0 text-base sm:text-xl" />
                            <span className="truncate">Submitted Assignments</span>
                        </h2>

                        <button
                            onClick={() => setClickSubmittedAssignment(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 sm:p-2 rounded-lg transition-colors shrink-0"
                        >
                            <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                    
                    {/* Assignment Count */}
                    <p className="text-green-100 text-xs sm:text-sm mt-1 sm:mt-2">
                        {assignment.length} assignment{assignment.length !== 1 ? 's' : ''} submitted
                    </p>
                </div>

                {/* CONTENT */}
                <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-3 sm:mb-4"></div>
                            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading assignments...</p>
                        </div>
                    ) : assignment.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                <FaFileAlt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1 sm:mb-2">No Submissions Yet</h3>
                            <p className="text-gray-500 text-sm sm:text-base">You haven't submitted any assignments yet.</p>
                        </div>
                    ) : (
                        assignment.map((a, i) => {
                            console.log("Score data:", a);
                            return (
                                <div 
                                    key={a._id || i}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        {/* Title and Status */}
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                                                    <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                                        {a.title}
                                                    </h4>
                                                    
                                                    {/* Status Badge */}
                                                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full shrink-0 ${
                                                        a.isChecked 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {a.isChecked ? (
                                                            <>
                                                                <FaCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                                Graded
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                                Under Review
                                                            </>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Course Name */}
                                                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                                                    📚 Course: Python for Data Science
                                                </p>
                                            </div>

                                            {/* Grade - Desktop */}
                                            {a.isChecked && a.score?.[0]?.score && (
                                                <div className="hidden sm:flex flex-col items-center bg-white rounded-xl px-4 py-2 shadow-sm border border-green-200">
                                                    <span className="text-xs text-gray-500">Grade</span>
                                                    <span className="text-2xl font-bold text-green-600">{a.score[0].score}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                                            <p className="text-gray-500 flex items-center gap-1">
                                                <FaClock className="w-3 h-3 text-gray-400" />
                                                {new Date(a.submittedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            
                                            {/* Grade - Mobile */}
                                            {a.isChecked && a.score?.[0]?.score && (
                                                <p className="sm:hidden text-green-600 font-semibold flex items-center gap-1">
                                                    <FaCheckCircle className="w-3 h-3" />
                                                    Grade: {a.score[0].score}
                                                </p>
                                            )}
                                        </div>

                                        {/* Feedback */}
                                        {a.isChecked && (
                                            <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-100">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                                                    💬 Instructor Feedback:
                                                </p>
                                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                                    {a.feedback || "Excellent work! Your data visualization techniques are impressive."}
                                                </p>
                                            </div>
                                        )}

                                        {/* Pending Review Message */}
                                        {!a.isChecked && (
                                            <div className="bg-blue-50/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                                                <p className="text-blue-700 text-xs sm:text-sm flex items-center gap-2">
                                                    <FaClock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                                    Your assignment is being reviewed. Check back soon for your grade and feedback.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {assignment.length > 0 && (
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-3 sm:p-4 shrink-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                            <p className="text-xs sm:text-sm text-gray-500">
                                {assignment.filter(a => a.isChecked).length} of {assignment.length} graded
                            </p>
                            <button
                                onClick={() => setClickSubmittedAssignment(false)}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmittedAssignments;