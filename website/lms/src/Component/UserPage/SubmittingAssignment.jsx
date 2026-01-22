import React from 'react'
import { useContext } from 'react';
import { FaArrowRight, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { AllCourseDetail } from '../AllCourseContext/Context';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const SubmittingAssignment = ({ setclickSubmittingAssignment, assignment, userCourses }) => {
  console.log(userCourses)
  const { user } = useContext(AllCourseDetail);

  const [formData, setFormData] = useState({
    assignmentName: "",
    assignmentFile: null,
    comment: "",
  })
  console.log(assignment, userCourses)

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, assignmentFile: e.target.files[0] })
  }

  const handleSubmit = async () => {
    if (!formData.assignmentName) return toast.warning("Please select an assignment");
    if (!formData.assignmentFile) return toast.warning("Please upload a file");

    let sendData = new FormData()
    sendData.append("instructorId", formData.assignmentName);
    sendData.append("assignmentName", formData.assignmentName);
    sendData.append("comment", formData.comment);
    sendData.append("userId", user._id);
    sendData.append("file", formData.assignmentFile);
    // let payload = {
    //   assignmentName: formData.assignmentName,
    //   assignmentFile: sendData,
    //   comment: formData.comment,
    //   userId: user?._id
    // }

    try {
      let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/submit_assignment`, sendData)
      console.log(res)

      if (res.data.success) {
        toast.success(res.data.message)
        setclickSubmittingAssignment(false)
      }
    } catch (error) {
      console.error(error)
    }

  }

console.log(formData)
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4">
      <ToastContainer />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-3xl z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaArrowRight className="text-white text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">Submit New Assignment</h2>
                <p className="text-green-100 text-sm">Upload your work below</p>
              </div>
            </div>

            <button
              onClick={() => setclickSubmittingAssignment(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-b-3xl">
          <div className="space-y-6">

            {/* Assignment Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Assignment
              </label>
              <select
                name="assignmentName"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                <option>Select assignment</option>
                {currentuserAssignment && currentuserAssignment.map((a, i) => {
                  return (
                    <option key={i} value={JSON.stringify({ instructorId: a.instructorId, title: a.title })}>{a.title}</option>
                  )
                })}


              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl transition-all
                      focus:ring-2 focus:ring-green-500 focus:border-transparent
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                      file:bg-green-50 file:text-green-700 file:font-semibold hover:file:bg-green-100"
              />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                name="comment"
                onChange={handleChange}
                value={formData.comment}

                rows="4"
                placeholder="Add any notes or comments about your submission..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
              onClick={handleSubmit}>
              <FaCheckCircle />
              Submit Assignment
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmittingAssignment