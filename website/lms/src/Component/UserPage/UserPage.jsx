import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FaPen, FaUserCircle, FaCamera, FaEnvelope, FaCalendarAlt, FaAward } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AllCourseDetail } from '../AllCourseContext/Context'
import AddStudent from '../AddStudentDetails/AddStudent'
import {
  FaBook, FaCertificate, FaTrophy, FaClock, FaFire,
  FaChartLine, FaBookmark, FaPlay, FaDownload, FaShare,
  FaStar, FaCheckCircle, FaArrowRight, FaFilter
} from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md'
import UserAssignment from './UserAssignment'
import SubmittingAssignment from './SubmittingAssignment'
import SubmittedAssignments from './SubmittedAssignments'

const UserPage = () => {
  const [courseFilter, setCourseFilter] = useState('all');
  const { user } = useContext(AllCourseDetail)
  const [showForm, setShowForm] = useState(false)
  const [usercourse, setUserCourse] = useState([])
  const [assignment, setAssignment] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [clickAssignment, setClickAssignment] = useState(false)
  const [clicksubmittingAssignment, setclickSubmittingAssignment] = useState(false)
  const [clickSubmittedAssignment, setClickSubmittedAssignment] = useState(false)
  const [email, setEmail] = useState(null)
  const [course, setCourse] = useState([])
  const [completed, setCompleted] = useState([])
  const [editMode, setEditMode] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const studentEnrolledCourse = async () => {
    try {
      setLoading(true)
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_payment_details`)
      let allCourse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`)
      let allCourseComplete = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_completers`)
      let allAssignment = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_assignments`)
      let allStudent = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_students`)
      console.log(allStudent)
      console.log(res)
      console.log(allCourse)
      console.log(allCourseComplete)
      console.log(allAssignment)
      setUserCourse(res.data.paymentDetails)
      setCourse(allCourse.data.courses)
      setCompleted(allCourseComplete.data.allCourseCompleters)
      setAssignment(allAssignment.data.assignment)
      setStudents(allStudent.data.students)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    studentEnrolledCourse()
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user])

  const userCourses = usercourse.filter((c) => c.userEmail === email)
  const totalCourse = userCourses.length

  const userCompletedWithcertificate = completed.filter((c) => c.userEmail === user?.email && c.userId === user._id)

  console.log(userCompletedWithcertificate)

  const currentStudent = students.filter((s) => s.accoutRegisterdEmail === user?.email)
  console.log(currentStudent)

  const isRegistDstudent = currentStudent.some((s) => s.isExist === true)
  console.log(isRegistDstudent)

  const stats = {
    totalHours: 127,
    coursesCompleted: 8,
    coursesEnrolled: 12,
    currentStreak: 15,
    certificates: 8,
    averageScore: 91
  };

  const activities = [
    { type: 'lesson', title: 'Completed "Advanced Hooks in React"', time: '2 hours ago', course: 'Advanced React' },
    { type: 'certificate', title: 'Earned Python Certificate', time: '1 week ago', course: 'Python for Data Science' },
    { type: 'quiz', title: 'Scored 95% in UI Principles Quiz', time: '2 days ago', course: 'UI/UX Design' },
    { type: 'enrollment', title: 'Enrolled in Machine Learning', time: '3 days ago', course: 'ML Fundamentals' }
  ];

  console.log(completed)
  console.log(assignment)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-20 py-4 sm:py-6 md:py-10 bg-gray-50 min-h-screen">
      {showForm && <AddStudent
        setShowForm={setShowForm}
        emailll={email}
        editMode={editMode}
        editStudent={editStudent} />}
      {clickAssignment && <UserAssignment
        setClickAssignment={setClickAssignment}
        assignment={assignment}
        userCourses={userCourses}
      />}
      {clicksubmittingAssignment && <SubmittingAssignment
        setclickSubmittingAssignment={setclickSubmittingAssignment}
        assignment={assignment}
        userCourses={userCourses}
      />}
      {clickSubmittedAssignment && <SubmittedAssignments setClickSubmittedAssignment={setClickSubmittedAssignment} />}

      {/* Profile Header Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="flex flex-col items-center lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-8">

            {/* Profile Photo Section */}
            <div className="relative group cursor-pointer flex-shrink-0">
              {/* Animated Ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl sm:blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>

              {/* Photo Container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 sm:p-1 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                      {user?.firstname?.[0]}{user?.lastname?.[0]}
                    </span>
                  </div>
                </div>

                {/* Camera Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaCamera className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl" />
                </div>
              </div>

              {/* Online Status */}
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 sm:border-3 border-white"></div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 md:space-y-6 w-full">
              {/* Name and Edit */}
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    {`${user?.firstname || ''} ${user?.lastname || ''}`}
                  </h1>
                  <button
                    onClick={() => {
                      setShowForm(true)
                      setEditMode(true)
                      setEditStudent(currentStudent)
                    }}
                    className="group/btn p-1.5 sm:p-2 md:p-2.5 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md"
                    aria-label="Edit profile"
                  >
                    <FaPen className="text-blue-600 group-hover/btn:rotate-12 transition-transform text-sm sm:text-base md:text-lg" />
                  </button>
                </div>

                {/* Role Badge */}
                <div className="flex justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
                    <FaAward className="text-xs sm:text-sm" />
                    {user?.role || 'Student'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-gray-600 hover:text-blue-600 transition-colors group/email cursor-pointer">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-md sm:rounded-lg group-hover/email:bg-blue-100 transition-colors">
                    <FaEnvelope className="text-blue-600 text-sm sm:text-base md:text-lg" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-base truncate max-w-[200px] sm:max-w-none">{user?.email}</span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-500">
                  <div className="p-1.5 sm:p-2 bg-purple-50 rounded-md sm:rounded-lg">
                    <FaCalendarAlt className="text-purple-600 text-xs sm:text-sm md:text-base" />
                  </div>
                  <span className="text-xs sm:text-sm">Member since Jan 2023</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 sm:pt-4 md:pt-6">
                {isRegistDstudent === true ? null : (
                  <button
                    className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group/btn"
                    onClick={() => setShowForm(true)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Add Student Details
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8 mt-4 sm:mt-6 md:mt-8">

        {/* Learning Statistics */}
        <section className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <FaChartLine className="text-blue-600 text-lg sm:text-xl md:text-2xl" />
            Learning Statistics
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {/* Completed */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all text-center">
              <FaCheckCircle className="text-green-600 text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 mx-auto" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                {stats.coursesCompleted}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Completed
              </div>
            </div>

            {/* Enrolled */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all text-center">
              <FaBook className="text-purple-600 text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 mx-auto" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
                {totalCourse}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Enrolled
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all text-center">
              <FaCertificate className="text-yellow-600 text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 mx-auto" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600">
                {userCompletedWithcertificate.length}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Certificates
              </div>
            </div>
          </div>
        </section>

        {/* Assignments Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Assignments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setClickAssignment(true)}
              className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-sm hover:shadow-md"
            >
              <MdAssignment className="text-lg sm:text-xl" />
              <span className="font-semibold text-xs sm:text-sm">View Assignments</span>
            </button>

            <button
              onClick={() => setclickSubmittingAssignment(true)}
              className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm hover:shadow-md"
            >
              <MdAssignment className="text-lg sm:text-xl" />
              <span className="font-semibold text-xs sm:text-sm">Upload Assignment</span>
            </button>

            <button
              onClick={() => setClickSubmittedAssignment(true)}
              className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-sm hover:shadow-md sm:col-span-2 lg:col-span-1"
            >
              <MdAssignment className="text-lg sm:text-xl" />
              <span className="font-semibold text-xs sm:text-sm">Submitted Assignments</span>
            </button>
          </div>
        </div>

        {/* My Courses */}
        <section className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <FaBook className="text-purple-600 text-lg sm:text-xl md:text-2xl" />
              My Courses
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">{userCourses.length} course(s)</span>
          </div>

          {userCourses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FaBook className="text-gray-300 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No courses yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start learning by enrolling in a course</p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition"
              >
                Browse Courses <FaArrowRight />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {userCourses.map((c, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden bg-gray-100">
                    <img
                      src={course.find((co) => co._id === c.courseId)?.image?.[0]}
                      alt={c.courseName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {c.courseName}
                    </h3>

                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`/course/${c.courseId}`}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FaPlay className="text-xs" />
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Certificates */}
        <section className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <FaCertificate className="text-yellow-600 text-lg sm:text-xl md:text-2xl" />
            My Certificates
          </h2>

          {userCompletedWithcertificate.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FaTrophy className="text-gray-300 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No certificates yet</h3>
              <p className="text-gray-500 text-sm">Complete a course to earn your first certificate!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {userCompletedWithcertificate.map((c, i) => (
                <div
                  key={i}
                  className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 group overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-tr from-red-200/30 to-pink-300/30 rounded-full blur-2xl"></div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <FaTrophy className="text-yellow-600 text-2xl sm:text-3xl md:text-4xl" />
                      <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                        {c.score || 0}%
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{c.coursename}</h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs mb-3 sm:mb-4">
                      Completed: {c.completedAt ? new Date(c.completedAt).toLocaleDateString() : 'N/A'}
                    </p>

                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-md sm:rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm">
                        <FaDownload className="text-xs" /> Download
                      </button>
                      <button className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 font-semibold rounded-md sm:rounded-lg hover:bg-gray-200 transition-all">
                        <FaShare className="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default UserPage