import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaClipboardList,
  FaBook,
  FaQuestionCircle,
  FaUsers,
  FaTrash,
  FaClock,
  FaChartLine
} from "react-icons/fa";

const InstructorQuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/all`,
        { withCredentials: true }
      );
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id, quizName) => {
    if (!window.confirm(`Delete "${quizName}"?`)) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete_quiz/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      toast.success("Quiz deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);
  const totalSubmissions = quizzes.reduce((sum, q) => sum + (q.submissions?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                Quiz Manager
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">Create and manage your course assessments</p>
            </div>
            
            {/* Create Button */}
            <Link
              to="/add_quiz"
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <FaPlus className="text-sm sm:text-lg" /> 
              <span>Create New Quiz</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Total Quizzes */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
              <div className="text-center sm:text-left order-2 sm:order-1">
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">Total Quizzes</p>
                <p className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {quizzes.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 order-1 sm:order-2">
                <FaClipboardList className="text-white text-sm sm:text-lg md:text-2xl" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>

          {/* Total Questions */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
              <div className="text-center sm:text-left order-2 sm:order-1">
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">Questions</p>
                <p className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {totalQuestions}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 order-1 sm:order-2">
                <FaQuestionCircle className="text-white text-sm sm:text-lg md:text-2xl" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          {/* Total Submissions */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
              <div className="text-center sm:text-left order-2 sm:order-1">
                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">Submissions</p>
                <p className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {totalSubmissions}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 order-1 sm:order-2">
                <FaUsers className="text-white text-sm sm:text-lg md:text-2xl" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white shadow-lg p-8 sm:p-12 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaClipboardList className="text-indigo-600 text-2xl sm:text-3xl md:text-4xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Quizzes Yet</h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
                Start creating engaging quizzes for your students
              </p>
              <Link
                to="/add_quiz"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FaPlus className="text-sm sm:text-lg" /> Create Your First Quiz
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-4 sm:p-5 md:p-6">
                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {quiz.quizName}
                  </h3>
                  
                  {/* Course Tag */}
                  {quiz.courseId?.title && (
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 rounded-md sm:rounded-lg mb-3 sm:mb-4 max-w-full">
                      <FaBook className="text-indigo-600 text-[10px] sm:text-xs flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-indigo-700 truncate">
                        {quiz.courseId.title}
                      </span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 mt-3 sm:mt-4">
                    <div className="text-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                        <FaQuestionCircle className="text-blue-600 text-xs sm:text-sm md:text-base" />
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {quiz.questions?.length || 0}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Questions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                        <FaUsers className="text-green-600 text-xs sm:text-sm md:text-base" />
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {quiz.submissions?.length || 0}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Submissions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                        <FaClock className="text-purple-600 text-xs sm:text-sm md:text-base" />
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {quiz.duration || "—"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Minutes</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-gray-100">
                    <Link
                      to={`/instructor_quiz_submissions/${quiz._id}`}
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
                    >
                      <FaChartLine className="text-xs sm:text-sm" /> View Submissions
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id, quiz.quizName)}
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-600 rounded-lg sm:rounded-xl font-medium hover:bg-red-100 transition-all duration-200 text-xs sm:text-sm"
                    >
                      <FaTrash className="text-xs sm:text-sm" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorQuizManager;