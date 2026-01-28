import React from 'react'
import { useContext } from 'react';
import { FaArrowRight, FaCheckCircle, FaTimes, FaCloudUploadAlt, FaFileAlt } from 'react-icons/fa'
import { AllCourseDetail } from '../AllCourseContext/Context';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const SubmittingAssignment = ({ setclickSubmittingAssignment, assignment, userCourses }) => {
  const { user } = useContext(AllCourseDetail);

  const [formData, setFormData] = useState({
    assignmentName: "",
    assignmentFile: null,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false);

  const userCourseid = userCourses.map((c) => c.courseId)

  const currentuserAssignment = assignment.filter(a => {
    let assignedUserId = a.assignedStudents
    let parseCourse
    if (typeof a.course === "string") {
      parseCourse = JSON.parse(a.course);
    } else {
      parseCourse = a.course;
    }

    const currentUser = assignedUserId.filter((id) => id.includes(user?._id))

    return currentUser.length && userCourseid.includes(parseCourse.id)
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, assignmentFile: e.target.files[0] })
  }

  const handleSubmit = async () => {
    if (!formData.assignmentName) return toast.warning("Please select an assignment");
    if (!formData.assignmentFile) return toast.warning("Please upload a file");

    setSubmitting(true);

    let sendData = new FormData()
    sendData.append("instructorId", formData.assignmentName);
    sendData.append("assignmentName", formData.assignmentName);
    sendData.append("comment", formData.comment);
    sendData.append("userId", user._id);
    sendData.append("file", formData.assignmentFile);

    try {
      let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/submit_assignment`, sendData)

      if (res.data.success) {
        toast.success(res.data.message)
        setclickSubmittingAssignment(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit assignment")
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <ToastContainer />

      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 sm:p-5 lg:p-6 rounded-t-2xl sm:rounded-t-3xl z-10 flex-shrink-0">
          <div className="flex justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg sm:rounded-xl flex-shrink-0">
                <FaArrowRight className="text-white text-base sm:text-lg lg:text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Submit Assignment</h2>
                <p className="text-green-100 text-xs sm:text-sm">Upload your work below</p>
              </div>
            </div>

            <button
              onClick={() => setclickSubmittingAssignment(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 sm:p-2 rounded-lg transition flex-shrink-0"
            >
              <FaTimes size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">

            {/* Assignment Select */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Select Assignment <span className="text-red-500">*</span>
              </label>
              <select
                name="assignmentName"
                onChange={handleChange}
                value={formData.assignmentName}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Select assignment</option>
                {currentuserAssignment && currentuserAssignment.map((a, i) => {
                  return (
                    <option key={i} value={JSON.stringify({ instructorId: a.instructorId, title: a.title })}>
                      {a.title}
                    </option>
                  )
                })}
              </select>
              {currentuserAssignment.length === 0 && (
                <p className="mt-2 text-xs sm:text-sm text-gray-500">
                  No assignments available for your enrolled courses.
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Assignment File <span className="text-red-500">*</span>
              </label>
              
              {/* Custom File Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="file-upload"
                />
                <div className={`w-full px-4 py-6 sm:py-8 bg-white border-2 border-dashed rounded-lg sm:rounded-xl transition-all text-center ${
                  formData.assignmentFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}>
                  {formData.assignmentFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaFileAlt className="text-green-600 text-lg sm:text-xl" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-full px-4">
                        {formData.assignmentFile.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {(formData.assignmentFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, assignmentFile: null });
                        }}
                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium mt-1"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FaCloudUploadAlt className="text-3xl sm:text-4xl text-gray-400" />
                      <p className="text-sm sm:text-base font-medium text-gray-700">
                        <span className="text-green-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        PDF, DOC, DOCX, ZIP (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Comments <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="comment"
                onChange={handleChange}
                value={formData.comment}
                rows="3"
                placeholder="Add any notes or comments about your submission..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-5 lg:p-6 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setclickSubmittingAssignment(false)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              className="w-full sm:flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg sm:rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              onClick={handleSubmit}
              disabled={submitting || !formData.assignmentName || !formData.assignmentFile}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-sm sm:text-base" />
                  <span>Submit Assignment</span>
                </>
              )}
            </button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
            By submitting, you confirm this is your original work.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubmittingAssignment