import axios from 'axios';
import React, { useEffect, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaQuestionCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

const UploadModuleQuizz = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [course, setCourse] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courseid, setCourseid] = useState("")
    const { id } = useParams()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState({
        course: "",
        moduleQuizz: [
            {
                module: "",
                question: "",
                options: { A: "", B: "", C: "", D: "" },
                rightAnswer: ""
            }
        ]
    });



    const getAllCourseDetails = async () => {
        try {
            setLoading(true);
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`);
            setCourse(res.data.courses);
        } catch (error) {
            console.error("Error fetching course details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllCourseDetails();


    }, []);

    useEffect(() => {
        if (id && course.length > 0) {
            fetchQuiz();
        }
    }, [id, course]);



    const fetchQuiz = async () => {
        try {
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_module_quiz/${id}`)
            console.log(res)
            if (res.data.success) {
                const quizdata = res.data.moduleQuiz
                console.log(quizdata.moduleQuizz)
                setQuiz({
                    course: quizdata.course,
                    moduleQuizz: quizdata.moduleQuizz

                })

                const selectedCourseData = course.find((c) => c.title === quizdata.course);
                if (selectedCourseData) {

                    console.log(selectedCourseData.courseModules)
                    setModules(selectedCourseData.courseModules);
                    setCourseid(selectedCourseData._id);
                }
            }



            setIsEdit(true)
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
    }


    const handleCourseChange = (e) => {
        const selectedCourse = e.target.value;
        setQuiz({ ...quiz, course: selectedCourse });

        const selectedCourseData = course.find((c) => c.title === selectedCourse);
        if (selectedCourseData) {
            console.log(selectedCourseData.courseModules)
            setModules(selectedCourseData.courseModules);
            setCourseid(selectedCourseData._id)
        } else {
            setModules([]);
        }
    };


    const handleQuizChange = (index, e) => {
        const { name, value } = e.target;
        const newModuleQuizz = [...quiz.moduleQuizz];

        if (["A", "B", "C", "D"].includes(name)) {
            newModuleQuizz[index].options[name] = value;
        } else {
            newModuleQuizz[index][name] = value;
        }

        setQuiz({ ...quiz, moduleQuizz: newModuleQuizz });
    };


    const handleAddQuiz = () => {
        if (!quiz.course) {
            toast.warning("Please select a course before adding questions.");
            return;
        }

        setQuiz({
            ...quiz,
            moduleQuizz: [
                ...quiz.moduleQuizz,
                {
                    module: "",
                    question: "",
                    options: { A: "", B: "", C: "", D: "" },
                    rightAnswer: ""
                }
            ]
        });
    };


    const handleRemoveQuiz = (index) => {
        const newModuleQuizz = quiz.moduleQuizz.filter((_, i) => i !== index);
        setQuiz({ ...quiz, moduleQuizz: newModuleQuizz });
    };
    console.log(quiz)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!quiz.course || quiz.moduleQuizz.length === 0) {
            toast.warning("Please select a course and add at least one quiz question.");
            return;
        }

        try {

            if (isEdit) {
                const payload = {
                    course: quiz.course,
                    courseId: courseid,
                    moduleQuizz: quiz.moduleQuizz
                }
                let editRes = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/get_module_quiz/${id}`, payload)
                console.log(editRes);


                if (editRes.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Updated!",
                        text: editRes.data.message || "Changes have been saved successfully.",
                        showConfirmButton: false,
                        timer: 1800,
                    });

                    await new Promise((back) => setTimeout(back, 2000))

                    navigate("/view_all_quizz")


                }


            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_module_quizz`, {
                    course: quiz.course,
                    courseId: courseid,
                    moduleQuizz: quiz.moduleQuizz

                });
                console.log(res)
                if (res.data.success) {
                    toast.success(res.data.message || "Quiz uploaded successfully!");
                    setQuiz({
                        course: "",
                        moduleQuizz: [
                            {
                                module: "",
                                question: "",
                                options: { A: "", B: "", C: "", D: "" },
                                rightAnswer: ""
                            }
                        ]
                    });
                    setModules([]);
                } else {
                    toast.error(res.data.message || "Failed to upload quiz.");
                }
            }

        } catch (error) {
            console.error("Error uploading quiz:", error);
            toast.error("Failed to upload quiz.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <ToastContainer />

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-6">
                        <FaQuestionCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                        {isEdit ? "Edit Module Quiz" : "Upload Module Quiz"}

                    </h1>
                    <p className="text-gray-600 text-lg">
                        Add quiz questions for each module of a course
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">

                        {/* Course Selection */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">1</span>
                                    Course Selection
                                </h2>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Select Course
                                    </label>
                                    <select
                                        name="course"
                                        value={quiz.course}
                                        onChange={handleCourseChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                    >
                                        <option value="">Choose a course</option>
                                        {course.map((c, i) => (
                                            <option value={c.title} key={i}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
                            <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">2</span>
                                    Quiz Questions
                                </h2>
                            </div>

                            <div className="p-8 space-y-8">
                                {quiz.moduleQuizz.map((q, index) => (
                                    <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 relative">
                                        <div className="grid gap-4">
                                            {console.log(q)}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Module</label>
                                                <select
                                                    name="module"
                                                    defaultValue={q.module}
                                                    onChange={(e) => handleQuizChange(index, e)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                                >
                                                    <option value="">Choose a module</option>
                                                    {modules.map((m, i) => (
                                                        <option key={i} value={m.title}>{m.title}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
                                                <input
                                                    type="text"
                                                    name="question"
                                                    value={q.question}
                                                    onChange={(e) => handleQuizChange(index, e)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                                                    placeholder="Enter quiz question..."
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                {["A", "B", "C", "D"].map((opt) => (
                                                    <div key={opt}>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Option {opt}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name={opt}
                                                            value={q.options[opt]}
                                                            onChange={(e) => handleQuizChange(index, e)}
                                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                                            placeholder={`Option ${opt}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Right Answer</label>
                                                <input
                                                    type="text"
                                                    name="rightAnswer"
                                                    value={q.rightAnswer}
                                                    onChange={(e) => handleQuizChange(index, e)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                    placeholder="Enter correct answer (A/B/C)"
                                                />
                                            </div>
                                        </div>

                                        {quiz.moduleQuizz.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveQuiz(index)}
                                                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddQuiz}
                                    className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
                                >
                                    <FaPlus /> Add Question
                                </button>
                            </div>
                        </div>


                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-xl hover:scale-105 transition-transform"
                            >
                                {loading ? "Uploading..." : "Upload All Quizzes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadModuleQuizz;
