import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaFileExport, FaCode } from 'react-icons/fa';
import AddFeeStructure from './AddFeeStructure';
import Delete from '../TableActions/Delete';

const FeeStructure = () => {
    const [showForm, setShowForm] = useState(false);
    const [feeStructore, setFeeStructore] = useState([])
    const [search, setSearch] = useState("")
    const [id, setId] = useState("")
    let [deleteClick, setDeleteClick] = useState(false)
    const deleteCont = "Are you sure that you want to delete this fee structure?"


    const getAllFeeStructor = async () => {
        let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_fee_structorre?name=${search}`)
        setFeeStructore(res.data.feeStructore)
        console.log(res);

    }

    useEffect(() => {
        getAllFeeStructor()
    }, [search])

    const handleDelete = (id) => {
        setDeleteClick(true)
        setId(id)
    }
    const onTimeDelete = () => {
        setFeeStructore((prev) => prev.filter((s) => s._id !== id))

    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {deleteClick && <Delete
                    setDeleteClick={setDeleteClick}
                    deleteCont={deleteCont}
                    id={id}
                    api_end_point={`${import.meta.env.VITE_API_URL}/api/v1/get_fee_structore`}
                    onTimeDelete={onTimeDelete}
                />}
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FaCode className="text-4xl text-blue-600" />
                        <h1 className="text-4xl font-bold text-slate-800">Fee Structure Management</h1>
                    </div>
                    <p className="text-slate-600">Define and manage fee amounts for programming courses and batches</p>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by course, batch, or year..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                <FaPlus /> Add Fee Structure
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                                <FaFileExport /> Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Modal */}

                {showForm && <AddFeeStructure setShowForm={setShowForm} />}

                {/* Fee Structures Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                                    <th className="text-left py-4 px-6 font-semibold">Course Name</th>
                                    <th className="text-left py-4 px-6 font-semibold">Batch</th>
                                    <th className="text-left py-4 px-6 font-semibold">Academic Year</th>
                                    <th className="text-left py-4 px-6 font-semibold">Total Fee</th>
                                    <th className="text-left py-4 px-6 font-semibold">Fee Breakdown</th>
                                    <th className="text-left py-4 px-6 font-semibold">Installments</th>
                                    <th className="text-center py-4 px-6 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeStructore.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-slate-500">
                                            No fee structures found. Click "Add Fee Structure" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    feeStructore.map((s, i) => (
                                        <tr
                                            key={i}
                                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors '
                                                }`}
                                        >
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {s.name}
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">
                                                <span className="inline-flex px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                    {s.batch}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">
                                                <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                    {s.year}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-bold text-green-600">
                                                ₹{s.totalFee.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-xs space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Tuition:</span>
                                                        <span className="font-semibold text-slate-800">₹{s.feeBreakDown.tuition}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Exam:</span>
                                                        <span className="font-semibold text-slate-800">₹{s.feeBreakDown.exam}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Library:</span>
                                                        <span className="font-semibold text-slate-800">₹{s.feeBreakDown.library}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Lab:</span>
                                                        <span className="font-semibold text-slate-800">₹{s.feeBreakDown.lab}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Other:</span>
                                                        <span className="font-semibold text-slate-800">₹{s.feeBreakDown.other}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-700 rounded-full font-bold">
                                                    {s.installment}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button

                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button

                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Delete"
                                                        onClick={() => handleDelete(s._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Total Structures</h3>
                        <p className="text-4xl font-bold">{feeStructore.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Average Total Fee</h3>
                        <p className="text-4xl font-bold">
                            ₹{Math.round(feeStructore.reduce((acc, s) => acc + s.totalFee, 0) / feeStructore.length || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Active Courses</h3>
                        <p className="text-4xl font-bold">{new Set(feeStructore.map(s => s.courseName)).size}</p>
                    </div>
                </div>
            </div>
        </div>)
}

export default FeeStructure