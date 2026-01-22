import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch, FaEnvelope, FaPlus, FaCalendar, FaUser, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Delete from '../TableActions/Delete';

const UserEnquiries = () => {
  const [enquiry, setEnquiry] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const [deleteClick, setDeleteClick] = useState(false);
    const [id, setId] = useState("");

  const deleteCont = "Are you sure that you delete enquiry";

  const getAllEnquiries = async (page = 1) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/getAll_enquiry`, {
        params: { page, limit: itemsPerPage, name: search },
      });
      setEnquiry(res.data.data || []);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getAllEnquiries(1);
  }, [search]);

  const handleDelete = (id) => {
    setDeleteClick(true);
    setId(id)
  }
  const onTimeDelete = () => {
      setEnquiry((prev)=>prev.filter((e)=>e._id === id))
  }
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: <FaCheckCircle className="text-xs" />, label: 'Resolved' };
      case 'replied':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: <FaCheckCircle className="text-xs" />, label: 'Replied' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: <FaClock className="text-xs" />, label: 'Pending' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: <FaTimesCircle className="text-xs" />, label: status || 'Unknown' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {deleteClick && <Delete
       setDeleteClick={setDeleteClick}
        deleteCont={deleteCont} 
        onTimeDelete={onTimeDelete}
        />}
      <div className="w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">User Enquiries</h2>
            <p className="text-gray-600">Manage and respond to user inquiries</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search by name..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 px-4 py-2 rounded-xl border border-yellow-200">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{enquiry.filter(e => e.status === 'pending').length || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Total Enquiries</p>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Enquiries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiry.length > 0 ? enquiry.map((e, i) => {
                  const statusConfig = getStatusConfig(e.status);
                  return (
                    <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-blue-500 text-sm" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(e.createdAt).split(',')[0]}</p>
                            <p className="text-xs text-gray-500">{formatDate(e.createdAt).split(',')[1]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{e.name}</p>
                          <p className="text-xs text-gray-500">{e.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md line-clamp-2"></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          {e.message}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                        <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition group" title="Reply">
                          <FaEnvelope className="group-hover:scale-110 transition" />
                        </button>
                       
                       
                      </td>
                      <td  className='px-6 py-4 whitespace-nowrap'>
                       <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition group" title="Edit">
                          <FaEdit className="group-hover:scale-110 transition" />
                        </button>
                        <button className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition group" title="Delete" onClick={handleDelete}>
                          <FaTrash className="group-hover:scale-110 transition" onClick={()=>handleDelete(e._id)}/>
                        </button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaEnvelope className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No enquiries found</p>
                        <p className="text-gray-400 text-sm">Check back later for new messages</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

       
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} enquiries
            </div>
            <div className="flex gap-2">
              <button onClick={() => currentPage > 1 && getAllEnquiries(currentPage - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition">Previous</button>
              {[...Array(totalPages)].map((_, idx) => (
                <button key={idx} onClick={() => getAllEnquiries(idx + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-white'}`}>{idx + 1}</button>
              ))}
              <button onClick={() => currentPage < totalPages && getAllEnquiries(currentPage + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEnquiries;
