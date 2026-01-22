import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch, FaFileExport, FaUniversity, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaFilter, FaEnvelope, FaPhone, FaGlobe, FaCalendar, FaUser } from 'react-icons/fa';


const RegistrationRequest = () => {
    const [search, setSearch] = useState("");
    const [institute, setInstitute] = useState([])
    const [isApprovedOrRejected, setAprovedOrRejected] = useState(false)

    const getAllRequest = async () => {
        let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_institution`)
        console.log(res);
        setInstitute(res.data.institutions)
    }

    useEffect(() => {
        getAllRequest()
    }, [isApprovedOrRejected])


    const handleApprove = async (id, s) => {
        let res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/update_status/${id}`,
            { status: s })
        console.log(res);
        setAprovedOrRejected(s)

    };

    const handleReject = async (id, s) => {
        let res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/update_status/${id}`,
            { status: s })
        console.log(res);
        setAprovedOrRejected(s)

    }; 

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FaUniversity className="text-4xl text-blue-600" />
                        <h1 className="text-4xl font-bold text-slate-800">Registration Requests</h1>
                    </div>
                    <p className="text-slate-600">Review and manage institution registration requests</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setFilterStatus("all")}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm opacity-90">Total Requests</p>
                                <p className="text-3xl font-bold mt-1">{institute.all}</p>
                            </div>
                            <FaUniversity className="text-3xl opacity-80" />
                        </div>
                    </div>

                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by institution, admin, or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Institution</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Admin Details</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {institute.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <FaUniversity className="text-6xl text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 text-lg">No registration requests found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    institute.map((req, index) => (
                                        <tr
                                            key={req._id}
                                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={req.image}
                                                        alt={req.institutionName}
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{req.institutionName}</p>
                                                        <p className="text-xs text-slate-500">Est. {req.establishedYear}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <FaUser className="text-blue-500 text-sm" />
                                                    <span className="font-medium">{req.adminFullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-700 text-sm">
                                                        <FaEnvelope className="text-blue-500 text-xs" />
                                                        <span>{req.adminEmail}</span>
                                                    </div>

                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <FaCalendar className="text-blue-500 text-sm" />
                                                    <span className="text-sm">{req.createdAt}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        // onClick={() => setSelectedRequest(req)}
                                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>

                                                    {req.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(req._id, "approved")}
                                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <FaCheckCircle />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(req._id, "rejected")}
                                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <FaTimesCircle />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistrationRequest