import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { AllCourseDetail } from '../AllCourseContext/Context';
import axios from 'axios';

const ModuleQuizz = ({ currentQuizz, onBack, moduleName, moduleId, currentQuizId, onQuizSubmitSuccess , courseName}) => {
  console.log(courseName)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  let [quizz, setQuizz] = useState([])
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const { user } = useContext(AllCourseDetail);

  console.log(user)

  // const navigete = useNavigate()

  const makeQuestion = () => {
    if (currentQuizz && Array.isArray(currentQuizz)) {
      setQuizz(currentQuizz)
    }
  }


  useEffect(() => {
    makeQuestion()
  }, [currentQuizz])

  if (!quizz || quizz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white/90 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-2xl">
          <p className="text-lg text-red-500 font-semibold">No quizzes available.</p>
        </div>
      </div>
    );
  }


  const currentQuestion = quizz[currentIndex]

  const handleOptionChange = (clickOption) => {
    console.log(clickOption)
    setSelectedOption(clickOption)
  }

  const handleSubmit = async () => {
    if (!selectedOption) return;

    const currentAnswer = {
      question: currentQuestion.question,
      selectedOption: selectedOption,
      rightAnswer: currentQuestion.rightAnswer,
      isCorrect: selectedOption === currentQuestion.rightAnswer
    }
    const updatedAnswers = [...userAnswers, currentAnswer];

 
    setUserAnswers(updatedAnswers)




    if (currentIndex + 1 < quizz.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption("")
    } else {
      const totalScore = updatedAnswers.filter((a) => a.isCorrect).length;
      console.log(totalScore)
      try {

        const answerdata = updatedAnswers.map(
          ({ question, selectedOption, rightAnswer }) => ({
            question,
            selectedOption,
            rightAnswer,
          })
        );


        const payload = {
          userName: `${user.firstname} ${user.lastname}`,
          email: user.email,
          courseName:courseName,
          moduleName: moduleName,
          moduleId: moduleId,
          quizId: currentQuizId,
          answer: answerdata,
          score: totalScore || "00"
        }

        let submitRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/submiting_quiz`, payload)

        console.log(submitRes)
        if (submitRes.data.success) {
          toast.success(submitRes.data.message)
          onQuizSubmitSuccess()
          onBack()
          
        }
      } catch (error) {
        console.error(error)

      }
    }




  }

  console.log(userAnswers)



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
      <ToastContainer />
      {/* Decorative animated background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-2xl p-10 relative z-10 border border-white/20">

        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => onBack()}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-md hover:bg-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-indigo-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-indigo-600 font-semibold">Back</span>
          </button>
        </div>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-indigo-600">
              Progress
            </span>
            <span className="text-sm font-semibold text-slate-600"> {currentIndex + 1} / {quizz.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out w-1/2"
              style={{ width: `${((currentIndex + 1) / quizz.length) * 100}%`, }}></div>
          </div>
        </div>

        <div className="mb-3 inline-block px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
          Question {currentIndex + 1}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {Object.entries(currentQuestion.options).map(([key, value]) => (

            <label
              key={key}
              className={`block border-2 rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 transform hover:scale-102 hover:shadow-lg ${selectedOption === key
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 shadow-md scale-102"
                : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
            >

              <div className="flex items-center">
                <input
                  type="radio"
                  name="option"
                  checked={selectedOption === key}
                  onChange={() => handleOptionChange(key)}
                  className="mr-4 w-5 h-5 text-indigo-600"
                />
                <div className="flex items-center">
                  <span
                    className={`font-bold text-lg mr-3 ${selectedOption === key
                      ? "text-indigo-600"
                      : "text-slate-600"
                      }`}
                  >
                    {key}.
                  </span>
                  <span
                    className={`text-base ${selectedOption === key
                      ? "text-slate-800 font-medium"
                      : "text-slate-700"
                      }`}
                  >
                    {value}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>

        <button className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
          onClick={() => handleSubmit()}
          disabled={!selectedOption}
        >
          {currentIndex + 1 === quizz.length ? "Finish Quiz" : "Next"}
        </button>
      </div>

      {/* Result Section (Static Design Example) */}
      {/* Uncomment this block if you want to preview result UI */}
      {/*
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-2xl p-10 mt-10 relative z-10 border border-white/20 text-center">
        <div className="mb-6 inline-block p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Quiz Completed!
        </h2>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-indigo-200">
          <p className="text-slate-600 text-lg mb-2">Your Score</p>
          <p className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            8<span className="text-3xl text-slate-400"> / 10</span>
          </p>
          <p className="text-slate-600 mt-4 text-lg">Great job! 👏</p>
        </div>

        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg px-10 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg">
          Restart Quiz
        </button>
      </div>
      */}
    </div>
  );
}

export default ModuleQuizz