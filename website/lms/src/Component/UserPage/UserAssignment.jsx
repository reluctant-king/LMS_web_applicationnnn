import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { FaBookmark, FaTimes, FaClock, FaBook } from 'react-icons/fa'
import { AllCourseDetail } from '../AllCourseContext/Context'

const UserAssignment = ({ setClickAssignment, assignment, userCourses }) => {
  console.log(userCourses)
  const { user } = useContext(AllCourseDetail)

  let [loading, setLoading] = useState(false)

  const getAllAssignments = async () => {
    try {
      setLoading(true)
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_assignments`)
      console.log(res)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllAssignments()
  }, [])

  console.log(assignment)

  const userCourseid = userCourses.map((c) => c.courseId)
  console.log(userCourseid)

  const currentuserAssignment = assignment.filter(a => {
    let assignedUserId = a.assignedStudents
    console.log(assignedUserId)
    let parseCourse
    if (typeof a.course === "string") {
      parseCourse = JSON.parse(a.course);
    } else {
      parseCourse = a.course;
    }
    console.log(parseCourse);

    const currentUser = assignedUserId.filter((id) => id.includes(user?._id))
    console.log(currentUser)

    return currentUser.length && userCourseid.includes(parseCourse.id)
  })
  console.log(currentuserAssignment)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">

      {/* Popup Box */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl z-10">
          <div className="flex justify-between items-start sm:items-center gap-3">

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl">
                <FaBookmark className="text-white text-lg sm:text-xl md:text-2xl" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Pending Assignments</h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Your recent assignment tasks
                </p>
              </div>
            </div>

            <button
              onClick={() => setClickAssignment(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 sm:p-2 rounded-lg transition flex-shrink-0"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Assignment Count Badge - Mobile */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2">
            <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
              {currentuserAssignment.length} Assignment{currentuserAssignment.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && currentuserAssignment.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBookmark className="text-gray-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Pending Assignments</h3>
              <p className="text-gray-500 text-sm">You're all caught up! Check back later for new assignments.</p>
            </div>
          )}

          {/* Assignment Cards */}
          {!loading && currentuserAssignment.map((a, i) => {
            // Parse course data
            let parsedCourse
            if (typeof a.course === "string") {
              parsedCourse = JSON.parse(a.course);
            } else {
              parsedCourse = a.course;
            }

            return (
              <div 
                key={i}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title and Status */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {a.title}
                        </h4>
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
                          Pending
                        </span>
                      </div>

                      {/* Course Name */}
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <FaBook className="text-indigo-500 flex-shrink-0" />
                        <span className="truncate">{parsedCourse?.name || 'N/A'}</span>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm">
                        <FaClock className="text-orange-500 flex-shrink-0" />
                        <span className="font-medium">Deadline:</span>
                        <span>{a.deadline || 'No deadline'}</span>
                      </div>
                    </div>

                    {/* Desktop Submit Button */}
                    <button className="hidden sm:flex px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-lg sm:rounded-xl hover:shadow-lg transition-all whitespace-nowrap items-center justify-center">
                      Submit Assignment
                    </button>
                  </div>

                  {/* Description */}
                  {a.description && (
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {a.description}
                    </p>
                  )}

                  {/* Mobile Submit Button */}
                  <button className="sm:hidden w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    Submit Assignment
                  </button>

                  {/* Additional Info Row - Optional */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-blue-100">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      Max Marks: <span className="font-semibold text-gray-700">{a.maxMarks || 'N/A'}</span>
                    </span>
                    {a.createdAt && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          Assigned: {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Bottom Action */}
        {currentuserAssignment.length > 0 && (
          <div className="sticky bottom-0 p-3 bg-white border-t border-gray-100 sm:hidden">
            <button
              onClick={() => setClickAssignment(false)}
              className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAssignment