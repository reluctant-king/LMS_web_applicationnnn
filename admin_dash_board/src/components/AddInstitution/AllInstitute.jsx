import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileExport, FaUniversity, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';


const AllInstitute = () => {
    const [institutions, setInstitutions] = useState([])
    const [search, setSearch] = useState("")
    const getAllInstitutuion = async () => {
        let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_institution?institutionName=${search}`)
        console.log(res);
        getStatusBadge()
        setInstitutions(res.data.institutions)



    }
    useEffect(() => {
        getAllInstitutuion()
    }, [search])
    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: {
                bg: "bg-green-50",
                text: "text-green-700",
                icon: <FaCheckCircle className="inline mr-1" />,
                label: "Approved"
            },
            rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                icon: <FaTimesCircle className="inline mr-1" />,
                label: "Rejected"
            },
            pending: {
                bg: "bg-yellow-50",
                text: "text-yellow-700",
                icon: <FaClock className="inline mr-1" />,
                label: "Pending"
            }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium`}>
                {config.icon}
                {config.label}
            </span>
        );
    };




    const approved = institutions.filter(i => i.status === 'approved').length
    const pending = institutions.filter(i => i.status === 'pending').length
    const rejected = institutions.filter(i => i.status === 'rejected').length


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FaUniversity className="text-4xl text-blue-600" />
                        <h1 className="text-4xl font-bold text-slate-800">Institution Management</h1>
                    </div>
                    <p className="text-slate-600">Manage and monitor educational institutions and their administrators</p>
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
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                <FaPlus /> Add Institution
                            </button>

                        </div>
                    </div>
                </div>

                {/* Institutions Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                                    <th className="text-left py-4 px-6 font-semibold">Image</th>
                                    <th className="text-left py-4 px-6 font-semibold">Institution Name</th>
                                    <th className="text-left py-4 px-6 font-semibold">Admin Name</th>
                                    <th className="text-left py-4 px-6 font-semibold">Admin Email</th>
                                    <th className="text-left py-4 px-6 font-semibold">Website URL</th>
                                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                                    <th className="text-center py-4 px-6 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*  */}
                                {institutions && institutions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-slate-500">
                                            No institutions found.
                                        </td>
                                    </tr>
                                ) : (institutions.map((i, k) => {
                                    return (
                                        <tr
                                            key={k}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <img
                                                    src={i.image}
                                                    alt={i.institutionName}
                                                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                />
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {i.institutionName}
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">
                                                {i.adminFullName}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 text-sm">
                                                {i.adminEmail}
                                            </td>
                                            <td className="py-4 px-6">
                                                <a
                                                    href={i.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                                >
                                                    {i.websiteUrl}
                                                </a>
                                            </td>
                                            <td className="py-4 px-6">
                                                {getStatusBadge(i.status)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2 justify-center">

                                                    <button
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }))}



                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Total Institutions</h3>
                        <p className="text-4xl font-bold">{institutions.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Approved</h3>
                        <p className="text-4xl font-bold">{approved}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Pending</h3>
                        <p className="text-4xl font-bold">{pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-2">Rejected</h3>
                        <p className="text-4xl font-bold">{rejected}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllInstitute