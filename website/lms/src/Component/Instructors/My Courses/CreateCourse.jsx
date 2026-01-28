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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);
  const totalSubmissions = quizzes.reduce((sum, q) => sum + (q.submissions?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Quiz Manager
              </h1>
              <p className="text-gray-600 text-lg">Create and manage your course assessments</p>
            </div>
            <Link
              to="/add_quiz"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <FaPlus className="text-lg" /> Create New Quiz
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Quizzes */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Quizzes</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {quizzes.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <FaClipboardList className="text-white text-2xl" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>

          {/* Total Questions */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Questions</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {totalQuestions}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <FaQuestionCircle className="text-white text-2xl" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          {/* Total Submissions */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Submissions</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {totalSubmissions}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <FaUsers className="text-white text-2xl" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-lg p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaClipboardList className="text-indigo-600 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Quizzes Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start creating engaging quizzes for your students
              </p>
              <Link
                to="/add_quiz"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FaPlus className="text-lg" /> Create Your First Quiz
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
              >
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {quiz.quizName}
                  </h3>
                  
                  {/* Course Tag */}
                  {quiz.courseId?.title && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg mb-4">
                      <FaBook className="text-indigo-600 text-xs" />
                      <span className="text-sm font-medium text-indigo-700 truncate">
                        {quiz.courseId.title}
                      </span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6 mt-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <FaQuestionCircle className="text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {quiz.questions?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Questions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <FaUsers className="text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {quiz.submissions?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Submissions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <FaClock className="text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {quiz.duration || "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Minutes</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/instructor_quiz_submissions/${quiz._id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      <FaChartLine /> View Submissions
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id, quiz.quizName)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 text-sm"
                    >
                      <FaTrash /> Delete
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