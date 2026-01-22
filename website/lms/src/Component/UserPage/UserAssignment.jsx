import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { FaBookmark, FaTimes } from 'react-icons/fa'
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
    <div className="fixed inset-0  backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4">

      {/* Popup Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl z-10">
          <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">
              <FaBookmark className="text-white text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">Pending Assignments</h2>
                <p className="text-blue-100 text-sm">
                  Your recent assignment tasks
                </p>
              </div>
            </div>

            <button
              onClick={() => setClickAssignment(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {currentuserAssignment && currentuserAssignment.map((a, i) => {
            return (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">
                        {a.title}
                      </h4>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {a.course?.name}
                    </p>
                    <p className="text-gray-500 text-sm"><span className='f-bold'>Deadline:</span> {a.deadline}</p>
                    <p className="text-gray-700 text-sm mt-2">
                      {a.description}
                    </p>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap">
                    Submit Assignment
                  </button>
                </div>
              </div>
            )
          })}

        </div>

      </div>
    </div>
  )
}

export default UserAssignment