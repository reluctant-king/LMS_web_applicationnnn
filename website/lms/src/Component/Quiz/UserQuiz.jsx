import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaCheck, 
  FaClock, 
  FaQuestionCircle,
  FaPaperPlane,
  FaSpinner
} from "react-icons/fa";

const UserQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_quiz/${quizId}`)
      .then(res => {
        const quizData = res.data.data;
        setQuiz(quizData);
        setAnswers(quizData.questions.map(q => ({
          questionId: q._id,
          selectedOption: -1
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [quizId]);

  const handleOptionChange = (qIndex, oIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex].selectedOption = oIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    axios.post(`${import.meta.env.VITE_API_URL}/api/v1/submit_quiz`, { quizId, answers })
      .then(res => {
        alert(`Quiz submitted! Score: ${res.data.data.score}`);
        navigate("/quizzes");
      })
      .catch(err => {
        console.error(err.response?.data || err);
        alert("Failed to submit quiz. Check console for details.");
        setSubmitting(false);
      });
  };

  const answeredCount = answers.filter(a => a.selectedOption !== -1).length;
  const progress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaQuestionCircle className="text-4xl sm:text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-sm sm:text-base">Quiz not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600 text-sm sm:text-base" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-1">
                  {quiz.title || "Quiz"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {quiz.questions.length} Questions
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 text-gray-600">
                <FaClock className="text-sm sm:text-base text-blue-500" />
                <span className="text-xs sm:text-sm font-medium">
                  {answeredCount}/{quiz.questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm text-gray-600">Progress</span>
              <span className="text-xs sm:text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Navigation - Mobile */}
        <div className="lg:hidden mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {quiz.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  currentQuestion === idx
                    ? 'bg-blue-600 text-white shadow-lg'
                    : answers[idx]?.selectedOption !== -1
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {quiz.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              id={`question-${qIndex}`}
              className={`bg-white rounded-xl sm:rounded-2xl shadow-md border-2 transition-all ${
                answers[qIndex]?.selectedOption !== -1
                  ? 'border-green-200'
                  : 'border-transparent'
              }`}
            >
              {/* Question Header */}
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold ${
                    answers[qIndex]?.selectedOption !== -1
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {answers[qIndex]?.selectedOption !== -1 ? (
                      <FaCheck className="text-xs sm:text-sm" />
                    ) : (
                      qIndex + 1
                    )}
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 leading-relaxed flex-1">
                    {q.questionText}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="p-4 sm:p-5 lg:p-6 space-y-2 sm:space-y-3">
                {q.options.map((opt, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all border-2 ${
                      answers[qIndex]?.selectedOption === oIndex
                        ? 'bg-blue-50 border-blue-400 shadow-sm'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      answers[qIndex]?.selectedOption === oIndex
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {answers[qIndex]?.selectedOption === oIndex && (
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex]?.selectedOption === oIndex}
                      onChange={() => handleOptionChange(qIndex, oIndex)}
                      className="sr-only"
                    />
                    <span className={`text-sm sm:text-base ${
                      answers[qIndex]?.selectedOption === oIndex
                        ? 'text-blue-800 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation & Submit */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6">
          {/* Unanswered Warning */}
          {answeredCount < quiz.questions.length && (
            <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-yellow-800">
                <span className="font-semibold">Note:</span> You have {quiz.questions.length - answeredCount} unanswered question(s).
              </p>
            </div>
          )}

          {/* Question Grid - Desktop */}
          <div className="hidden lg:block mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Question Overview:</p>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_, idx) => (
                <a
                  key={idx}
                  href={`#question-${idx}`}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm transition-all hover:scale-105 ${
                    answers[idx]?.selectedOption !== -1
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {idx + 1}
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-xs sm:text-sm" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-xs sm:text-sm" />
                  <span>Submit Quiz</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4 sm:h-6 lg:h-8"></div>
      </div>
    </div>
  );
};

export default UserQuiz;