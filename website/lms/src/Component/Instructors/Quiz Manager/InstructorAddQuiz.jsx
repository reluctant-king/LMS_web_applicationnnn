import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCheckCircle, FaArrowLeft, FaQuestionCircle, FaListAlt, FaLightbulb } from "react-icons/fa";

const InstructorAddQuiz = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    question: "",
    options: { A: "", B: "", C: "" },
    rightAnswer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["A", "B", "C"].includes(name)) {
      setQuiz((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else {
      setQuiz((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddQuizz = async () => {
    // Validation
    if (!quiz.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!quiz.options.A.trim() || !quiz.options.B.trim() || !quiz.options.C.trim()) {
      toast.error("Please fill all options");
      return;
    }

    if (!["A", "B", "C"].includes(quiz.rightAnswer)) {
      toast.error("Please select the correct answer");
      return;
    }

    try {
      const payload = {
        question: quiz.question,
        options: quiz.options,
        rightAnswer: quiz.rightAnswer,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create_quiz`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Quiz question added successfully!");
        
        // Reset form
        setQuiz({
          question: "",
          options: { A: "", B: "", C: "" },
          rightAnswer: "",
        });
      } else {
        toast.error(res.data.message || "Failed to add quiz");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const optionColors = {
    A: "from-blue-500 to-cyan-500",
    B: "from-purple-500 to-pink-500",
    C: "from-orange-500 to-red-500",
  };

  const optionBgColors = {
    A: "bg-blue-50 border-blue-200",
    B: "bg-purple-50 border-purple-200",
    C: "bg-orange-50 border-orange-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition font-medium text-sm sm:text-base"
        >
          <FaArrowLeft className="text-xs sm:text-sm" /> 
          <span>Back to Quizzes</span>
        </button>

        {/* Header */}
        <div className="mb-5 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
            <FaQuestionCircle className="text-white text-xl sm:text-2xl lg:text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add Quiz Question
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-0.5 sm:mt-1">
              Create a new multiple choice question
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          
          {/* Question Section */}
          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md sm:rounded-lg flex items-center justify-center">
                <FaQuestionCircle className="text-white text-xs sm:text-sm" />
              </div>
              <label className="text-base sm:text-lg font-bold text-gray-900">
                Question <span className="text-red-500">*</span>
              </label>
            </div>
            <textarea
              name="question"
              value={quiz.question}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-3.5 lg:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-sm sm:text-base text-gray-900 placeholder-gray-400 shadow-sm"
              placeholder="Enter your question here..."
            />
          </div>

          {/* Options Section */}
          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg flex items-center justify-center">
                <FaListAlt className="text-white text-xs sm:text-sm" />
              </div>
              <label className="text-base sm:text-lg font-bold text-gray-900">
                Answer Options <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {["A", "B", "C"].map((opt) => (
                <div key={opt} className="group">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${optionColors[opt]} rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-white text-sm sm:text-base flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      {opt}
                    </div>
                    <input
                      type="text"
                      name={opt}
                      value={quiz.options[opt]}
                      onChange={handleChange}
                      className="flex-1 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm sm:text-base text-gray-900 placeholder-gray-400 shadow-sm"
                      placeholder={`Enter option ${opt}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer Section */}
          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md sm:rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-white text-xs sm:text-sm" />
              </div>
              <label className="text-base sm:text-lg font-bold text-gray-900">
                Correct Answer <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {["A", "B", "C"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQuiz({ ...quiz, rightAnswer: opt })}
                  className={`group relative p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 font-bold transition-all duration-200 ${
                    quiz.rightAnswer === opt
                      ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-lg scale-105"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg bg-gradient-to-br ${optionColors[opt]} flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-md`}>
                      {opt}
                    </div>
                    <span className="text-xs sm:text-sm hidden xs:block">Option {opt}</span>
                    <span className="text-xs xs:hidden">{opt}</span>
                    {quiz.rightAnswer === opt && (
                      <FaCheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 lg:top-3 lg:right-3 text-green-600 text-sm sm:text-base lg:text-xl animate-bounce" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddQuizz}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            <FaPlus className="text-base sm:text-lg lg:text-xl" /> 
            <span>Add Question</span>
          </button>
        </div>

        {/* Help Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-blue-200 p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <FaLightbulb className="text-white text-base sm:text-lg lg:text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-base sm:text-lg mb-1.5 sm:mb-2">Quick Tips</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                  <span>Make sure your question is clear and concise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                  <span>Ensure all options are distinct and relevant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                  <span>Select the correct answer before submitting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                  <span>Review your question for any typos or errors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAddQuiz;