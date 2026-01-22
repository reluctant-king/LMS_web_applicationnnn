import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'

const AddFeeStructure = ({ setShowForm }) => {
    const [course, setCourse] = useState([])
    const [batch, setBatch] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        courseName: '',
        semester: '',
        academicYear: '',
        totalFee: '',
        tuitionFee: '',
        examFee: '',
        libraryFee: '',
        labFee: '',
        otherFee: '',
        installments: ''
    });
    const academicYears = ['2024-25', '2025-26', '2026-27'];


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    };
    console.log(formData);




    const getAllCourse = async () => {
        const courseres = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`)
        const batchRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_all_batches`)
        setCourse(courseres.data.data)
        setBatch(batchRes.data.data)
        console.log(batchRes);


    }

    useEffect(() => {
        getAllCourse()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        let payload = {
            name: formData.courseName,
            batch: formData.semester,
            year: formData.academicYear,
            totalFee: formData.totalFee,
            installment: formData.installments,
            feeBreakDown: {
                tuition: formData.tuitionFee,
                exam: formData.examFee,
                library: formData.libraryFee,
                lab: formData.labFee,
                other: formData.otherFee,
            }
        }
        try {
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_fee_structore`, payload)
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message)
                setShowForm(false)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");

        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <ToastContainer />
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
                    <h2 className="text-2xl font-bold">

                    </h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Course Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Course Name *
                                </label>
                                <select
                                    name="courseName"
                                    value={formData.courseName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Course</option>
                                    {course && course.map((c, i) => {
                                        return (


                                            <option key={i} name="courseName">{c.title}</option>


                                        )
                                    })}
                                </select>
                            </div>

                            {/* Batch */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Batch *
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select batch</option>

                                    {batch && batch.map((b, i) => {
                                        return (

                                            <option key={i} name="semester">{b.batchName}</option>

                                        )
                                    })}
                                </select>
                            </div>

                            {/* Academic Year */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Academic Year *
                                </label>
                                <select
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Total Fee */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Total Fee (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="totalFee"
                                    value={formData.totalFee}
                                    onChange={handleInputChange}
                                    placeholder="Enter total fee"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Fee Components Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                Fee Components
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Tuition Fee (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="tuitionFee"
                                        value={formData.tuitionFee}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Exam Fee (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="examFee"
                                        value={formData.examFee}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Library Fee (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="libraryFee"
                                        value={formData.libraryFee}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Lab Fee (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="labFee"
                                        value={formData.labFee}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Other Fee (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="otherFee"
                                        value={formData.otherFee}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Installments Allowed
                                    </label>
                                    <input
                                        type="number"
                                        name="installments"
                                        value={formData.installments}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                            >
                                <FaTimes /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium
                                    ${loading
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                    }`}
                            >
                                <FaSave />
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default AddFeeStructure