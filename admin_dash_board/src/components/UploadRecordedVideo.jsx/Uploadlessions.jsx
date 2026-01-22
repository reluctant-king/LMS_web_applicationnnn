import React, { useEffect, useState } from 'react'
import { FaVideo, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Uploadlessions = () => {
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState([])
  const [modules, setModules] = useState([])
  const [id, setId] = useState("")
  const [input, setInput] = useState({
    course: "",
    lessons: [
      {
        module: "",
        content: ""
      }
    ]
  })

  const getAllCourseDetail = async () => {
    try {
      setLoading(true)
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`)
      setCourse(res.data.courses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllCourseDetail()
  }, [])


  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value
    setInput({ ...input, course: selectedCourse })

    const selectedCourseData = course.find((c) => c.title === selectedCourse)
    const selectedCourseid = course.find((c) => c.title === selectedCourse)
    if (selectedCourseData) {
      setModules(selectedCourseData.courseModules)
    } else {
      setModules([])
    }
    if (selectedCourseid) {
      setId(selectedCourseid._id)
    } else {
      setId("")
    }
  }

  console.log(id)

  const handleLessonChange = (index, e) => {
    const { name, value } = e.target
    const newLessons = [...input.lessons]
    newLessons[index][name] = value
    setInput({ ...input, lessons: newLessons })
  }

  const handleAddLesson = () => {
    if (!input.course) {
      toast.warning("Please select a course before adding lessons.")
      return
    }

    setInput({
      ...input,
      lessons: [...input.lessons, { module: "", content: "" }]
    })
  }


  const handleRemoveLesson = (index) => {
    const newLessons = input.lessons.filter((_, i) => i !== index)
    setInput({ ...input, lessons: newLessons })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.course || input.lessons.length === 0) {
      toast.warning("Please select a course and add at least one lesson.")
      return
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_lession`, {
        course: input.course,
        courseId: id,
        lessons: input.lessons
      })

      console.log(res)

        if (res.data.success) {
          toast.success(res.data.message || "Lessons uploaded successfully!")
          setInput({ course: "", lessons: [{ module: "", content: "" }] })
          setModules([])
        } else {
          toast.error(res.data.message || "Failed to upload lessons.")
        }
    } catch (error) {
      console.error("Error uploading lessons:", error)
      toast.error("Failed to upload lessons.")
    }
  }
  console.log(input)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <ToastContainer />
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            <FaVideo className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Upload New Lessons
          </h1>
          <p className="text-gray-600 text-lg">
            Add engaging lessons to your course modules
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* Course Selection */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-6">
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
                    value={input.course}
                    onChange={handleCourseChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
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

            {/* Lesson Content Section */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
              <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">2</span>
                  Lesson Content
                </h2>
              </div>

              <div className="p-8 space-y-8">
                {input.lessons.map((lesson, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 relative">
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Module
                        </label>
                        <select
                          name="module"
                          value={lesson.module}
                          onChange={(e) => handleLessonChange(index, e)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                        >
                          <option value="">Choose a module</option>
                          {modules.map((m, i) => (
                            <option key={i} value={m.title}>
                              {m.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Lesson Description
                        </label>
                        <textarea
                          name="content"
                          value={lesson.content}
                          onChange={(e) => handleLessonChange(index, e)}
                          rows="5"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors resize-none"
                          placeholder="Provide a detailed description of what students will learn..."
                        />
                      </div>
                    </div>

                    {input.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-xl hover:from-fuchsia-700 hover:to-pink-700 transition-all duration-300"
                >
                  <FaPlus /> Add Lesson
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-2xl transition-all transform hover:scale-105 hover:from-violet-700 hover:to-fuchsia-700"
              >
                {loading ? "Uploading..." : "Upload All Lessons"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Uploadlessions
