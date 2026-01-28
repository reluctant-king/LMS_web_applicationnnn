import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
  FiAward,
  FiFileText,
  FiDownload,
  FiEye,
  FiCheckCircle
} from "react-icons/fi";
import {
  BsCheckCircle,
  BsLightbulb,
  BsJournalText,
  BsFileEarmarkPdf
} from "react-icons/bs";
import {
  MdQuiz,
  MdMenuBook
} from "react-icons/md";
import {
  HiDocumentText
} from "react-icons/hi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ModuleQuizz from "./ModuleQuizz";
import { AllCourseDetail } from "../AllCourseContext/Context";
import ModuleQuizReview from "./ModuleQuizReview";
import { toast, ToastContainer } from "react-toastify";

const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 group"
  >
    <FiChevronLeft className="text-purple-600 text-lg sm:text-xl lg:text-2xl group-hover:text-purple-700" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 group"
  >
    <FiChevronRight className="text-purple-600 text-lg sm:text-xl lg:text-2xl group-hover:text-purple-700" />
  </button>
);

const Lerning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lesson, setLesson] = useState([])
  const [selectedModule, setSelectedmodule] = useState([])
  const [clickReadMeterial, setClickReadmeterial] = useState(false)
  const [clickQuizz, setClickQuizz] = useState(false)
  const [clickReview, setClickReview] = useState(false)
  const [allQuiz, setAllQuiz] = useState([])
  const [savedSlide, setSavedSlide] = useState(null);
  const [currentQuizz, setCurrentQyuzz] = useState([])
  const [moduleName, setModulename] = useState("")
  const [moduleId, setModuleUd] = useState("")
  const [submitedQuiz, setSubmitesQuiz] = useState([])
  const [currentReview, setCurrentReview] = useState([])
  const [sliderKey, setSliderKey] = useState(0);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [refreshReview, setRefreshReview] = useState(false);

  const { user, userAnswer } = useContext(AllCourseDetail);

  const sliderRef = useRef(null);

  const getCourse = async () => {
    try {
      setLoading(true);
      let res = await axios.get(`${import.meta.env.VITE_API_URL}get_course/${id}`);
      let quizSubmitRes = await axios.get(`${import.meta.env.VITE_API_URL}get_all_userSubmited_answer`)
      setCourse(res.data.data);
      setSubmitesQuiz(quizSubmitRes.data.userSubmitedQquiz)
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLesson = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_lesson/${id}`)
      const getAllQres = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_module_quizz`)
      setLesson(res.data.lessons)
      setAllQuiz(getAllQres.data.quizes)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCourse();
    if (id) getLesson()
  }, [id, refreshReview]);

  const onQuizSubmitSuccess = () => {
    setRefreshReview((prev) => !prev)
  }

  useEffect(() => {
    if (!clickReadMeterial && !clickQuizz && !clickReview && savedSlide !== null) {
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(savedSlide);
          setCurrentSlide(savedSlide);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [clickReadMeterial, clickQuizz, clickReview, savedSlide]);

  if (loading || !course)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-200 border-t-purple-600"></div>
          <BsLightbulb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 text-lg sm:text-xl animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base text-center">Loading your learning journey...</p>
      </div>
    );

  const modules = course?.courseModules || [];

  const slides = [];

  modules.forEach((mod, index) => {
    slides.push({
      type: "lesson",
      title: mod.title,
      content: mod.description || "Comprehensive study material covering all key concepts",
      moduleNumber: index + 1,
    });
    slides.push({
      type: "quiz",
      title: `Quiz for ${mod.title}`,
      moduleName: mod.title,
      moduleId: mod._id,
      content: `Test your knowledge from module ${index + 1}`,
      moduleNumber: index + 1,
    });
  });

  slides.push({
    type: "completion",
    title: "🎉 Course Completed!",
    content:
      "Congratulations! You've successfully completed the course. You can now download your certificate as proof of your accomplishment.",
  });

  const handleReadMeterial = (moduleTitle) => {
    setSavedSlide(currentSlide);
    if (!lesson || lesson.length === 0) {
      console.warn("No lessons found");
      return;
    }
    const lessonList = lesson[0].lessons || []
    const selectedModule = lessonList.find((l) => l.module === moduleTitle)

    if (selectedModule) {
      setSelectedmodule(selectedModule)
    } else {
      console.warn("No content found for module:", moduleTitle);
    }
    setClickReadmeterial(true)
  }

  const handleStartQuiz = (moduleName, moduleId) => {
    setSavedSlide(currentSlide);
    setModulename(moduleName)
    setModuleUd(moduleId)
    const allquestions = allQuiz.flatMap(q => q.moduleQuizz)
    const currentModuleQuestion = allquestions.filter(q => q.module === moduleName)
    setCurrentQyuzz(currentModuleQuestion)
    setClickQuizz(true)
  }

  const handleReview = (moduleId) => {
    setSavedSlide(currentSlide);
    const currentQuizReview = submitedQuiz.filter((q) => q.moduleId === moduleId && q.email === user.email)

    if (currentQuizReview.length === 0) {
      toast.warning("You haven't attended this quiz yet!");
      return;
    }
    setCurrentReview(currentQuizReview)
    setClickReview(true)
  }

  const handleBackFromReading = () => {
    setClickReadmeterial(false);
    setSliderKey(prev => prev + 1);
  };

  const handleBackFromQuiz = () => {
    setClickQuizz(false);
    setSliderKey(prev => prev + 1);
  };

  const handleBackFromReview = () => {
    setClickReview(false);
    setSliderKey(prev => prev + 1);
  };

  const attendedQuiz = submitedQuiz.find((q) => q.moduleId === currentModuleId && q.email === user.email);
  const totalQuestions = attendedQuiz?.answer?.length || 0;
  const correctAnswers = attendedQuiz && attendedQuiz.answer?.filter((a) => a.selectedOption === a.rightAnswer).length || "0";
  const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const currentSlideData = slides[currentSlide];
  const hasPassedCurrentQuiz = attendedQuiz && scorePercentage > 70;
  const isAttendQuizz = submitedQuiz.some((q) => q.moduleId === currentModuleId)
  const isUserAttent = submitedQuiz.some((q) => q.email === user.email)
  const matchQuizId = submitedQuiz.some((q) => q.quizId === currentQuizId)

  const desablenextArrow =
    currentSlideData?.type === "quiz" &&
    currentModuleId &&
    (!isUserAttent || !hasPassedCurrentQuiz || !isAttendQuizz || scorePercentage <= 70);

  const DisabledNextArrow = ({ reason }) => {
    const handleHover = () => {
      if (reason === "notAttended") {
        toast.warning("You haven't attended this quiz. Please attend the quiz first!");
      } else if (reason === "lowScore") {
        toast.warning("You didn't score the minimum mark (70%). Please retake the quiz!");
      }
    };

    return (
      <button
        disabled
        onMouseOver={handleHover}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"
      >
        <FiChevronRight className="text-gray-400 text-base sm:text-lg" />
      </button>
    );
  }

  const nextArrowReason = !isAttendQuizz
    ? "notAttended"
    : scorePercentage <= 70
      ? "lowScore"
      : null;

  const settings = {
    dots: true,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: currentSlide,
    prevArrow: <CustomPrevArrow />,
    nextArrow: desablenextArrow ? <DisabledNextArrow reason={nextArrowReason} /> : <CustomNextArrow />,
    beforeChange: (current, next) => {
      setCurrentSlide(next)
      const nextSlide = slides[next];
      if (nextSlide && nextSlide.moduleId) {
        setCurrentModuleId(nextSlide.moduleId);
      } else {
        setCurrentModuleId(null);
      }

      if (nextSlide?.type === "quiz") {
        const allQuestions = allQuiz.flatMap((q) => q.moduleQuizz);
        const quizData = allQuestions.find((q) => q.module === nextSlide.moduleName);

        if (quizData) {
          setCurrentQuizId(quizData._id);
        } else {
          console.warn("No quiz found for module:", nextSlide.moduleName);
        }
      }
    },
    customPaging: (i) => (
      <div className="mt-3 sm:mt-4">
        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
          }`}></div>
      </div>
    ),
  };

  const handleCertificate = async (email, userName, course, userId) => {
    try {
      const [certificateRes, courseCompleteRes] = await Promise.all([
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/course_completation_certificate`, {
          email: email,
          studentName: userName,
          courseName: course
        }),
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/course_completers`, {
          username: userName,
          userId: userId,
          userEmail: email,
          coursename: course
        })
      ]);

      if (certificateRes.data.success && courseCompleteRes.data.success) {
        toast.success("We will mail your certificate shortly!")
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <ToastContainer />
      
      {clickReadMeterial ? (
        selectedModule && (
          <div id="reading-section" className="px-2 sm:px-4 md:px-6 lg:px-10 pt-8 sm:pt-12 lg:pt-16">
            <div className="bg-white border-t border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-700 mb-3 sm:mb-4">
                {selectedModule.module}
              </h2>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-purple-100">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {selectedModule.content}
                </p>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={handleBackFromReading}
                className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:scale-105 transition-transform"
              >
                ← Back
              </button>
            </div>
          </div>
        )
      ) : clickQuizz ? (
        <ModuleQuizz
          currentQuizz={currentQuizz}
          setClickQuizz={setClickQuizz}
          moduleName={moduleName}
          moduleId={moduleId}
          onBack={handleBackFromQuiz}
          currentQuizId={currentQuizId}
          onQuizSubmitSuccess={onQuizSubmitSuccess}
          courseName={course?.title}
        />
      ) : clickReview ? (
        <ModuleQuizReview
          currentReview={currentReview}
          onBack={handleBackFromReview}
        />
      ) : (
        <div>
          {/* Back Button */}
          <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white text-gray-700 rounded-lg sm:rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
            >
              <FiArrowLeft className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>
          </div>

          {/* Main Card */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <FiBook className="text-xl sm:text-2xl lg:text-3xl" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-90">
                    Learning Path
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold line-clamp-2">{course.title}</h1>
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <BsFileEarmarkPdf className="text-base sm:text-lg" />
                    {modules.length} Materials
                  </span>
                  <span className="flex items-center gap-1">
                    <MdQuiz className="text-base sm:text-lg" />
                    {modules.length} Quizzes
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Your Progress</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-600">
                    {currentSlide + 1} / {slides.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Slider Section */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                <Slider ref={sliderRef} key={sliderKey} {...settings}>
                  {slides.map((slide, idx) => (
                    <div key={idx}>
                      <div className="px-1 sm:px-2 md:px-4">
                        {/* Module Badge */}
                        <div className="flex justify-center mb-4 sm:mb-6">
                          <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${slide.type === "lesson"
                            ? 'bg-purple-100 text-purple-700'
                            : slide.type === "quiz"
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                            }`}>
                            {slide.type === "lesson" ? (
                              <>
                                <MdMenuBook className="text-base sm:text-lg" />
                                <span className="hidden xs:inline">Module</span> {slide.moduleNumber}
                              </>
                            ) : slide.type === "quiz" ? (
                              <>
                                <MdQuiz className="text-base sm:text-lg" />
                                <span className="hidden xs:inline">Quiz</span> {slide.moduleNumber}
                              </>
                            ) : (
                              <>
                                <FiAward className="text-base sm:text-lg" />
                                <span>Complete</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-2 sm:mb-4 px-2">
                          {slide.title}
                        </h2>

                        {/* Description */}
                        <p className="text-center text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                          {slide.content}
                        </p>

                        {/* Lesson Card */}
                        {slide.type === "lesson" && (
                          <div className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-700 mb-3 sm:mb-4">
                              {slide.title}
                            </h2>
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-purple-100">
                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {
                                  lesson[0]?.lessons?.find(l => l.module === slide.title)?.content ||
                                  "No content found for this module."
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Quiz Card */}
                        {slide.type === "quiz" && (
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-inner border border-blue-100">
                            <div className="flex flex-col items-center gap-4 sm:gap-6">
                              {/* Quiz Icon */}
                              <div className="relative">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-200">
                                  <MdQuiz className="text-blue-600 text-3xl sm:text-4xl lg:text-5xl" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                  <span className="text-xs font-bold text-gray-800">?</span>
                                </div>
                              </div>

                              {/* Quiz Info */}
                              <div className="text-center">
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Knowledge Assessment</h3>
                                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1">Challenge yourself with interactive questions</p>
                                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Multiple choice, true/false, and more</p>
                              </div>

                              {/* Quiz Buttons */}
                              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
                                <button
                                  className="flex-1 group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm sm:text-base hover:scale-105"
                                  onClick={() => handleStartQuiz(slide.moduleName, slide.moduleId)}
                                >
                                  <BsJournalText className="text-lg sm:text-xl group-hover:scale-110 transition-transform" />
                                  Start Quiz
                                </button>
                                <button
                                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-white text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-sm sm:text-base border-2 border-gray-200 hover:border-blue-300"
                                  onClick={() => handleReview(slide.moduleId)}
                                >
                                  <FiCheckCircle className="text-base sm:text-lg" />
                                  Review
                                </button>
                              </div>

                              {/* Quiz Stats */}
                              <div className="flex gap-6 sm:gap-8 mt-2 sm:mt-4">
                                <div className="text-center">
                                  <div className="text-xl sm:text-2xl font-bold text-blue-600">10</div>
                                  <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Questions</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xl sm:text-2xl font-bold text-purple-600">15</div>
                                  <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Completion Card */}
                        {slide.type === "completion" && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-inner border border-green-200 text-center flex flex-col items-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-green-300 mb-4 sm:mb-6">
                              <FiAward className="text-green-600 text-3xl sm:text-4xl lg:text-5xl" />
                            </div>

                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-3 sm:mb-4">
                              {slide.title}
                            </h2>
                            <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl mb-6 sm:mb-8 px-2">
                              {slide.content}
                            </p>

                            <button
                              onClick={() => handleCertificate(user.email, `${user.firstname} ${user.lastname}`, course?.title, user._id)}
                              className="flex items-center gap-2 sm:gap-3 px-5 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              <FiDownload className="text-lg sm:text-xl lg:text-2xl" />
                              <span>Download Certificate</span>
                            </button>
                          </div>
                        )}

                        {/* Completed Badge */}
                        {idx < currentSlide && (
                          <div className="mt-4 sm:mt-6 flex justify-center">
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full font-semibold text-xs sm:text-sm">
                              <BsCheckCircle className="text-base sm:text-lg" />
                              Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lerning;