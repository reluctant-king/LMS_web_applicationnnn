import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { FaDownload, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa'
import { AllCourseDetail } from '../AllCourseContext/Context'

const SubmittedAssignments = ({ setClickSubmittedAssignment }) => {
    const [loading, setLoading] = useState(false)
    const [assignment, setAssigment] = useState([])
    const { user } = useContext(AllCourseDetail);

    const getAllSubmittedAssignment = async () => {
        try {
            setLoading(true)
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_user_submitted_assignment`)
            console.log(res)
            let correntUserAssignment = res.data.userAssignment.filter((a) => a.userId === user?._id)
            console.log(correntUserAssignment)
            setAssigment(correntUserAssignment)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)

        }

    }

    useEffect(() => {
        getAllSubmittedAssignment()
    }, [])
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 rounded-t-3xl z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FaCheckCircle className="text-white" />
                            Submitted Assignments
                        </h2>

                        <button
                            onClick={() => setClickSubmittedAssignment(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                        >
                            <FaTimes size={22} />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-4">
                    {
                        assignment && assignment.map((a, i) => {
                            console.log("Score data:", a);
                            // console.log(score)
                            return (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-bold text-gray-900">
                                                    {a.title}
                                                </h4>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                    {a.isChecked ? (
                                                        <>
                                                            <FaCheckCircle size={12} />
                                                            Graded
                                                        </>
                                                    ) : (<>
                                                        <FaClock size={12} color='blue' />
                                                        <p className='bg-blue-100 text-blue-700 text-xs font-semibold rounded-full'> Under Review</p>
                                                    </>)}

                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-2">Course: Python for Data Science</p>

                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                <p className="text-gray-500">Submitted:  {new Date(a.submittedAt).toLocaleString()}</p>
                                                {console.log("Score data:", a.score)}
                                                <p className="text-green-600 font-semibold">
                                                    {a.isChecked && (
                                                        <span className="text-green-600 font-semibold">
                                                            Grade: {a.score[0]?.score}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            {/* {console.log(a.score)} */}
                                            <p className="text-gray-700 text-sm mt-2">
                                                Instructor Feedback: Excellent work! Your data visualization techniques are impressive.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default SubmittedAssignments