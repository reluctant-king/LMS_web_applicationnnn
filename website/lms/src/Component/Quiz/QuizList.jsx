import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { AllCourseDetail } from "../AllCourseContext/Context";

const QuizList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizz, setQuizz] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AllCourseDetail);
  const [selectedOptionname, setSelectedOptionNAme] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);

  const getAllQuizess = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_quizz`);
      console.log(res);
      setQuizz(res.data.quizz);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllQuizess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="bg-white/90 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-sm sm:text-lg font-semibold text-slate-700 ml-1 sm:ml-2">Loading quiz...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!quizz || quizz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="bg-white/90 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-2xl">
          <p className="text-sm sm:text-lg text-red-500 font-semibold">No quizzes available.</p>
        </div>
      </div>
    );
  }

  let currentQuestion = quizz[currentIndex];

  const handleOptionChange = (optionKey, value) => {
    setSelectedOption(optionKey);
    setSelectedOptionNAme(value);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error("Please select an answer!");
      return;
    }

    const currentQuestion = quizz[currentIndex];
    const selectedAnswerValue = currentQuestion.options[selectedOption];
    const correctAnswerValue = currentQuestion.options[currentQuestion.rightAnswer];

    const currentAnswer = {
      question: currentQuestion.question,
      selectedAnswer: selectedAnswerValue,
      correctAnswer: correctAnswerValue,
    };

    if (selectedOption === currentQuestion.rightAnswer) {
      setScore((prev) => prev + 1);
    }

    const sendQuizResult = async (answerData) => {
      try {
        const payload = {
          userName: `${user.firstname} ${user.lastname}`,
          email: user.email,
          score: score,
          totalQuestions: quizz.length,
          answers: answerData
        };
        console.log(payload);
        let subRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/send_quiz_result`, payload);
        console.log(subRes);
      } catch (error) {
        console.error("Error sending quiz result:", error);
      }
    };

    let updatedAnswers = [...userAnswers, currentAnswer];

    if (currentIndex + 1 < quizz.length) {
      setUserAnswers(updatedAnswers);
      setCurrentIndex(currentIndex + 1);
      setSelectedOption("");
    } else {
      setUserAnswers(updatedAnswers);
      setShowResult(true);
      sendQuizResult(updatedAnswers);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 sm:p-6 relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Decorative animated background elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-40 sm:w-72 h-40 sm:h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-52 sm:w-96 h-52 sm:h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-2xl p-4 sm:p-6 md:p-10 relative z-10 border border-white/20">
        {!showResult ? (
          <>
            {/* Progress bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-semibold text-indigo-600">Progress</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">{currentIndex + 1} / {quizz.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / quizz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Badge */}
            <div className="mb-2 sm:mb-3 inline-block px-3 sm:px-4 py-0.5 sm:py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
              Question {currentIndex + 1}
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5 sm:space-y-4">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <label
                  key={key}
                  className={`block border-2 rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-102 hover:shadow-lg ${
                    selectedOption === key
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 shadow-md scale-[1.01] sm:scale-102"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="option"
                      checked={selectedOption === key}
                      onChange={() => handleOptionChange(key, value)}
                      className="mr-2.5 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0"
                    />
                    <div className="flex items-center min-w-0">
                      <span className={`font-bold text-sm sm:text-lg mr-2 sm:mr-3 shrink-0 ${
                        selectedOption === key ? 'text-indigo-600' : 'text-slate-600'
                      }`}>
                        {key}.
                      </span>
                      <span className={`text-sm sm:text-base ${
                        selectedOption === key ? 'text-slate-800 font-medium' : 'text-slate-700'
                      }`}>
                        {value}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="mt-5 sm:mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {currentIndex + 1 === quizz.length ? 'Finish Quiz' : 'Submit Answer'}
            </button>

            {/* Question Counter - Mobile */}
            <div className="mt-4 sm:hidden flex justify-center gap-1">
              {quizz.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-indigo-600 w-4'
                      : idx < currentIndex
                      ? 'bg-green-500'
                      : 'bg-slate-300'
                  }`}
                ></div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4 sm:py-8">
            {/* Success Icon */}
            <div className="mb-4 sm:mb-6 inline-block p-3 sm:p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
              <svg className="w-10 h-10 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Quiz Completed!
            </h2>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 border-2 border-indigo-200">
              <p className="text-slate-600 text-sm sm:text-lg mb-1 sm:mb-2">Your Score</p>
              <p className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {score}
                <span className="text-xl sm:text-3xl text-slate-400"> / {quizz.length}</span>
              </p>
              
              {/* Progress Circle - Visual Representation */}
              <div className="mt-4 sm:mt-6 flex justify-center">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(score / quizz.length) * 283} 283`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg sm:text-2xl font-bold text-slate-700">
                      {Math.round((score / quizz.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 mt-3 sm:mt-4 text-base sm:text-lg">
                {score === quizz.length 
                  ? "Perfect! 🎉" 
                  : score >= quizz.length * 0.7 
                  ? "Great job! 👏" 
                  : "Keep practicing! 💪"}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                <p className="text-lg sm:text-2xl font-bold text-green-600">{score}</p>
                <p className="text-[10px] sm:text-xs text-green-600 font-medium">Correct</p>
              </div>
              <div className="bg-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                <p className="text-lg sm:text-2xl font-bold text-red-600">{quizz.length - score}</p>
                <p className="text-[10px] sm:text-xs text-red-600 font-medium">Wrong</p>
              </div>
              <div className="bg-indigo-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                <p className="text-lg sm:text-2xl font-bold text-indigo-600">{quizz.length}</p>
                <p className="text-[10px] sm:text-xs text-indigo-600 font-medium">Total</p>
              </div>
            </div>

            {/* Restart Button */}
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentIndex(0);
                setScore(0);
                setSelectedOption("");
                setUserAnswers([]);
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint - Desktop only */}
      <div className="hidden sm:block mt-4 text-white/60 text-sm">
        Press <kbd className="px-2 py-1 bg-white/20 rounded">1-4</kbd> to select option
      </div>
    </div>
  );
};

export default QuizList;